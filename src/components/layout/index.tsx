import * as React from 'react';
import { $isShowMobileModal } from '@/stores/common';
import { useStore as useNanostore } from '@nanostores/react';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isShowMobileMenu = useNanostore($isShowMobileModal);
  return (
    <>
      <Header />
      <div
        className={`content-container w-full bg-darkBlue !px-0 pb-12
          text-white md:h-full md:overflow-auto md:pb-10 md:pt-20
            ${isShowMobileMenu ? 'h-[100vh] overflow-y-hidden' : ''}
        `}>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
