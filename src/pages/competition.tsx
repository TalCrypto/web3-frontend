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
import TopVol from '@/components/competition/revamp/TopVol';
import MyPerformance from '@/components/competition/revamp/MyPerformance';
import MobileDropdown from '@/components/competition/revamp/MobileDropdown';
import MyPerformanceMobile from '@/components/competition/revamp/mobile/MyPerformanceMobile';
import TopFP from '@/components/competition/revamp/TopFP';

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
        <MobileDropdown />

        <div className="flex-1 border-t border-t-[#71AAFF38] bg-[#00000080]">
          <div className="content-container mb-[48px] px-0 md:py-[48px]">
            {activeTab === 0 && <TopVol />}
            {activeTab === 1 && <TopGainer />}
            {activeTab === 2 && <TopFP />}
            {activeTab === 3 && 'Top Referrer'}
            {activeTab === 4 && <MyPerformance />}
          </div>
        </div>

        <CompetitionDataUpdater />
      </main>
    </>
  );
}
