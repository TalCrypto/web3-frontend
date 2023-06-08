/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
// import moment from 'moment';
import { logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { /* calculateNumber, */ formatterValue, isPositive, formatterUSDC } from '@/utils/calculateNumbers';
import { firebaseAnalytics } from '@/const/firebaseConfig';

import { apiConnection } from '@/utils/apiConnection';
import { localeConversion } from '@/utils/localeConversion';
import { getTradingActionTypeFromAPI } from '@/components/trade/desktop/information/ActionType';
import { trimString } from '@/utils/string';

import { formatDateTime, formatDateTimeFromString } from '@/utils/date';

import { /* PriceWithIcon, */ PriceWithUsdc } from '@/components/common/PricWithIcon';

import { useStore as useNanostore } from '@nanostores/react';
import { updateTradeInformation } from '@/utils/TradeInformation';
import { tsMarketHistory, tsFundingPaymentHistory, tsSportPriceList } from '@/stores/TradeInformation';
import { walletProvider } from '@/utils/walletProvider';
import { wsCurrentToken } from '@/stores/WalletState';

function SmallPriceIcon(props: any) {
  const { priceValue = 0, className = '' } = props;
  return (
    <div className={`text-14 flex items-center space-x-[6px] text-highEmphasis ${className}`}>
      <Image src="/images/components/layout/header/eth-tribe3.svg" alt="" width={16} height={16} />
      <span>{priceValue}</span>
    </div>
  );
}

function Cell(props: any) {
  const { items, classNames, rowStyle } = props;
  return (
    <div
      className="relative mb-6 grid grid-cols-12 items-center whitespace-break-spaces
      text-[12px] text-mediumEmphasis">
      {items.map((item: any, index: any) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className={`${classNames[index]}`} key={index}>
          {item}
        </div>
      ))}
    </div>
  );
}

function ExplorerButton(props: any) {
  const { txHash, collection } = props;
  const etherscanUrl = `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${txHash}`;
  const fullWalletAddress = walletProvider.holderAddress;

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

const MarketTrade = (props: any) => {
  const router = useRouter();
  const marketHistory = useNanostore(tsMarketHistory);
  const [displayCount, setDisplayCount] = useState(10);
  const fullWalletAddress = walletProvider.holderAddress;

  const walletAddressToShow = (addr: any) => {
    if (!addr) {
      return '';
    }
    return `${addr.substring(0, 7)}...${addr.slice(-3)}`;
  };

  return (
    <div className="mx-[20px]">
      <Cell
        items={['User ID', 'Action / Type', 'Notional Size / Resulting Price', '']}
        classNames={['col-span-4', 'col-span-3 pl-3', 'col-span-4 px-3', 'col-span-1 px-3']}
      />
      {marketHistory && marketHistory.length > 0 ? (
        marketHistory
          .slice(0, displayCount > marketHistory.length ? marketHistory.length : displayCount)
          .map(({ timestamp, exchangedPositionSize, positionNotional, spotPrice, userAddress, userId, txHash }, index) => (
            <Cell
              key={`market_${timestamp}_${index}`}
              rowStyle={fullWalletAddress === userAddress ? { backgroundColor: 'rgba(32, 34, 73, 0.5)' } : {}}
              items={[
                <div className="time relative">
                  <div className="absolute left-[-12px] top-0 mt-[3px] h-[34px] w-[2px] rounded-[30px] bg-primaryBlue" />

                  <span>{formatDateTime(timestamp)}</span>
                  <div className="h-[6px] w-full" />
                  <span className="market_user" onClick={() => router.push(`/userprofile/${userAddress}`)}>
                    {trimString(userId, 10) || walletAddressToShow(userAddress) || ' '}
                  </span>
                  {fullWalletAddress === userAddress ? (
                    <span className="ml-1 rounded-sm bg-[#E06732] p-[2px] align-middle text-[8px] font-extrabold text-highEmphasis">
                      YOU
                    </span>
                  ) : null}
                </div>,
                <div>
                  <span className={`market ${isPositive(exchangedPositionSize) ? 'text-marketGreen' : 'text-marketRed'}`}>
                    {isPositive(exchangedPositionSize) ? 'LONG' : 'SHORT'}
                  </span>
                  <div className="h-[6px] w-full" />
                  <span className="text-highEmphasis">{getTradingActionTypeFromAPI(marketHistory[index])}</span>
                </div>,
                <div>
                  <SmallPriceIcon priceValue={formatterValue(positionNotional, 2)} />
                  <div className="h-[6px] w-full" />
                  <SmallPriceIcon priceValue={formatterValue(spotPrice, 2)} />
                </div>,

                <ExplorerButton txHash={txHash} />
              ]}
              classNames={['col-span-4 pl-3', 'col-span-3 px-3', 'col-span-3 px-3', 'col-span-2 px-3']}
            />
          ))
      ) : (
        <div className="item-center flex justify-center">
          <span className="body1 my-40 text-center text-mediumEmphasis">There is no market history.</span>
        </div>
      )}

      {marketHistory && marketHistory.length > 0 ? (
        displayCount >= marketHistory.length ? null : (
          <div
            className="text-center text-[14px] font-semibold text-primaryBlue"
            onClick={() => {
              // logHelper('overview_show_more_pressed', holderAddress, { collection });
              setDisplayCount(displayCount + 5);
            }}>
            Show More
          </div>
        )
      ) : null}
    </div>
  );
};

interface IOpenseaData {
  asset: any;
  asset_bundle: any;
  payment_token: any;
  total_price: any;
  event_timestamp: any;
  transaction: any;
}

const SpotTable = (props: any) => {
  const [displayCount, setDisplayCount] = useState(10);
  const openseaData = useNanostore(tsSportPriceList);
  const fullWalletAddress = walletProvider.holderAddress;
  const currentToken = useNanostore(wsCurrentToken);

  return (
    <div className="mx-[20px]">
      <Cell items={['Time', 'Item', 'Price', '']} classNames={['col-span-4 px-3', 'col-span-3 px-2 ', 'col-span-3 px-1', 'col-span-1']} />
      {openseaData && openseaData.length > 0 ? (
        openseaData?.slice(0, displayCount > openseaData.length ? openseaData.length : displayCount).map((data: IOpenseaData) => {
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
                collection: currentToken
              });
            }
            apiConnection.postUserEvent('tribedetail_spottransaction_etherscan_pressed', {
              page: 'Trade',
              transaction: transactionHash.substring(2),
              token: assetToken,
              collection: currentToken
            });
          };
          const assetCreationDate = !asset ? asset_bundle.assets[0].created_date : asset.created_date;
          const priceValue = !total_price
            ? '0.00'
            : localeConversion(isUSDC ? formatterUSDC(total_price, 2) : formatterValue(total_price, 2), 2);
          const key_value = assetCreationDate + event_timestamp + assetToken;

          return (
            <Cell
              classNames={['col-span-4 px-3', 'col-span-3 px-2 text-[14px]', 'col-span-3 px-1', 'col-span-1 px-1']}
              key={`spot_${key_value}`}
              items={[
                <div className="relative">
                  <div className="absolute left-[-12px] top-0 mt-[-6px] h-[34px] w-[2px] rounded-[30px] bg-primaryBlue" />
                  {formatDateTimeFromString(event_timestamp)}
                </div>,
                <div className="flex items-center text-[14px] text-[#6286e3]">
                  <Image src={src} className="mr-1 rounded-[5px]" alt="" width={24} height={24} />
                  {`#${assetToken}` || 'No Name'}
                </div>,
                <div className="price">
                  {isUSDC ? (
                    <PriceWithUsdc priceValue={priceValue} className="margin-16 text-14 font-400" />
                  ) : (
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

      {openseaData && openseaData.length > 0 ? (
        displayCount >= openseaData.length ? null : (
          <div
            className="text-center text-[14px] font-semibold text-primaryBlue"
            onClick={() => {
              // logHelper('overview_show_more_pressed', holderAddress, { collection });
              setDisplayCount(displayCount + 5);
            }}>
            Show More
          </div>
        )
      ) : null}
    </div>
  );
};

const FundingPaymentHistory = () => {
  const fundingPaymentHistory = useNanostore(tsFundingPaymentHistory);
  const [displayCount, setDisplayCount] = useState(10);

  return fundingPaymentHistory !== null ? (
    <div className="scrollable mx-[20px] h-full overflow-y-scroll">
      <Cell items={['Time', 'Funding Rate Long / Short']} classNames={['col-span-4 px-3', 'col-span-8 text-right']} />
      {fundingPaymentHistory && fundingPaymentHistory.length > 0 ? (
        fundingPaymentHistory
          .slice(0, displayCount > fundingPaymentHistory.length ? fundingPaymentHistory.length : displayCount)
          .map(({ timestamp, rateLong, rateShort } /* index */) => (
            <Cell
              key={`funding_${timestamp}`}
              items={[
                <div className="time relative">
                  <div className="absolute left-[-12px] top-0 mt-[-6px] h-[34px] w-[2px] rounded-[30px] bg-primaryBlue" />
                  {formatDateTime(timestamp)}
                </div>,
                <div>
                  {`${rateLong > 0 ? '-' : '+'}${Math.abs(Number(formatterValue(rateLong * 100, 5))).toFixed(5)} %`} /&nbsp;
                  {`${rateShort > 0 ? '-' : '+'}${Math.abs(Number(formatterValue(rateShort * 100, 5))).toFixed(5)} %`}
                </div>
              ]}
              classNames={[
                'col-span-4 px-3',
                `col-span-8 text-right text-[14px] market ${rateLong > 0 ? 'text-marketRed' : 'text-marketGreen'}`
              ]}
            />
          ))
      ) : (
        <div className="item-center flex justify-center">
          <span className="body1 my-40 text-center text-mediumEmphasis">You have no funding payment history.</span>
        </div>
      )}

      {fundingPaymentHistory && fundingPaymentHistory.length > 0 ? (
        displayCount >= fundingPaymentHistory.length ? null : (
          <div
            className="text-center text-[14px] font-semibold text-primaryBlue"
            onClick={() => {
              // logHelper('overview_show_more_pressed', holderAddress, { collection });
              setDisplayCount(displayCount + 5);
            }}>
            Show More
          </div>
        )
      ) : null}
    </div>
  ) : null;
};

function TabsInfo(props: any) {
  const { activeTab } = props;
  const currentToken = useNanostore(wsCurrentToken);

  useEffect(() => {
    updateTradeInformation(currentToken);
  }, [currentToken]);

  return (
    <>
      <div className={`${activeTab === 0 ? 'block' : 'hidden'} h-full`}>
        <MarketTrade />
      </div>
      <div className={`${activeTab === 1 ? 'block' : 'hidden'} h-full`}>
        <SpotTable />
      </div>
      <div className={`${activeTab === 2 ? 'block' : 'hidden'} h-full`}>
        <FundingPaymentHistory />
      </div>
    </>
  );
}

export default TabsInfo;
