import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TopMenu from '@/components/layout/header/desktop/TopMenu';
import Web3Area from '@/components/layout/header/desktop/Web3Area';
// import MobileHeader from '@/components/layout/header/mobile';

function Header() {
  return (
    <>
      <div
        className="fixed left-0 right-0 top-0 z-20 hidden
        w-full shadow-md backdrop-blur-3xl md:block">
        <div className="navbar container px-0">
          <div className="flex">
            <Link href="/trade/degods">
              <div className="relative mr-[24px] flex h-full min-w-[93px] cursor-pointer items-center">
                <Image src="/images/logos/nav_logo.svg" alt="" width={93} height={46} />
                <div
                  className="gradient-bg absolute bottom-[10px] right-0 flex h-[13px] w-[34px]
                    items-center justify-center rounded-bl-[1px] rounded-br-[12px]
                    rounded-tl-[12px] rounded-tr-[1px] text-center text-[7px]
                    font-semibold leading-[9px] text-highEmphasis">
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

      {/* <div className="block bg-lightBlue md:hidden">
        <MobileHeader />
      </div> */}
    </>
  );
}

export default Header;
