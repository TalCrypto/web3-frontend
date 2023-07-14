/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { $tsIsShowPriceGapOverModal } from '@/stores/trading';
import OutlineButton from '@/components/common/OutlineButton';

const ShowPriceGapOverModal = () => {
  const dismissModal = () => {
    $tsIsShowPriceGapOverModal.set(false);
  };

  return (
    <>
      <div
        className="tooltip-content absolute bottom-[34px] left-[-113px] z-20 w-[230px]
        rounded-[4px] bg-white px-3 py-2 text-highEmphasis">
        <div className="text-[12px] leading-[16px] text-highEmphasis">
          vAMM - Oracle Price gap &gt; 10%, <br />
          Liquidation now occurs at Oracle <br />
          Price (note that P&L is still <br />
          calculated based on vAMM <br />
          price)
        </div>

        <div className="flex">
          <div className="flex-1" />
          <OutlineButton
            className="rounded-[4px] border-[1px]
            border-highEmphasis !px-3 !py-1 !text-[12px]
            !font-normal text-highEmphasis"
            onClick={dismissModal}>
            Got it !
          </OutlineButton>
        </div>
      </div>

      <div
        className="absolute bottom-[26px] left-[2px] h-0 w-0
          border-l-[8px] border-r-[8px] border-t-[8px]
          border-l-transparent border-r-transparent border-t-[#213676]"
      />
    </>
  );
};

export default ShowPriceGapOverModal;
