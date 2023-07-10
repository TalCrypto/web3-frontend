/* eslint-disable operator-linebreak */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore as useNanostore } from '@nanostores/react';
import Image from 'next/image';
import Tooltip from '@/components/common/Tooltip';
import { $psSelectedCollectionAmm, $psShowBalance, $psShowFundingPayment, $psShowShareIndicator } from '@/stores/portfolio';
import { DoubleRowPriceContent, LargeTypeIcon, SingleRowPriceContent } from '@/components/portfolio/common/PriceLabelComponents';
import { UserPositionInfo } from '@/stores/user';
import { useIsOverPriceGap } from '@/hooks/collection';
import { usePublicClient } from 'wagmi';
import { ammAbi } from '@/const/abi';

function PositionListItem(props: { userPosition: UserPositionInfo; itemIndex: number }) {
  const router = useRouter();
  const { userPosition, itemIndex } = props;
  const isShowBalance = useNanostore($psShowBalance);
  const isOverPriceGap = useIsOverPriceGap();
  const isBadDebt = userPosition ? userPosition.leverage === 0 : false;

  const publicClient = usePublicClient();

  const [isLiquidationWarn, setIsLiquidationWarn] = useState(false);
  const [isLiquidationRisk, setIsLiquidationRisk] = useState(false);

  const { size } = userPosition;
  const sizeInEth = userPosition.currentNotional;
  const totalPnl = userPosition.unrealizedPnl;
  const className = `${isShowBalance ? (size > 0 ? 'up' : size === 0 ? '' : 'down') : ''}`;

  const liquidationChanceLimit = 0.05;

  useEffect(() => {
    async function checkLiquidation() {
      const oraclePrice = await publicClient.readContract({
        address: userPosition.ammAddress,
        abi: ammAbi,
        functionName: 'getUnderlyingPrice'
      });
      const selectedPriceForCalc = !isOverPriceGap ? userPosition.vammPrice : oraclePrice;
      setIsLiquidationWarn(
        (userPosition.size > 0 && // long
          userPosition.liquidationPrice < selectedPriceForCalc &&
          selectedPriceForCalc < userPosition.liquidationPrice * (1 + liquidationChanceLimit)) ||
          (userPosition.size < 0 && // short
            userPosition.liquidationPrice > selectedPriceForCalc &&
            selectedPriceForCalc > userPosition.liquidationPrice * (1 - liquidationChanceLimit))
      );
      setIsLiquidationRisk(
        (userPosition.size > 0 && selectedPriceForCalc <= userPosition.liquidationPrice) ||
          (userPosition.size < 0 && selectedPriceForCalc >= userPosition.liquidationPrice)
      );
    }
    checkLiquidation();
  }, [isOverPriceGap, publicClient, userPosition]);

  // leverage handling
  const isLeverageNegative = userPosition ? userPosition.leverage <= 0 : false;
  const isLeverageOver = userPosition ? userPosition.leverage > 100 : false;

  const userPositionAmm = userPosition.amm;

  const clickItem = (e: any) => {
    e.preventDefault();
    const url = `/trade/${userPositionAmm}`;

    // navigate to url
    router.push(url);
  };

  const showFundingPayment = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    $psSelectedCollectionAmm.set(userPositionAmm);
    $psShowFundingPayment.set(true);
  };

  const showSharePosition = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    $psSelectedCollectionAmm.set(userPositionAmm);
    $psShowShareIndicator.set(true);
  };

  return (
    <div
      className={`px-9 ${itemIndex % 2 === 0 ? 'bg-secondaryBlue/[.58]' : ''}  cursor-pointer
        border-b-[1px] border-b-secondaryBlue py-3 hover:bg-secondaryBlue
      `}>
      <div className="flex" onClick={clickItem}>
        <div className="relative w-[20%] pl-3">
          <div
            className={`absolute left-[-8px] top-[-4px] mt-[3px]  w-[3px] rounded-[30px]
            ${isOverPriceGap ? 'h-[70px] bg-warn' : 'h-[50px] bg-primaryBlue'}`}
          />
          <LargeTypeIcon amm={userPositionAmm} className={className} size={size} isShowBalance={isShowBalance} />
        </div>
        <div className="w-[13%]">
          <DoubleRowPriceContent
            priceContent={isShowBalance ? userPosition.vammPrice?.toFixed(2) : '****'}
            normalContent={isShowBalance ? userPosition.entryPrice?.toFixed(2) : '****'}
          />
        </div>
        <div className="w-[13%]">
          <SingleRowPriceContent
            priceValue={
              <>
                {isShowBalance ? (userPosition.liquidationPrice < 0 ? '0.00' : userPosition.liquidationPrice?.toFixed(2)) : '****'}
                <div className="ml-[4px] flex space-x-[4px]">
                  {isLiquidationWarn && !isLiquidationRisk ? (
                    <Tooltip
                      direction="top"
                      content="Your position is in high chance to be liquidated, please adjust your collateral to secure your trade.">
                      <Image src="/images/common/alert/alert_yellow.svg" width={20} height={20} alt="" />
                    </Tooltip>
                  ) : null}
                  {isLiquidationRisk ? (
                    <Tooltip direction="top" content="Your position is at risk of being liquidated. Please manage your risk.">
                      <Image src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />
                    </Tooltip>
                  ) : null}
                </div>
              </>
            }
            isElement
            className={isOverPriceGap ? 'text-warn' : ''}
          />
          <div className="ml-[26px] mt-2 flex text-[14px] font-medium text-mediumEmphasis">
            <div className="mr-1">{`${
              userPosition === null
                ? '---'
                : isLeverageNegative
                ? 'N/A'
                : isLeverageOver
                ? '100.00 x +'
                : isShowBalance
                ? `${userPosition.leverage?.toFixed(2)}X`
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
            priceContent={isShowBalance ? Math.abs(userPosition.size)?.toFixed(4) : '****'}
            normalContent={isShowBalance ? Math.abs(sizeInEth)?.toFixed(4) : '****'}
            amm={userPositionAmm}
          />
        </div>
        <div className="w-[15%]">
          <SingleRowPriceContent priceValue={isShowBalance ? userPosition.margin?.toFixed(4) : '****'} isElement />
        </div>
        <div className="w-[13%]">
          <SingleRowPriceContent priceValue={isShowBalance ? totalPnl.toFixed(4) : '****'} isElement={!isShowBalance} />
        </div>
        <div className="w-[17%]">
          <SingleRowPriceContent
            priceValue={
              isShowBalance
                ? userPosition.fundingPayment > 0
                  ? `+${userPosition.fundingPayment.toFixed(4)}`
                  : userPosition.fundingPayment === 0
                  ? Math.abs(userPosition.fundingPayment)?.toFixed(4)
                  : userPosition.fundingPayment.toFixed(4)
                : '****'
            }
          />
        </div>
        <div className="w-[12%]">
          <div className="flex h-full items-center">
            <Tooltip direction="top" content="Funding Payment" className="ml-4">
              <Image
                alt=""
                onClick={showFundingPayment}
                src="/images/components/trade/position/funding_payment.svg"
                width={20}
                height={20}
              />
            </Tooltip>

            <Tooltip direction="top" content="Share Position" className="ml-9">
              <Image alt="" onClick={showSharePosition} src="/images/mobile/pages/trade/share_icon.svg" width={20} height={20} />
            </Tooltip>
          </div>
        </div>
      </div>

      {/* wip price gap */}
      {isOverPriceGap ? (
        <div className="mb-3 ml-2 mt-1">
          <div className="flex items-start space-x-[6px]">
            <Image src="/images/common/alert/alert_yellow.svg" width={15} height={15} alt="" />
            <p className="text-b3 text-warn">
              Warning: vAMM - Oracle Price gap &gt; 10%, liquidation now occurs at <b>Oracle Price</b> (note that P&L is still calculated
              based on vAMM price). {isBadDebt ? 'Positions with negative collateral value cannot be closed.' : ''}{' '}
              <a
                target="_blank"
                href="https://tribe3.gitbook.io/tribe3/getting-started/liquidation-mechanism"
                className="underline hover:text-warn/50"
                rel="noreferrer">
                Learn More
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PositionListItem;
