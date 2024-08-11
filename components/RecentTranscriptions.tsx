import React from 'react'

const RecentTranscriptions = ({
    accounts,
    transactions = [],
    appwriteItemId,
    page =1,
}: RecentTransactionsProps) => {
  return (
    <section className='recent-transactions'>
        <header className='flex items-center justify-between'>
            <h2 className='recent-transactions-label'>
                Recent Transactions
            </h2>
            
        </header>
    </section>
  )
}

export default RecentTranscriptions