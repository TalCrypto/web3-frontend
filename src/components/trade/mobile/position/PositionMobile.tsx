/* eslint-disable @next/next/no-img-element */
/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';

import HistoryModal from '@/components/trade/mobile/position/HistoryModal';
import FundingPaymentModal from '@/components/trade/mobile/position/FundingPaymentModal';

import { useIsOverPriceGap, usePositionInfo, useTransactionIsPending, useFundingPaymentHistory } from '@/hooks/collection';
import { AMM, getCollectionInformation } from '@/const/collectionList';
import { $currentAmm, $oraclePrice, $vammPrice } from '@/stores/trading';
import { $isShowMobileModal } from '@/stores/modal';
import MobileTooltip from '@/components/common/mobile/Tooltip';

function MedPriceIcon(props: any) {
  const { priceValue = 0, className = '', isLoading = false, image = '' } = props;
  return (
    <div className={`flex text-[14px] font-normal text-highEmphasis ${className}`}>
      <Image src={image || '/images/components/layout/header/eth-tribe3.svg'} className="mr-1" alt="" width={16} height={16} />
      <span className={`${isLoading ? 'flash' : ''}`}>{priceValue}</span>
    </div>
  );
}

const liquidationChanceLimit = 0.05;

export default function PositionMobile() {
  const currentAmm = useNanostore($currentAmm);
  const positionInfo = usePositionInfo(currentAmm);
  const vammPrice = useNanostore($vammPrice);
  const oraclePrice = useNanostore($oraclePrice);
  const isOverPriceGap = useIsOverPriceGap();
  const isPending = useTransactionIsPending(currentAmm);
  const collectionInfo = currentAmm ? getCollectionInformation(currentAmm) : null;

  const [isLoading, setIsLoading] = useState(false);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFundingPaymentModal, setShowFundingPaymentModal] = useState(false);

  const selectedAmm = currentAmm ?? AMM.DEGODS;
  const { total: fpTotal } = useFundingPaymentHistory(selectedAmm);

  const liquidationChanceWarning = () => {
    if (!positionInfo || !vammPrice || !oraclePrice) return false;

    const selectedPriceForCalc = !isOverPriceGap ? vammPrice : oraclePrice;

    if (
      positionInfo.size > 0 && // long
      positionInfo.liquidationPrice < selectedPriceForCalc &&
      selectedPriceForCalc < positionInfo.liquidationPrice * (1 + liquidationChanceLimit)
    )
      return true;
    if (
      positionInfo.size < 0 && // short
      positionInfo.liquidationPrice > selectedPriceForCalc &&
      selectedPriceForCalc > positionInfo.liquidationPrice * (1 - liquidationChanceLimit)
    )
      return true;
    return false;
  };

  const liquidationRiskWarning = () => {
    if (!positionInfo || !vammPrice || !oraclePrice) return false;

    const selectedPriceForCalc = !isOverPriceGap ? vammPrice : oraclePrice;

    if (positionInfo.size > 0 && selectedPriceForCalc <= positionInfo.liquidationPrice) return true; // long
    if (positionInfo.size < 0 && selectedPriceForCalc >= positionInfo.liquidationPrice) return true; // short
    return false;
  };

  if (!positionInfo || positionInfo.size === 0 || !collectionInfo) {
    return null;
  }

  return (
    <div className="bg-lightBlue pb-3 pt-6">
      <div className="flex justify-between px-5">
        <div className="flex space-x-[6px]">
          <Image src="/images/mobile/pages/trade/shopping-bag-green.svg" width={20} height={20} alt="" />
          <div className="text-16 font-600 text-highEmphasis">My {/* currentCollectionName */} Position</div>
        </div>
        <div className="flex space-x-[24px]">
          <div
            onClick={() => {
              setShowHistoryModal(true);
              $isShowMobileModal.set(true);
            }}>
            <Image alt="" src="/images/components/trade/position/trade_history.svg" width={16} height={16} />
          </div>
          <div
            onClick={() => {
              setShowFundingPaymentModal(true);
              $isShowMobileModal.set(true);
            }}>
            <Image alt="" src="/images/components/trade/position/funding_payment.svg" width={16} height={16} />
          </div>
        </div>
      </div>

      <div>
        <div className="px-5 pb-2 pt-6">
          <div className="mb-3 flex">
            <div className="flex w-[180px] items-center text-[14px] text-mediumEmphasis">
              Unrealized P/L
              <MobileTooltip
                content={
                  <>
                    <div className="mb-3 text-[15px] font-semibold">Accumulated Realized P/L</div>
                    <div className="text-[12px] font-normal">
                      Realized P/L is the sum of funding payment and P/L from price change. P/L from price change is included in realized
                      P/L when a position is partially/fully closed/liquidated
                    </div>
                  </>
                }>
                <Image
                  src="/images/components/trade/history/more_info.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="ml-[6px] cursor-pointer"
                />
              </MobileTooltip>
            </div>
            <div className="text-[14px] font-normal">
              <MedPriceIcon
                priceValue={Number(positionInfo.unrealizedPnl.toFixed(4)) === 0 ? '0.0000' : positionInfo.unrealizedPnl.toFixed(4)}
                className={
                  Number(positionInfo.unrealizedPnl.toFixed(4)) > 0
                    ? 'text-marketGreen'
                    : Number(positionInfo.unrealizedPnl.toFixed(4)) === 0
                    ? ''
                    : 'text-marketRed'
                }
                isLoading={isLoading || isPending}
              />
            </div>
          </div>

          <div className="mb-3 flex">
            <div className="w-[180px] text-[14px] text-mediumEmphasis">Accu. Fund. Payment</div>
            <div className="text-[14px] font-normal">
              <MedPriceIcon
                priceValue={!fpTotal ? '0.0000' : fpTotal.toFixed(4)}
                className={fpTotal > 0 ? 'text-marketGreen' : !fpTotal ? '' : 'text-marketRed'}
                isLoading={isLoading || isPending}
              />
            </div>
          </div>

          <div className="mb-3 flex">
            <div className="w-[180px] text-[14px] text-mediumEmphasis">Type</div>
            <div className="text-[14px] font-normal">
              <span className={!positionInfo ? '' : positionInfo.size > 0 ? 'text-marketGreen' : 'text-marketRed'}>
                {!positionInfo ? '---' : positionInfo.size > 0 ? 'LONG' : 'SHORT'}
              </span>
            </div>
          </div>

          <div className="mb-3 flex">
            <div className="w-[180px] text-[14px] text-mediumEmphasis">Avg. Entry Price</div>
            <div className="text-[14px] font-normal">
              <MedPriceIcon
                priceValue={!positionInfo ? '---' : positionInfo.entryPrice < 0 ? '0.00' : positionInfo.entryPrice.toFixed(4)}
                className="font-normal"
                isLoading={isLoading || isPending}
              />
            </div>
          </div>

          <div className="mb-3 flex">
            <div className="w-[180px] text-[14px] text-mediumEmphasis">Notional</div>
            <div className="text-[14px] font-normal">
              <MedPriceIcon priceValue={positionInfo.currentNotional.toFixed(4)} isLoading={isLoading || isPending} />
            </div>
          </div>

          <div className="mb-3 flex">
            <div className="w-[180px] text-[14px] text-mediumEmphasis">Leverage</div>

            <div className="text-[14px] font-normal">
              <span className={`font-normal ${isLoading || isPending ? 'flash' : ''}`}>
                {!positionInfo
                  ? '---'
                  : positionInfo.leverage <= 0
                  ? 'N/A'
                  : positionInfo.leverage > 100
                  ? '100.00 x +'
                  : `${positionInfo.leverage.toFixed(2)} x`}
              </span>
            </div>
          </div>

          <div className="mb-3 flex">
            <div className="w-[180px] text-[14px] text-mediumEmphasis">Liqui. Price</div>
            <div className="text-[14px] font-normal">
              <MedPriceIcon
                priceValue={!positionInfo ? '---' : positionInfo.liquidationPrice < 0 ? '0.00' : positionInfo.liquidationPrice.toFixed(2)}
                className={`${isOverPriceGap ? 'text-warn' : ''} `}
                isLoading={isLoading || isPending}
              />
              {isOverPriceGap ? (
                <div className="absolute bottom-[-5px] left-[50px] border-[7px] border-b-0 border-x-transparent border-t-warn" />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <HistoryModal showHistoryModal={showHistoryModal} setShowHistoryModal={setShowHistoryModal} />
      <FundingPaymentModal showFundingPaymentModal={showFundingPaymentModal} setShowFundingPaymentModal={setShowFundingPaymentModal} />
    </div>
  );
}
