/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import BaseButton from '@/components/trade/common/actionBtns/BaseButton';
import { useStore as useNanostore } from '@nanostores/react';
import { useSwitchNetwork } from 'wagmi';
import { DEFAULT_CHAIN } from '@/const/supportedChains';
import { $showSwitchNetworkErrorModal } from '@/stores/modal';
import { $userIsWrongNetwork } from '@/stores/user';

function SwitchButton() {
  const { switchNetwork, isError } = useSwitchNetwork();
  const [isLoading, setIsLoading] = useState(false);
  const isWrongNet = useNanostore($userIsWrongNetwork);

  useEffect(() => {
    if (!isWrongNet || isError) {
      setIsLoading(false);
    }
  }, [isWrongNet, isError]);

  const handleSwitch = () => {
    if (switchNetwork) {
      setIsLoading(true);
      switchNetwork(DEFAULT_CHAIN.id);
    } else {
      $showSwitchNetworkErrorModal.set(true);
    }
  };

  return <BaseButton isLoading={isLoading} onClick={handleSwitch} label="Switch to Arbitrum" />;
}

export default SwitchButton;
