/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { utils } from 'ethers';
import Image from 'next/image';
import { PriceWithIcon } from '@/components/common/PricWithIcon';
import { calculateNumber } from '@/utils/calculateNumbers';
import { localeConversion } from '@/utils/localeConversion';
import { useStore as useNanostore } from '@nanostores/react';
import { wsIsLogin, wsIsWrongNetwork } from '@/stores/WalletState';
import { CollectionOverview, useMarketOverview } from '@/hooks/market';
import { getCollectionInformation } from '@/const/collectionList';

const SortingIndicator = ({ value }: { value: number }) => (
  <Image
    className="icon"
    alt=""
    width={16}
    height={16}
    src={value === 0 ? '/images/common/no_sort.svg' : value === 1 ? '/images/common/sort_up.svg' : '/images/common/sort_down.svg'}
  />
);

const CollectionModal = (props: any) => {
  const { visible, setVisible, selectCollection } = props;
  const [trigerUpdate, setTriggerUpdate] = useState(false);
  const { isLoading, data: overviewData } = useMarketOverview(trigerUpdate);
  const [periodIndex, setPeriodIndex] = useState(0);
  const initSorting = { collection: 0, vammPrice: 0, priceGap: 0, timeChange: 0, dayVolume: 1, fundingRate: 0, timeValue: 0 };
  const [positionSorting, setPositionSorting] = useState(initSorting);
  const [sortedData, setSortedData] = useState(overviewData);

  const updateOverviewData = () => setTriggerUpdate(state => !state);

  useEffect(() => {
    if (overviewData) {
      const temp = [...overviewData];
      const { dayVolume } = positionSorting;
      setSortedData(temp);
      if (dayVolume !== 0) {
        const tempSort = temp.sort((a: any, b: any) => {
          const dayVol = a.volume - b.volume;
          return -dayVol;
        });
        setSortedData(tempSort);
      }
    }
  }, [overviewData, positionSorting]);

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

  if (!visible) return null;

  const renderData = () =>
    sortedData &&
    sortedData.map((tradingData: CollectionOverview, index: any) => {
      const targetCollection = getCollectionInformation(tradingData.amm);
      const { logo, collection, collectionName, displayCollectionPair } = targetCollection;

      const vAMMPrice = !tradingData.vammPrice ? 0 : Number(utils.formatEther(tradingData.vammPrice));
      const oraclePrice = !tradingData.oraclePrice ? 0 : Number(utils.formatEther(tradingData.oraclePrice));
      const priceGap = vAMMPrice && oraclePrice ? vAMMPrice / oraclePrice - 1 : 0;
      const priceGapPercentage = priceGap * 100;

      const changed24h = (
        <p className={`${Number(calculateNumber(tradingData.priceChangeRatio24h, 2)) > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
          {Number(calculateNumber(tradingData.priceChangeRatio24h, 2)) > 0 ? '+' : '-'}
          {Math.abs(Number(calculateNumber(tradingData.priceChange24h, 2)))}(
          {Math.abs(Number(calculateNumber(tradingData.priceChangeRatio24h, 2)))}%)
        </p>
      );

      const changed7d = (
        <p className={`${Number(calculateNumber(tradingData.priceChangeRatio7d, 2)) > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
          {Number(calculateNumber(tradingData.priceChangeRatio7d, 2)) > 0 ? '+' : '-'}
          {Math.abs(Number(calculateNumber(tradingData.priceChange7d, 2)))}(
          {Math.abs(Number(calculateNumber(tradingData.priceChangeRatio7d, 2)))}%)
        </p>
      );

      const changed30d = (
        <p className={`${Number(calculateNumber(tradingData.priceChangeRatio30d, 2)) > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
          {Number(calculateNumber(tradingData.priceChangeRatio30d, 2)) > 0 ? '+' : '-'}
          {Math.abs(Number(calculateNumber(tradingData.priceChange30d, 2)))}(
          {Math.abs(Number(calculateNumber(tradingData.priceChangeRatio30d, 2)))}%)
        </p>
      );

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
          className={`flex flex-row p-3
            ${index % 2 === 0 ? 'bg-[#1c1d3f]' : 'bg-lightBlue'}
          `}
          key={collection}
          onClick={() => {
            selectCollection(collection);
            setVisible(false);
          }}>
          <div className="flex-1 basis-1/4 px-[18px]">
            <div className="flex">
              <div>
                <Image src={logo} width="24" height="24" alt="" />
              </div>
              <div className="ml-[6px]">
                <p className="mb-1 text-[14px] text-highEmphasis">{collectionName}</p>
                <p className="text-[12px]">{displayCollectionPair}</p>
              </div>
            </div>
          </div>
          <div className="basis-1/5 px-[18px]">
            <PriceWithIcon priceValue={localeConversion(vAMMPrice, 2)} />
            <p className="ml-[22px] mt-1 text-[12px]">{localeConversion(oraclePrice, 2)}</p>
          </div>
          <div className="basis-1/4 px-[18px] text-highEmphasis">{priceGapElement}</div>
          <div className="basis-1/6 px-[18px] text-right">
            {periodIndex === 0 ? changed24h : null}
            {periodIndex === 1 ? changed7d : null}
            {periodIndex === 2 ? changed30d : null}
          </div>
          <div className="flex basis-1/6 items-start justify-end px-[18px]">
            <PriceWithIcon priceValue={calculateNumber(tradingData.volume, 2)} className="justify-content-end" />
          </div>
          <div className="font-400 basis-1/5 px-[18px] text-right text-[12px] text-highEmphasis">
            <div>
              Long{' '}
              <span className={Number(calculateNumber(tradingData.fundingRateLong, 5)) > 0 ? 'text-marketRed' : 'text-marketGreen'}>
                {Number(calculateNumber(tradingData.fundingRateLong, 5)) > 0 ? 'Pay' : 'Get'}
              </span>{' '}
              {`${Math.abs(Number(Number(calculateNumber(tradingData.fundingRateLong, 5)) * 100)).toFixed(3)}%`}
            </div>
            <div>
              Short{' '}
              <span className={Number(calculateNumber(tradingData.fundingRateLong, 5)) > 0 ? 'text-marketGreen' : 'text-marketRed'}>
                {Number(calculateNumber(tradingData.fundingRateLong, 5)) > 0 ? 'Get' : 'Pay'}
              </span>{' '}
              {`${Math.abs(Number(Number(calculateNumber(tradingData.fundingRateShort, 5)) * 100)).toFixed(3)}%`}
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
        className="relative mx-auto mt-[80px] h-[600px] max-w-[940px]
          rounded-[12px] border-[1px] border-[#a8cbff]/[.22] bg-[#0c0d20] text-[14px]
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
            <Image className="cursor-pointer" src="/images/common/refresh.svg" width="24" height="24" alt="" onClick={updateOverviewData} />
          </div>
          <div className="absolute right-6 top-6 cursor-pointer" onClick={() => setVisible(false)}>
            <Image src="/images/components/common/modal/close.svg" width="16" height="16" alt="" />
          </div>
        </div>
        <div className="body">
          <div className="collection-table">
            <div className="text-normal px-3 pb-6 text-[14px] leading-[17px]">
              <div className="trow flex flex-row">
                <div className="flex-1 basis-1/4 px-[18px]">Collection</div>
                <div
                  className="basis-1/5 cursor-pointer px-[18px]"
                  onClick={() => setPositionSorting({ ...initSorting, vammPrice: (positionSorting.vammPrice + 1) % 3 })}>
                  <div className="flex">
                    vAMM Price <SortingIndicator value={positionSorting.vammPrice} />
                  </div>
                  <p>Oracle Price</p>
                </div>
                <div
                  className="basis-1/4 cursor-pointer px-[18px]"
                  onClick={() => setPositionSorting({ ...initSorting, priceGap: (positionSorting.priceGap + 1) % 3 })}>
                  <div className="flex">
                    vAMM-Oracle <SortingIndicator value={positionSorting.priceGap} />
                  </div>
                  <p>Price Gap</p>
                </div>
                <div className="basis-1/6 cursor-pointer px-[18px]">
                  <div
                    className="flex text-right"
                    onClick={() => setPositionSorting({ ...initSorting, timeValue: (positionSorting.timeValue + 1) % 3 })}>
                    Change <SortingIndicator value={positionSorting.timeValue} />
                  </div>
                  <div className="change-period">
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
                  className="basis-1/6 cursor-pointer px-[18px] text-right"
                  onClick={() => setPositionSorting({ ...initSorting, dayVolume: (positionSorting.dayVolume + 1) % 3 })}>
                  <div className="flex">
                    24hr Volume <SortingIndicator value={positionSorting.dayVolume} />
                  </div>
                </div>
                <div className="basis-1/5 px-[18px] text-right">Funding Rate</div>
              </div>
            </div>
            <div className="tbody">
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
