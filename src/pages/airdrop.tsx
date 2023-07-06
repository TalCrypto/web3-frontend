/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { useRouter } from 'next/router';
import { $asActiveTab } from '@/stores/airdrop';
import TabItems from '@/components/airdrop/desktop/TabItems';
import { useStore as useNanostore } from '@nanostores/react';
import Overview from '@/components/airdrop/desktop/Overview';
import Referral from '@/components/airdrop/desktop/Referral';
import Leaderboard from '@/components/airdrop/desktop/Leaderboard';
import Rules from '@/components/airdrop/desktop/Rules';

import RulesMobile from '@/components/airdrop/mobile/Rules';

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

          <div className="pt-9">
            {activeTab === 0 ? <Overview /> : activeTab === 1 ? <Referral /> : activeTab === 2 ? <Leaderboard /> : <Rules />}
          </div>
        </div>

        <div
          className="mobile-view block bg-lightBlue bg-[url('/images/components/airdrop/bg-mobile.png')]
             bg-[center_top] bg-no-repeat md:hidden
          ">
          <div className="text-glow-green mb-[12px] pt-9 text-center text-[32px] font-bold">AIRDROP SEASON 2</div>
          <p className="mb-[48px] text-center">
            More <span className="text-seasonGreen">Tribe3 points</span>, <br />
            more <span className="text-seasonGreen">Tribe3 tokens</span> for you
          </p>

          {/* <TabItems /> */}

          <div className="pt-9">{activeTab === 0 ? null : activeTab === 1 ? null : activeTab === 2 ? null : <RulesMobile />}</div>
        </div>
      </main>
    </>
  );
}
