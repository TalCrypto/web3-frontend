import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TopMenu from './TopMenu';
import Web3Area from './Web3Area';

function Header() {
  return (
    <div
      className="fixed left-0 right-0 top-0 z-10 w-full
      bg-[#0c0d2099]  shadow-md backdrop-blur-3xl">
      <div className="container px-0">
        <div className="flex">
          <Link href="/">
            <div className="relative mr-[24px] flex min-w-[93px] cursor-pointer items-center">
              <Image src="/images/logos/nav_logo.svg" alt="" width={93} height={46} />
              <div
                className="gradient-bg font-mont text-opacity-87
                  absolute bottom-[10px] right-0 flex h-[13px] w-[34px]
                  items-center justify-center rounded-bl-[1px] rounded-br-[12px]
                  rounded-tl-[12px] rounded-tr-[1px] text-center text-[7px]
                  font-semibold leading-[9px] text-white">
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
