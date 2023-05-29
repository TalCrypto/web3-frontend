import * as React from 'react';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <>
    <Header />
    <div className="w-full px-10 pb-10 pt-20 text-white">{children}</div>
    <Footer />
  </>
);

export default Layout;
