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
  const airdropBgClass = isMobileView
    ? ''
    : "bg-black bg-[url('/images/components/airdrop/bg-s2.png')] bg-cover bg-fixed bg-[center_top] bg-no-repeat";

  const isUserprofilePage = router.pathname.match('/userprofile');
  const userprofileBgClass = "bg-black bg-[url('/images/components/userprofile/bg1.png')] bg-cover bg-fixed bg-[center_top] bg-no-repeat";
  const userprofileBg2Class = "bg-[url('/images/components/userprofile/bg2.png')] bg-cover bg-fixed bg-center bg-no-repeat";

  return (
    <>
      <Header />
      <div
        className={`min-h-screen w-full
          ${isAirdropPage ? airdropBgClass : 'bg-darkBlue'}
          ${isUserprofilePage ? userprofileBgClass : ''}`}>
        <div
          className={`
            ${isUserprofilePage ? userprofileBg2Class : 'content-container pb-[42px]'}
            mmd:pb-10 w-full
            !px-0  text-white md:h-full md:min-h-screen md:pt-20 
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
