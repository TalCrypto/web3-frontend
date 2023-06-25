/* eslint-disable @next/next/no-img-element */
/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';
import { useStore as useNanostore } from '@nanostores/react';

import { firebaseAnalytics } from '@/const/firebaseConfig';
import TitleTips from '@/components/common/TitleTips';
import { apiConnection } from '@/utils/apiConnection';
import { pageTitleParser } from '@/utils/eventLog';

import IndividualShareContainer from '@/components/trade/desktop/position/IndividualShareContainer';

import Dropdown from '@/components/trade/desktop/position/Dropdown';
import HistoryModal from '@/components/trade/desktop/position/HistoryModal';
import FundingPaymentModal from '@/components/trade/desktop/position/FundingPaymentModal';
import { $currentAmm, $oraclePrice, $vammPrice } from '@/stores/trading';
import { useIsOverPriceGap, usePositionInfo, useTransactionIsPending } from '@/hooks/collection';
import { getCollectionInformation } from '@/const/collectionList';
import { $userAddress } from '@/stores/user';

function MedPriceIcon(props: any) {
  const { priceValue = 0, className = '', isLoading = false, image = '' } = props;
  return (
    <div className={`font-400 flex text-[15px] text-highEmphasis ${className}`}>
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

const liquidationChanceLimit = 0.05;

export default function PositionDetails(props: any) {
  const router = useRouter();
  const address = useNanostore($userAddress);
  const currentAmm = useNanostore($currentAmm);
  const positionInfo = usePositionInfo(currentAmm);
  const vammPrice = useNanostore($vammPrice);
  const oraclePrice = useNanostore($oraclePrice);
  const isOverPriceGap = useIsOverPriceGap();
  console.log('vammPrice', vammPrice);
  const isPending = useTransactionIsPending(currentAmm);
  const collectionInfo = currentAmm ? getCollectionInformation(currentAmm) : null;

  // const [isTradingHistoryShow, setIsTradingHistoryShow] = useState(false);
  const [showSharePosition, setShowSharePosition] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFundingPaymentModal, setShowFundingPaymentModal] = useState(false);

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
          page: pageTitleParser(router.asPath),
          collection: currentAmm
        },
        address
      );
    }
  };

  if (!positionInfo || positionInfo.size === 0 || !collectionInfo) {
    return null;
  }

  return (
    <div className="relative mb-6 rounded-[6px] border-[1px] border-[#2e4371] px-9 py-6">
      {showSharePosition ? (
        <IndividualShareContainer
          positionInfo={positionInfo}
          collectionInfo={collectionInfo}
          setShowShareComponent={setShowSharePosition}
        />
      ) : null}
      <div className=" mb-[36px] flex justify-between">
        <div className="flex items-center space-x-[6px]">
          <Image className="" src="/images/mobile/pages/trade/shopping-bag-green.svg" width={20} height={20} alt="" />
          <div className="font-600 text-[16px] text-highEmphasis">My {collectionInfo.name} Position</div>
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
        {showFundingPaymentModal && currentAmm ? (
          <FundingPaymentModal setShowFundingPaymentModal={setShowFundingPaymentModal} amm={currentAmm} />
        ) : null}
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
            <span className={!positionInfo ? '' : positionInfo.size > 0 ? 'text-marketGreen' : 'text-marketRed'}>
              {!positionInfo ? '---' : positionInfo.size > 0 ? 'LONG' : 'SHORT'}
            </span>
          </div>
          <div className="flex w-[25%] space-x-[12px]">
            <MedPriceIcon
              priceValue={positionInfo.size.toFixed(4).replace('-', '')}
              isLoading={isLoading || isPending}
              image={collectionInfo.image}
            />
            <div>/</div>
            <MedPriceIcon priceValue={positionInfo.currentNotional.toFixed(4)} className="normalprice" isLoading={isLoading || isPending} />
          </div>
          <div className="flex w-[20%] pl-12">
            <span className={`normalprice mr-1 ${isLoading || isPending ? 'flash' : ''}`}>
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
                titleText={<Image className="" src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />}
                tipsText="Leverage ratio not meaningful when collateral is ≤ 0"
              />
            ) : null}
          </div>
          <div className="relative flex w-[20%] space-x-[3px] pl-4">
            <MedPriceIcon
              priceValue={!positionInfo ? '---' : positionInfo.liquidationPrice < 0 ? '0.00' : positionInfo.liquidationPrice.toFixed(2)}
              className={`normalprice ${isOverPriceGap ? 'text-warn' : ''} `}
              isLoading={isLoading || isPending}
            />
            {liquidationChanceWarning() && !liquidationRiskWarning() ? (
              <TitleTips
                placement="top"
                titleText={<Image className="" src="/images/common/alert/alert_yellow.svg" width={20} height={20} alt="" />}
                tipsText="Your position is in high chance to be liquidated, please adjust your collateral to secure your trade."
              />
            ) : null}
            {liquidationRiskWarning() ? (
              <TitleTips
                placement="top"
                titleText={<Image className="" src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />}
                tipsText="Your position is at risk of being liquidated. Please manage your risk."
              />
            ) : null}
            {isOverPriceGap ? (
              <div className="absolute bottom-[-5px] left-[50px] border-[7px] border-b-0 border-x-transparent border-t-warn" />
            ) : null}
          </div>
          <div className="w-[20%]">
            <MedPriceIcon
              priceValue={positionInfo.unrealizedPnl === 0 ? '0.0000' : positionInfo.unrealizedPnl.toFixed(4)}
              className={positionInfo.unrealizedPnl > 0 ? 'text-marketGreen' : positionInfo.unrealizedPnl === 0 ? '' : 'text-marketRed'}
              isLoading={isLoading || isPending}
            />
          </div>
        </div>
      </div>
      {isOverPriceGap ? (
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
      ) : null}
    </div>
  );
}
