import React from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';

import { wsIsShowTransferTokenModal } from '@/stores/WalletState';

interface ButtonContentProps {
  icon: string;
  url: string;
  name: string;
}

function ButtonContent({ icon, url, name }: ButtonContentProps) {
  const openUrl = () => {
    wsIsShowTransferTokenModal.set(false);
    window.open(url, '_blank');
  };

  return (
    <div
      className="mr-[24px] flex h-[40px] min-w-[120px] cursor-pointer
      items-center justify-between rounded-[8px] border border-solid
      border-blue-500 px-3 text-base font-medium"
      onClick={openUrl}>
      <Image src={icon} alt="" className="mr-1 h-6 w-6" width={24} height={24} />
      {name}
    </div>
  );
}

const TransferTokenModal = () => {
  const isShowTransferTokenModal = useNanostore(wsIsShowTransferTokenModal);

  if (!isShowTransferTokenModal) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-10 flex h-screen items-center
        justify-center overflow-auto bg-black bg-opacity-40"
      onClick={() => wsIsShowTransferTokenModal.set(false)}>
      <div
        className="w-[500px] rounded-xl bg-lightBlue p-[16px] pb-0 text-[14px]
          font-normal leading-normal"
        onClick={e => e.stopPropagation()}>
        <div className="items-initial flex content-center justify-end">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer"
            onClick={() => wsIsShowTransferTokenModal.set(false)}
          />
        </div>
        <div className="relative flex flex-col items-center justify-center">
          <div className="mb-9">
            <div className="text-color-87 text-[15px] font-semibold">Bridge ETH / WETH to Arbitrum👇</div>
            <div className="items-initial z-2 mt-4 flex content-center justify-start">
              <ButtonContent url="https://bridge.arbitrum.io/" name="Arbitrum" icon="/images/components/layout/header/arbitrum.png" />
            </div>
          </div>
          <div className="mb-[60px]">
            <div className="text-color-87 text-[15px] font-semibold">Wrap ETH on Arbitrum👇</div>
            <div className="items-initial z-2 mt-4 flex content-center justify-start">
              <ButtonContent url="https://app.uniswap.org/#/swap/" name="Uniswap" icon="/images/components/layout/header/uniswap.png" />
              <div className="w-[120px]" />
            </div>
          </div>
          <Image
            src="/images/components/common/modal/modal-logo.svg"
            width={170}
            height={165}
            alt=""
            className="absolute bottom-0 right-0 mr-3 flex items-end"
          />
        </div>
      </div>
    </div>
  );
};

export default TransferTokenModal;
