import Link from 'next/link'
import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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
            <Link href={`/transaction-history/?id?=${appwriteItemId}`} className='view-all-btn'>
                View All
            </Link>
        </header>

        <Tabs defaultValue={appwriteItemId} className="w-full">
            <TabsList className='recent-transactions-tablist'>
               
            </TabsList>
        </Tabs>

    </section>
  )
}

export default RecentTranscriptions