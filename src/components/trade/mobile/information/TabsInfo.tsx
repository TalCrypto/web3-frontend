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
import { getTradingActionType } from '@/utils/actionType';
import { trimString } from '@/utils/string';

import { formatDateTime, formatDateTimeFromString } from '@/utils/date';

import { /* PriceWithIcon, */ PriceWithUsdc } from '@/components/common/PricWithIcon';

import { useStore as useNanostore } from '@nanostores/react';
import { tsMarketHistory, tsFundingPaymentHistory, tsSportPriceList } from '@/stores/TradeInformation';
import { wsCurrentToken, wsFullWalletAddress } from '@/stores/WalletState';
import { walletProvider } from '@/utils/walletProvider';

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
  const { items, classNames, isHeader } = props;
  return (
    <div
      className={`relative mb-6 grid grid-cols-12 whitespace-break-spaces
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
      <Image alt="" src="/images/common/out.svg" onClick={getAnalyticsMktEtherscan} width={16} height={16} />
    </a>
  );
}

const MarketTrade = (props: any) => {
  const router = useRouter();
  const marketHistory = useNanostore(tsMarketHistory);
  const [displayCount, setDisplayCount] = useState(10);
  const fullWalletAddress = useNanostore(wsFullWalletAddress);

  const walletAddressToShow = (addr: any) => {
    if (!addr) {
      return '';
    }
    return `${addr.substring(0, 7)}...${addr.slice(-3)}`;
  };

  return (
    <>
      <div className="mx-[20px]">
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
          classNames={['col-span-4', 'col-span-3 pl-1 pr-3', 'col-span-5 pl-6', '']}
          isHeader
        />

        {marketHistory && marketHistory.length > 0 ? (
          marketHistory
            .slice(0, displayCount > marketHistory.length ? marketHistory.length : displayCount)
            .map(({ timestamp, exchangedPositionSize, positionNotional, spotPrice, userAddress, userId, txHash }, index) => (
              <div
                className={`relative mb-6 grid grid-cols-12 items-center
                whitespace-break-spaces text-[12px] text-mediumEmphasis`}
                key={`market_${timestamp}_${index}`}>
                <div className="time relative col-span-4 border-l-[2px] border-primaryBlue pl-2">
                  <span>{formatDateTime(timestamp)}</span>
                  <div className="h-[6px] w-full" />
                  <div className="max-w-[100px] overflow-x-hidden text-ellipsis">
                    <span className="market_user " onClick={() => router.push(`/userprofile/${userAddress}`)}>
                      {trimString(userId, 10) || walletAddressToShow(userAddress) || ' '}
                    </span>
                    {fullWalletAddress === userAddress ? (
                      <span className="ml-1 rounded-sm bg-[#E06732] p-[2px] align-middle text-[8px] font-extrabold text-highEmphasis">
                        YOU
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-span-4">
                  <span className={`market ${isPositive(exchangedPositionSize) ? 'text-marketGreen' : 'text-marketRed'}`}>
                    {isPositive(exchangedPositionSize) ? 'LONG' : 'SHORT'}
                  </span>
                  <div className="h-[6px] w-full" />
                  <span className="text-highEmphasis">{getTradingActionType(marketHistory[index])}</span>
                </div>
                <div className="col-span-3 pl-2">
                  <SmallPriceIcon priceValue={formatterValue(positionNotional, 2)} />
                  <div className="h-[6px] w-full" />
                  <SmallPriceIcon priceValue={formatterValue(spotPrice, 2)} />
                </div>

                <div className="col-span-1 flex justify-end">
                  <ExplorerButton txHash={txHash} />
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
                // logHelper('overview_show_more_pressed', holderAddress, { collection });
                setDisplayCount(displayCount + 5);
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
  const openseaData = useNanostore(tsSportPriceList);
  const fullWalletAddress = useNanostore(wsFullWalletAddress);
  const currentToken = useNanostore(wsCurrentToken);

  return (
    <>
      <div className="mx-[20px]">
        <Cell items={['Time', 'Item', 'Price', '']} classNames={['col-span-4 px-3', 'col-span-4 px-2 ', 'col-span-3 px-1', 'col-span-1']} />
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
                classNames={['col-span-4', 'col-span-4 px-2 text-[14px]', 'col-span-3 px-1', 'col-span-1 flex justify-end']}
                key={`spot_${key_value}`}
                items={[
                  <div className="relative border-l-[2px] border-primaryBlue px-3">{formatDateTimeFromString(event_timestamp)}</div>,
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
                  <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noreferrer" onClick={getAnalyticsSpotEthers}>
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
                // logHelper('overview_show_more_pressed', holderAddress, { collection });
                setDisplayCount(displayCount + 5);
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
  const fundingPaymentHistory = useNanostore(tsFundingPaymentHistory);
  const [displayCount, setDisplayCount] = useState(10);

  return fundingPaymentHistory !== null ? (
    <>
      <div className="scrollable mx-[20px] h-full overflow-y-scroll">
        <Cell items={['Time', 'Funding Rate Long / Short']} classNames={['col-span-4 px-3', 'col-span-8 text-right']} />
        {fundingPaymentHistory && fundingPaymentHistory.length > 0 ? (
          fundingPaymentHistory
            .slice(0, displayCount > fundingPaymentHistory.length ? fundingPaymentHistory.length : displayCount)
            .map(({ timestamp, rateLong, rateShort } /* index */) => (
              <Cell
                key={`funding_${timestamp}`}
                items={[
                  <div className="time border-l-[2px] border-primaryBlue px-3">{formatDateTime(timestamp)}</div>,
                  <div>
                    <span className={`${rateLong > 0 ? 'text-marketRed' : 'text-marketGreen'}`}>
                      {`${rateLong > 0 ? '-' : '+'}${Math.abs(Number(formatterValue(rateLong * 100, 5))).toFixed(5)} %`}
                    </span>{' '}
                    <span className="text-highEmphasis">/&nbsp;</span>
                    <span className={`${rateShort > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
                      {`${rateShort > 0 ? '+' : '-'}${Math.abs(Number(formatterValue(rateShort * 100, 5))).toFixed(5)} %`}
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
                // logHelper('overview_show_more_pressed', holderAddress, { collection });
                setDisplayCount(displayCount + 5);
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
