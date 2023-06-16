import React, { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';
// import Sidebar from '@/components/layout/footer/mobile/Sidebar';
import { wsIsShowTradingMobile } from '@/stores/WalletState';
import { useStore as useNanostore } from '@nanostores/react';
import MobileMenu from '@/components/trade/mobile/menu';
import { $userIsConnected, $userIsConnecting, $userIsWrongNetwork, $userWethBalance } from '@/stores/user';
import { useConnect, useSwitchNetwork } from 'wagmi';
import { CHAINS } from '@/const/supportedChains';
import { $isShowMobileModal } from '@/stores/common';

function MobileFooter() {
  const { connect } = useConnect();
  const { switchNetwork } = useSwitchNetwork();
  const isConnected = useNanostore($userIsConnected);
  const isConnecting = useNanostore($userIsConnecting);
  const wethBalance = useNanostore($userWethBalance);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false);
  const isWethCollected = wethBalance !== 0;

  const onClickBottomButton = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    if (isWrongNetwork && switchNetwork) {
      switchNetwork(CHAINS[0].id);
      return;
    }

    if (!isWethCollected) {
      return;
    }

    wsIsShowTradingMobile.set(true);
    $isShowMobileModal.set(true);
  };

  return (
    <>
      <div
        className="backface-visibility-hidden duration-400 fixed bottom-0
          left-0 z-10 box-border block h-[49px] w-full transform bg-secondaryBlue
          pr-5 text-white md:hidden">
        <div
          className="box-border flex h-full w-full
            content-center items-center justify-normal overflow-hidden">
          <button
            className="relative box-border flex h-full w-[124px] flex-shrink-0
              items-center justify-center overflow-ellipsis whitespace-nowrap
              bg-primaryBlue text-xs font-semibold capitalize leading-[17px]
              text-highEmphasis transition duration-100"
            onClick={onClickBottomButton}>
            {isConnecting ? (
              <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
            ) : !isConnected ? (
              <>
                Connect
                <br />
                Wallet
              </>
            ) : isWrongNetwork ? (
              <>
                Switch to <br /> Arbitrum
              </>
            ) : !isWethCollected ? (
              'Get WETH'
            ) : (
              'Trade'
            )}
          </button>
          {isConnected ? (
            <div className="ml-6 flex-1 text-[12px] font-normal leading-[15px] text-mediumEmphasis">
              Wallet Balance
              <div className="text-[12px] font-semibold leading-[18px] text-highEmphasis">{wethBalance} WETH</div>
            </div>
          ) : (
            <div className="ml-6 flex-1 text-[12px] font-normal leading-[15px] text-mediumEmphasis">
              Please connect
              <br />
              wallet to trade
            </div>
          )}

          <div className="relative h-full w-[50px]">
            <button
              className="absolute bottom-[5px] right-0"
              onClick={() => {
                setIsShowMobileMenu(true);
                $isShowMobileModal.set(true);
              }}>
              <Image src="/images/mobile/common/menu_icon.svg" alt="" width={40} height={40} />
            </button>
          </div>
        </div>
      </div>

      {isShowMobileMenu ? <MobileMenu setIsShowMobileMenu={setIsShowMobileMenu} /> : null}
    </>
  );
}

export default MobileFooter;
