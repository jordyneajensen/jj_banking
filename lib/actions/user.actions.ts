'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite';
import { cookies } from 'next/headers';
import { encryptId, extractCustomerIdFromUrl, parseStringify } from '../utils';
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from 'plaid';
import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from 'next/cache';
import { addFundingSource, createDwollaCustomer } from '@/lib/actions/dwolla.actions';

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

// Fetch user information from the database
export const getUserInfo = async ({ userId }: { userId: string }) => {
  try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};

// Sign in a user and set session cookie
export const signIn = async ({ email, password }: { email: string; password: string }) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });
    return parseStringify(user);
  } catch (error) {
    console.error('Sign-in error:', error);
  }
};

// Sign up a new user and create a Dwolla customer
export const signUp = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  // Other user fields...
}) => {
  const { email, password, firstName, lastName } = userData;
  
  try {
    const { account, database } = await createAdminClient();

    // Create new user account
    const newUserAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error('Error creating user');

    // Create Dwolla customer
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData, type: 'personal',
      address1: '',
      city: '',
      state: '',
      postalCode: '',
      dateOfBirth: '',
      ssn: ''
    });
    if (!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer');

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    // Save user data in the database
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      { ...userData, userId: newUserAccount.$id, dwollaCustomerId, dwollaCustomerUrl }
    );

    // Create session and set cookie
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error('Sign-up error:', error);
  }
};

// Fetch the currently logged-in user's details
export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();
    return await getUserInfo({ userId: result.$id });
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
    return null;
  }
};

// Log out the current user and delete the session cookie
export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete('appwrite-session');
    await account.deleteSession('current');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Create a Plaid Link token for connecting a bank account
export const createLinkToken = async (user: { $id: string; firstName: string; lastName: string }) => {
  try {
    const tokenParams = {
      user: { client_user_id: user.$id },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);
    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.error('Error creating Plaid Link token:', error);
  }
};

// Create a new bank account in the database
export const createBankAccount = async (props: {
  userId: string;
  bankId: string;
  accountId: string;
  accessToken: string;
  fundingSourceUrl: string;
  sharableId: string;
}) => {
  try {
    const { database } = await createAdminClient();
    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      props
    );
    return parseStringify(bankAccount);
  } catch (error) {
    console.error('Error creating bank account:', error);
  }
};

// Exchange Plaid public token for access token and create a bank account
export const exchangePublicToken = async ({ publicToken, user }: {
  publicToken: string;
  user: { $id: string; dwollaCustomerId: string };
}) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Get account information from Plaid
    const accountsResponse = await plaidClient.accountsGet({ access_token: accessToken });
    const accountData = accountsResponse.data.accounts[0];

    // Create processor token for Dwolla
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(request);
    const processorToken = processorTokenResponse.data.processor_token;

    // Create funding source URL
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw new Error('Failed to create funding source URL');

    // Save bank account information
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      sharableId: encryptId(accountData.account_id),
    });

    // Revalidate path to reflect changes
    revalidatePath('/');

    return parseStringify({ publicTokenExchange: 'complete' });
  } catch (error) {
    console.error('Error exchanging public token:', error);
  }
};

// Fetch all bank accounts for a user
export const getBanks = async ({ userId }: { userId: string }) => {
  try {
    const { database } = await createAdminClient();
    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );
    return parseStringify(banks.documents);
  } catch (error) {
    console.error('Error fetching banks:', error);
  }
};

// Fetch a specific bank by document ID
export const getBank = async ({ documentId }: { documentId: string }) => {
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    );
    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error('Error fetching bank by document ID:', error);
  }
};

// Fetch a bank by account ID
export const getBankByAccountId = async ({ accountId }: { accountId: string }) => {
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    );

    if (bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error('Error fetching bank by account ID:', error);
  }
};