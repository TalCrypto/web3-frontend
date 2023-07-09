/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable operator-linebreak */
import React, { useEffect, useState } from 'react';
// import moment from 'moment';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { localeConversion } from '@/utils/localeConversion';
import { getTradingActionType } from '@/utils/actionType';
import { trimString } from '@/utils/string';

import { formatDateTime, formatDateTimeFromString } from '@/utils/date';

import { /* PriceWithIcon, */ PriceWithUsdc } from '@/components/common/PriceWithIcon';

import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm, $fundingRatesHistory, $futureMarketHistory, $spotMarketHistory } from '@/stores/trading';
import { formatBigInt } from '@/utils/bigInt';
import { $userAddress } from '@/stores/user';
import { ThreeDots } from 'react-loader-spinner';
import { SmallPriceIcon } from '@/components/portfolio/common/PriceLabelComponents';

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
  const { txHash } = props;
  const etherscanUrl = `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${txHash}`;

  return (
    <a href={etherscanUrl} target="_blank" rel="noreferrer" className="cursor-pointer">
      <Image alt="" src="/images/common/out.svg" width={16} height={16} />
    </a>
  );
}

const MarketTrade = () => {
  const router = useRouter();
  const marketHistory = useNanostore($futureMarketHistory);
  const address = useNanostore($userAddress);
  const [newAdded, setNewAdded] = useState(false);

  useEffect(() => {
    if (marketHistory && marketHistory.length > 0) {
      setNewAdded(true);
    }
    const timeout = setTimeout(() => setNewAdded(false), 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [marketHistory]);

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

      <div className="scrollable mr-1 h-[calc(100%-50px)] overflow-y-scroll">
        {!marketHistory ? (
          <div className="flex items-center justify-center" style={{ minHeight: '350px' }}>
            <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
          </div>
        ) : marketHistory.length > 0 ? (
          marketHistory
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((record, index) => (
              <div
                key={`market_trade_${index}`}
                className={`relative mb-1 grid grid-cols-12 items-center py-1 ${newAdded && record.isNew ? 'flash' : ''}
                  cursor-pointer pl-[46px] pr-[42px] text-[14px] text-mediumEmphasis
                  ${address === record.userAddress ? 'bg-secondaryBlue' : ''}
                `}
                onClick={() => router.push(`/userprofile/${record.userAddress}`)}>
                <div className="time relative col-span-3 pl-3">
                  <div className="absolute left-[-12px] top-0 mt-[3px] h-[34px] w-[3px] rounded-[30px] bg-primaryBlue" />

                  <span className="text-[12px]">{formatDateTime(record.timestamp, 'MM/DD/YYYY HH:mm')}</span>
                  <br />
                  <span className={`market ${record.exchangedPositionSize > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
                    {record.exchangedPositionSize > 0 ? 'LONG' : 'SHORT'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-highEmphasis">{getTradingActionType(record)}</span>
                </div>
                <div className="col-span-2">
                  <SmallPriceIcon priceValue={record.positionNotional.toFixed(4)} />
                </div>
                <div className="col-span-2">
                  <SmallPriceIcon priceValue={record.spotPrice.toFixed(2)} />
                </div>
                <div
                  className="relative col-span-2 flex cursor-pointer items-center"
                  onClick={() => router.push(`/userprofile/${record.userAddress}`)}>
                  <span className="market_user cursor-pointer overflow-x-hidden text-ellipsis">
                    {trimString(record.userId, 10) || walletAddressToShow(record.userAddress)}
                  </span>
                  {address === record.userAddress ? (
                    <span
                      className="absolute right-0 ml-1 rounded-sm bg-[#E06732] p-[2px]
                    align-middle text-[8px] font-extrabold text-highEmphasis">
                      YOU
                    </span>
                  ) : null}
                </div>
                <div className="col-span-1 px-3">
                  <ExplorerButton txHash={record.txHash} />
                </div>
              </div>
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

const SpotTable = () => {
  const openseaData = useNanostore($spotMarketHistory);

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

      <div className="scrollable mr-1 h-[calc(100%-50px)] overflow-y-scroll pl-[46px] pr-[42px]">
        {!openseaData ? (
          <div className="flex items-center justify-center" style={{ minHeight: '350px' }}>
            <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
          </div>
        ) : openseaData.length > 0 ? (
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
            const assetCreationDate = !asset ? asset_bundle.assets[0].created_date : asset.created_date;
            const priceValue = !total_price
              ? '0.00'
              : localeConversion(isUSDC ? formatBigInt(total_price, 6).toFixed(2) : formatBigInt(total_price).toFixed(2), 2, 2);
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
                  <a href={`https://etherscan.io/tx/${transactionHash}`} className="cursor-pointer" target="_blank" rel="noreferrer">
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

const FundingPaymentHistory = () => {
  const fundingPaymentHistory = useNanostore($fundingRatesHistory);

  return fundingPaymentHistory !== null ? (
    <div className="h-full">
      <div className="mx-[46px]">
        <Cell
          items={['Time', 'Funding Rate (LONG)', 'Funding Rate (SHORT)']}
          classNames={['col-span-4 text-[12px]', 'col-span-4 px-3 text-[12px]', 'col-span-4 px-3 text-[12px]']}
        />
      </div>

      <div className="scrollable mr-1 h-[calc(100%-50px)] overflow-y-scroll pl-[46px] pr-[42px]">
        {!fundingPaymentHistory ? (
          <div className="flex items-center justify-center" style={{ minHeight: '350px' }}>
            <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
          </div>
        ) : fundingPaymentHistory.length > 0 ? (
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
        <MarketTrade />
      </div>
      <div className={`${activeTab === 1 ? 'block' : 'hidden'} h-[86%] overflow-hidden`}>
        <SpotTable />
      </div>
      <div className={`${activeTab === 2 ? 'block' : 'hidden'} h-[86%] overflow-hidden`}>
        <FundingPaymentHistory />
      </div>
    </>
  );
}
export default TribeDetailComponents;
