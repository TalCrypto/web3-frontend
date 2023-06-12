/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
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
import { wsCurrentToken, wsFullWalletAddress } from '@/stores/WalletState';

function SmallPriceIcon(props: any) {
  const { priceValue = 0, className = '' } = props;
  return (
    <div className={`flex items-center space-x-[6px] text-[14px] text-highEmphasis ${className}`}>
      <Image src="/images/components/layout/header/eth-tribe3.svg" alt="" width={16} height={16} />
      <span>{priceValue}</span>
    </div>
  );
}

function Cell(props: any) {
  const { items, classNames } = props;
  return (
    <div
      className="relative mb-6 grid grid-cols-12 items-center
      text-[14px] text-mediumEmphasis">
      {items.map((item: any, index: any) => (
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

function ExplorerButton(props: any) {
  const { txHash, collection } = props;
  const etherscanUrl = `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${txHash}`;
  const fullWalletAddress = useNanostore(wsFullWalletAddress);

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

const MarketTrade = () => {
  const router = useRouter();
  const marketHistory = useNanostore(tsMarketHistory);
  const fullWalletAddress = useNanostore(wsFullWalletAddress);

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
        classNames={[
          'col-span-3 text-[12px]',
          'col-span-2 text-[12px]',
          'col-span-2 text-[12px]',
          'col-span-2 text-[12px]',
          'col-span-2 text-[12px]',
          'col-span-1'
        ]}
      />
      {marketHistory && marketHistory.length > 0 ? (
        marketHistory.map(({ timestamp, exchangedPositionSize, positionNotional, spotPrice, userAddress, userId, txHash }, index) => (
          <Cell
            key={`market_${timestamp}_${index}`}
            rowStyle={fullWalletAddress === userAddress ? { backgroundColor: 'rgba(32, 34, 73, 0.5)' } : {}}
            items={[
              <div className="time relative">
                <div className="absolute left-[-12px] top-0 mt-[6px] h-[34px] w-[3px] rounded-[30px] bg-primaryBlue" />

                <span className="text-[12px]">{formatDateTime(timestamp)}</span>
                <br />
                <span className={`market ${isPositive(exchangedPositionSize) ? 'text-marketGreen' : 'text-marketRed'}`}>
                  {isPositive(exchangedPositionSize) ? 'LONG' : 'SHORT'}
                </span>
              </div>,
              <span className="text-highEmphasis">{getTradingActionTypeFromAPI(marketHistory[index])}</span>,

              <SmallPriceIcon priceValue={formatterValue(positionNotional, 2)} />,
              <SmallPriceIcon priceValue={formatterValue(spotPrice, 2)} />,
              <div className="relative overflow-x-hidden text-ellipsis">
                <span className="market_user cursor-pointer" onClick={() => router.push(`/userprofile/${userAddress}`)}>
                  {trimString(userId, 10) || walletAddressToShow(userAddress)}
                </span>
                {fullWalletAddress === userAddress ? (
                  <span
                    className="absolute right-0 top-[1px] ml-1 rounded-sm
                    bg-[#E06732] p-[2px] align-middle text-[8px] font-extrabold text-highEmphasis">
                    YOU
                  </span>
                ) : null}
              </div>,
              <ExplorerButton txHash={txHash} />
            ]}
            classNames={['col-span-3 pl-3', 'col-span-2', 'col-span-2', 'col-span-2', 'col-span-2 ', 'col-span-1 px-3']}
          />
        ))
      ) : (
        <div className="item-center flex justify-center">
          <span className="body1 my-40 text-center text-mediumEmphasis">There is no market history.</span>
        </div>
      )}
    </div>
  );
};

const SpotTable = () => {
  const openseaData = useNanostore(tsSportPriceList);
  const fullWalletAddress = useNanostore(wsFullWalletAddress);
  const currentToken = useNanostore(wsCurrentToken);

  return (
    <div className="scrollable mx-[46px] h-full overflow-y-scroll">
      <Cell
        items={['Time', 'Item', 'Price', '']}
        classNames={['col-span-3 text-[12px]', 'col-span-3 px-3 text-[12px]', 'col-span-4 px-3 text-[12px]', 'col-span-1 px-3 text-[12px]']}
      />
      {openseaData && openseaData && openseaData.length > 0 ? (
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
          const key_value = assetCreationDate + event_timestamp + assetToken;

          return (
            <Cell
              classNames={['col-span-3 px-3', 'col-span-3 px-3', 'col-span-4 px-3', 'col-span-1 px-3']}
              key={`spot_${key_value}`}
              items={[
                <div className="relative text-[12px]">
                  <div className="absolute left-[-12px] top-0 mt-[-8px] h-[34px] w-[3px] rounded-[30px] bg-primaryBlue" />
                  {formatDateTimeFromString(event_timestamp)}
                </div>,
                <div className="flex items-center text-[12px] text-[#6286e3]">
                  <Image src={src} className="mr-3 rounded-[5px]" alt="" width={40} height={40} />
                  {`#${assetToken}` || 'No Name'}
                </div>,
                <div className="price">
                  {isUSDC ? (
                    <PriceWithUsdc priceValue={priceValue} className="margin-16 font-400 text-[14px]" />
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
    </div>
  );
};

const FundingPaymentHistory = () => {
  const fundingPaymentHistory = useNanostore(tsFundingPaymentHistory);

  return fundingPaymentHistory !== null ? (
    <div className="scrollable mx-[46px] h-full overflow-y-scroll">
      <Cell
        items={['Time', 'Funding Rate (LONG)', 'Funding Rate (SHORT)']}
        classNames={['col-span-4 text-[12px]', 'col-span-4 px-3 text-[12px]', 'col-span-4 px-3 text-[12px]']}
      />
      {fundingPaymentHistory && fundingPaymentHistory.length > 0 ? (
        fundingPaymentHistory.map(({ timestamp, rateLong, rateShort } /* index */) => (
          <Cell
            key={`funding_${timestamp}`}
            items={[
              <div className="time relative text-[12px]">
                <div className="absolute left-[-12px] top-0 mt-[-8px] h-[34px] w-[3px] rounded-[30px] bg-primaryBlue" />
                {formatDateTime(timestamp)}
              </div>,
              <div>{`${rateLong > 0 ? '-' : '+'}${Math.abs(Number(formatterValue(rateLong * 100, 4))).toFixed(4)} %`}</div>,
              <div>{`${rateShort > 0 ? '+' : '-'}${Math.abs(Number(formatterValue(rateShort * 100, 4))).toFixed(4)} %`}</div>
            ]}
            classNames={[
              'col-span-4 px-3',
              `col-span-4 px-3 market ${rateLong > 0 ? 'text-marketRed' : 'text-marketGreen'}`,
              `col-span-4 px-3 market ${rateLong > 0 ? 'text-marketGreen' : 'text-marketRed'}`
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
};

function TribeDetailComponents(props: any) {
  const { activeTab } = props;
  const currentToken = useNanostore(wsCurrentToken);

  useEffect(() => {
    updateTradeInformation(currentToken);
  }, [currentToken]);

  return (
    <>
      <div className={`${activeTab === 0 ? 'block' : 'hidden'} h-[86%]`}>
        <MarketTrade />
      </div>
      <div className={`${activeTab === 1 ? 'block' : 'hidden'} h-[86%]`}>
        <SpotTable />
      </div>
      <div className={`${activeTab === 2 ? 'block' : 'hidden'} h-[86%]`}>
        <FundingPaymentHistory />
      </div>
    </>
  );
}
export default TribeDetailComponents;
