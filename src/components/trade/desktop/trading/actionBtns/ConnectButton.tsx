import React from 'react';
import BaseButton from '@/components/trade/desktop/trading/actionBtns/BaseButton';
import { useStore as useNanostore } from '@nanostores/react';
import { $userIsConnecting } from '@/stores/user';
import { useWeb3Modal } from '@web3modal/react';

function ConnectButton() {
  const { open } = useWeb3Modal();
  const isConnecting = useNanostore($userIsConnecting);

  const traderConnectWallet = () => {
    open({ route: 'ConnectWallet' });
  };

  return <BaseButton isLoading={isConnecting} onClick={traderConnectWallet} label="Connect Wallet" />;
}

export default ConnectButton;
