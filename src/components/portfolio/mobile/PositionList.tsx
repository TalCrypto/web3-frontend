/* eslint-disable no-unused-vars */
import PrimaryButton from '@/components/common/PrimaryButton';
import PositionListItem from '@/components/portfolio/mobile/PositionListItem';
import { $psUserPosition } from '@/stores/portfolio';
import { useRouter } from 'next/router';
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';

function PositionList() {
  const router = useRouter();
  const psUserPosition = useNanostore($psUserPosition);

  let itemIndex = 0;

  return (
    <div>
      {psUserPosition.length === 0 ? (
        <div className="mt-[100px]">
          <div className="mb-6 text-center text-[16px] text-mediumEmphasis">You have no open position.</div>
          <div className="flex justify-center">
            <PrimaryButton
              className="px-[14px] py-[7px] !text-[14px] font-semibold"
              onClick={() => {
                router.push('/trade');
              }}>
              Go to Trade
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div className="scrollable">
          <div className="px-5">
            {psUserPosition.map((item: any, index: any) => {
              if (!item) {
                return null;
              }
              itemIndex += 1;
              return <PositionListItem key={`position_item_mobile_${itemIndex}`} userPosition={item} index={index} itemIndex={itemIndex} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default PositionList;
