import React from 'react';
import PrimaryButton from '@/components/common/PrimaryButton';
import { $isShowLoginModal } from '@/stores/modal';

const WalletNotConnected = () => {
  const onBtnConnectWallet = () => {
    // open();
    $isShowLoginModal.set(true);
  };

  return (
    <div className="flex h-[calc(100vh-400px)] flex-col items-center">
      <p className="mb-6 mt-4">Please connect wallet to get started!</p>
      <PrimaryButton className="px-[14px] py-[7px] !text-[14px] font-semibold" onClick={onBtnConnectWallet}>
        Connect Wallet
      </PrimaryButton>
    </div>
  );
};

export default WalletNotConnected;
