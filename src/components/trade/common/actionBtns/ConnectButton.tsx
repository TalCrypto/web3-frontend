import React from 'react';
import BaseButton from '@/components/trade/common/actionBtns/BaseButton';
import { useStore as useNanostore } from '@nanostores/react';
import { $userIsConnecting } from '@/stores/user';
// import { useWeb3Modal } from '@web3modal/react';
import { /* $isMobileView, */ $isShowLoginModal } from '@/stores/modal';

function ConnectButton() {
  // const { open } = useWeb3Modal();
  const isConnecting = useNanostore($userIsConnecting);
  // const isMobileView = useNanostore($isMobileView);

  const traderConnectWallet = () => {
    // if (isMobileView) {
    //   open({ route: 'ConnectWallet' });
    // } else {
    $isShowLoginModal.set(true);
    // }
  };

  return <BaseButton isLoading={isConnecting} onClick={traderConnectWallet} label="Connect Wallet" />;
}

export default ConnectButton;
