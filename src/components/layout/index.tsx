/* eslint-disable operator-linebreak */
import * as React from 'react';
import { $isMobileView, $isShowMobileModal } from '@/stores/modal';
import { useStore as useNanostore } from '@nanostores/react';
import LayoutUpdater from '@/components/updaters/LayoutUpdater';
import { useRouter } from 'next/router';
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

  return (
    <>
      <Header />
      {isCompetitionPage ? (
        <video autoPlay loop muted className="absolute -top-[109px] w-full">
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
