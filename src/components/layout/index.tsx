/* eslint-disable operator-linebreak */
import React, { useEffect, useRef } from 'react';
import { $isMobileView, $isShowMobileModal } from '@/stores/modal';
import { useStore as useNanostore } from '@nanostores/react';
import LayoutUpdater from '@/components/updaters/LayoutUpdater';
import { useRouter } from 'next/router';
import { $activeDropdown } from '@/stores/competition';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isShowMobileMenu = useNanostore($isShowMobileModal);
  const isMobileView = useNanostore($isMobileView);

  const isAirdropPage = router.pathname === '/airdrop';
  const isCompetitionPage = router.pathname === '/competition';
  const airdropBgClass = isMobileView
    ? ''
    : "bg-black bg-[url('/images/components/airdrop/bg-s2.png')] bg-cover bg-fixed bg-[center_top] bg-no-repeat";

  const competitionActiveDropdown = useNanostore($activeDropdown);

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

  return (
    <>
      <Header />
      {isCompetitionPage ? (
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
          } absolute -top-[12vw] h-[93vw] w-full object-cover md:-top-[109px] md:h-auto md:object-fill`}>
          <source src="/images/components/competition/backgrounds/bg-spot-light.mp4" type="video/mp4" />
          {/* Your browser does not support the video tag. */}
        </video>
      ) : null}
      <div
        className={`h-full w-full
          ${isAirdropPage ? airdropBgClass : 'bg-darkBlue'}`}>
        <div
          className={`content-container mmd:pb-10 w-full
            !px-0 pb-12 text-white md:h-full md:pt-20 
            ${isShowMobileMenu ? 'h-[100dvh] overflow-y-hidden' : ''}
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
