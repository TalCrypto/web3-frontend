import * as React from 'react';
import Header from './header';
import Footer from './footer';
import PageHeader from './header/PageHeader';

interface LayoutProps {
  title: string;
  ogTitle: string;
  ogDesc: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, ogTitle, ogDesc, children }) => (
  <>
    <PageHeader title={title} ogTitle={ogTitle} ogDesc={ogDesc} />
    <Header />
    <div className="container mt-20 text-white">{children}</div>
    <Footer />
  </>
);

export default Layout;
