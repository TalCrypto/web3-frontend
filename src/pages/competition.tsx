/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import React, { useContext, useEffect, useState } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { useRouter } from 'next/router';
import Image from 'next/image';
import TopComponent from '@/components/competition/desktop/TopComponent';
import { useAccount } from 'wagmi';
import { $isCompetitionLeaderboardLoading } from '@/stores/competition';
import { apiConnection } from '@/utils/apiConnection';
import PrizeComponent from '@/components/competition/desktop/PrizeComponent';
import Leaderboard from '@/components/competition/desktop/Leaderboard';

export default function Competition() {
  const { address, isConnected, isConnecting } = useAccount();

  const getInitialData = async () => {
    $isCompetitionLeaderboardLoading.set(true);
    const leaderboardPromises = [
      apiConnection.getAbsPnlLeaderboard(address),
      apiConnection.getRealizedPnlPercentageLeaderboard(address),
      apiConnection.getNetConvergenceLeaderboard(address),
      apiConnection.getTopLosersLeaderboard(address)
    ];

    await Promise.allSettled(leaderboardPromises);

    setTimeout(() => {
      $isCompetitionLeaderboardLoading.set(false);
    }, 500);
  };

  useEffect(() => {
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
