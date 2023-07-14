/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $psLiqSwitchRatio, $psSelectedCollectionAmm, $psShowBalance, $psShowFundingPayment } from '@/stores/portfolio';
import { SingleRowPriceContent, SmallTypeIcon } from '@/components/portfolio/common/PriceLabelComponents';
import { $isShowMobileModal } from '@/stores/modal';
import { useFundingPaymentHistory } from '@/hooks/collection';
import { UserPositionInfo } from '@/stores/user';
import { usePublicClient } from 'wagmi';
import { ammAbi } from '@/const/abi';
import { formatBigInt } from '@/utils/bigInt';

function PositionListItem(props: { userPosition: UserPositionInfo }) {
  const { userPosition } = props;
  const isShowBalance = useNanostore($psShowBalance);
  const liqSwitchRatio = useNanostore($psLiqSwitchRatio);
  const publicClient = usePublicClient();

  const { size } = userPosition;
  const sizeInEth = userPosition.currentNotional;
  const totalPnl = userPosition.unrealizedPnl;
  const className = `${isShowBalance ? (size > 0 ? 'up' : size === 0 ? '' : 'down') : ''}`;

  const isLeverageNegative = userPosition ? userPosition.leverage <= 0 : false;
  const isLeverageOver = userPosition ? userPosition.leverage > 100 : false;

  const userPositionAmm = userPosition.amm;
  const { total: accFp } = useFundingPaymentHistory(userPositionAmm);

  const [isOverPriceGap, setIsOverPriceGap] = useState(false);

  useEffect(() => {
    async function checkLiquidation() {
      if (!liqSwitchRatio || !userPosition.ammAddress) return;
      const oraclePriceBn = await publicClient.readContract({
        address: userPosition.ammAddress,
        abi: ammAbi,
        functionName: 'getUnderlyingPrice'
      });
      const oraclePrice = formatBigInt(oraclePriceBn);
      const isOver =
        oraclePrice && userPosition.vammPrice ? Math.abs((userPosition.vammPrice - oraclePrice) / oraclePrice) >= liqSwitchRatio : false;
      setIsOverPriceGap(isOver);
    }
    checkLiquidation();
  }, [liqSwitchRatio, publicClient, userPosition]);

  const clickItem = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    $psSelectedCollectionAmm.set(userPositionAmm);
    $psShowFundingPayment.set(true);
    $isShowMobileModal.set(true);
  };

  return (
    <div className="cursor-pointer border-b-[1px] border-b-secondaryBlue px-5 py-3" onClick={clickItem}>
      <div className="flex items-center ">
        <div className="w-[35%]">
          <SmallTypeIcon amm={userPositionAmm} className={className} size={size} isShowBalance={isShowBalance} />
        </div>
        <div className="w-[32%] text-right">
          <div className="text-[14px]">
            <SingleRowPriceContent
              width={16}
              height={16}
              className="justify-end text-[14px]"
              priceValue={isShowBalance ? sizeInEth.toFixed(4) : '****'}
              isElement
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
            {/* {isLeverageNegative ? (
              <Tooltip direction="top" content="Leverage ratio not meaningful when collateral is ≤ 0">
                <Image src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />
              </Tooltip>
            ) : null} */}
          </div>
        </div>
        <div className="w-[35%] ">
          <SingleRowPriceContent
            width={16}
            height={16}
            className="justify-end text-[14px]"
            priceValue={isShowBalance ? totalPnl.toFixed(4) : '****'}
            isElement={!isShowBalance}
          />
          <SingleRowPriceContent
            width={16}
            height={16}
            className="mt-[3px] justify-end !text-[12px]"
            priceValue={isShowBalance ? (accFp ? accFp.toFixed(4) : '0.0000') : '****'}
            isElement={!isShowBalance}
          />
        </div>
      </div>

      {/* wip price gap */}
      {isOverPriceGap && liqSwitchRatio ? (
        <div className="mb-3 ml-2 mt-2">
          <div className="flex items-start space-x-[6px]">
            <p className="text-b3 text-warn">
              Warning: vAMM - Oracle Price gap &gt; {liqSwitchRatio * 100}%, liquidation now occurs at <b>Oracle Price</b>
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PositionListItem;
