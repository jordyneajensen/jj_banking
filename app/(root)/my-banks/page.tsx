import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react';

const MyBanks = async () => {
  try {
    // Fetch the logged-in user
    const loggedIn = await getLoggedInUser();

    // Handle the case where user is not logged in
    if (!loggedIn || !loggedIn.$id) {
      return <p>Error: User not logged in.</p>;
    }

    // Fetch accounts for the logged-in user
    const accounts = await getAccounts({ userId: loggedIn.$id });

    // Handle the case where accounts data is not available
    if (!accounts || !accounts.data) {
      return <p>Error: Unable to fetch accounts.</p>;
    }

    return (
      <section className='flex'>
        <div className="my-banks">
          <HeaderBox
            title="My Bank Accounts"
            subtext="Effortlessly manage your banking activities."
          />

          <div className="space-y-4">
            <h2 className="header-2">Your cards</h2>
            <div className="flex flex-wrap gap-6">
              {accounts.data.length > 0 ? (
                accounts.data.map((a: Account) => (
                  <BankCard
                    key={a.id} // Use a unique identifier for the key prop
                    account={a}
                    userName={loggedIn.firstName}
                  />
                ))
              ) : (
                <p>No bank accounts found.</p> // Handle the case where there are no accounts
              )}
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error fetching data:', error);
    return <p>Error: An unexpected error occurred.</p>;
  }
};

export default MyBanks;
