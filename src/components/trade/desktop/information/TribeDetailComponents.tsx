/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
import React from 'react';
// import moment from 'moment';
import { logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { firebaseAnalytics } from '@/const/firebaseConfig';

import { apiConnection } from '@/utils/apiConnection';
import { localeConversion } from '@/utils/localeConversion';
import { getTradingActionTypeFromAPI } from '@/utils/actionType';
import { trimString } from '@/utils/string';

import { formatDateTime, formatDateTimeFromString } from '@/utils/date';

import { /* PriceWithIcon, */ PriceWithUsdc } from '@/components/common/PricWithIcon';

import { useStore as useNanostore } from '@nanostores/react';
import { useFundingRatesHistory, useMarketHistory, useOpenSeaData } from '@/hooks/market';
import { AMM } from '@/const/collectionList';
import { $currentAmm } from '@/stores/trading';
import { useAccount } from 'wagmi';
import { formatBigIntString } from '@/utils/bigInt';

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
  const { address } = useAccount();

  const getAnalyticsMktEtherscan = () => {
    if (firebaseAnalytics && address) {
      logEvent(firebaseAnalytics, 'tribedetail_markettrades_etherscan_pressed', {
        collection,
        wallet: address.substring(2),
        transaction: txHash.substring(2)
      });
    }
    if (address) {
      apiConnection.postUserEvent(
        'tribedetail_markettrades_etherscan_pressed',
        {
          page: 'Trade',
          transaction: txHash.substring(2),
          collection
        },
        address
      );
    }
  };

  return (
    <a href={etherscanUrl} target="_blank" rel="noreferrer" className="cursor-pointer">
      <Image alt="" src="/images/common/out.svg" onClick={getAnalyticsMktEtherscan} width={16} height={16} />
    </a>
  );
}

const MarketTrade = ({ amm }: { amm: AMM }) => {
  const router = useRouter();
  const marketHistory = useMarketHistory(amm);
  const { address } = useAccount();

  const walletAddressToShow = (addr: any) => {
    if (!addr) {
      return '';
    }
    return `${addr.substring(0, 7)}...${addr.slice(-3)}`;
  };

  return (
    <div className="h-full">
      <div className="mx-[46px]">
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
      </div>

      <div className="scrollable mr-1 h-full overflow-y-scroll pl-[46px] pr-[42px]">
        {marketHistory && marketHistory.length > 0 ? (
          marketHistory
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((record, index) => (
              <Cell
                key={`market_${record.timestamp}_${index}`}
                rowStyle={address === record.userAddress ? { backgroundColor: 'rgba(32, 34, 73, 0.5)' } : {}}
                items={[
                  <div className="time relative">
                    <div className="absolute left-[-12px] top-0 mt-[6px] h-[34px] w-[3px] rounded-[30px] bg-primaryBlue" />

                    <span className="text-[12px]">{formatDateTime(record.timestamp)}</span>
                    <br />
                    <span className={`market ${record.exchangedPositionSize > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
                      {record.exchangedPositionSize > 0 ? 'LONG' : 'SHORT'}
                    </span>
                  </div>,
                  <span className="text-highEmphasis">{getTradingActionTypeFromAPI({ type: '', collateralChange: 0, ...record })}</span>,

                  <SmallPriceIcon priceValue={record.positionNotional.toFixed(2)} />,
                  <SmallPriceIcon priceValue={record.spotPrice.toFixed(2)} />,
                  <div
                    className="relative cursor-pointer overflow-x-hidden text-ellipsis"
                    onClick={() => router.push(`/userprofile/${record.userAddress}`)}>
                    <span className="market_user cursor-pointer">
                      {trimString(record.userId, 10) || walletAddressToShow(record.userAddress)}
                    </span>
                    {address === record.userAddress ? (
                      <span
                        className="absolute right-0 top-[1px] ml-1 rounded-sm
                    bg-[#E06732] p-[2px] align-middle text-[8px] font-extrabold text-highEmphasis">
                        YOU
                      </span>
                    ) : null}
                  </div>,
                  <ExplorerButton txHash={record.txHash} />
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
    </div>
  );
};

const SpotTable = ({ amm }: { amm: AMM }) => {
  const { address } = useAccount();
  const openseaData = useOpenSeaData(amm);

  return (
    <div className="h-full">
      <div className="mx-[46px]">
        <Cell
          items={['Time', 'Item', 'Price', '']}
          classNames={[
            'col-span-3 text-[12px]',
            'col-span-4 px-3 text-[12px]',
            'col-span-4 px-3 text-[12px]',
            'col-span-1 px-3 text-[12px]'
          ]}
        />
      </div>

      <div className="scrollable mr-1 h-full overflow-y-scroll pl-[46px] pr-[42px]">
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
              if (firebaseAnalytics && address) {
                logEvent(firebaseAnalytics, 'tribedetail_spottransaction_etherscan_pressed', {
                  wallet: address.substring(2),
                  transaction: transactionHash.substring(2),
                  token: assetToken,
                  collection: amm // from tokenRef.current
                });
              }
              if (address) {
                apiConnection.postUserEvent(
                  'tribedetail_spottransaction_etherscan_pressed',
                  {
                    page: 'Trade',
                    transaction: transactionHash.substring(2),
                    token: assetToken,
                    collection: amm // from tokenRef.current
                  },
                  address
                );
              }
            };
            const assetCreationDate = !asset ? asset_bundle.assets[0].created_date : asset.created_date;
            const priceValue = !total_price
              ? '0.00'
              : localeConversion(isUSDC ? formatBigIntString(total_price, 6).toFixed(2) : formatBigIntString(total_price).toFixed(2));
            const key_value = assetCreationDate + event_timestamp + assetToken;

            return (
              <Cell
                classNames={['col-span-3 px-3', 'col-span-4 px-3', 'col-span-4 px-3', 'col-span-1 px-3']}
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
                  <a
                    href={`https://etherscan.io/tx/${transactionHash}`}
                    className="cursor-pointer"
                    target="_blank"
                    rel="noreferrer"
                    onClick={getAnalyticsSpotEthers}>
                    <Image src="/images/common/out.svg" className="out-link-icon" alt="" width={20} height={20} />
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
    </div>
  );
};

const FundingPaymentHistory = ({ amm }: { amm: AMM }) => {
  const fundingPaymentHistory = useFundingRatesHistory(amm);

  return fundingPaymentHistory !== null ? (
    <div className="h-full">
      <div className="mx-[46px]">
        <Cell
          items={['Time', 'Funding Rate (LONG)', 'Funding Rate (SHORT)']}
          classNames={['col-span-4 text-[12px]', 'col-span-4 px-3 text-[12px]', 'col-span-4 px-3 text-[12px]']}
        />
      </div>

      <div className="scrollable mr-1 h-full overflow-y-scroll pl-[46px] pr-[42px]">
        {fundingPaymentHistory && fundingPaymentHistory.length > 0 ? (
          fundingPaymentHistory.map(({ timestamp, rateLong, rateShort } /* index */) => (
            <Cell
              key={`funding_${timestamp}`}
              items={[
                <div className="time relative text-[12px]">
                  <div className="absolute left-[-12px] top-0 mt-[-8px] h-[34px] w-[3px] rounded-[30px] bg-primaryBlue" />
                  {formatDateTime(timestamp)}
                </div>,
                <div>{`${rateLong > 0 ? '-' : '+'}${Math.abs(rateLong * 100).toFixed(4)} %`}</div>,
                <div>{`${rateShort > 0 ? '+' : '-'}${Math.abs(rateShort * 100).toFixed(4)} %`}</div>
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
    </div>
  ) : null;
};

function TribeDetailComponents(props: any) {
  const { activeTab } = props;
  const currentAmm = useNanostore($currentAmm);

  if (!currentAmm) return null;

  return (
    <>
      <div className={`${activeTab === 0 ? 'block' : 'hidden'} h-[86%] overflow-hidden`}>
        <MarketTrade amm={currentAmm} />
      </div>
      <div className={`${activeTab === 1 ? 'block' : 'hidden'} h-[86%] overflow-hidden`}>
        <SpotTable amm={currentAmm} />
      </div>
      <div className={`${activeTab === 2 ? 'block' : 'hidden'} h-[86%] overflow-hidden`}>
        <FundingPaymentHistory amm={currentAmm} />
      </div>
    </>
  );
}
export default TribeDetailComponents;
