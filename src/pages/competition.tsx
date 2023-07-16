/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import TopComponent from '@/components/competition/desktop/TopComponent';
import PrizeComponent from '@/components/competition/desktop/PrizeComponent';
import Leaderboard from '@/components/competition/desktop/Leaderboard';
import { $asCompetitionLeaderboardUpdateTrigger } from '@/stores/competition';
import { useAccount } from 'wagmi';
import CompetitionDataUpdater from '@/components/updaters/CompetitionUpdater';

export default function Competition() {
  const { address } = useAccount();

  useEffect(() => {
    $asCompetitionLeaderboardUpdateTrigger.set(!$asCompetitionLeaderboardUpdateTrigger.get());
  }, [address]);

  return (
    <>
      <PageHeader
        title="Competition"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />
      <main>
        {/* <div className="relative hidden md:block"> */}
        <div className="relative pb-8">
          <TopComponent />
          <PrizeComponent />
          <Leaderboard />
        </div>

        {/* <div className="mobile-view" /> */}
        <CompetitionDataUpdater />
      </main>
    </>
  );
}
