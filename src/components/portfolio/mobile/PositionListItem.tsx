/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import Image from 'next/image';
import Tooltip from '@/components/common/Tooltip';
import { $psSelectedCollectionAmm, $psShowBalance, $psShowFundingPayment } from '@/stores/portfolio';
import { SingleRowPriceContent, SmallTypeIcon } from '@/components/portfolio/common/PriceLabelComponents';
import { $isShowMobileModal } from '@/stores/modal';
import { getAMMByAddress } from '@/const/addresses';

function PositionListItem(props: any) {
  const { userPosition } = props;
  const isShowBalance = useNanostore($psShowBalance);

  const { size } = userPosition;
  const sizeInEth = userPosition.currentNotional;
  const totalPnl = userPosition.unrealizedPnl;
  const className = `${isShowBalance ? (size > 0 ? 'up' : size === 0 ? '' : 'down') : ''}`;

  const isLeverageNegative = userPosition ? userPosition.leverage <= 0 : false;
  const isLeverageOver = userPosition ? userPosition.leverage > 100 : false;

  const userPositionAmm = getAMMByAddress(userPosition.amm);

  const clickItem = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    $psSelectedCollectionAmm.set(userPositionAmm);
    $psShowFundingPayment.set(true);
    $isShowMobileModal.set(true);
  };

  return (
    <div className="cursor-pointer border-b-[1px] border-b-secondaryBlue hover:bg-secondaryBlue">
      <div className="flex items-center py-3" onClick={clickItem}>
        <div className="w-[35%]">
          <SmallTypeIcon amm={userPositionAmm} className={className} size={size} isShowBalance={isShowBalance} />
        </div>
        <div className="w-[33%] text-right">
          <div className="text-[14px]">
            <SingleRowPriceContent
              width={16}
              height={16}
              className="justify-end text-[14px]"
              priceValue={isShowBalance ? Math.abs(Number(sizeInEth))?.toFixed(4) : '****'}
            />
          </div>
          <div className="mt-1 flex justify-end text-right text-[12px] font-medium">
            <div>{`${
              userPosition === null
                ? '---'
                : isLeverageNegative
                ? 'N/A'
                : isLeverageOver
                ? '100.00 x +'
                : isShowBalance
                ? `${userPosition.leverage.toFixed(2)}X`
                : '****'
            }`}</div>
            {isLeverageNegative ? (
              <Tooltip direction="top" content="Leverage ratio not meaningful when collateral is ≤ 0">
                <Image src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />
              </Tooltip>
            ) : null}
          </div>
        </div>
        <div className="w-[32%] ">
          <SingleRowPriceContent
            width={16}
            height={16}
            className="justify-end text-[14px]"
            priceValue={
              isShowBalance
                ? totalPnl > 0
                  ? `${totalPnl.toFixed(4)}`
                  : totalPnl === 0
                  ? Math.abs(totalPnl)?.toFixed(4)
                  : totalPnl
                : '****'
            }
          />
          <SingleRowPriceContent
            width={16}
            height={16}
            className="mt-[3px] justify-end !text-[12px]"
            priceValue={
              isShowBalance
                ? userPosition.fundingPayment > 0
                  ? `${userPosition.fundingPayment.toFixed(4)}`
                  : userPosition.fundingPayment === 0
                  ? Math.abs(userPosition.fundingPayment)?.toFixed(4)
                  : userPosition.fundingPayment
                : '****'
            }
          />
        </div>
      </div>
    </div>
  );
}

export default PositionListItem;
