/* eslint-disable no-unused-vars */
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';

import AirdropPoint from '@/components/layout/header/desktop/AirdropPoint';
import { $showSwitchNetworkErrorModal } from '@/stores/modal';
import LiveTrades from '@/components/layout/header/desktop/LiveTrades';
import ConnectWalletButton from './ConnectWalletButton';
import ErrorModal from './ErrorModal';

function Web3Area() {
  const isShowErrorSwitchNetworkModal = useNanostore($showSwitchNetworkErrorModal);

  return (
    <div
      className="navbar-container relative mx-auto flex h-[60px] items-start
        justify-start p-0 py-[14px] text-[16px] font-medium text-white">
      <AirdropPoint />

      <LiveTrades />

      <ConnectWalletButton />

      <ErrorModal isShow={isShowErrorSwitchNetworkModal} image="/images/components/layout/header/cloudError.svg" />
    </div>
  );
}

export default Web3Area;
