import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TopMenu from './TopMenu';
import Web3Area from './Web3Area';

function Header() {
  return (
    <div className="navbar-top-container">
      <div className="container px-0">
        <div className="flex">
          <Link href="/">
            <div className="relative mr-[24px] flex min-w-[93px] cursor-pointer items-center">
              <Image src="/images/logos/nav_logo.svg" alt="" width={93} height={46} />
              <div className="beta-badge">
                <div>BETA</div>
              </div>
            </div>
          </Link>

          <TopMenu />
          <div className="flex-1" />

          <Web3Area />
        </div>
      </div>
    </div>
  );
}

export default Header;
