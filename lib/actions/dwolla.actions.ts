"use server";

import { Client } from "dwolla-v2";

// Define TypeScript interfaces for function parameters
interface CreateFundingSourceOptions {
  customerId: string;
  fundingSourceName: string;
  plaidToken: string;
}

interface NewDwollaCustomerParams {
  // Define properties for new customer, e.g.:
  firstName: string;
  lastName: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  // Add other necessary fields here
}

interface TransferParams {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: number; // Ensure amount is a positive number
}

interface AddFundingSourceParams {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
}

const getEnvironment = (): "production" | "sandbox" => {
  const environment = process.env.DWOLLA_ENV as string;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    // Validate inputs
    if (!options.customerId || !options.fundingSourceName || !options.plaidToken) {
      throw new Error("Missing required parameters for creating a funding source.");
    }

    const res = await dwollaClient.post(`customers/${options.customerId}/funding-sources`, {
      name: options.fundingSourceName,
      plaidToken: options.plaidToken,
    });

    return res.headers.get("location");
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
    throw err; // Optionally rethrow the error
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post("on-demand-authorizations");
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", err);
    throw err; // Optionally rethrow the error
  }
};

export const createDwollaCustomer = async (
  newCustomer: NewDwollaCustomerParams
) => {
  try {
    // Validate inputs
    if (!newCustomer.firstName || !newCustomer.lastName || !newCustomer.email) {
      throw new Error("Missing required customer information.");
    }

    const res = await dwollaClient.post("customers", newCustomer);
    return res.headers.get("location");
  } catch (err) {
    console.error("Creating a Dwolla Customer Failed: ", err);
    throw err; // Optionally rethrow the error
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    // Validate inputs
    if (!sourceFundingSourceUrl || !destinationFundingSourceUrl || amount <= 0) {
      throw new Error("Invalid parameters for creating a transfer.");
    }

    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: "USD",
        value: amount,
      },
    };

    const res = await dwollaClient.post("transfers", requestBody);
    return res.headers.get("location");
  } catch (err) {
    console.error("Transfer fund failed: ", err);
    throw err; // Optionally rethrow the error
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    // Validate inputs
    if (!dwollaCustomerId || !processorToken || !bankName) {
      throw new Error("Missing required parameters for adding a funding source.");
    }

    // Create dwolla auth link
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // Add funding source to the dwolla customer & get the funding source URL
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };

    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Adding funding source failed: ", err);
    throw err; // Optionally rethrow the error
  }
};
