import React from 'react';
import PrimaryButton from '@/components/common/PrimaryButton';
import { useWeb3Modal } from '@web3modal/react';

const WalletNotConnected = () => {
  const { open } = useWeb3Modal();

  const onBtnConnectWallet = () => {
    open();
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
