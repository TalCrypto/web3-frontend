/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import PrimaryButton from '@/components/common/PrimaryButton';
import { $tsIsShowPriceGapOverModal } from '@/stores/trading';

const ShowPriceGapOverModal = () => {
  const dismissModal = () => {
    $tsIsShowPriceGapOverModal.set(false);
  };

  return (
    <div
      className={`fixed inset-0 z-[12] flex h-screen items-center
        justify-center overflow-auto bg-black bg-opacity-40 px-6`}
      onClick={dismissModal}>
      <div
        className={`relative mx-auto w-full overflow-hidden
          rounded-[6px] bg-secondaryBlue p-6`}>
        <div className="mb-6 text-center leading-[20px]">
          <div className="my-3 text-[16px] font-semibold text-highEmphasis">vAMM - Oracle Price gap &gt; 10%,</div>

          <div className="text-[12px] text-highEmphasis">
            Liquidation now occurs at Oracle Price (note that P&L is still calculated based on vAMM price)
          </div>
        </div>

        <PrimaryButton className="py-2 text-[12px] font-semibold text-highEmphasis" onClick={dismissModal}>
          Got it !
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ShowPriceGapOverModal;
