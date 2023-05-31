import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';
import Sidebar from '@/components/layout/footer/mobile/Sidebar';

function MobileFooter() {
  const isLogin = false;
  const isLoading = false;
  const wethBalance = 0;
  const isTethCollected = false;
  const isNetworkSame = true;
  const [isSidebarShow, setIsSidebarShow] = useState(false);

  function handleGoToTrade() {}

  useEffect(() => {
    const handleBodyClick = (event: any) => {
      if (!event.target.closest('.footer') && !event.target.closest('.sidebar') && isSidebarShow) {
        setIsSidebarShow(false);
      }
    };
    document.body.addEventListener('click', handleBodyClick);
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, [isSidebarShow]);

  return (
    <>
      <div
        className="footer backface-visibility-hidden z-600 duration-400 fixed
          bottom-0 left-0 box-border block h-[64px] w-full transform bg-[#202249]
          pr-2 text-white md:hidden">
        <div
          className="box-border flex h-full w-full
            content-center items-center justify-normal overflow-hidden">
          <button
            className="relative box-border h-full w-[124px]
              flex-shrink-0 overflow-ellipsis whitespace-nowrap
              bg-[#2574FB] text-xs font-semibold capitalize text-white/[.87]
              transition duration-100"
            onClick={handleGoToTrade}>
            {isLoading ? (
              <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
            ) : !isLogin ? (
              'Connect Wallet'
            ) : !isNetworkSame ? (
              'Switch to Goerli'
            ) : !isTethCollected ? (
              'Get TETH'
            ) : (
              'Trade'
            )}
          </button>
          {isLogin ? (
            <div className="ml-6 flex-1 text-xs font-normal text-[#a8cbff]/[.75]">
              Wallet Balance
              <div className="text-base font-semibold text-white/[.87]">{wethBalance} TETH</div>
            </div>
          ) : (
            <div className="ml-6 flex-1 text-xs font-normal text-[#a8cbff]/[.75]">
              Please connect
              <br />
              wallet to trade
            </div>
          )}
          <button
            onClick={() => {
              setIsSidebarShow(true);
            }}>
            <Image src="/images/mobile/common/menu_icon.svg" alt="" width={40} height={40} />
          </button>
        </div>
      </div>

      <div
        className={`sidebar translate-z-0 fixed right-0 top-0
        ${isSidebarShow ? 'block' : 'hidden'}
        z-10 h-full w-[260px] text-white`}>
        <Sidebar />
      </div>
    </>
  );
}

export default MobileFooter;
