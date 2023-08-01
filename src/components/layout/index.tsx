/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
import React, { useEffect, useRef } from 'react';
import { $isMobileView, $isShowMobileModal, $isBannerShow } from '@/stores/modal';
import { useStore as useNanostore } from '@nanostores/react';
import LayoutUpdater from '@/components/updaters/LayoutUpdater';
import { useRouter } from 'next/router';
import { $activeDropdown } from '@/stores/competition';
import { $isNotFoundPage } from '@/stores/route';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isShowMobileMenu = useNanostore($isShowMobileModal);
  const isMobileView = useNanostore($isMobileView);
  const isBannerShow = useNanostore($isBannerShow);

  const isNotFoundPage = useNanostore($isNotFoundPage);
  const isAirdropPage = router.pathname === '/airdrop';
  const isCompetitionPage = router.pathname === '/competition';
  const airdropBgClass = isMobileView
    ? ''
    : "bg-black bg-[url('/images/components/airdrop/bg-s2.png')] bg-cover bg-fixed bg-[center_top] bg-no-repeat";

  const isUserprofilePage = router.pathname.match('/userprofile');
  const userprofileBgClass =
    "bg-black bg-[url('/images/components/userprofile/bg1.png')] bg-cover bg-fixed bg-left-top 4xl:bg-[left_top_-10rem] bg-no-repeat";
  const userprofileBg2Class = "bg-[url('/images/components/userprofile/bg2.png')] bg-cover bg-fixed bg-right-top bg-no-repeat";

  const competitionActiveDropdown = useNanostore($activeDropdown);
  const isFullContentContainer = isUserprofilePage || isCompetitionPage || isNotFoundPage;

  // competition page bg video
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

  // const competitionVideoBg = () => {
  //   if (isCompetitionPage)
  //     return (
  //       <video
  //         // onError={failed}
  //         ref={videoRef}
  //         autoPlay
  //         playsInline
  //         loop
  //         muted
  //         preload="auto"
  //         className={`${
  //           competitionActiveDropdown === 0 ? '' : 'hidden md:block'
  //         } absolute -top-[12vw] h-[93vw] w-full object-cover md:-top-[109px] md:h-auto md:object-fill`}>
  //         <source src="/images/components/competition/backgrounds/bg-spot-light.mp4" type="video/mp4" />
  //         {/* Your browser does not support the video tag. */}
  //       </video>
  //     );
  //
  //   return null;
  // };

  return (
    <>
      <Header />
      <div
        className={`min-h-screen w-full
          ${isAirdropPage ? airdropBgClass : 'bg-darkBlue'}
          ${isUserprofilePage || isNotFoundPage ? userprofileBgClass : ''}`}>
        <div
          className={`
            ${isFullContentContainer ? '' : 'content-container pb-[42px]'}
            ${isUserprofilePage || isNotFoundPage ? userprofileBg2Class : ''}
            mmd:pb-10 w-full
            !px-0  text-white md:h-full md:min-h-screen ${isBannerShow ? 'md:pt-[120px]' : 'md:pt-20'}
            ${isShowMobileMenu ? 'h-[100vh] overflow-y-hidden' : ''}
        `}>
          {children}
        </div>
      </div>

      <LayoutUpdater />
      <Footer />
    </>
  );
};

export default Layout;
