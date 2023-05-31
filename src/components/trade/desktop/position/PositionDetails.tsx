/* eslint-disable @next/next/no-img-element */
/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import moment from 'moment';
import { logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';
import { useStore as useNanostore } from '@nanostores/react';
import { utils } from 'ethers';

import { calculateNumber, formatterValue } from '@/utils/calculateNumbers';
import { firebaseAnalytics } from '@/const/firebaseConfig';
// import { TypeWithIconByCollection } from '@/components/trade/desktop/information/TypeWithIcon';
// import { getTradingActionType } from '@/components/trade/desktop/information/ActionType';

// import IndividualShareContainer from '../dashboard/individualShareContainer';
// import { PriceWithIcon } from '../../components/priceWithIcon';
import TitleTips from '@/components/common/TitleTips';
import { apiConnection } from '@/utils/apiConnection';
import { pageTitleParser } from '@/utils/eventLog';
// import CustomDropdown from '../../components/CustomDropdown';
import collectionList from '@/const/collectionList';
import collectionsLoading from '@/stores/collectionsLoading';
import { walletProvider } from '@/utils/walletProvider';
import { priceGapLimit } from '@/stores/priceGap';

import IndividualShareContainer from '@/components/trade/desktop/position/IndividualShareContainer';

function MedPriceIcon(props: any) {
  const { priceValue = 0, className = '', isLoading = false, image = '' } = props;
  return (
    <div className={`text-15 font-400 flex text-highEmphasis ${className}`}>
      <img src={image || '/static/eth-tribe3.svg'} className="icon" alt="" width="20px" height="20px" style={{ marginRight: '4px' }} />
      <span className={`${isLoading ? 'animate__animated animate__flash animate__infinite' : ''}`}>{priceValue}</span>
    </div>
  );
}

export default function PositionDetails(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);

  const {
    userPosition,
    tradingData,
    // tokenRef,
    currentToken,
    fullWalletAddress
    // historyRecords,
    // setFundingModalIsShow,
    // setHistoryModalIsVisible
  } = props;

  const vAMMPrice = !tradingData.spotPrice ? 0 : Number(utils.formatEther(tradingData.spotPrice));
  const oraclePrice = !tradingData.twapPrice ? 0 : Number(utils.formatEther(tradingData.twapPrice));
  const priceGap = vAMMPrice && oraclePrice ? vAMMPrice / oraclePrice - 1 : 0;
  const priceGapLmt = useNanostore(priceGapLimit);

  // price gap
  const isGapAboveLimit = priceGapLmt ? Math.abs(priceGap) >= priceGapLmt : false;
  const isBadDebt = userPosition ? Number(utils.formatEther(userPosition.remainMarginLeverage)) === 0 : false;

  // const [isTradingHistoryShow, setIsTradingHistoryShow] = useState(false);
  const [showSharePosition, setShowSharePosition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentCollection = collectionList.filter((item: any) => item.collection.toUpperCase() === currentToken.toUpperCase())[0];
  const currentCollectionName = currentCollection.shortName || 'BAYC';
  const collectionIsPending = useNanostore(collectionsLoading.collectionsLoading);

  // liquidation warning
  const positionType = userPosition ? (userPosition.size > 0 ? 'LONG' : 'SHORT') : null;
  const liquidationPrice = userPosition ? Number(utils.formatEther(userPosition.liquidationPrice)) : null;
  const liquidationChanceLimit = 0.05;

  const [userInfo, setUserInfo] = useState({});

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

  if (userPosition !== null && tradingData !== null) {
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
    const timer = setTimeout(() => setIsLoading(false), 1000);
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

  if (userPosition === null) {
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
    <div className="positionpanel mb-[24px]">
      {showSharePosition ? (
        <IndividualShareContainer userPosition={[userPosition]} setShowShareComponent={setShowSharePosition} userInfo={userInfo} />
      ) : null}
      <div className="mb-[36px] flex justify-between">
        <div className="flex space-x-[6px]">
          <img className="" src="/static/shoppingbag-green.svg" width="20" height="20" alt="" />
          <div className="text-16 font-600 text-highEmphasis">My {currentCollectionName} Position</div>
          {collectionIsPending[currentCollection.amm] ? <div className="pending-reminder">Transaction Pending...</div> : null}
        </div>
        <div className="flex space-x-[24px]">
          <div className="nav-icon-btn" onClick={() => clickShowSharePosition(true)}>
            <img alt="" src="/static/share_icon.svg" width="16" height="16" />
          </div>
          {/* <div className="cursor-pointer" onClick={() => clickShowSharePosition(true)}>
            <img alt="" src="/static/threedots_icon.svg" width="16" height="16" />
          </div> */}
          {/* <CustomDropdown.Dropdown>
            <CustomDropdown.Toggle id="dropdown-custom-components">
              <div className="nav-icon-btn">
                <img alt="" src="/static/threedots_icon.svg" width="16" height="16" />
              </div>
            </CustomDropdown.Toggle>

            <CustomDropdown.Menu>
              <CustomDropdown.Item
                eventKey="1"
                onClick={() => {
                  setHistoryModalIsVisible(true);
                }}>
                <img alt="" src="/static/icon/dashboard/tradeHistory.svg" width="16" height="16" style={{ marginRight: 6 }} />
                <span>View History</span>
              </CustomDropdown.Item>
              <CustomDropdown.Item
                eventKey="2"
                onClick={() => {
                  router.push('/dashboard');
                }}>
                <img alt="" src="/static/icon/dashboard/position.svg" width="16" height="16" style={{ marginRight: 6 }} />
                <span>View Portfolio</span>
              </CustomDropdown.Item>
              <CustomDropdown.Item
                eventKey="3"
                onClick={() => {
                  setFundingModalIsShow(true);
                }}>
                <img alt="" src="/static/icon/dashboard/fundingPayment.svg" width="16" height="16" style={{ marginRight: 6 }} />
                <span>View Funding Payment</span>
              </CustomDropdown.Item>
            </CustomDropdown.Menu>
          </CustomDropdown.Dropdown> */}
        </div>
      </div>
      <div>
        <div className="text-14 font-500 mb-[12px] flex text-mediumEmphasis">
          <div className="w-[15%]">Type</div>
          <div className="w-[25%]">Contract Size / Notional</div>
          <div className="w-[20%] pl-12">Leverage</div>
          <div className="w-[20%] pl-4">Liqui. Price</div>
          <div className="w-[20%]">Unrealized P/L</div>
        </div>
        <div className="text-15 font-400 flex text-highEmphasis">
          <div className="w-[15%]">
            <span className={userPosition === null ? '' : userPosition.size > 0 ? 'risevalue' : 'dropvalue'}>
              {userPosition === null ? '---' : userPosition.size > 0 ? 'LONG' : 'SHORT'}
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
            <span
              className={`normalprice mr-1 ${
                isLoading || collectionIsPending[currentCollection.amm] ? 'animate__animated animate__flash animate__infinite' : ''
              }`}>
              {userPosition === null
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
                titleText={<img className="" src="/static/alert_red.svg" width="20" height="20" alt="" />}
                tipsText="Leverage ratio not meaningful when collateral is ≤ 0"
              />
            ) : null}
          </div>
          <div className="relative flex w-[20%] space-x-[3px] pl-4">
            <MedPriceIcon
              priceValue={
                userPosition === null
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
                titleText={<img className="" src="/static/alert_yellow.svg" width="20" height="20" alt="" />}
                tipsText="Your position is in high chance to be liquidated, please adjust your collateral to secure your trade."
              />
            ) : null}
            {liquidationRiskWarning() ? (
              <TitleTips
                placement="top"
                titleText={<img className="" src="/static/alert_red.svg" width="20" height="20" alt="" />}
                tipsText="Your position is at risk of being liquidated. Please manage your risk."
              />
            ) : null}
            {isGapAboveLimit ? (
              <div className="absolute bottom-[-5px] left-[50px] border-[7px] border-b-0 border-x-transparent border-t-[#FFC24B]" />
            ) : null}
          </div>
          <div className="w-[20%]">
            <MedPriceIcon
              priceValue={userPosition === null ? '---' : Number(totalPnlValue) === 0 ? '0.0000' : totalPnlValue}
              className={
                userPosition === null ? '' : Number(numberTotalPnl) > 0 ? 'risevalue' : Number(numberTotalPnl) === 0 ? '' : 'dropvalue'
              }
              isLoading={isLoading || collectionIsPending[currentCollection.amm]}
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

  // old backup
  // return (
  //   <div className="col positionpanel">
  //     {showSharePosition ? <IndividualShareContainer userPosition={[userPosition]} setShowShareComponent={setShowSharePosition} /> : null}
  //     <div className="row titlerow">
  //       <div className="col-auto my-auto sectiontitle">
  //         <img alt="" src="../../static/positionicon.svg" width="20px" height="20px" className="iconposition" />
  //         My Position
  //       </div>
  //       <div className="col shareposition" onClick={() => clickShowSharePosition(true)}>
  //         Share Position Performance
  //         <img alt="" src="../../static/share-position.png" className="share-icon" />
  //       </div>
  //     </div>
  //     <div className="row contentrow">
  //       <div className="col-7 longside">
  //         <div className="col contentpanel headerside">
  //           <div className="row">
  //             <SectionHeader row1="Position" row2="Details" />
  //             <div className="col">
  //               <div className="col contenttitle">
  //                 <TitleTips
  //                   titleText="Unrealized P/L"
  //                   tipsText="Current profit or loss on this open position due to price change on the vAMM price (this takes into account the price impact of exiting the position)"
  //                 />
  //                 {/* <TextTips
  //                   tipsText="Current profit or loss on this open position due to price change on the vAMM price (this takes into account the price impact of exiting the position)"
  //                   size="16px"
  //                 /> */}
  //               </div>
  //               <div className="col">
  //                 <PriceIcon
  //                   priceValue={userPosition === null ? '---' : totalPnlValue}
  //                   className={userPosition === null ? '' : Number(numberTotalPnl) > 0 ? 'risevalue' : 'dropvalue'}
  //                 />
  //               </div>
  //             </div>
  //             <div className="col" />
  //           </div>
  //         </div>
  //         <div className="col contentpanel">
  //           <div className="row detailrows">
  //             <div className="col">
  //               <div className="col contenttitle">Entry Price</div>
  //               <div className="col">
  //                 <SmallPriceIcon
  //                   priceValue={userPosition === null ? '---' : calculateNumber(userPosition.entryPrice, 2)}
  //                   className="normalprice"
  //                 />
  //               </div>
  //             </div>
  //             <div className="col">
  //               <div className="col contenttitle">Current Price</div>
  //               <div className="col">
  //                 <SmallPriceIcon priceValue={currentPrice} className="normalprice" />
  //               </div>
  //             </div>
  //             <div className="col">
  //               <div className="col contenttitle">Contract Size</div>
  //               <div className="col">
  //                 <SmallPriceIcon
  //                   priceValue={absoluteSize}
  //                   className="normalprice"
  //                   type={currentToken === '' ? '' : currentToken}
  //                   endsetter={currentToken === '' ? '' : ` ${currentToken}`}
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //           <div className="row detailrows">
  //             <div className="col-4">
  //               <div className="col contenttitle">Type</div>
  //               <div className="col">
  //                 <span className={userPosition === null ? '' : userPosition.size > 0 ? 'risevalue' : 'dropvalue'}>
  //                   {userPosition === null ? '---' : userPosition.size > 0 ? 'LONG' : 'SHORT'}
  //                 </span>
  //               </div>
  //             </div>
  //             <div className="col-4">
  //               <div className="col contenttitle">Funding Payment</div>
  //               <div className="col">
  //                 <SmallPriceIcon
  //                   priceValue={userPosition === null ? '---' : calculateNumber(userPosition.fundingPayment, 3)}
  //                   className={`market
  //                     ${calculateNumber(userPosition.fundingPayment, 3) > 0
  //                     ? 'up'
  //                     : calculateNumber(userPosition.fundingPayment, 3) < 0
  //                       ? 'down'
  //                       : 'normaltext'
  //                     }`}
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="col">
  //         <div className="col contentpanel headerside">
  //           <div className="row">
  //             <SectionHeader row1="Leverage" row2="Details" />
  //             <div className="col">
  //               <div className="col contenttitle">
  //                 <TitleTips
  //                   titleText="Collateral Value"
  //                   tipsText="Current collateral after taking into account of unrealized P&L, accumulated funding payment, and manual collateral adjustments"
  //                 />
  //               </div>
  //               <div className="col">
  //                 <PriceIcon
  //                   priceValue={userPosition === null ? '---' : calculateNumber(userPosition.realMargin, 4)}
  //                   className="normalprice"
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="col contentpanel">
  //           <div className="row detailrows">
  //             <div className="col">
  //               <div className="col contenttitle">
  //                 <TitleTips
  //                   titleText="Liquidation Price"
  //                   tipsText="The price where the platform forcefully closes a position due to its margin ratio going below the maintenance collateral ratio requirement"
  //                 />
  //               </div>
  //               <div className="col">
  //                 <SmallPriceIcon
  //                   priceValue={userPosition === null ? '---' : calculateNumber(userPosition.liquidationPrice, 2)}
  //                   className="normalprice"
  //                 />
  //               </div>
  //             </div>
  //             <div className="col">
  //               <div className="col contenttitle">
  //                 <TitleTips
  //                   titleText="Notional Value"
  //                   tipsText="The total value or exposure of this position"
  //                 />
  //               </div>
  //               <div className="col">
  //                 <SmallPriceIcon priceValue={sizeInEth} className="normalprice" />
  //               </div>
  //             </div>
  //           </div>
  //           <div className="row detailrows">
  //             <div className="col">
  //               <div className="col contenttitle">
  //                 <TitleTips
  //                   titleText="Leverage"
  //                   tipsText="Currnet Notional Amount / Current Collateral"
  //                 />
  //               </div>
  //               <div className="col">
  //                 <span className="normalprice">
  //                   {userPosition === null ? '---' : formatterValue(userPosition.remainMarginLeverage, 2, 'x')}
  //                 </span>
  //               </div>
  //             </div>
  //             <div className="col normalprice">
  //               <div className="col contenttitle">
  //                 <TitleTips
  //                   titleText="Collateral Ratio"
  //                   tipsText="Current Collateral / Currnet Notional Amount"
  //                 />
  //               </div>
  //               <div className="col">{userPosition === null ? '---' : `${calculateNumber(userPosition.marginRatio, 2)}%`}</div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="row showhistoryrow">
  //       <div
  //         className="col advancebtn selectbehaviour"
  //         onClick={() => {
  //           setIsTradingHistoryShow(!isTradingHistoryShow);
  //           logEvent(firebaseAnalytics, 'showTradingHistory_pressed', {
  //             wallet: fullWalletAddress.substring(2),
  //             is_shown: !isTradingHistoryShow,
  //             collection: currentToken
  //           });
  //           apiConnection.postUserEvent('showTradingHistory_pressed', {
  //             page,
  //             is_shown: !isTradingHistoryShow,
  //             collection: currentToken
  //           });
  //         }}
  //       >
  //         {isTradingHistoryShow ? 'Hide' : 'Show'} Trading History
  //         {isTradingHistoryShow ? (
  //           <img src="/static/angle_up.svg" style={{ marginRight: '8px' }} alt="" />
  //         ) : (
  //           <img src="/static/angle_down.svg" style={{ marginRight: '8px' }} alt="" />
  //         )}
  //       </div>
  //       <div className="col-8">
  //         {calculateNumber(userPosition.marginRatio, 1) < 20 ? (
  //           <div className="col tipsrow">
  //             <img alt="" src="../../static/tips_exclude.svg" width="11px" height="11px" className="iconposition" />
  //             Your position is in high chance to be liquidated, please adjust your collateral to secure your trade.
  //           </div>
  //         ) : null}
  //       </div>
  //     </div>
  //     {isTradingHistoryShow === false ? null : historyRecords === null ? null : (
  //       <HistoryContents historyRecords={historyRecords} tokenRef={tokenRef} />
  //     )}
  //   </div>
  // );
}
