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

import ReferralMobile from '@/components/airdrop/mobile/Referral';
import RulesMobile from '@/components/airdrop/mobile/Rules';
import OverviewMobile from '@/components/airdrop/mobile/Overview';
import TopInfo from '@/components/airdrop/desktop/TopInfo';
import TopInfoMobile from '@/components/airdrop/mobile/TopInfo';
import TabSwitcher from '@/components/airdrop/mobile/TabSwitcher';
import LeaderboardMobile from '@/components/airdrop/mobile/Leaderboard';
import LeaderboardDataUpdater from '@/components/updaters/LeaderboardUpdater';
import { ToastContainer } from 'react-toastify';

export default function Home() {
  const router = useRouter();
  const activeTab = useNanostore($asActiveTab);

  const routingQuery = () => {
    const { target }: any = router.query;
    if (target) {
      const index = ['', 'refer', 'leaderboard'].indexOf(target);
      if (index >= 0) {
        $asActiveTab.set(index);
      }
    }
  };

  useEffect(() => {
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
        ogTitle="Start longing or shorting NFT collections with leverage."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />

      <ToastContainer
        enableMultiContainer
        containerId="AIRDROP"
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{ border: '1px solid rgba(120, 243, 99, 1)', fontFamily: 'Montserrat', width: '380px' }}
      />

      <main>
        <div className="hidden md:block">
          <TopInfo />

          <TabItems />

          <div className="pt-9">
            {activeTab === 0 ? <Overview /> : activeTab === 1 ? <Referral /> : activeTab === 2 ? <Leaderboard /> : <Rules />}
          </div>
        </div>

        <div
          className="mobile-view block bg-darkBlue bg-[url('/images/components/airdrop/bg-mobile.png')]
             bg-cover bg-[center_top] bg-no-repeat md:hidden
          ">
          <TopInfoMobile />

          <TabSwitcher />

          <div className="bg-darkBlue pt-9">
            {activeTab === 0 ? (
              <OverviewMobile />
            ) : activeTab === 1 ? (
              <ReferralMobile />
            ) : activeTab === 2 ? (
              <LeaderboardMobile />
            ) : (
              <RulesMobile />
            )}
          </div>
        </div>

        <LeaderboardDataUpdater />
      </main>
    </>
  );
}
