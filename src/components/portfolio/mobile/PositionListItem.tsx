/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { calculateNumber /* , formatterValue */ } from '@/utils/calculateNumbers';
import { useStore as useNanostore } from '@nanostores/react';
import Image from 'next/image';
import Tooltip from '@/components/common/Tooltip';
import { $psSelectedCollectionAmm, $psShowBalance, $psShowFundingPayment } from '@/stores/portfolio';
import { SingleRowPriceContent, SmallTypeIcon } from '@/components/portfolio/common/PriceLabelComponents';
import { $isShowMobileModal } from '@/stores/modal';

function PositionListItem(props: any) {
  const { userPosition } = props;
  const isShowBalance = useNanostore($psShowBalance);

  const size = calculateNumber(userPosition.size, 4);
  const sizeInEth = calculateNumber(userPosition.currentNotional, 4);
  const totalPnl = calculateNumber(userPosition.unrealizedPnl, 4);
  const className = `size-text ${isShowBalance ? (Number(size) > 0 ? 'up' : Number(size) === 0 ? '' : 'down') : ''}`;

  const isLeverageNegative = userPosition ? Number(calculateNumber(userPosition.remainMarginLeverage, 18)) <= 0 : false;
  const isLeverageOver = userPosition ? Number(calculateNumber(userPosition.remainMarginLeverage, 18)) > 100 : false;

  const clickItem = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    $psSelectedCollectionAmm.set(userPosition.amm);
    $psShowFundingPayment.set(true);
    $isShowMobileModal.set(true);
  };

  return (
    <div className="cursor-pointer border-b-[1px] border-b-secondaryBlue hover:bg-secondaryBlue">
      <div className="flex items-center py-3" onClick={clickItem}>
        <div className="w-[35%]">
          <SmallTypeIcon
            content={userPosition.pair}
            name={userPosition.pair}
            className={className}
            size={size}
            isShowBalance={isShowBalance}
          />
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
            <div className="">{`${
              userPosition === null
                ? '---'
                : isLeverageNegative
                ? 'N/A'
                : isLeverageOver
                ? '100.00 x +'
                : isShowBalance
                ? `${calculateNumber(userPosition.remainMarginLeverage, 2)}X`
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
                ? Number(totalPnl) > 0
                  ? `+${totalPnl}`
                  : Number(totalPnl) === 0
                  ? Math.abs(Number(totalPnl))?.toFixed(4)
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
                ? Number(totalPnl) > 0
                  ? `+${totalPnl}`
                  : Number(totalPnl) === 0
                  ? Math.abs(Number(totalPnl))?.toFixed(4)
                  : totalPnl
                : '****'
            }
          />
        </div>
      </div>
    </div>
  );
}

export default PositionListItem;
