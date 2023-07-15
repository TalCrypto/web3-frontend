import React from 'react';
import Image from 'next/image';
import { $tsIsContinueClose, $tsIsFirstPartialClose, $tsIsShowPartialCloseModal } from '@/stores/trading';
import { useStore as useNanostore } from '@nanostores/react';

export default function PartialCloseModal() {
  const isShowPartialCloseModal = useNanostore($tsIsShowPartialCloseModal);
  if (!isShowPartialCloseModal) {
    return null;
  }

  const dismissModal = () => {
    $tsIsShowPartialCloseModal.set(false);
  };

  return (
    <div
      className={`fixed inset-0 z-10 flex h-screen items-center
        justify-center overflow-auto bg-black bg-opacity-40 px-6`}
      onClick={dismissModal}>
      <div
        className={`relative mx-auto overflow-hidden
          rounded-[12px] bg-secondaryBlue`}>
        <div className="mr-4 pb-1 pt-[10px] text-end">
          <div className="items-initial flex content-center justify-end">
            <Image
              src="/images/components/common/modal/close.svg"
              alt=""
              className="cursor-pointer"
              width={16}
              height={16}
              onClick={e => {
                e.stopPropagation();
                dismissModal();
              }}
            />
          </div>
        </div>
        <div className="relative p-6 text-center leading-[20px]">
          <div className="text-[12px] text-highEmphasis">
            Partially closing a position would <br />
            NOT release any collateral. <br />
            Please do so by adjusting collateral, <br />
            which doesn’t cost any transaction fee.
          </div>
          <div className="mt-7">
            <button
              className="mb-3 w-full cursor-pointer rounded-[4px] bg-primaryBlue px-[10px]
                py-[6px] text-[15px] font-semibold text-highEmphasis"
              onClick={e => {
                e.stopPropagation();
                $tsIsFirstPartialClose.set(false);
                $tsIsShowPartialCloseModal.set(false);
                $tsIsContinueClose.set(true);
              }}>
              Continue Close
            </button>

            <button
              className="w-full cursor-pointer rounded-[4px] bg-primaryBlue px-[10px]
                py-[6px] text-[15px] font-semibold text-highEmphasis"
              onClick={e => {
                e.preventDefault();
                dismissModal();
              }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
