import * as React from 'react';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <>
    <Header />
    <div className="w-full px-0 pb-12 text-white md:container md:pb-10 md:pt-20">{children}</div>
    <Footer />
  </>
);

export default Layout;
