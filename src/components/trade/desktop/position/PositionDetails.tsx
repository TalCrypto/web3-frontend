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
import { utils } from 'ethers';

import { calculateNumber, formatterValue } from '@/utils/calculateNumbers';
import { firebaseAnalytics } from '@/const/firebaseConfig';
import TitleTips from '@/components/common/TitleTips';
import { apiConnection } from '@/utils/apiConnection';
import { pageTitleParser } from '@/utils/eventLog';
import collectionList from '@/const/collectionList';
import collectionsLoading from '@/stores/collectionsLoading';
import { walletProvider } from '@/utils/walletProvider';
import { priceGapLimit } from '@/stores/priceGap';

import IndividualShareContainer from '@/components/trade/desktop/position/IndividualShareContainer';
import { wsCurrentToken, wsIsLogin, wsUserPosition } from '@/stores/WalletState';

import Dropdown from '@/components/trade/desktop/position/Dropdown';
import HistoryModal from '@/components/trade/desktop/position/HistoryModal';
import FundingPaymentModal from '@/components/trade/desktop/position/FundingPaymentModal';

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
  const { page } = pageTitleParser(router.asPath);

  const { tradingData } = props;

  const vAMMPrice = !tradingData.spotPrice ? 0 : Number(utils.formatEther(tradingData.spotPrice));
  const oraclePrice = !tradingData.twapPrice ? 0 : Number(utils.formatEther(tradingData.twapPrice));
  const priceGap = vAMMPrice && oraclePrice ? vAMMPrice / oraclePrice - 1 : 0;
  const priceGapLmt = useNanostore(priceGapLimit);
  const userPosition: any = useNanostore(wsUserPosition);

  // price gap
  const isGapAboveLimit = priceGapLmt ? Math.abs(priceGap) >= priceGapLmt : false;
  const isBadDebt = userPosition ? Number(utils.formatEther(userPosition.remainMarginLeverage)) === 0 : false;

  // const [isTradingHistoryShow, setIsTradingHistoryShow] = useState(false);
  const currentToken = useNanostore(wsCurrentToken);
  const [showSharePosition, setShowSharePosition] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentCollection = collectionList.filter((item: any) => item.collection.toUpperCase() === currentToken.toUpperCase())[0];
  const currentCollectionName = currentCollection.shortName || 'DEGODS';
  const collectionIsPending = useNanostore(collectionsLoading.collectionsLoading);

  // liquidation warning
  const positionType = userPosition ? (userPosition.size > 0 ? 'LONG' : 'SHORT') : null;
  const liquidationPrice = userPosition ? Number(utils.formatEther(userPosition.liquidationPrice)) : null;
  const liquidationChanceLimit = 0.05;
  const fullWalletAddress = walletProvider.holderAddress;

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFundingPaymentModal, setShowFundingPaymentModal] = useState(false);

  const [userInfo, setUserInfo] = useState({});
  const isLoginState = useNanostore(wsIsLogin);

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

  // const size = '';
  // const currentPrice = '';
  let sizeInEth = '';
  let absoluteSize = 0;
  let totalPnlValue = '';
  let numberTotalPnl = 0;

  if (userPosition && tradingData) {
    // size = calculateNumber(userPosition.size, 4);
    // currentPrice = calculateNumber(tradingData.spotPrice, 2);
    absoluteSize = Math.abs(Number(calculateNumber(userPosition.size, 4)));
    sizeInEth = `${calculateNumber(userPosition.currentNotional, 4)} `;
    const calc = userPosition.unrealizedPnl;
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
  }, [currentToken, userPosition]);

  useEffect(() => {
    if (fullWalletAddress) {
      apiConnection.getUserInfo(fullWalletAddress).then(data => {
        setUserInfo(data.data);
      });
    }
  }, [fullWalletAddress]);

  if (!userPosition) {
    return null;
  }

  const clickShowSharePosition = (show: any) => {
    setShowSharePosition(show);

    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'share_position_performance_pressed', {
        wallet: walletProvider?.holderAddress?.substring(2),
        collection: currentToken
      });
    }

    apiConnection.postUserEvent('share_position_performance_pressed', {
      page,
      collection: currentToken
    });
  };

  // const marginRatio = Number(calculateNumber(userPosition.marginRatio, 2)) * 100;

  return (
    <div className="relative mb-6 rounded-[6px] border-[1px] border-[#2e4371] px-9 py-6">
      {showSharePosition ? <IndividualShareContainer setShowShareComponent={setShowSharePosition} userInfo={userInfo} /> : null}
      <div className=" mb-[36px] flex justify-between">
        <div className="flex items-center space-x-[6px]">
          <Image className="" src="/images/mobile/pages/trade/shopping-bag-green.svg" width="20" height="20" alt="" />
          <div className="text-16 font-600 text-highEmphasis">My {currentCollectionName} Position</div>
          {collectionIsPending[currentCollection.amm] ? (
            <div
              className="ml-3 rounded-[2px] border-[1px] border-[#ffc24b]/[.87]
            px-[3px] py-[1px] text-[12px] text-[#ffc24b]/[.87]">
              Transaction Pending...
            </div>
          ) : null}
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
        </div>
        {showHistoryModal ? <HistoryModal setShowHistoryModal={setShowHistoryModal} /> : null}
        {showFundingPaymentModal ? (
          <FundingPaymentModal tradingData={tradingData} setShowFundingPaymentModal={setShowFundingPaymentModal} />
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
            <span className={!userPosition ? '' : userPosition.size > 0 ? 'risevalue' : 'dropvalue'}>
              {!userPosition ? '---' : userPosition.size > 0 ? 'LONG' : 'SHORT'}
            </span>
          </div>
          <div className="flex w-[25%] space-x-[12px]">
            <MedPriceIcon
              priceValue={absoluteSize}
              type={currentToken === '' ? '' : currentToken}
              isLoading={isLoading || collectionIsPending[currentCollection.amm]}
              image={currentCollection?.image}
            />
            <div>/</div>
            <MedPriceIcon
              priceValue={sizeInEth}
              className="normalprice"
              isLoading={isLoading || collectionIsPending[currentCollection.amm]}
            />
          </div>
          <div className="flex w-[20%] pl-12">
            <span className={`normalprice mr-1 ${isLoading || collectionIsPending[currentCollection.amm] ? 'flash' : ''}`}>
              {!userPosition
                ? '---'
                : isLeverageNegative
                ? 'N/A'
                : isLeverageOver
                ? '100.00 x +'
                : formatterValue(userPosition.remainMarginLeverage, 2, 'x')}
            </span>
            {isLeverageNegative ? (
              <TitleTips
                placement="top"
                titleText={<Image className="" src="/images/common/alert/alert_red.svg" width="20" height="20" alt="" />}
                tipsText="Leverage ratio not meaningful when collateral is ≤ 0"
              />
            ) : null}
          </div>
          <div className="relative flex w-[20%] space-x-[3px] pl-4">
            <MedPriceIcon
              priceValue={
                !userPosition
                  ? '---'
                  : Number(calculateNumber(userPosition.liquidationPrice, 2)) < 0
                  ? '0.00'
                  : calculateNumber(userPosition.liquidationPrice, 2)
              }
              className={`normalprice ${isGapAboveLimit ? 'text-warn' : ''} `}
              isLoading={isLoading || collectionIsPending[currentCollection.amm]}
            />
            {liquidationChanceWarning() && !liquidationRiskWarning() ? (
              <TitleTips
                placement="top"
                titleText={<Image className="" src="/images/common/alert/alert_yellow.svg" width="20" height="20" alt="" />}
                tipsText="Your position is in high chance to be liquidated, please adjust your collateral to secure your trade."
              />
            ) : null}
            {liquidationRiskWarning() ? (
              <TitleTips
                placement="top"
                titleText={<Image className="" src="/images/common/alert/alert_red.svg" width="20" height="20" alt="" />}
                tipsText="Your position is at risk of being liquidated. Please manage your risk."
              />
            ) : null}
            {isGapAboveLimit ? (
              <div className="absolute bottom-[-5px] left-[50px] border-[7px] border-b-0 border-x-transparent border-t-[#FFC24B]" />
            ) : null}
          </div>
          <div className="w-[20%]">
            <MedPriceIcon
              priceValue={!userPosition ? '---' : Number(totalPnlValue) === 0 ? '0.0000' : totalPnlValue}
              className={!userPosition ? '' : Number(numberTotalPnl) > 0 ? 'risevalue' : Number(numberTotalPnl) === 0 ? '' : 'dropvalue'}
              isLoading={isLoading || collectionIsPending[currentCollection.amm]}
            />
          </div>
        </div>
      </div>
      {isGapAboveLimit ? (
        <div className="mt-[18px] flex items-start space-x-[6px]">
          <Image src="/images/common/alert/alert_yellow.svg" width={15} height={15} alt="" />
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
