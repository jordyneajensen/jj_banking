import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RIghtSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import React from 'react'

const Home = () => {
  const loggedIn = { firstName: 'Jordyn', lastName: 'JJ', email: 'jordyn@example.com' };

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting" 
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your accound and transactions efficiently."         
          />

         <TotalBalanceBox
            accounts={[]}
            totalBanks={}
            totalCurrentBalance={}
         /> 
        </header>
      </div>
      <RightSidebar 
        user={loggedIn}
        transactions={[]}
        banks={[{}, {}]}
      />
    </section>
  )
}

export default Home