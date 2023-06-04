import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';
// import Sidebar from '@/components/layout/footer/mobile/Sidebar';
import { connectWallet, updateTargetNetwork } from '@/utils/Wallet';
import { wsIsLogin, wsIsWalletLoading, wsIsWrongNetwork, wsWethBalance } from '@/stores/WalletState';
import { useStore as useNanostore } from '@nanostores/react';
import { walletProvider } from '@/utils/walletProvider';

function MobileFooter() {
  const isLogin = useNanostore(wsIsLogin);
  const isWalletLoading = useNanostore(wsIsWalletLoading);
  const isWrongNetwork = useNanostore(wsIsWrongNetwork);
  const isTethCollected = Number(walletProvider.wethBalance) !== 0;
  const wethBalance = useNanostore(wsWethBalance);
  const [isSidebarShow, setIsSidebarShow] = useState(false);

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

  const onClickBottomButton = async () => {
    if (!isLogin) {
      connectWallet(null, false);
    }

    if (isWrongNetwork) {
      updateTargetNetwork(null);
    }
  };

  return (
    <>
      <div
        className="footer backface-visibility-hidden z-600 duration-400 fixed
          bottom-0 left-0 box-border block h-[64px] w-full transform bg-secondaryBlue
          pr-2 text-white md:hidden">
        <div
          className="box-border flex h-full w-full
            content-center items-center justify-normal overflow-hidden">
          <button
            className="relative box-border flex h-full w-[124px] flex-shrink-0
              items-center justify-center overflow-ellipsis whitespace-nowrap
              bg-primaryBlue text-xs font-semibold capitalize text-highEmphasis
              transition duration-100"
            onClick={onClickBottomButton}>
            {isWalletLoading ? (
              <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
            ) : !isLogin ? (
              'Connect Wallet'
            ) : isWrongNetwork ? (
              <>
                Switch to <br /> Arbitrum
              </>
            ) : !isTethCollected ? (
              'Get TETH'
            ) : (
              'Trade'
            )}
          </button>
          {isLogin ? (
            <div className="ml-6 flex-1 text-xs font-normal text-mediumEmphasis">
              Wallet Balance
              <div className="text-base font-semibold text-highEmphasis">{wethBalance} TETH</div>
            </div>
          ) : (
            <div className="ml-6 flex-1 text-xs font-normal text-mediumEmphasis">
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

      {/* <div
        className={`sidebar translate-z-0 fixed right-0 top-0
        ${isSidebarShow ? 'block' : 'hidden'}
        z-10 h-full w-[260px] text-white`}>
        <Sidebar />
      </div> */}
    </>
  );
}

export default MobileFooter;
