/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
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

import { PriceWithUsdc } from '@/components/common/PriceWithIcon';
import { useStore as useNanostore } from '@nanostores/react';
import { $fundingRatesHistory, $futureMarketHistory, $spotMarketHistory } from '@/stores/trading';
import { $userAddress } from '@/stores/user';
import { formatBigInt } from '@/utils/bigInt';
import { ThreeDots } from 'react-loader-spinner';
import { SmallPriceIcon } from '@/components/portfolio/common/PriceLabelComponents';

function Cell(props: any) {
  const { items, classNames, isHeader } = props;
  return (
    <div
      className={`mb-6 grid grid-cols-12 whitespace-break-spaces
        text-[12px] text-mediumEmphasis
        ${isHeader ? 'font-normal' : 'items-center'}
      `}>
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
  const { txHash } = props;
  const etherscanUrl = `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${txHash}`;

  return (
    <a href={etherscanUrl} target="_blank" rel="noreferrer">
      <Image alt="" src="/images/common/out.svg" width={16} height={16} />
    </a>
  );
}

const MarketTrade = () => {
  const router = useRouter();
  const marketHistory = useNanostore($futureMarketHistory);
  const [displayCount, setDisplayCount] = useState(10);
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
    <>
      <div>
        <Cell
          items={[
            'User ID',
            <>
              Action /<br />
              Type
            </>,
            <>
              Notional Size /<br />
              Resulting Price
            </>,
            ''
          ]}
          classNames={['col-span-4 ml-8', 'col-span-3 pl-3 pr-3', 'col-span-5 pl-6', '']}
          isHeader
        />

        {!marketHistory ? (
          <div className="flex items-center justify-center" style={{ minHeight: '350px' }}>
            <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
          </div>
        ) : marketHistory.length > 0 ? (
          marketHistory.slice(0, displayCount > marketHistory.length ? marketHistory.length : displayCount).map((record, index) => (
            <div
              className={`mb-1 grid grid-cols-12 items-center whitespace-break-spaces
                  px-5 py-2 text-[12px] text-mediumEmphasis
                  ${address === record.userAddress ? 'bg-secondaryBlue' : ''}
                   ${newAdded && record.isNew ? 'flash' : ''}
                `}
              style={{ WebkitTransform: 'translate3d(0,0,0)' }}
              key={`market_${record.timestamp}_${index}`}
              onClick={() => router.push(`/userprofile/${record.userAddress}`)}>
              <div className="col-span-4 border-l-[2px] border-primaryBlue pl-2">
                <span>{formatDateTime(record.timestamp, 'MM/DD/YYYY HH:mm')}</span>
                <div className="h-[6px] w-full" />
                <div className="max-w-[100px] overflow-x-hidden text-ellipsis">
                  <span className="market_user " onClick={() => router.push(`/userprofile/${record.userAddress}`)}>
                    {trimString(record.userId, 10) || walletAddressToShow(record.userAddress)}
                  </span>
                </div>
              </div>
              <div className="col-span-5 pl-2">
                <span className={`market ${record.exchangedPositionSize > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
                  {record.exchangedPositionSize > 0 ? 'LONG' : 'SHORT'}
                </span>
                <div className="h-[6px] w-full" />
                <span className="text-highEmphasis">{getTradingActionType(marketHistory[index], true)}</span>
              </div>
              <div className="col-span-2 ml-[-16px]">
                <SmallPriceIcon priceValue={record.positionNotional.toFixed(4)} />
                <div className="h-[6px] w-full" />
                <SmallPriceIcon priceValue={record.spotPrice.toFixed(2)} />
              </div>

              <div className="col-span-1 flex justify-end">
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

      <div className="bg-darkBlue py-[35px] text-center">
        {marketHistory && marketHistory.length > 0 ? (
          displayCount >= marketHistory.length ? null : (
            <span
              className="text-center text-[14px] font-semibold text-primaryBlue"
              onClick={() => {
                setDisplayCount(displayCount + 15);
              }}>
              Show More
            </span>
          )
        ) : null}
      </div>
    </>
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

const SpotTable = () => {
  const [displayCount, setDisplayCount] = useState(10);
  const openseaData = useNanostore($spotMarketHistory);

  return (
    <>
      <div className="mx-[20px]">
        <Cell items={['Time', 'Item', 'Price', '']} classNames={['col-span-4 px-3', 'col-span-4 px-2 ', 'col-span-3 px-1', 'col-span-1']} />
        {!openseaData ? (
          <div className="flex items-center justify-center" style={{ minHeight: '350px' }}>
            <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
          </div>
        ) : openseaData.length > 0 ? (
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
            const assetToken = !asset ? asset_bundle.assetBundle_temp[0].token_id : asset.token_id;

            const assetCreationDate = !asset ? asset_bundle.assets[0].created_date : asset.created_date;
            const priceValue = !total_price
              ? '0.00'
              : localeConversion(isUSDC ? formatBigInt(total_price, 6).toFixed(2) : formatBigInt(total_price).toFixed(2), 2);
            const keyValue = assetCreationDate + event_timestamp + assetToken;

            return (
              <Cell
                classNames={['col-span-4', 'col-span-4 px-2 text-[14px]', 'col-span-3 px-1', 'col-span-1 flex justify-end']}
                key={`spot_${keyValue}`}
                items={[
                  <div className="border-l-[2px] border-primaryBlue px-3">{formatDateTimeFromString(event_timestamp)}</div>,
                  <div className="flex items-center text-[14px] text-[#6286e3]">
                    <Image src={src} className="mr-1 rounded-[5px]" alt="" width={16} height={16} />
                    {`#${assetToken}` || 'No Name'}
                  </div>,
                  <div className="price">
                    {isUSDC ? (
                      <PriceWithUsdc priceValue={priceValue} className="margin-16 font-400 text-[14px]" />
                    ) : (
                      <SmallPriceIcon priceValue={priceValue} />
                    )}
                  </div>,
                  <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noreferrer">
                    <Image src="/images/common/out.svg" className="out-link-icon" alt="" width={16} height={16} />
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

      <div className="bg-darkBlue py-[35px] text-center">
        {openseaData && openseaData.length > 0 ? (
          displayCount >= openseaData.length ? null : (
            <span
              className="text-center text-[14px] font-semibold text-primaryBlue"
              onClick={() => {
                setDisplayCount(displayCount + 15);
              }}>
              Show More
            </span>
          )
        ) : null}
      </div>
    </>
  );
};

const FundingPaymentHistory = () => {
  const fundingPaymentHistory = useNanostore($fundingRatesHistory);
  const [displayCount, setDisplayCount] = useState(10);

  return fundingPaymentHistory !== null ? (
    <>
      <div className="scrollable mx-[20px] h-full overflow-y-scroll">
        <Cell items={['Time', 'Funding Rate Long / Short']} classNames={['col-span-4 px-3', 'col-span-8 text-right']} />
        {!fundingPaymentHistory ? (
          <div className="flex items-center justify-center" style={{ minHeight: '350px' }}>
            <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
          </div>
        ) : fundingPaymentHistory.length > 0 ? (
          fundingPaymentHistory
            .slice(0, displayCount > fundingPaymentHistory.length ? fundingPaymentHistory.length : displayCount)
            .map(({ timestamp, rateLong, rateShort } /* index */) => (
              <Cell
                key={`funding_${timestamp}`}
                items={[
                  <div className="time border-l-[2px] border-primaryBlue px-3">{formatDateTime(timestamp)}</div>,
                  <div>
                    <span className={`${rateLong > 0 ? 'text-marketRed' : 'text-marketGreen'}`}>
                      {`${rateLong > 0 ? '-' : '+'}${Math.abs(rateLong * 100).toFixed(5)} %`}
                    </span>{' '}
                    <span className="text-highEmphasis">/&nbsp;</span>
                    <span className={`${rateShort > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
                      {`${rateShort > 0 ? '+' : '-'}${Math.abs(rateShort * 100).toFixed(5)} %`}
                    </span>
                  </div>
                ]}
                classNames={['col-span-4', `col-span-8 text-right text-[14px]}`]}
              />
            ))
        ) : (
          <div className="item-center flex justify-center">
            <span className="body1 my-40 text-center text-mediumEmphasis">You have no funding payment history.</span>
          </div>
        )}
      </div>

      <div className="bg-darkBlue py-[35px] text-center">
        {fundingPaymentHistory && fundingPaymentHistory.length > 0 ? (
          displayCount >= fundingPaymentHistory.length ? null : (
            <span
              className="text-center text-[14px] font-semibold text-primaryBlue"
              onClick={() => {
                setDisplayCount(displayCount + 15);
              }}>
              Show More
            </span>
          )
        ) : null}
      </div>
    </>
  ) : null;
};

function TabsInfo(props: any) {
  const { activeTab } = props;

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
