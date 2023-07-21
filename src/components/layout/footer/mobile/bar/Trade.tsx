/* eslint-disable no-alert */
import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
// import Sidebar from '@/components/layout/footer/mobile/Sidebar';
import { useStore as useNanostore } from '@nanostores/react';
// import { useWeb3Modal } from '@web3modal/react';
import { DEFAULT_CHAIN } from '@/const/supportedChains';
import { useConnect, useSwitchNetwork } from 'wagmi';
import { $userIsConnected, $userIsConnecting, $userIsWrongNetwork, $userWethBalance } from '@/stores/user';
import { $isShowTradingMobile } from '@/stores/trading';
import { $isShowMobileModal, $isShowMobileTokenModal, $showSwitchNetworkErrorModal } from '@/stores/modal';

function MobileTradeFooterInfo() {
  // const { open } = useWeb3Modal();
  const { switchNetwork } = useSwitchNetwork();
  const isConnected = useNanostore($userIsConnected);
  const isConnecting = useNanostore($userIsConnecting);
  const wethBalance = useNanostore($userWethBalance);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const isWethCollected = wethBalance !== 0;
  const showWethBalanceLabel = !isConnected ? '' : isWrongNetwork ? '-.-- WETH' : `${Number(wethBalance).toFixed(2)} WETH`;
  const { connect, connectors } = useConnect();

  const onClickBottomButton = async () => {
    if (!isConnected) {
      const connector0 = connectors[0];
      const connector1 = connectors[1];
      alert(connector0);
      alert(connector0.id);
      alert(connector0.name);
      alert(connector1);
      alert(connector1.id);
      alert(connector1.name);
      const connector = connectors[1];
      connect({ connector });
      // let isInjected = false;

      // for (let i = 0; i < connectors.length; i += 1) {
      //   const connector = connectors[i];
      //   if (connector?.id.includes('injected')) {
      //     connect({ connector });
      //     isInjected = true;
      //   }
      // }

      // if (!isInjected) {
      //   open();
      // }

      return;
    }

    if (isWrongNetwork) {
      if (switchNetwork) {
        switchNetwork(DEFAULT_CHAIN.id);
      } else {
        $showSwitchNetworkErrorModal.set(true);
      }
      return;
    }

    if (!isWethCollected) {
      $isShowMobileTokenModal.set(true);
      return;
    }

    $isShowTradingMobile.set(true);
    $isShowMobileModal.set(true);
  };

  return (
    <>
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
          <div className="text-[12px] font-semibold leading-[18px] text-highEmphasis">{showWethBalanceLabel}</div>
        </div>
      ) : (
        <div className="ml-6 flex-1 text-[12px] font-normal leading-[15px] text-mediumEmphasis">
          Please connect
          <br />
          wallet to trade
        </div>
      )}
    </>
  );
}

export default MobileTradeFooterInfo;
