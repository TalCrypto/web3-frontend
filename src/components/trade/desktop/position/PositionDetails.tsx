/* eslint-disable @next/next/no-img-element */
/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';

import TitleTips from '@/components/common/TitleTips';

import SharePosition from '@/components/trade/desktop/position/SharePosition';

import Dropdown from '@/components/trade/desktop/position/Dropdown';
import HistoryModal from '@/components/trade/desktop/position/HistoryModal';
import FundingPaymentModal from '@/components/trade/desktop/position/FundingPaymentModal';
import { $currentAmm, $oraclePrice, $vammPrice } from '@/stores/trading';
import { useIsOverPriceGap, usePositionInfo, useTransactionIsPending, useFundingPaymentHistory } from '@/hooks/collection';
import { AMM, getCollectionInformation } from '@/const/collectionList';
import Tooltip from '@/components/common/Tooltip';

function MedPriceIcon(props: any) {
  const { priceValue = 0, className = '', isLoading = false, image = '' } = props;

  return (
    <div className="flex text-[16px] text-highEmphasis">
      <Image src={image || '/images/common/symbols/eth-tribe3.svg'} className="mr-1" alt="" width={20} height={20} />
      <span className={`${isLoading ? 'flash' : ''}  ${className}`}>{priceValue}</span>
    </div>
  );
}

const liquidationChanceLimit = 0.05;

export default function PositionDetails() {
  const currentAmm = useNanostore($currentAmm);
  const positionInfo = usePositionInfo(currentAmm);
  const vammPrice = useNanostore($vammPrice);
  const oraclePrice = useNanostore($oraclePrice);
  const isOverPriceGap = useIsOverPriceGap();
  const isPending = useTransactionIsPending(currentAmm);
  const collectionInfo = currentAmm ? getCollectionInformation(currentAmm) : null;

  const [showSharePosition, setShowSharePosition] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFundingPaymentModal, setShowFundingPaymentModal] = useState(false);

  const selectedAmm = currentAmm ?? AMM.DEGODS;
  const { total: fpTotal } = useFundingPaymentHistory(selectedAmm);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentAmm, positionInfo]);

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

  const clickShowSharePosition = (show: boolean) => {
    setShowSharePosition(show);
  };

  if (!positionInfo || positionInfo.size === 0 || !collectionInfo) {
    return null;
  }

  return (
    <div className="relative mb-9 rounded-[6px] border-[1px] border-[#2e4371] bg-lightBlue">
      {showSharePosition ? (
        <SharePosition positionInfo={positionInfo} collectionInfo={collectionInfo} setShowShareComponent={setShowSharePosition} />
      ) : null}
      <div className="mb-6 flex justify-between px-9 pt-6">
        <div className="flex items-center space-x-[6px] ">
          <Image src="/images/mobile/pages/trade/shopping-bag-green.svg" width={20} height={20} alt="" />
          <div className="font-600 text-[16px] text-highEmphasis">My {collectionInfo.collection} Position</div>
          {isPending ? (
            <div
              className="ml-3 rounded-[2px] border-[1px] border-warn
            px-[3px] py-[1px] text-[12px] text-warn">
              Transaction Pending...
            </div>
          ) : null}
        </div>
        <div className="flex space-x-[24px]">
          <div className="cursor-pointer" onClick={() => clickShowSharePosition(true)}>
            <Image alt="" src="/images/mobile/pages/trade/share_icon.svg" width={16} height={16} />
          </div>

          <div
            className="open-dropdown flex h-[20px] w-[20px] cursor-pointer
            justify-center hover:rounded-full hover:bg-white/[.2]"
            onClick={() => setShowDropdown(!showDropdown)}>
            <Image alt="" src="/images/components/trade/position/menu.svg" width={16} height={16} />
          </div>

          {showDropdown ? (
            <Dropdown
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setShowHistoryModal={setShowHistoryModal}
              setShowFundingPaymentModal={setShowFundingPaymentModal}
            />
          ) : null}
        </div>
        {showHistoryModal ? <HistoryModal setShowHistoryModal={setShowHistoryModal} /> : null}
        {showFundingPaymentModal && currentAmm ? <FundingPaymentModal setShowFundingPaymentModal={setShowFundingPaymentModal} /> : null}
      </div>
      <div className="px-9">
        <div className="mb-6 flex justify-between font-medium text-mediumEmphasis">
          <div>
            <div className="mb-3 text-[14px] font-normal">Type</div>
            <div className="text-[16px] font-semibold">
              <span className={!positionInfo ? '' : positionInfo.size > 0 ? 'text-marketGreen' : 'text-marketRed'}>
                {!positionInfo ? '---' : positionInfo.size > 0 ? 'LONG' : 'SHORT'}
              </span>
            </div>
          </div>
          <div>
            <div className="mb-3 text-[14px] font-normal">Notional</div>
            <div className="flex">
              <MedPriceIcon priceValue={positionInfo.currentNotional.toFixed(4)} isLoading={isLoading || isPending} />
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center text-[14px] font-normal">
              Unrealized P/L
              <Tooltip
                direction="top"
                content={
                  <div className="text-center">
                    Unrealized P/L is calculated based <br />
                    on the current vAMM price change and <br />
                    does not include funding payment
                  </div>
                }>
                <Image
                  src="/images/components/trade/history/more_info.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="ml-[6px] cursor-pointer"
                />
              </Tooltip>
            </div>
            <div>
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
          <div>
            <div className="mb-3 text-[14px] font-normal">Accu. Fund. Payment</div>
            <div>
              <MedPriceIcon
                priceValue={!fpTotal ? '0.0000' : fpTotal.toFixed(4)}
                className={fpTotal > 0 ? 'text-marketGreen' : !fpTotal ? '' : 'text-marketRed'}
                isLoading={isLoading || isPending}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="font-semiBold rounded-[6px] bg-darkBlue px-9 py-6 text-[16px]">
        <div className="flex justify-between font-medium text-mediumEmphasis">
          <div>
            <div className="mb-3 text-[14px] font-normal">Avg. Entry Price</div>
            <div>
              <MedPriceIcon
                priceValue={!positionInfo ? '---' : positionInfo.entryPrice < 0 ? '0.00' : positionInfo.entryPrice.toFixed(4)}
                className="text-[15px] font-normal"
                isLoading={isLoading || isPending}
              />
            </div>
          </div>
          <div>
            <div className="mb-3 text-[14px] font-normal">Liqui. Price</div>
            <div className="flex">
              <MedPriceIcon
                priceValue={!positionInfo ? '---' : positionInfo.liquidationPrice < 0 ? '0.00' : positionInfo.liquidationPrice.toFixed(2)}
                className={`${isOverPriceGap ? 'text-warn' : ''} `}
                isLoading={isLoading || isPending}
              />
              {liquidationChanceWarning() && !liquidationRiskWarning() ? (
                <TitleTips
                  placement="top"
                  titleText={<Image src="/images/common/alert/alert_yellow.svg" width={20} height={20} alt="" />}
                  tipsText="Your position is in high chance to be liquidated, please adjust your collateral to secure your trade."
                />
              ) : null}
              {liquidationRiskWarning() ? (
                <TitleTips
                  placement="top"
                  titleText={<Image src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />}
                  tipsText="Your position is at risk of being liquidated. Please manage your risk."
                />
              ) : null}
              {isOverPriceGap ? (
                <div className="absolute bottom-[-5px] left-[50px] border-[7px] border-b-0 border-x-transparent border-t-warn" />
              ) : null}
            </div>
          </div>
          <div>
            <div className="mb-3 text-[14px] font-normal">Contract Size</div>
            <div className="flex">
              <MedPriceIcon
                priceValue={positionInfo.size.toFixed(4).replace('-', '')}
                className="text-[15px] font-normal"
                isLoading={isLoading || isPending}
                image={collectionInfo.image}
              />
            </div>
          </div>
          <div>
            <div className="mb-3 text-[14px] font-normal">Collateral</div>
            <div>
              <MedPriceIcon
                priceValue={positionInfo.margin.toFixed(4).replace('-', '')}
                className="text-[15px] font-normal"
                isLoading={isLoading || isPending}
              />
            </div>
          </div>
          <div>
            <div className="mb-3 text-[14px] font-normal">Leverage</div>
            <div className="flex items-center text-[15px] font-normal text-highEmphasis">
              <span className={`text-[15px] font-normal ${isLoading || isPending ? 'flash' : ''}`}>
                {!positionInfo
                  ? '---'
                  : positionInfo.leverage <= 0
                  ? 'N/A'
                  : positionInfo.leverage > 100
                  ? '100.00 x +'
                  : `${positionInfo.leverage.toFixed(2)} x`}
              </span>
              {positionInfo.leverage <= 0 ? (
                <TitleTips
                  placement="top"
                  titleText={<Image src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />}
                  tipsText="Leverage ratio not meaningful when collateral is ≤ 0"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* {isOverPriceGap ? (
        <div className="mt-[18px] flex items-start space-x-[6px]">
          <Image src="/images/common/alert/alert_yellow.svg" width={15} height={15} alt="" />
          <p className="text-b3 text-warn">
            Warning: vAMM - Oracle Price gap &gt; 20%, liquidation now occurs at <b>Oracle Price</b> (note that P&L is still calculated
            based on vAMM price). {positionInfo.leverage <= 0 ? 'Positions with negative collateral value cannot be closed.' : ''}{' '}
            <a
              target="_blank"
              href="https://tribe3.gitbook.io/tribe3/getting-started/liquidation-mechanism"
              className="underline hover:text-warn/50"
              rel="noreferrer">
              Learn More
            </a>
          </p>
        </div>
      ) : null} */}
    </div>
  );
}
