import React from 'react';
import Image from 'next/image';

import { wsIsConnectWalletModalShow, wsIsWalletLoading } from '@/stores/WalletState';
import { connectWithWalletConnect, connectWithEthereum } from '@/utils/Wallet';

export default function ConnectWalletModal() {
  const connectWallet = (isWC: boolean) => {
    wsIsConnectWalletModalShow.set(false);
    if (isWC) {
      connectWithWalletConnect();
    } else {
      connectWithEthereum();
    }
  };

  const closeModal = () => {
    wsIsWalletLoading.set(false);
    wsIsConnectWalletModalShow.set(false);
  };

  const imageSize = 24;

  return (
    <div
      className="fixed inset-0 z-10 flex h-screen
      items-center justify-center overflow-auto bg-black bg-opacity-40"
      onClick={closeModal}>
      <div
        className="mx-4 w-full max-w-[500px] rounded-lg bg-lightBlue
          px-6 py-6 text-[14px] font-normal leading-normal md:px-9"
        onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-end justify-end">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            className="cursor-pointer"
            width={16}
            height={16}
            onClick={closeModal}
          />
        </div>
        <div className="relative flex cursor-default flex-col items-start justify-start">
          <div className="mb-3 text-[16px] font-semibold">Connect Your Wallet👇</div>

          <div className="w-full">
            <div
              className="mt-3 flex cursor-pointer flex-col items-center
                justify-center rounded-md border border-solid
                border-primaryBlue py-6 hover:bg-[#2574fb33]"
              onClick={() => connectWallet(false)}>
              <Image src="/images/components/layout/header/okx-logo.svg" alt="" className="logo" width={imageSize} height={imageSize} />
              <div className="mt-[6px] text-[16px] font-semibold">OKX Wallet</div>
              <div className="text-[12px] font-normal">Connect to your OKX Wallet.</div>
            </div>
            <div
              className="mt-3 flex cursor-pointer flex-col items-center
                justify-center rounded-md border border-solid
                border-primaryBlue py-6 hover:bg-[#2574fb33]"
              onClick={() => connectWallet(false)}>
              <Image
                src="/images/components/layout/header/metamask-logo.png"
                alt=""
                className="logo"
                width={imageSize}
                height={imageSize}
              />
              <div className="mt-[6px] text-[16px] font-semibold">Metamask</div>
              <div className="text-[12px] font-normal">Connect to your Metamask Wallet.</div>
            </div>
            <div
              className="mt-3 flex cursor-pointer flex-col items-center
                justify-center rounded-md border border-solid
                border-primaryBlue py-6 hover:bg-[#2574fb33]"
              onClick={() => connectWallet(true)}>
              <Image
                src="/images/components/layout/header/walletconnect-logo.png"
                alt=""
                className="logo"
                width={imageSize}
                height={imageSize}
              />
              <div className="mt-[6px] text-[16px] font-semibold">WalletConnect</div>
              <div className="text-[12px] font-normal">Scan with WalletConnect to connect.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
