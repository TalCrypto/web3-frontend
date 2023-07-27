import React from 'react';
import BaseButton from '@/components/trade/common/actionBtns/BaseButton';
import { useStore as useNanostore } from '@nanostores/react';
import { $userIsConnecting } from '@/stores/user';
import { useWeb3Modal } from '@web3modal/react';
import { $isMobileView, $isShowLoginModal, $isShowMobileTncModal } from '@/stores/modal';
import { useConnect } from 'wagmi';

function ConnectButton() {
  const { open } = useWeb3Modal();
  const isConnecting = useNanostore($userIsConnecting);
  const isMobileView = useNanostore($isMobileView);
  const { connect, connectors } = useConnect();

  const traderConnectWallet = () => {
    if (isMobileView) {
      const localStorageTncApproved = localStorage.getItem('isTncApproved') === 'true';
      if (!localStorageTncApproved) {
        $isShowMobileTncModal.set(true);
        return;
      }
      // let isInjected = false;

      // for (let i = 0; i < connectors.length; i += 1) {
      //   const connector = connectors[i];
      //   if (connector?.name.toLowerCase().includes('metamask')) {
      //     connect({ connector });
      //     isInjected = true;
      //     break;
      //   }
      // }

      // if (!isInjected) {
      //   open();
      // }
      open();
    } else {
      $isShowLoginModal.set(true);
    }
  };

  return <BaseButton isLoading={isConnecting} onClick={traderConnectWallet} label="Connect Wallet" />;
}

export default ConnectButton;
