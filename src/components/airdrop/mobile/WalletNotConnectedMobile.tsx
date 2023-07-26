import React from 'react';
import PrimaryButton from '@/components/common/PrimaryButton';
import { $isShowMobileTncModal } from '@/stores/modal';
import { useWeb3Modal } from '@web3modal/react';
import { useConnect } from 'wagmi';

const WalletNotConnectedMobile = () => {
  const { open } = useWeb3Modal();
  const { connect, connectors } = useConnect();

  const onBtnConnectWallet = () => {
    const localStorageTncApproved = localStorage.getItem('isTncApproved') === 'true';
    if (!localStorageTncApproved) {
      $isShowMobileTncModal.set(true);
      return;
    }

    let isInjected = false;

    for (let i = 0; i < connectors.length; i += 1) {
      const connector = connectors[i];
      if (connector?.name.toLowerCase().includes('metamask')) {
        connect({ connector });
        isInjected = true;
        break;
      }
    }

    if (!isInjected) {
      open();
    }
  };

  return (
    <div className="flex h-[calc(100dvh-325px)] flex-col items-center">
      <p className="mb-6 mt-4">Please connect wallet to get started!</p>
      <PrimaryButton className="px-[14px] py-[7px] !text-[14px] font-semibold" onClick={onBtnConnectWallet}>
        Connect Wallet
      </PrimaryButton>
    </div>
  );
};

export default WalletNotConnectedMobile;
