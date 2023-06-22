import React from 'react';
import BaseButton from '@/components/trade/desktop/trading/actionBtns/BaseButton';
import { useStore as useNanostore } from '@nanostores/react';
import { $userIsConnecting } from '@/stores/user';
import { useSwitchNetwork } from 'wagmi';
import { DEFAULT_CHAIN } from '@/const/supportedChains';
import { $showSwitchNetworkErrorModal } from '@/stores/modal';

function SwitchButton() {
  const { switchNetwork } = useSwitchNetwork();
  const isConnecting = useNanostore($userIsConnecting);

  const handleSwitch = () => {
    if (switchNetwork) {
      switchNetwork(DEFAULT_CHAIN.id);
    } else {
      $showSwitchNetworkErrorModal.set(true);
    }
  };

  return <BaseButton isLoading={isConnecting} onClick={handleSwitch} label="Switch to Arbitrum" />;
}

export default SwitchButton;
