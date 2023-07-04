/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { useRouter } from 'next/router';
import { $asActiveTab } from '@/stores/airdrop';
import TabItems from '@/components/airdrop/TabItems';
import { useStore as useNanostore } from '@nanostores/react';
import Overview from '@/components/airdrop/Overview';
import Referral from '@/components/airdrop/Referral';
import Leaderboard from '@/components/airdrop/Leaderboard';
import Rules from '@/components/airdrop/Rules';

export default function Home() {
  const router = useRouter();
  const activeTab = useNanostore($asActiveTab);

  // value from nano store
  // const userPointData = useNanostore(userPoint);
  // const leaderboardData = useNanostore(leaderboard);
  // const prevUserPointData = useNanostore(userPrevSeasonPoint);

  const routingQuery = () => {
    const { target }: any = router.query;
    if (target) {
      const index = ['', 'refer', 'leaderboard'].indexOf(target);
      if (index >= 0) {
        $asActiveTab.set(index);
      }
    }
  };

  const getInitialData = () => {
    // apiConnection.getLeaderboard();
  };

  useEffect(() => {
    getInitialData();
    routingQuery();
  }, []);

  // handle route query url to set state tab
  useEffect(() => {
    const { target } = router.query;
    switch (target) {
      case 'refer':
        $asActiveTab.set(1);
        break;
      case 'leaderboard':
        $asActiveTab.set(2);
        break;
      case 'rules':
        $asActiveTab.set(3);
        break;
      default:
        $asActiveTab.set(0);
        break;
    }
  }, [router.query]);

  return (
    <>
      <PageHeader
        title="Airdrop"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />
      <main>
        <div className="hidden md:block">
          <div className="text-glow-green mb-[12px] mt-9 text-center text-[32px] font-bold">AIRDROP SEASON 2</div>
          <p className="mb-[48px] text-center">
            More <span className="text-seasonGreen">Tribe3 points</span>, more <span className="text-seasonGreen">Tribe3 tokens</span>
            for you 🙌
          </p>

          <TabItems />

          <div>{activeTab === 0 ? <Overview /> : activeTab === 1 ? <Referral /> : activeTab === 2 ? <Leaderboard /> : <Rules />}</div>
        </div>

        <div className="mobile-view" />
      </main>
    </>
  );
}
