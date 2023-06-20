import React from 'react';
import BaseButton from '@/components/trade/desktop/trading/actionBtns/BaseButton';
import { useStore as useNanostore } from '@nanostores/react';
import { $showGetWEthModal } from '@/stores/modal';

function GetWETHButton() {
  const isConnecting = useNanostore($showGetWEthModal);

  const handleClick = () => {
    $showGetWEthModal.set(true);
  };

  return <BaseButton isPending={isConnecting} onClickButton={handleClick} label="Get WETH" />;
}

export default GetWETHButton;
