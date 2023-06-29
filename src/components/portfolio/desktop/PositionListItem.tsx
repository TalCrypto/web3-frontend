/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { calculateNumber } from '@/utils/calculateNumbers';
import { useRouter } from 'next/router';
import { useStore as useNanostore } from '@nanostores/react';
import { utils } from 'ethers';
import Image from 'next/image';
import Tooltip from '@/components/common/Tooltip';
import { $psSelectedCollectionAmm, $psShowBalance, $psShowFundingPayment, $psShowShareIndicator } from '@/stores/portfolio';
import { DoubleRowPriceContent, LargeTypeIcon, SingleRowPriceContent } from '@/components/portfolio/common/PriceLabelComponents';
import { $priceChangePct } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';

function PositionListItem(props: any) {
  const router = useRouter();
  const { userPosition, itemIndex } = props;
  const isShowBalance = useNanostore($psShowBalance);

  const size = calculateNumber(userPosition.size, 4);
  const currentPrice = calculateNumber(userPosition.spotPrice, 2);
  const sizeInEth = calculateNumber(userPosition.currentNotional, 4);
  const totalPnl = calculateNumber(userPosition.unrealizedPnl, 4);
  const className = `size-text ${isShowBalance ? (Number(size) > 0 ? 'up' : Number(size) === 0 ? '' : 'down') : ''}`;
  const [tradingData]: any = useState({});

  const vAMMPrice = !tradingData.spotPrice ? 0 : Number(utils.formatEther(tradingData.spotPrice));
  const oraclePrice = !tradingData.twapPrice ? 0 : Number(utils.formatEther(tradingData.twapPrice));
  const priceGap = vAMMPrice && oraclePrice ? vAMMPrice / oraclePrice - 1 : 0;
  const priceGapLmt = useNanostore($priceChangePct);

  // price gap
  const isGapAboveLimit = priceGapLmt ? Math.abs(priceGap) >= priceGapLmt : false;

  // liquidation warning
  const positionType = userPosition ? (userPosition.size > 0 ? 'LONG' : 'SHORT') : null;
  const liquidationPrice = userPosition ? Number(utils.formatEther(userPosition.liquidationPrice)) : null;
  const liquidationChanceLimit = 0.05;

  const liquidationChanceWarning = () => {
    if (!userPosition || !tradingData.spotPrice || !tradingData.twapPrice || !priceGapLmt) return false;

    const selectedPriceForCalc = !isGapAboveLimit ? vAMMPrice : oraclePrice;

    if (
      positionType === 'LONG' &&
      Number(liquidationPrice) < selectedPriceForCalc &&
      selectedPriceForCalc < Number(liquidationPrice) * (1 + liquidationChanceLimit)
    )
      return true;
    if (
      positionType === 'SHORT' &&
      Number(liquidationPrice) > selectedPriceForCalc &&
      selectedPriceForCalc > Number(liquidationPrice) * (1 - liquidationChanceLimit)
    )
      return true;
    return false;
  };

  const liquidationRiskWarning = () => {
    if (!userPosition || !tradingData.spotPrice || !tradingData.twapPrice || !priceGapLmt) return false;

    const selectedPriceForCalc = !isGapAboveLimit ? vAMMPrice : oraclePrice;

    if (positionType === 'LONG' && selectedPriceForCalc <= Number(liquidationPrice)) return true;
    if (positionType === 'SHORT' && selectedPriceForCalc >= Number(liquidationPrice)) return true;
    return false;
  };

  // leverage handling
  const isLeverageNegative = userPosition ? Number(calculateNumber(userPosition.remainMarginLeverage, 18)) <= 0 : false;
  const isLeverageOver = userPosition ? Number(calculateNumber(userPosition.remainMarginLeverage, 18)) > 100 : false;

  const targetCollection = getCollectionInformation(userPosition.amm);
  const targetCollectionType = targetCollection ? targetCollection.collection : 'BAYC';

  const clickItem = (e: any) => {
    e.preventDefault();
    const url = `/trade/${encodeURIComponent(targetCollectionType)}`;

    // navigate to url
    router.push(url);
  };

  const showFundingPayment = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    $psSelectedCollectionAmm.set(userPosition.amm);
    $psShowFundingPayment.set(true);
  };

  const showSharePosition = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    $psSelectedCollectionAmm.set(userPosition.amm);
    $psShowShareIndicator.set(true);
  };

  return (
    <div
      className={`px-9 ${itemIndex % 2 === 0 ? 'bg-secondaryBlue/[.58]' : ''}
        cursor-pointer border-b-[1px] border-b-secondaryBlue hover:bg-secondaryBlue
    `}>
      <div className="flex py-3" onClick={clickItem}>
        <div className="relative w-[20%] pl-3">
          <div className="absolute left-[-8px] top-[-4px] mt-[3px] h-[50px] w-[3px] rounded-[30px] bg-primaryBlue" />
          <LargeTypeIcon
            content={userPosition.pair}
            name={userPosition.amm}
            className={className}
            size={size}
            isShowBalance={isShowBalance}
          />
        </div>
        <div className="w-[13%]">
          <DoubleRowPriceContent
            priceContent={isShowBalance ? currentPrice : '****'}
            normalContent={isShowBalance ? calculateNumber(userPosition.entryPrice, 2) : '****'}
          />
        </div>
        <div className="w-[13%]">
          <SingleRowPriceContent
            priceValue={
              <>
                {isShowBalance
                  ? Number(calculateNumber(userPosition.liquidationPrice, 2)) < 0
                    ? '0.00'
                    : calculateNumber(userPosition.liquidationPrice, 2)
                  : '****'}
                <div className="ml-[4px] flex space-x-[4px]">
                  {liquidationChanceWarning() && !liquidationRiskWarning() ? (
                    <Tooltip
                      direction="top"
                      content="Your position is in high chance to be liquidated, please adjust your collateral to secure your trade.">
                      <Image src="/images/common/alert/alert_yellow.svg" width={20} height={20} alt="" />
                    </Tooltip>
                  ) : null}
                  {liquidationRiskWarning() ? (
                    <Tooltip direction="top" content="Your position is at risk of being liquidated. Please manage your risk.">
                      <Image src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />
                    </Tooltip>
                  ) : null}
                </div>
              </>
            }
            isElement
            className={isGapAboveLimit ? 'text-warn' : ''}
          />
          <div className="ml-[26px] mt-2 flex text-[14px] font-medium">
            <div className="mr-1">{`${
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
        <div className="w-[14%]">
          <DoubleRowPriceContent
            priceContent={isShowBalance ? Math.abs(Number(calculateNumber(userPosition.size, 4)))?.toFixed(4) : '****'}
            iconType={userPosition.pair}
            normalContent={isShowBalance ? Math.abs(Number(sizeInEth))?.toFixed(4) : '****'}
          />
        </div>
        <div className="w-[15%]">
          <SingleRowPriceContent priceValue={isShowBalance ? calculateNumber(userPosition.realMargin, 4) : '****'} />
        </div>
        <div className="w-[13%]">
          <SingleRowPriceContent
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
        {/* <div className="w-[17%]">
          <SingleRowPriceContent
            priceValue={
              isShowBalance
                ? Number(fundingPaymentCount) > 0
                  ? `+${fundingPaymentCount}`
                  : Number(fundingPaymentCount) === 0
                  ? Math.abs(Number(fundingPaymentCount))?.toFixed(4)
                  : fundingPaymentCount
                : '****'
            }
          />
        </div> */}
        <div className="w-[12%]">
          <div className="flex h-full items-center">
            <Tooltip direction="top" content="Funding Payment" className="ml-4">
              <Image
                alt=""
                onClick={showFundingPayment}
                src="/images/components/trade/position/funding_payment.svg"
                width={16}
                height={16}
              />
            </Tooltip>

            <Tooltip direction="top" content="Share Position" className="ml-9">
              <Image alt="" onClick={showSharePosition} src="/images/mobile/pages/trade/share_icon.svg" width={20} height={20} />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PositionListItem;
