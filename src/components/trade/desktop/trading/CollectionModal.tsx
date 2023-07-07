/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import { localeConversion } from '@/utils/localeConversion';
import { CollectionOverview, useMarketOverview } from '@/hooks/market';
import { getCollectionInformation } from '@/const/collectionList';
import { $marketUpdateTrigger } from '@/stores/trading';
import { useStore as useNanostore } from '@nanostores/react';
import SortingIndicator from '@/components/common/SortingIndicator';

const CollectionModal = (props: any) => {
  const { setVisible, selectCollection } = props;
  const marketUpdateTrigger = useNanostore($marketUpdateTrigger);
  const { isLoading, data: overviewData } = useMarketOverview();
  const [periodIndex, setPeriodIndex] = useState(0);
  const initSorting = { collection: 0, vammPrice: 0, priceGap: 0, timeChange: 0, dayVolume: 1, fundingRate: 0, timeValue: 0 };
  const [positionSorting, setPositionSorting] = useState(initSorting);
  const [sortedData, setSortedData] = useState(overviewData);

  const updateOverviewData = () => $marketUpdateTrigger.set(!marketUpdateTrigger);

  useEffect(() => {
    if (overviewData) {
      const temp = [...overviewData];
      const { dayVolume, fundingRate, vammPrice, priceGap, timeValue } = positionSorting;
      if (dayVolume !== 0) {
        const tempSort = temp.sort((a: any, b: any) => {
          const dayVol = a.volume - b.volume;
          return dayVolume === 1 ? -dayVol : dayVol;
        });
        setSortedData(tempSort);
      }
      if (fundingRate !== 0) {
        const tempSort = temp.sort((a: any, b: any) => {
          const fundRate = a.fundingRate - b.fundingRate;
          return fundingRate === 1 ? -fundRate : fundRate;
        });
        setSortedData(tempSort);
      }
      if (vammPrice !== 0) {
        const tempSort = temp.sort((a: any, b: any) => {
          const futPrice = a.vammPrice - b.vammPrice;
          return vammPrice === 1 ? -futPrice : futPrice;
        });
        setSortedData(tempSort);
      }
      if (priceGap !== 0) {
        const tempSort = temp.sort((a: any, b: any) => {
          const avAMMPrice = !a.vammPrice ? 0 : a.vammPrice;
          const aoraclePrice = !a.oraclePrice ? 0 : a.oraclePrice;
          const bvAMMPrice = !b.vammPrice ? 0 : b.vammPrice;
          const boraclePrice = !b.oraclePrice ? 0 : b.oraclePrice;
          const apGap = avAMMPrice && aoraclePrice ? avAMMPrice / aoraclePrice - 1 : 0;
          const bpGap = bvAMMPrice && boraclePrice ? bvAMMPrice / boraclePrice - 1 : 0;
          const pGap = apGap - bpGap;
          return priceGap === 1 ? -pGap : pGap;
        });
        setSortedData(tempSort);
      }
      if (timeValue !== 0) {
        let tempSort = [];
        switch (periodIndex) {
          case 0:
            tempSort = temp.sort((a: any, b: any) => {
              const timeVal = a.priceChangeRatio24h - b.priceChangeRatio24h;
              return timeValue === 1 ? -timeVal : timeVal;
            });
            break;

          case 1:
            tempSort = temp.sort((a: any, b: any) => {
              const timeVal = a.priceChangeRatio7d - b.priceChangeRatio7d;
              return timeValue === 1 ? -timeVal : timeVal;
            });
            break;

          case 2:
            tempSort = temp.sort((a: any, b: any) => {
              const timeVal = a.priceChangeRatio30d - b.priceChangeRatio30d;
              return timeValue === 1 ? -timeVal : timeVal;
            });
            break;

          default:
            tempSort = temp.sort((a: any, b: any) => {
              const timeVal = a.priceChangeRatio24h - b.priceChangeRatio24h;
              return timeValue === 1 ? -timeVal : timeVal;
            });
            break;
        }
        setSortedData(tempSort);
      }
    }
  }, [positionSorting, periodIndex, overviewData]);

  const renderData = () =>
    sortedData &&
    sortedData.map((tradingData: CollectionOverview, index: any) => {
      const targetCollection = getCollectionInformation(tradingData.amm);
      const { logo, amm: collection, collectionName, displayCollectionPair } = targetCollection;

      const vAMMPrice = !tradingData.vammPrice ? 0 : tradingData.vammPrice;
      const oraclePrice = !tradingData.oraclePrice ? 0 : tradingData.oraclePrice;
      const priceGap = vAMMPrice && oraclePrice ? vAMMPrice / oraclePrice - 1 : 0;
      const priceGapPercentage = priceGap * 100;

      const changed24h = tradingData.priceChange24h ? (
        <p className={`${tradingData.priceChange24h > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
          {tradingData.priceChange24h > 0 ? '+' : '-'}
          {Math.abs(Number(tradingData.priceChange24h?.toFixed(2)))}({Math.abs(Number(tradingData.priceChangeRatio24h?.toFixed(2)))}%)
        </p>
      ) : null;

      const changed7d = tradingData.priceChange7d ? (
        <p className={`${tradingData.priceChange7d > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
          {tradingData.priceChange7d > 0 ? '+' : '-'}
          {Math.abs(Number(tradingData.priceChange7d?.toFixed(2)))}({Math.abs(Number(tradingData.priceChangeRatio7d?.toFixed(2)))}%)
        </p>
      ) : null;

      const changed30d = tradingData.priceChange30d ? (
        <p className={`${tradingData.priceChange30d > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
          {tradingData.priceChange30d > 0 ? '+' : '-'}
          {Math.abs(Number(tradingData.priceChange30d?.toFixed(2)))}({Math.abs(Number(tradingData.priceChangeRatio30d?.toFixed(2)))}%)
        </p>
      ) : null;

      const priceGapElement = (
        <div className="flex items-center">
          <div className="mr-[6px]">
            <Image width={16} height={16} src="/images/common/symbols/eth-tribe3.svg" alt="" />
          </div>
          {`${priceGapPercentage > 0 ? '+' : ''}${(vAMMPrice - oraclePrice).toFixed(2)} (${Math.abs(priceGapPercentage).toFixed(2)}%)`}
        </div>
      );

      return (
        <div
          className={`flex cursor-pointer flex-row px-9 py-[11px]
            ${index % 2 === 0 ? 'bg-[#1c1d3f]' : 'bg-lightBlue'}
            ${index === sortedData.length - 1 ? 'rounded-b-[12px]' : ''}
          `}
          key={collection}
          onClick={() => {
            selectCollection(collection);
            setVisible(false);
          }}>
          <div className="w-[240px]">
            <div className="flex">
              <div className="w-[36px]">
                <Image src={logo} width={36} height={36} alt="" />
              </div>
              <div className="ml-[6px]">
                <p className="mb-1 text-[14px] text-highEmphasis">{collectionName}</p>
                <p className="text-[12px]">{displayCollectionPair}</p>
              </div>
            </div>
          </div>
          <div className="w-[130px]">
            <PriceWithIcon priceValue={localeConversion(vAMMPrice, 2)} />
            <p className="ml-[22px] mt-1 text-[12px]">{localeConversion(oraclePrice, 2)}</p>
          </div>
          <div className="w-[140px] text-highEmphasis">{priceGapElement}</div>
          <div className="w-[110px] text-right">
            {periodIndex === 0 ? changed24h : null}
            {periodIndex === 1 ? changed7d : null}
            {periodIndex === 2 ? changed30d : null}
          </div>
          <div className="flex w-[140px] items-start justify-end">
            <PriceWithIcon priceValue={tradingData.volume?.toFixed(2)} className="justify-content-end" />
          </div>
          <div className="font-400 w-[140px] text-right text-[12px] text-highEmphasis">
            <div className="mb-1">
              Long{' '}
              <span className={tradingData.fundingRateLong && tradingData.fundingRateLong > 0 ? 'text-marketRed' : 'text-marketGreen'}>
                {tradingData.fundingRateLong && tradingData.fundingRateLong > 0 ? 'Pay' : 'Get'}
              </span>{' '}
              {`${Math.abs(Number(Number(tradingData.fundingRateLong?.toFixed(5)) * 100)).toFixed(3)}%`}
            </div>
            <div>
              Short{' '}
              <span className={tradingData.fundingRateLong && tradingData.fundingRateLong > 0 ? 'text-marketGreen' : 'text-marketRed'}>
                {tradingData.fundingRateLong && tradingData.fundingRateLong > 0 ? 'Get' : 'Pay'}
              </span>{' '}
              {`${Math.abs(Number(Number(tradingData.fundingRateShort?.toFixed(5)) * 100)).toFixed(3)}%`}
            </div>
          </div>
        </div>
      );
    });

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-10 h-full w-full
       bg-black/[.2] backdrop-blur-[4px]"
      onClick={() => {
        setVisible(false);
      }}>
      <div
        className="relative mx-auto mt-[80px] max-w-[940px]
          rounded-[12px] border-[1px] border-[#a8cbff]/[.22] bg-darkBlue text-[14px]
          font-normal leading-[17px] text-mediumEmphasis"
        onClick={e => {
          e.stopPropagation();
        }}>
        <div className="p-6">
          <div className="flex flex-1 space-x-[9px]">
            <p
              className="text-[20px] font-semibold
                leading-[24px] text-highEmphasis">
              Collections
            </p>
            <Image className="cursor-pointer" src="/images/common/refresh.svg" width={24} height={24} alt="" onClick={updateOverviewData} />
          </div>
          <div className="absolute right-6 top-6 cursor-pointer" onClick={() => setVisible(false)}>
            <Image src="/images/components/common/modal/close.svg" width={16} height={16} alt="" />
          </div>
        </div>
        <div className="rounded-b-[12px]">
          <div className="collection-table">
            <div className="text-normal px-9 pb-6 text-[14px] leading-[17px]">
              <div className="trow flex flex-row">
                <div className="w-[240px]">Collection</div>
                <div
                  className="w-[130px] cursor-pointer"
                  onClick={() => setPositionSorting({ ...initSorting, vammPrice: (positionSorting.vammPrice + 1) % 3 })}>
                  <div className="mb-1 flex">
                    vAMM Price <SortingIndicator value={positionSorting.vammPrice} />
                  </div>
                  <p>Oracle Price</p>
                </div>
                <div
                  className="w-[140px] cursor-pointer"
                  onClick={() => setPositionSorting({ ...initSorting, priceGap: (positionSorting.priceGap + 1) % 3 })}>
                  <div className="mb-1 flex">
                    vAMM-Oracle <SortingIndicator value={positionSorting.priceGap} />
                  </div>
                  <p>Price Gap</p>
                </div>
                <div className="w-[110px] cursor-pointer">
                  <div
                    className="mb-1 flex justify-end"
                    onClick={() => setPositionSorting({ ...initSorting, timeValue: (positionSorting.timeValue + 1) % 3 })}>
                    Change <SortingIndicator value={positionSorting.timeValue} />
                  </div>
                  <div className="text-right">
                    <span
                      onClick={() => {
                        setPositionSorting({ ...initSorting });
                        setPeriodIndex(0);
                      }}
                      className={`font-medium
                        ${periodIndex === 0 ? 'text-highEmphasis underline' : 'text-primaryBlue'}`}>
                      24hr
                    </span>
                    <span
                      onClick={() => {
                        setPositionSorting({ ...initSorting });
                        setPeriodIndex(1);
                      }}
                      className={`ml-1 font-medium
                        ${periodIndex === 1 ? 'text-highEmphasis underline' : 'text-primaryBlue'}`}>
                      7D
                    </span>
                    <span
                      onClick={() => {
                        setPositionSorting({ ...initSorting });
                        setPeriodIndex(2);
                      }}
                      className={`ml-1 font-medium
                        ${periodIndex === 2 ? 'text-highEmphasis underline' : 'text-primaryBlue'}`}>
                      30D
                    </span>
                  </div>
                </div>
                <div
                  className="w-[140px] cursor-pointer pl-[12px]"
                  onClick={() => setPositionSorting({ ...initSorting, dayVolume: (positionSorting.dayVolume + 1) % 3 })}>
                  <div className="mb-1 flex justify-end">
                    24hr Volume <SortingIndicator value={positionSorting.dayVolume} />
                  </div>
                </div>
                <div className="w-[140px] text-right">Funding Rate</div>
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                  <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
                </div>
              ) : (
                renderData()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;
