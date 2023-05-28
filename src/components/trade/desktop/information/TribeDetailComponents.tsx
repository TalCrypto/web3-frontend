/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
// import moment from 'moment';
import { logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { /* calculateNumber, */ formatterValue, isPositive, formatterUSDC } from '@/utils/calculateNumbers';
import { firebaseAnalytics } from '@/const/firebaseConfig';
import { getFundingPaymentHistory, getMarketHistory } from '@/utils/trading';

import collectionList from '@/const/collectionList';
import { apiConnection } from '@/utils/apiConnection';
import { localeConversion } from '@/utils/localeConversion';
import { getBaycFromMainnet } from '@/utils/opensea';
import Tab from '@/components/common/Tab';
import { getTradingActionTypeFromAPI } from '@/components/trade/desktop/information/ActionType';
import { trimString } from '@/utils/string';

import { /* PriceWithIcon, */ PriceWithUsdc } from '@/components/common/PricWithIcon';

// function OverviewItemCol(props: any) {
//   const { className, children } = props;
//   return (
//     <div className={`col ${className}`}>
//       <div className="label" />
//       <div className="content">{children}</div>
//     </div>
//   );
// }

function SmallPriceIcon(props: any) {
  const { priceValue = 0, className = '' } = props;
  return (
    <div className={`text-14 flex items-center space-x-[6px] text-highEmphasis ${className}`}>
      <Image src="/static/eth-tribe3.svg" alt="" width={16} height={16} />
      <span>{priceValue}</span>
    </div>
  );
}

// function LargePriceWithIcon(props: any) {
//   const { priceValue = 0, className = '' } = props;
//   return (
//     <div className={`large-price-with-icon ${className}`}>
//       <Image src="/static/eth-tribe3.svg" className="icon" alt="" />
//       {priceValue}
//     </div>
//   );
// }

// function Overview(props: any) {
//   const { tradingData, children } = props;
//   const [timeLabel, setTimeLabel] = useState('-- : -- : --');
//   const [interval, setI] = useState(null);
//   const [nextFundingTime, setNextFundingTime] = useState(0);
//   const hadKey = Object.keys(tradingData).length > 0;
//   let hours = '0';
//   let minutes = '0';
//   let seconds = '0';

//   function startCountdown() {
//     if (!hadKey) {
//       setTimeLabel('-- : -- : --');
//       return;
//     }
//     let endTime = tradingData.nextFundingTime * 1000;
//     const { fundingPeriod } = tradingData;
//     if (interval !== null) {
//       clearInterval(interval);
//     }
//     const intervalTime = setInterval(() => {
//       let difference = endTime - Date.now();
//       if (difference < 0) {
//         endTime = Date.now() + fundingPeriod * 1000;
//         difference = endTime - Date.now();
//       }
//       hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
//         .toString()
//         .padStart(2, '0');
//       minutes = Math.floor((difference / 1000 / 60) % 60)
//         .toString()
//         .padStart(2, '0');
//       seconds = Math.floor((difference / 1000) % 60)
//         .toString()
//         .padStart(2, '0');
//       setTimeLabel(`${hours} : ${minutes} : ${seconds}`);
//     }, 1000);
//     setI(intervalTime);
//   }

//   if (hadKey && nextFundingTime !== tradingData.nextFundingTime) {
//     setNextFundingTime(tradingData.nextFundingTime);
//     startCountdown();
//   }

//   return (
//     <div className="col-10 col-md-12 mx-auto">
//       <div className="row contentrow">
//         <div className="col-6 col-lg-5 col-md-6 col-sm-6 detailscard">
//           <div className="col title font-14-600 text-color-secondary">Floor Price</div>
//           <div className="row contentrow">
//             <div className="col">
//               <div className="col contenttitle">Futures</div>
//               <div>
//                 <LargePriceWithIcon priceValue={formatterValue(tradingData.spotPrice, 2)} className="margin-16" />
//               </div>
//             </div>
//             <div className="col">
//               <div className="col contenttitle">Spot</div>
//               <div>
//                 <LargePriceWithIcon priceValue={formatterValue(tradingData.twapPrice, 2)} className="margin-16" />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col detailscard">
//           <div className="col title font-14-600 text-color-secondary">Funding Rate</div>
//           <div className="col contents-mod funding-payment">
//             <div className="">
//               <div className="col">
//                 Long{' '}
//                 <span className={Number(formatterValue(tradingData.fundingRateLong * 100, 4)) > 0 ? 'down' : 'up'}>
//                   {Number(formatterValue(tradingData.fundingRateLong * 100, 4)) > 0 ? 'Pay' : 'Get'}
//                 </span>{' '}
//                 <span>{`${Math.abs(Number(formatterValue(tradingData.fundingRateLong * 100, 4)))}%`}</span>
//               </div>
//               <div className="col">
//                 Short{' '}
//                 <span className={Number(formatterValue(tradingData.fundingRateShort * 100, 4)) > 0 ? 'up' : 'down'}>
//                   {Number(formatterValue(tradingData.fundingRateShort * 100, 4)) > 0 ? 'Get' : 'Pay'}
//                 </span>{' '}
//                 <span>{`${Math.abs(Number(formatterValue(tradingData.fundingRateShort * 100, 4)))}%`}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col detailscard flex w-[203px] justify-between ">
//           <div className="col title font-14-600 text-color-secondary">Next Funding Payment</div>
//           <div className="col contents-mod">{timeLabel}</div>
//         </div>
//       </div>
//       <div className="row contentrow">
//         <div className="col-3 detailscard">
//           <div className="col title font-14-600 text-color-secondary">Volume (24hr)</div>
//           <div className="row normalrow">
//             <LargePriceWithIcon priceValue={formatterValue(tradingData.dayVolume, 2)} className="margin-16" />
//           </div>
//         </div>
//         <div className="col detailscard">
//           <div className="col title font-14-600 text-color-secondary">Long Short Ratio</div>
//           <div className="col">
//             <OverviewItemCol className="col-12" title="Long Short Ratio">
//               <div className="ratio-container">
//                 <div className="market up">Long</div>
//                 <div
//                   className="ratio-box long"
//                   style={{ width: `${calculateNumber(tradingData.longRatio, 0) < 30 ? 30 : calculateNumber(tradingData.longRatio, 0)}%` }}>
//                   <div className="label">{!hadKey ? '' : formatterValue(tradingData.longRatio, 0, '%')}</div>
//                   <div className="ratio long-ratio" />
//                 </div>
//                 <div
//                   className="ratio-box short"
//                   style={{
//                     width: `${calculateNumber(tradingData.shortRatio, 0) < 30 ? 30 : calculateNumber(tradingData.shortRatio, 0)}%`
//                   }}>
//                   <div className="label">{!hadKey ? '' : formatterValue(tradingData.shortRatio, 0, '%')}</div>
//                   <div className="ratio short-ratio" />
//                 </div>
//                 <div className="market down">Short</div>
//               </div>
//             </OverviewItemCol>
//           </div>
//         </div>
//       </div>
//       <div className="row mktrows align-items-center">
//         <div className="col markettradesdiv start" />
//         Market Trades
//         <div className="col markettradesdiv end" />
//       </div>
//       {children}
//     </div>
//   );
// }

function Cell(props: any) {
  const { items, classNames, rowStyle } = props;
  return (
    <div className="row cell" style={rowStyle}>
      {items.map((item: any, index: any) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className={`${classNames[index]}`} key={index}>
          {item}
        </div>
      ))}
    </div>
  );
}

interface IOpenseaData {
  asset: any;
  asset_bundle: any;
  payment_token: any;
  total_price: any;
  event_timestamp: any;
  transaction: any;
}

const SpotTable = forwardRef((props: any, ref: any) => {
  const { fullWalletAddress, /* tokenRef, */ currentToken } = props;
  const [openseaData, setOpenseaData] = useState([]);

  const fetchSpotPriceList = async () => {
    setOpenseaData([]);
    await getBaycFromMainnet(getCollectionInformation(currentToken).contract)
      .then((data: any) => {
        // from tokenRef.current
        setOpenseaData(data);
      })
      .catch(() => setOpenseaData([]));
  };
  useImperativeHandle(ref, () => ({ fetchSpotPriceList }));

  return (
    <div className="list">
      <Cell items={['Time', 'Item', 'Price', '']} classNames={['col-3 text-12', 'col-3  text-12', 'col-4  text-12', 'col-1  text-12']} />
      {openseaData?.map((data: IOpenseaData) => {
        const { asset, asset_bundle, payment_token, total_price, event_timestamp, transaction } = data;
        const src = !asset
          ? asset_bundle.assets[0].image_preview_url
          : !asset.image_preview_url
          ? 'https://storage.googleapis.com/opensea-static/opensea-profile/25.png'
          : asset.image_preview_url;
        let isEth = false;
        let isUSDC = false;
        if (payment_token !== null) {
          isEth = payment_token.symbol === 'ETH' || payment_token.symbol === 'WETH';
          isUSDC = payment_token.symbol === 'USDC';
        }
        const transactionHash = transaction.transaction_hash;
        const assetToken = !asset ? asset_bundle.asset_bundle_temp[0].token_id : asset.token_id;
        const getAnalyticsSpotEthers = () => {
          if (firebaseAnalytics) {
            logEvent(firebaseAnalytics, 'tribedetail_spottransaction_etherscan_pressed', {
              wallet: fullWalletAddress.substring(2),
              transaction: transactionHash.substring(2),
              token: assetToken,
              collection: currentToken // from tokenRef.current
            });
          }
          apiConnection.postUserEvent('tribedetail_spottransaction_etherscan_pressed', {
            page: 'Trade',
            transaction: transactionHash.substring(2),
            token: assetToken,
            collection: currentToken // from tokenRef.current
          });
        };
        const assetCreationDate = !asset ? asset_bundle.assets[0].created_date : asset.created_date;
        const priceValue = !total_price
          ? '0.00'
          : localeConversion(isUSDC ? formatterUSDC(total_price, 2) : formatterValue(total_price, 2), 2);

        return (
          <Cell
            classNames={['col-3', 'col-3', 'col-4', 'col-1']}
            key={assetCreationDate + event_timestamp + assetToken}
            items={[
              <div className="time flex">
                <div className="bg-primary" style={{ width: 3, height: 20, marginRight: 8, borderRadius: 2 }} />
                {/* {moment(event_timestamp).format('MM/DD/YYYY HH:mm')} */}
              </div>,
              <div className="items">
                <Image src={src} className="user-icon" alt="" />
                {`#${assetToken}` || 'No Name'}
              </div>,
              <div className="price">
                {isUSDC ? (
                  <PriceWithUsdc priceValue={priceValue} className="margin-16 text-14 font-400" />
                ) : (
                  // <PriceWithIcon priceValue={priceValue} className="margin-16  text-14 font-400" />
                  <SmallPriceIcon priceValue={priceValue} />
                )}
              </div>,
              <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noreferrer" onClick={getAnalyticsSpotEthers}>
                <Image src="/static/Out.svg" className="out-link-icon" alt="" />
              </a>
            ]}
          />
        );
      })}
    </div>
  );
});

function ExplorerButton(props: any) {
  const { txHash, fullWalletAddress, collection } = props;
  const etherscanUrl = `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${txHash}`;
  const getAnalyticsMktEtherscan = () => {
    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'tribedetail_markettrades_etherscan_pressed', {
        collection,
        wallet: fullWalletAddress.substring(2),
        transaction: txHash.substring(2)
      });
    }

    apiConnection.postUserEvent('tribedetail_markettrades_etherscan_pressed', {
      page: 'Trade',
      transaction: txHash.substring(2),
      collection
    });
  };

  return (
    <a href={etherscanUrl} target="_blank" rel="noreferrer">
      <Image alt="" src="../../../static/Out.svg" onClick={getAnalyticsMktEtherscan} width={20} height={20} />
    </a>
  );
}

const MarketTrade = forwardRef((props: any, ref: any) => {
  const router = useRouter();
  const { fullWalletAddress, currentToken } = props;
  const [marketHistory, setMarketHistory] = useState([]);
  const fetchMarketHistory = async () => {
    // console.log('fetchMarketHistory');
    await getMarketHistory(getCollectionInformation(currentToken).amm).then(data => setMarketHistory(data)); // from tokenRef.current
  };
  useImperativeHandle(ref, () => ({ fetchMarketHistory }));
  if (marketHistory.length === 0) {
    return null;
  }

  const walletAddressToShow = (addr: any) => `${addr.substring(0, 7)}...${addr.slice(-3)}`;

  return (
    <div className="col-12 mktlists">
      <Cell
        items={['Time / Type', 'Action', 'Contract Size', 'Resulting Price', 'User ID', '']}
        classNames={['col-3 text-12', 'col-2 text-12', 'col-2 text-12', 'col-2 text-12', 'col-2 text-12', 'col-1 text-12']}
      />
      {marketHistory.map(({ /* timestamp, */ exchangedPositionSize, positionNotional, spotPrice, userAddress, userId, txHash }, index) => (
        <Cell
          // key={`${timestamp}_${index}`}
          rowStyle={fullWalletAddress === userAddress ? { backgroundColor: 'rgba(32, 34, 73, 0.5)' } : {}}
          items={[
            // <div className="col firstcontent">
            //   <div className="col-auto initdivider" />
            //   <div className="col">{moment.unix(timestamp).format('MM/DD/YYYY HH:mm')}</div>
            // </div>,
            <div className="time">
              {/* <div className="bg-primary" style={{ width: 3, height: 20, marginRight: 8, borderRadius: 2 }} /> */}
              {/* <span>{moment.unix(timestamp).format('MM/DD/YYYY HH:mm')}</span> */}
              <br />
              <span className={`market ${isPositive(exchangedPositionSize) ? 'up' : 'down'}`}>
                {isPositive(exchangedPositionSize) ? 'LONG' : 'SHORT'}
              </span>
            </div>,
            <span className="text-highEmphasis">{getTradingActionTypeFromAPI(marketHistory[index])}</span>,
            // <TypeWithIconByCollection
            //   content={Math.abs(Number(formatterValue(exchangedPositionSize, 4))).toFixed(4)}
            //   collection={currentToken} // from tokenRef.current
            //   className="image"
            // />,
            <SmallPriceIcon priceValue={formatterValue(positionNotional, 2)} />,
            <SmallPriceIcon priceValue={formatterValue(spotPrice, 2)} />,
            <div>
              <span className="colorful-text" onClick={() => router.push(`/userprofile/${userAddress}`)}>
                {trimString(userId, 10) || walletAddressToShow(userAddress)}
              </span>
              {fullWalletAddress === userAddress ? (
                <span className="ml-1 rounded-sm bg-[#E06732] p-[2px] align-middle text-[8px] font-extrabold text-highEmphasis">YOU</span>
              ) : null}
            </div>,
            <ExplorerButton txHash={txHash} fullWalletAddress={fullWalletAddress} collection={currentToken} />
          ]}
          classNames={['col-3', 'col-2', 'col-2', 'col-2', 'col-2', 'col-1']}
        />
      ))}
    </div>
  );
});

const FundingPaymentHistory = forwardRef((props: any, ref) => {
  const { currentToken } = props;
  const [fundingPaymentHistory, setFundingPaymentHistory] = useState([]);

  const fetchFundingPaymentHistory = async () => {
    await getFundingPaymentHistory(getCollectionInformation(currentToken).amm).then(data => setFundingPaymentHistory(data)); // from tokenRef.current
  };
  useImperativeHandle(ref, () => ({ fetchFundingPaymentHistory }));

  return fundingPaymentHistory !== null ? (
    <div className="list">
      <Cell
        items={['Time', 'Funding Rate (LONG)', 'Funding Rate (SHORT)']}
        classNames={['col-4 text-12', 'col-3 text-12', 'col-3 text-12']}
      />
      {fundingPaymentHistory.length > 0 ? (
        fundingPaymentHistory.map(({ /* timestamp, */ rateLong /* , rateShort */ } /* index */) => (
          <Cell
            // key={`${timestamp}_${index}`}
            items={[
              <div className="time flex">
                <div className="bg-primary" style={{ width: 3, height: 20, marginRight: 8, borderRadius: 2 }} />
                {/* {moment.unix(timestamp).format('MM/DD/YYYY HH:mm')} */}
              </div>
              // `${rateLong > 0 ? '-' : '+'}${Math.abs(Number(formatterValue(rateLong * 100, 4))).toFixed(4)} %`,
              // `${rateShort > 0 ? '+' : '-'}${Math.abs(Number(formatterValue(rateShort * 100, 4))).toFixed(4)} %`
            ]}
            classNames={['col-4', `col-3 market ${rateLong > 0 ? 'down' : 'up'}`, `col-3 market ${rateLong > 0 ? 'up' : 'down'}`]}
          />
        ))
      ) : (
        <div className="item-center flex justify-center">
          <span className="body1 my-40 text-center text-mediumEmphasis">You have no funding payment history.</span>
        </div>
      )}
    </div>
  ) : null;
});

function getCollectionInformation(type: any) {
  const targetCollection = collectionList.filter(({ collection }) => collection.toUpperCase() === type.toUpperCase());
  return targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
}

function TribeDetailComponents(props: any, ref: any) {
  const [tribeDetailIndex, setTribeDetailIndex] = useState(0);
  const { fullWalletAddress, tokenRef, currentToken, activeTab } = props;
  const marketTradeRef = useRef();
  const fundingPaymentRef = useRef();
  const spotRef = useRef();
  function getAnalyticsDetailTab(index: any) {
    setTribeDetailIndex(index);
    const eventName = ['tribedetail_overview_pressed', 'tribedetail_spottransaction_pressed', 'tribedetail_fundingpayment_pressed'][index];
    if (firebaseAnalytics) {
      logEvent(
        firebaseAnalytics,
        eventName,
        { wallet: fullWalletAddress.substring(2), collection: currentToken } // from tokenRef.current
      );
    }
    apiConnection.postUserEvent(eventName, {
      page: 'Trade',
      collection: currentToken // from tokenRef.current
    });
  }
  const Tabs = ['Market Trades', 'Spot Transactions', 'Funding Payment History'].map((item, index) => (
    <Tab name={item} key={item} active={tribeDetailIndex === index} onClick={() => getAnalyticsDetailTab(index)} />
  ));

  const updateInfomations = () => {
    // marketTradeRef.current?.fetchMarketHistory();
    // fundingPaymentRef.current?.fetchFundingPaymentHistory();
    // spotRef.current?.fetchSpotPriceList();
  };

  useEffect(() => {
    updateInfomations();
  }, [currentToken]); // from tokenRef.current

  useImperativeHandle(ref, () => ({ updateInfomations }));

  return (
    <>
      <div className="sub-nav">{Tabs}</div>
      <div style={{ display: activeTab === 0 ? 'block' : 'none' }}>
        {/* <Overview tradingData={tradingData}>
          <MarketTrade ref={marketTradeRef} fullWalletAddress={fullWalletAddress} tokenRef={tokenRef} />
        </Overview> */}
        <MarketTrade ref={marketTradeRef} fullWalletAddress={fullWalletAddress} tokenRef={tokenRef} currentToken={currentToken} />
      </div>
      <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
        <SpotTable ref={spotRef} fullWalletAddress={fullWalletAddress} tokenRef={tokenRef} currentToken={currentToken} />
      </div>
      <div style={{ display: activeTab === 2 ? 'block' : 'none' }}>
        <FundingPaymentHistory ref={fundingPaymentRef} tokenRef={tokenRef} currentToken={currentToken} />
      </div>
    </>
  );
}
export default forwardRef(TribeDetailComponents);
