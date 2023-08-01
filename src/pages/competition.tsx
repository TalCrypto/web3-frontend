/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { $activeTab, $asCompetitionLeaderboardUpdateTrigger } from '@/stores/competition';
import { useAccount } from 'wagmi';
import CompetitionDataUpdater from '@/components/updaters/CompetitionUpdater';
import Title from '@/components/competition/revamp/Title';
import Tabs from '@/components/competition/revamp/Tabs';
import { useStore } from '@nanostores/react';
import TopGainer from '@/components/competition/revamp/TopGainer';

export default function Competition() {
  const { address } = useAccount();
  const activeTab = useStore($activeTab);

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
      <main className="flex min-h-[calc(100vh-80px)] flex-col">
        <Title />
        <Tabs />

        <div className="flex-1 border-t border-t-[#71AAFF38] bg-[#00000080]">
          <div className="content-container mb-[48px] px-5 py-[48px] md:px-0">
            {activeTab === 0 && 'Top Vol'}
            {activeTab === 1 && 'Top ROI'}
            {activeTab === 2 && <TopGainer />}
            {activeTab === 3 && 'Top FP'}
            {activeTab === 4 && 'Top Referrer'}
            {activeTab === 5 && 'My Performance'}
          </div>
        </div>
        <CompetitionDataUpdater />
      </main>
    </>
  );
}
