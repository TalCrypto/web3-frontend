/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useRef } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { $activeDropdown, $activeTab, $asCompetitionLeaderboardUpdateTrigger } from '@/stores/competition';
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
import ScrollTopButton from '@/components/common/ScrollToTopButton';
import TopReferrer from '@/components/competition/revamp/TopReferrer';
import RevampCompetitionUpdater from '@/components/updaters/RevampCompetitionUpdater';

export default function Competition() {
  const { address } = useAccount();
  const activeTab = useStore($activeTab);
  const competitionActiveDropdown = useStore($activeDropdown);

  useEffect(() => {
    $asCompetitionLeaderboardUpdateTrigger.set(!$asCompetitionLeaderboardUpdateTrigger.get());
  }, [address]);

  const videoRef: any = useRef(null);

  useEffect(() => {
    const handleUserInteraction = () => {
      // Play the video when the user interacts with the site
      if (videoRef.current) {
        videoRef.playsInline = true;
        videoRef.current.play();
      }
    };

    // Listen for user interaction events (e.g., click, touch, key press)
    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Competition"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />

      <video
        // onError={failed}
        ref={videoRef}
        autoPlay
        playsInline
        loop
        muted
        preload="auto"
        className={`${
          competitionActiveDropdown === 0 ? '' : 'hidden md:block'
        } fixed top-0 z-[-1] hidden h-full w-full object-cover md:block`}>
        <source src="/images/components/competition/backgrounds/CompetitionBgVideo.mp4" type="video/mp4" />
        {/* Your browser does not support the video tag. */}
      </video>

      <main className="flex min-h-screen flex-col lg:h-full lg:min-h-[calc(100vh-80px)]">
        <Title />
        <Tabs />
        <MobileDropdown />

        <div className="flex-1 border-t border-t-[#71AAFF38] bg-black/60">
          <div className="content-container mb-[48px] px-0 md:py-[48px]">
            {/* {activeTab === 0 && <TopVol />} */}
            {activeTab === 0 && <TopGainer />}
            {activeTab === 1 && <TopFP />}
            {activeTab === 2 && <TopReferrer />}
            {activeTab === 3 && <MyPerformance />}
          </div>
        </div>

        {/* <CompetitionDataUpdater /> */}
        <RevampCompetitionUpdater />
      </main>
      <ScrollTopButton />
    </>
  );
}
