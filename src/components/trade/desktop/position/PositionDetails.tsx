/* eslint-disable @next/next/no-img-element */
/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';
import { useStore as useNanostore } from '@nanostores/react';
import { utils } from 'ethers';

import { calculateNumber, formatterValue } from '@/utils/calculateNumbers';
import { firebaseAnalytics } from '@/const/firebaseConfig';
import TitleTips from '@/components/common/TitleTips';
import { apiConnection } from '@/utils/apiConnection';
import { pageTitleParser } from '@/utils/eventLog';
import { priceGapLimit } from '@/stores/priceGap';

import IndividualShareContainer from '@/components/trade/desktop/position/IndividualShareContainer';

import Dropdown from '@/components/trade/desktop/position/Dropdown';
import HistoryModal from '@/components/trade/desktop/position/HistoryModal';
import FundingPaymentModal from '@/components/trade/desktop/position/FundingPaymentModal';
import { $currentAMM, $transactionPendings } from '@/stores/trading';
import { useAccount, useTransaction } from 'wagmi';
import { $userInfo } from '@/stores/user';
import { usePositionInfo, useTradingData, useTransactionIsPending, useCollectionInfo } from '@/hooks/collection';

function MedPriceIcon(props: any) {
  const { priceValue = 0, className = '', isLoading = false, image = '' } = props;
  return (
    <div className={`text-15 font-400 flex text-highEmphasis ${className}`}>
      <Image
        src={image || '/images/common/symbols/eth-tribe3.svg'}
        className="icon"
        alt=""
        width={20}
        height={20}
        style={{ marginRight: '4px' }}
      />
      <span className={`${isLoading ? 'flash' : ''}`}>{priceValue}</span>
    </div>
  );
}

export default function PositionDetails(props: any) {
  const router = useRouter();
  const { address } = useAccount();
  const currentAmm = useNanostore($currentAMM);
  const userInfo = useNanostore($userInfo);
  const positionInfo = usePositionInfo(currentAmm);
  const tradingData = useTradingData(currentAmm);
  const isPending = useTransactionIsPending(currentAmm);
  const collectionInfo = useCollectionInfo(currentAmm);

  const [page, setPage] = useState<any>();

  // const [isTradingHistoryShow, setIsTradingHistoryShow] = useState(false);
  const [showSharePosition, setShowSharePosition] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFundingPaymentModal, setShowFundingPaymentModal] = useState(false);

  const vAMMPrice = tradingData?.spotPrice ?? 0;
  const oraclePrice = tradingData?.oraclePrice ?? 0;
  const priceGap: number = vAMMPrice !== 0 && oraclePrice !== 0 ? vAMMPrice / oraclePrice - 1 : 0;
  const priceGapLmt = useNanostore(priceGapLimit);

  // price gap
  const isGapAboveLimit = priceGapLmt ? Math.abs(priceGap) >= priceGapLmt : false;
  const isBadDebt = positionInfo ? positionInfo.leverage === 0 : false;

  // liquidation warning
  const positionType = positionInfo ? (positionInfo.size > 0 ? 'LONG' : 'SHORT') : null;
  const liquidationPrice = positionInfo ? Number(utils.formatEther(positionInfo.liquidationPrice)) : null;
  const liquidationChanceLimit = 0.05;

  useEffect(() => {
    if (router) {
      setPage(pageTitleParser(router.asPath));
    }
  }, [router]);

  const liquidationChanceWarning = useCallback(() => {
    if (!positionInfo || !tradingData || !tradingData.spotPrice || !tradingData.twapPrice || !priceGapLmt) return false;

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
  }, [positionInfo, tradingData]);

  const liquidationRiskWarning = useCallback(() => {
    if (!positionInfo || !tradingData || !tradingData.spotPrice || !tradingData.twapPrice || !priceGapLmt) return false;

    const selectedPriceForCalc = !isGapAboveLimit ? vAMMPrice : oraclePrice;

    if (positionType === 'LONG' && selectedPriceForCalc <= Number(liquidationPrice)) return true;
    if (positionType === 'SHORT' && selectedPriceForCalc >= Number(liquidationPrice)) return true;
    return false;
  }, [positionInfo, tradingData]);

  // leverage handling
  const isLeverageNegative = positionInfo ? positionInfo.leverage <= 0 : false;
  const isLeverageOver = positionInfo ? positionInfo.leverage > 100 : false;

  // const size = '';
  // const currentPrice = '';
  let sizeInEth = '';
  let absoluteSize = 0;
  let totalPnlValue = '';
  let numberTotalPnl = 0;

  if (positionInfo && tradingData) {
    // size = calculateNumber(positionInfo.size, 4);
    // currentPrice = calculateNumber(tradingData.spotPrice, 2);
    absoluteSize = Math.abs(Number(calculateNumber(positionInfo.size, 4)));
    sizeInEth = `${calculateNumber(positionInfo.currentNotional, 4)} `;
    const calc = positionInfo.unrealizedPnl;
    totalPnlValue = formatterValue(calc, 4);
    numberTotalPnl = Number(totalPnlValue);
  }

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentAmm, positionInfo]);

  if (!positionInfo || positionInfo.size === 0 || !collectionInfo) {
    return null;
  }

  const clickShowSharePosition = useCallback(
    (show: boolean) => {
      setShowSharePosition(show);
      if (firebaseAnalytics && address && currentAmm) {
        logEvent(firebaseAnalytics, 'share_position_performance_pressed', {
          wallet: address?.substring(2),
          collection: currentAmm
        });
      }

      if (address && currentAmm) {
        apiConnection.postUserEvent(
          'share_position_performance_pressed',
          {
            page,
            collection: currentAmm
          },
          address
        );
      }
    },
    [address, currentAmm]
  );

  // const marginRatio = Number(calculateNumber(positionInfo.marginRatio, 2)) * 100;

  return (
    <div className="relative mb-6 rounded-[6px] border-[1px] border-[#2e4371] px-9 py-6">
      {showSharePosition ? <IndividualShareContainer setShowShareComponent={setShowSharePosition} userInfo={userInfo} /> : null}
      <div className=" mb-[36px] flex justify-between">
        <div className="flex space-x-[6px]">
          <Image className="" src="/images/mobile/pages/trade/shopping-bag-green.svg" width="20" height="20" alt="" />
          <div className="text-16 font-600 text-highEmphasis">My {collectionInfo.shortName} Position</div>
          {isPending ? <div className="pending-reminder">Transaction Pending...</div> : null}
        </div>
        <div className="flex space-x-[24px]">
          <div className="cursor-pointer" onClick={() => clickShowSharePosition(true)}>
            <Image alt="" src="/images/mobile/pages/trade/share_icon.svg" width="16" height="16" />
          </div>

          <div
            className="open-dropdown flex h-[20px] w-[20px] cursor-pointer
            justify-center hover:rounded-full hover:bg-white/[.2]"
            onClick={() => setShowDropdown(!showDropdown)}>
            <Image alt="" src="/images/components/trade/position/menu.svg" width="16" height="16" />
          </div>

          {showDropdown ? (
            <Dropdown
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setShowHistoryModal={setShowHistoryModal}
              setShowFundingPaymentModal={setShowFundingPaymentModal}
            />
          ) : null}

          {showHistoryModal ? <HistoryModal setShowHistoryModal={setShowHistoryModal} /> : null}
          {showFundingPaymentModal ? (
            <FundingPaymentModal tradingData={tradingData} setShowFundingPaymentModal={setShowFundingPaymentModal} />
          ) : null}
        </div>
      </div>
      <div>
        <div className="mb-[12px] flex text-[14px] font-medium text-mediumEmphasis">
          <div className="w-[15%]">Type</div>
          <div className="w-[25%]">Contract Size / Notional</div>
          <div className="w-[20%] pl-12">Leverage</div>
          <div className="w-[20%] pl-4">Liqui. Price</div>
          <div className="w-[20%]">Unrealized P/L</div>
        </div>
        <div className="flex text-[15px] font-normal text-highEmphasis">
          <div className="w-[15%]">
            <span className={!positionInfo ? '' : positionInfo.size > 0 ? 'risevalue' : 'dropvalue'}>
              {!positionInfo ? '---' : positionInfo.size > 0 ? 'LONG' : 'SHORT'}
            </span>
          </div>
          <div className="flex w-[25%] space-x-[12px]">
            <MedPriceIcon priceValue={absoluteSize} isLoading={isLoading || isPending} image={collectionInfo.image} />
            <div>/</div>
            <MedPriceIcon priceValue={sizeInEth} className="normalprice" isLoading={isLoading || isPending} />
          </div>
          <div className="flex w-[20%] pl-12">
            <span className={`normalprice mr-1 ${isLoading || isPending ? 'flash' : ''}`}>
              {!positionInfo
                ? '---'
                : isLeverageNegative
                ? 'N/A'
                : isLeverageOver
                ? '100.00 x +'
                : formatterValue(positionInfo.leverage, 2, 'x')}
            </span>
            {isLeverageNegative ? (
              <TitleTips
                placement="top"
                titleText={<Image className="" src="/static/alert_red.svg" width="20" height="20" alt="" />}
                tipsText="Leverage ratio not meaningful when collateral is ≤ 0"
              />
            ) : null}
          </div>
          <div className="relative flex w-[20%] space-x-[3px] pl-4">
            <MedPriceIcon
              priceValue={
                !positionInfo
                  ? '---'
                  : Number(calculateNumber(positionInfo.liquidationPrice, 2)) < 0
                  ? '0.00'
                  : calculateNumber(positionInfo.liquidationPrice, 2)
              }
              className={`normalprice ${isGapAboveLimit ? 'text-warn' : ''} `}
              isLoading={isLoading || isPending}
            />
            {liquidationChanceWarning() && !liquidationRiskWarning() ? (
              <TitleTips
                placement="top"
                titleText={<Image className="" src="/static/alert_yellow.svg" width="20" height="20" alt="" />}
                tipsText="Your position is in high chance to be liquidated, please adjust your collateral to secure your trade."
              />
            ) : null}
            {liquidationRiskWarning() ? (
              <TitleTips
                placement="top"
                titleText={<Image className="" src="/static/alert_red.svg" width="20" height="20" alt="" />}
                tipsText="Your position is at risk of being liquidated. Please manage your risk."
              />
            ) : null}
            {isGapAboveLimit ? (
              <div className="absolute bottom-[-5px] left-[50px] border-[7px] border-b-0 border-x-transparent border-t-[#FFC24B]" />
            ) : null}
          </div>
          <div className="w-[20%]">
            <MedPriceIcon
              priceValue={!positionInfo ? '---' : Number(totalPnlValue) === 0 ? '0.0000' : totalPnlValue}
              className={!positionInfo ? '' : Number(numberTotalPnl) > 0 ? 'risevalue' : Number(numberTotalPnl) === 0 ? '' : 'dropvalue'}
              isLoading={isLoading || isPending}
            />
          </div>
        </div>
      </div>
      {isGapAboveLimit ? (
        <div className="mt-[18px] flex items-start space-x-[6px]">
          <Image src="/static/alert_yellow.svg" width={15} height={15} alt="" />
          <p className="text-b3 text-warn">
            Warning: vAMM - Oracle Price gap &gt; 20%, liquidation now occurs at <b>Oracle Price</b> (note that P&L is still calculated
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
      ) : null}
    </div>
  );
}
