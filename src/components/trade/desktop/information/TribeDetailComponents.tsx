/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react';
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
import { getTradingActionTypeFromAPI } from '@/components/trade/desktop/information/ActionType';
import { trimString } from '@/utils/string';

import { formatDateTime, formatDateTimeFromString } from '@/utils/date';

import { /* PriceWithIcon, */ PriceWithUsdc } from '@/components/common/PricWithIcon';

function SmallPriceIcon(props: any) {
  const { priceValue = 0, className = '' } = props;
  return (
    <div className={`text-14 flex items-center space-x-[6px] text-highEmphasis ${className}`}>
      <Image src="/images/components/layout/header/eth-tribe3.svg" alt="" width={16} height={16} />
      <span>{priceValue}</span>
    </div>
  );
}

function LargePriceWithIcon(props: any) {
  const { priceValue = 0, className = '' } = props;
  return (
    <div className={`large-price-with-icon ${className}`}>
      <Image src="/images/components/layout/header/eth-tribe3.svg" width={16} height={16} className="icon" alt="" />
      {priceValue}
    </div>
  );
}

function Cell(props: any) {
  const { items, classNames, rowStyle } = props;
  return (
    <div
      className="relative mb-6 grid grid-cols-12 items-center
      text-[14px] text-[#a3c2ff]/[.6]">
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
  const firstRender = useRef(true);

  const fetchSpotPriceList = useCallback(async () => {
    setOpenseaData([]);
    await getBaycFromMainnet(getCollectionInformation(currentToken).contract)
      .then((data: any) => {
        // from tokenRef.current
        setOpenseaData(data);
      })
      .catch(() => setOpenseaData([]));
  }, [currentToken]);

  // useImperativeHandle(ref, () => ({ fetchSpotPriceList }));

  useEffect(() => {
    if (firstRender.current) {
      fetchSpotPriceList();
      firstRender.current = false;
    }
  }, [fetchSpotPriceList]);

  return (
    <div className="scrollable mx-[46px] h-full overflow-y-scroll">
      <Cell items={['Time', 'Item', 'Price', '']} classNames={['col-span-3', 'col-span-3 px-3 ', 'col-span-4 px-3 ', 'col-span-1 px-3 ']} />
      {openseaData.length > 0 ? (
        openseaData?.map((data: IOpenseaData) => {
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
              classNames={['col-span-3 px-3', 'col-span-3 px-3', 'col-span-4 px-3', 'col-span-1 px-3']}
              key={assetCreationDate + event_timestamp + assetToken}
              items={[
                <div className="relative">
                  <div className="absolute left-[-12px] top-0 mt-[3px] h-[14px] w-[3px] rounded-[30px] bg-[#2574fb]" />

                  {/* <div className="bg-primary" style={{ width: 3, height: 20, marginRight: 8, borderRadius: 2 }} /> */}
                  {formatDateTimeFromString(event_timestamp)}
                  {/* {moment(event_timestamp).format('MM/DD/YYYY HH:mm')} */}
                </div>,
                <div className="flex items-center text-[14px] text-[#6286e3]">
                  <Image src={src} className="mr-3 rounded-[5px]" alt="" width={40} height={40} />
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
                  <Image src="/images/common/out.svg" className="out-link-icon" alt="" width={24} height={24} />
                </a>
              ]}
            />
          );
        })
      ) : (
        <div className="item-center flex justify-center">
          <span className="body1 my-40 text-center text-mediumEmphasis">There is no spot info.</span>
        </div>
      )}
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
      <Image alt="" src="/images/common/out.svg" onClick={getAnalyticsMktEtherscan} width={20} height={20} />
    </a>
  );
}

const MarketTrade = forwardRef((props: any, ref: any) => {
  const router = useRouter();
  const { fullWalletAddress, currentToken } = props;
  const [marketHistory, setMarketHistory] = useState([]);
  const firstRender = useRef(true);

  const fetchMarketHistory = useCallback(async () => {
    // console.log('fetchMarketHistory');
    await getMarketHistory(getCollectionInformation(currentToken).amm).then(data => setMarketHistory(data)); // from tokenRef.current
  }, [currentToken]);
  // useImperativeHandle(ref, () => ({ fetchMarketHistory }));
  // if (marketHistory.length === 0) {
  //   return null;
  // }

  useEffect(() => {
    if (firstRender.current) {
      fetchMarketHistory();
      firstRender.current = false;
    }
  }, [fetchMarketHistory]);

  const walletAddressToShow = (addr: any) => {
    if (!addr) {
      return '';
    }
    return `${addr.substring(0, 7)}...${addr.slice(-3)}`;
  };

  return (
    <div className="scrollable mx-[46px] h-full overflow-y-scroll">
      <Cell
        items={['Time / Type', 'Action', 'Notional Size', 'Resulting Price', 'User ID', '']}
        classNames={['col-span-3', 'col-span-2 px-3', 'col-span-2 px-3', 'col-span-2 px-3', 'col-span-2 px-3', 'col-span-1 px-3']}
      />
      {marketHistory.length > 0 ? (
        marketHistory.map(({ timestamp, exchangedPositionSize, positionNotional, spotPrice, userAddress, userId, txHash }, index) => (
          <Cell
            // key={`${timestamp}_${index}`}
            rowStyle={fullWalletAddress === userAddress ? { backgroundColor: 'rgba(32, 34, 73, 0.5)' } : {}}
            items={[
              // <div className="col firstcontent">
              //   <div className="col-auto initdivider" />
              //   <div className="col">{moment.unix(timestamp).format('MM/DD/YYYY HH:mm')}</div>
              // </div>,
              <div className="time relative">
                <div className="absolute left-[-12px] top-0 mt-[6px] h-[34px] w-[3px] rounded-[30px] bg-[#2574fb]" />

                {/* <div className="bg-primary" style={{ width: 3, height: 20, marginRight: 8, borderRadius: 2 }} /> */}
                {/* <span>{moment.unix(timestamp).format('MM/DD/YYYY HH:mm')}</span> */}
                <span>{formatDateTime(timestamp)}</span>
                <br />
                <span className={`market ${isPositive(exchangedPositionSize) ? 'text-[#78f363]' : 'text-[#ff5656]'}`}>
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
            classNames={['col-span-3 px-3', 'col-span-2 px-3', 'col-span-2 px-3', 'col-span-2 px-3', 'col-span-2 px-3', 'col-span-1 px-3']}
          />
        ))
      ) : (
        <div className="item-center flex justify-center">
          <span className="body1 my-40 text-center text-mediumEmphasis">There is no market history.</span>
        </div>
      )}
    </div>
  );
});

const FundingPaymentHistory = forwardRef((props: any, ref) => {
  const { currentToken } = props;
  const [fundingPaymentHistory, setFundingPaymentHistory] = useState([]);
  const firstRender = useRef(true);

  const fetchFundingPaymentHistory = useCallback(async () => {
    await getFundingPaymentHistory(getCollectionInformation(currentToken).amm).then(data => setFundingPaymentHistory(data)); // from tokenRef.current
  }, [currentToken]);
  useImperativeHandle(ref, () => ({ fetchFundingPaymentHistory }));

  useEffect(() => {
    if (firstRender.current) {
      fetchFundingPaymentHistory();
      firstRender.current = false;
    }
  }, [fetchFundingPaymentHistory]);

  return fundingPaymentHistory !== null ? (
    <div className="scrollable mx-[46px] h-full overflow-y-scroll">
      <Cell
        items={['Time', 'Funding Rate (LONG)', 'Funding Rate (SHORT)']}
        classNames={['col-span-4', 'col-span-4 px-3', 'col-span-4 px-3']}
      />
      {fundingPaymentHistory.length > 0 ? (
        fundingPaymentHistory.map(({ timestamp, rateLong, rateShort } /* index */) => (
          <Cell
            // key={`${timestamp}_${index}`}
            items={[
              <div className="time relative">
                {/* <div className="bg-primary" style={{ width: 3, height: 20, marginRight: 8, borderRadius: 2 }} /> */}
                <div className="absolute left-[-12px] top-0 mt-[3px] h-[14px] w-[3px] rounded-[30px] bg-[#2574fb]" />
                {formatDateTime(timestamp)}
              </div>,
              <div>{`${rateLong > 0 ? '-' : '+'}${Math.abs(Number(formatterValue(rateLong * 100, 4))).toFixed(4)} %`}</div>,
              <div>{`${rateShort > 0 ? '+' : '-'}${Math.abs(Number(formatterValue(rateShort * 100, 4))).toFixed(4)} %`}</div>
            ]}
            classNames={[
              'col-span-4 px-3',
              `col-span-4 px-3 market ${rateLong > 0 ? 'text-[#ff5656]' : 'text-[#78f363]'}`,
              `col-span-4 px-3 market ${rateLong > 0 ? 'text-[#78f363]' : 'text-[#ff5656]'}`
            ]}
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
  const { tradingData } = props;
  const [tribeDetailIndex, setTribeDetailIndex] = useState(0);
  const { fullWalletAddress, tokenRef, currentToken, activeTab } = props;
  const marketTradeRef = useRef();
  const fundingPaymentRef = useRef();
  const spotRef = useRef();
  // function getAnalyticsDetailTab(index: any) {
  //   setTribeDetailIndex(index);
  //   const eventName = ['tribedetail_overview_pressed', 'tribedetail_spottransaction_pressed', 'tribedetail_fundingpayment_pressed'][index];
  //   if (firebaseAnalytics) {
  //     logEvent(
  //       firebaseAnalytics,
  //       eventName,
  //       { wallet: fullWalletAddress.substring(2), collection: currentToken } // from tokenRef.current
  //     );
  //   }
  //   apiConnection.postUserEvent(eventName, {
  //     page: 'Trade',
  //     collection: currentToken // from tokenRef.current
  //   });
  // }

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
      <div className={`${activeTab === 0 ? 'block' : 'hidden'} h-[86%]`}>
        {/* <Overview tradingData={tradingData}>
          <MarketTrade ref={marketTradeRef} fullWalletAddress={fullWalletAddress} tokenRef={tokenRef} />
        </Overview> */}
        <MarketTrade ref={marketTradeRef} fullWalletAddress={fullWalletAddress} tokenRef={tokenRef} currentToken={currentToken} />
      </div>
      <div className={`${activeTab === 1 ? 'block' : 'hidden'} h-[86%]`}>
        <SpotTable ref={spotRef} fullWalletAddress={fullWalletAddress} tokenRef={tokenRef} currentToken={currentToken} />
      </div>
      <div className={`${activeTab === 2 ? 'block' : 'hidden'} h-[86%]`}>
        <FundingPaymentHistory ref={fundingPaymentRef} tokenRef={tokenRef} currentToken={currentToken} />
      </div>
    </>
  );
}
export default forwardRef(TribeDetailComponents);
