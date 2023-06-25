import React from 'react';
import BaseButton from '@/components/common/actionBtns/BaseButton';
import { useStore as useNanostore } from '@nanostores/react';
import { $showGetWEthModal } from '@/stores/modal';

function GetWETHButton() {
  const isLoading = useNanostore($showGetWEthModal);

  const handleClick = () => {
    $showGetWEthModal.set(true);
  };

  return <BaseButton isLoading={isLoading} onClick={handleClick} label="Get WETH" />;
}

export default GetWETHButton;
