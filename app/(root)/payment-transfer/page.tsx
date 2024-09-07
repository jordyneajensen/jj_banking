import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import PaymentTransferForm from '@/components/PaymentTransferForm';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Transfer = async () => {
  try {
    // Fetch logged-in user
    const loggedIn = await getLoggedInUser();
    
    // Handle the case where user is not logged in
    if (!loggedIn || !loggedIn.$id) {
      return <p>Error: User not logged in.</p>;
    }

    // Fetch accounts using the logged-in user's ID
    const accounts = await getAccounts({ userId: loggedIn.$id });
    
    // Handle the case where accounts data is not available
    if (!accounts || !accounts.data) {
      return <p>No accounts found.</p>;
    }

    const accountsData = accounts.data;

    return (
      <section className="payment-transfer">
        <HeaderBox
          title="Payment Transfer"
          subtext="Please provide any specific details or notes related to the payment transfer"
        />

        <section className="size-full pt-5">
          <PaymentTransferForm accounts={accountsData} />
        </section>
      </section>
    );
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error occurred while fetching data:', error);
    return <p>Error: An unexpected error occurred.</p>;
  }
};

export default Transfer;
