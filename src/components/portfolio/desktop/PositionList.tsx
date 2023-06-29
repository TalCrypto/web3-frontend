/* eslint-disable no-unused-vars */
import PrimaryButton from '@/components/common/PrimaryButton';
import { $psShowBalance, $psUserPosition } from '@/stores/portfolio';
import { useRouter } from 'next/router';
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { SingleRowPriceContent } from '@/components/portfolio/common/PriceLabelComponents';
import PositionListItem from '@/components/portfolio/desktop/PositionListItem';

function PositionList() {
  const router = useRouter();
  const psUserPosition = useNanostore($psUserPosition);
  const isShowBalance = useNanostore($psShowBalance);

  const totalCollateral = psUserPosition.reduce((pre: any, item: any) => (!item ? pre : pre + item.margin), 0);

  const totalUnrealized = psUserPosition.reduce((pre: any, item: any) => (!item ? pre : pre + item.unrealizedPnl), 0);

  // const totalFundingPaymentAccount = psUserPosition.reduce((pre: any, item: any) => (!item ? pre : pre + item.fundingPaymentCount), 0);

  let itemIndex = 0;

  return (
    <div>
      {psUserPosition.filter((item: any) => item !== null).length === 0 ? (
        <div className="mt-[100px]">
          <div className="mb-6 text-center text-[16px] text-mediumEmphasis">You have no open position.</div>
          <div className="flex justify-center">
            <PrimaryButton
              className="px-[14px] py-[7px] !text-[14px] font-semibold"
              onClick={() => {
                router.push('/trades');
              }}>
              Go to Trade
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div className="scrollable">
          <div>
            {psUserPosition.map((item: any, index: any) => {
              if (!item) {
                return null;
              }
              itemIndex += 1;
              return <PositionListItem key={`position_item_${itemIndex}`} userPosition={item} index={index} itemIndex={itemIndex} />;
            })}
          </div>
          <div className="flex px-9 pt-4 text-[16px] font-medium">
            <div className="w-[60%] pr-6 text-right text-mediumEmphasis">Total</div>
            <div className="w-[15%]">
              <SingleRowPriceContent priceValue={isShowBalance ? totalCollateral.toFixed(4) : '****'} />
            </div>
            <div className="w-[13%]">
              <SingleRowPriceContent priceValue={isShowBalance ? `${totalUnrealized.toFixed(4)}` : '****'} />
            </div>
            {/* <div className="w-[17%]">
              <SingleRowPriceContent
                priceValue={isShowBalance ? `${totalFundingPaymentAccount > 0 ? '+' : ''}${totalFundingPaymentAccount.toFixed(4)}` : '****'}
              />
            </div> */}
            <div className="w-[12%]" />
          </div>
        </div>
      )}
    </div>
  );
}

export default PositionList;
