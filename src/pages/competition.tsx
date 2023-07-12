/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import TopComponent from '@/components/competition/desktop/TopComponent';
import PrizeComponent from '@/components/competition/desktop/PrizeComponent';
import Leaderboard from '@/components/competition/desktop/Leaderboard';

export default function Competition() {
  return (
    <>
      <PageHeader
        title="Competition"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />
      <main>
        {/* <div className="relative hidden md:block"> */}
        <div className="relative">
          <TopComponent />
          <PrizeComponent />
          <Leaderboard />
        </div>

        {/* <div className="mobile-view" /> */}
      </main>
    </>
  );
}
