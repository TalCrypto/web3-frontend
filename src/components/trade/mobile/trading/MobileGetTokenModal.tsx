import React, { useState } from 'react';
import { $isShowMobileModal, $isShowMobileTokenModal } from '@/stores/modal';
import { useStore as useNanostore } from '@nanostores/react';
import Image from 'next/image';

export default function MobileGetTokenModal() {
  const isShowMobileTokenModal = useNanostore($isShowMobileTokenModal);

  const handleCloseModal = () => {
    $isShowMobileTokenModal.set(false);
    $isShowMobileModal.set(false);
  };

  const redirectExternal = (url: string) => {
    $isShowMobileTokenModal.set(false);
    window.open(url, '_blank');
  };

  return (
    <div
      className={`t-0 fixed bottom-0 left-0 right-0 z-[12] w-full
        ${isShowMobileTokenModal ? 'h-full' : 'h-0'}
       bg-black/[.3] backdrop-blur-[4px]`}
      onClick={handleCloseModal}>
      <div
        className={`transition-bottom absolute bottom-0 w-full
        ${isShowMobileTokenModal ? 'bottom-0' : 'bottom-[-250px]'}
        bg-secondaryBlue duration-500
      `}>
        <div className="h-[250px] px-[20px] py-[24px] ">
          <div className="font-[600] text-[#fff] ">Bridge ETH / WETH to Arbitrum👇</div>
          <div className="mt-[16px]  flex flex-row">
            <div
              className="flex w-auto flex-row 
                items-center justify-center rounded-[4px] border-[1px] border-[#2574FB] 
                px-[12px] py-[6px] align-middle text-[14px] text-[#fff] "
              onClick={() => redirectExternal('https://bridge.arbitrum.io/')}>
              <Image className="mr-[6px]" src="/icons/providers/arbitrum.png" alt="" width={24} height={24} />
              Arbitrum
            </div>
            <div />
          </div>
          <div className="mt-[24px]  ">
            <div className="font-[600] text-[#fff] ">Wrap ETH on Arbitrum👇</div>
          </div>
          <div className="mt-[16px] flex flex-row">
            <div
              className="flex w-auto flex-row 
                items-center justify-center rounded-[4px] border-[1px] border-[#2574FB] 
                px-[12px] py-[6px] align-middle text-[14px] text-[#fff] "
              onClick={() => redirectExternal('https://app.uniswap.org/#/swap/')}>
              <Image className="mr-[6px]" src="/icons/providers/uniswap.png" alt="" width={24} height={24} />
              Uniswap
            </div>
            <div />
          </div>
          <div className="flex items-end justify-end">
            <Image src="/images/mobile/common/close.svg" alt="" width={40} height={40} onClick={handleCloseModal} />
          </div>
        </div>
      </div>
    </div>
  );
}
