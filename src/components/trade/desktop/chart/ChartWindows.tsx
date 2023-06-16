/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';

import { logEvent } from 'firebase/analytics';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';

import { PriceWithIcon } from '@/components/common/PricWithIcon';
import { firebaseAnalytics } from '@/const/firebaseConfig';

import { AMM, getCollectionInformation } from '@/const/collectionList';

import TitleTips from '@/components/common/TitleTips';
import { apiConnection } from '@/utils/apiConnection';

import Tooltip from '@/components/common/Tooltip';
import { Address } from 'wagmi';
import { $collectionConfig, $currentAmm, $selectedTimeIndex } from '@/stores/trading';
import { useChartData, useTradingData } from '@/hooks/collection';

const flashAnim = 'flash';

function SmallPriceIcon(props: any) {
  const { priceValue = 0, className = '', iconSize = 16, isLoading = false } = props;
  return (
    <div className={`flex items-center space-x-[6px] text-[14px] text-highEmphasis ${className}`}>
      <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={iconSize} height={iconSize} />
      <span className={`${isLoading ? 'flash' : ''}`}>{priceValue}</span>
    </div>
  );
}

const ChartDisplay = dynamic(() => import('./chartDisplay'), {
  ssr: false
});

function PriceIndicator(props: { isStartLoadingChart: boolean; priceChangeValue: number; priceChangeRatio: number }) {
  const { priceChangeValue, priceChangeRatio, isStartLoadingChart } = props;

  return isStartLoadingChart || !priceChangeValue || !priceChangeRatio ? (
    <div
      className={`my-[11px] ml-3 mr-4 flex h-[32px] items-center rounded-full border-[1px]
        text-center text-[15px] font-semibold leading-[18px]
        ${priceChangeRatio && priceChangeRatio > 0 ? 'border-marketGreen text-marketGreen' : 'border-marketRed text-marketRed'}`}>
      <div className="col mx-4 my-auto flex items-center">
        <div className="col my-auto">-.-- (-.-- %)</div>
      </div>
    </div>
  ) : (
    <div
      className={`my-[11px] ml-3 mr-4 flex h-[32px] items-center rounded-full border-[1px]
        text-center text-[15px] font-semibold leading-[18px]
        ${priceChangeRatio > 0 ? 'border-marketGreen text-marketGreen' : 'border-marketRed text-marketRed'}`}>
      <Image
        alt="Polygon_pos"
        src={priceChangeRatio > 0 ? '/images/components/trade/chart/polygon_pos.svg' : '/images/components/trade/chart/polygon_neg.svg'}
        className="ml-4 mr-2"
        width={16}
        height={16}
      />
      <div>
        <div className="mr-4">
          {priceChangeValue.toFixed(2)}
          {`${priceChangeRatio.toFixed(2)}%`}
        </div>
      </div>
    </div>
  );
}

function chartButtonLogged(index: any, fullWalletAddress: Address, currentAmm: AMM) {
  const eventName = ['btnDay_pressed', 'btnWeek_pressed', 'btnMonth_pressed'][index];

  if (firebaseAnalytics) {
    logEvent(firebaseAnalytics, eventName, {
      wallet: fullWalletAddress.substring(2),
      collection: currentAmm
    });
  }
  apiConnection.postUserEvent(
    eventName,
    {
      wallet: fullWalletAddress,
      collection: currentAmm,
      page: 'Trade'
    },
    fullWalletAddress
  );
}

function ChartTimeTabs(props: any) {
  const { contentArray = [], controlRef, isStartLoadingChart } = props;
  const selectedTimeIndex = useNanostore($selectedTimeIndex);

  const setSelectedTimeIndex = (index: number) => {
    // chartButtonLogged(index, fullWalletAddress, currentToken); // from tokenRef.current
    $selectedTimeIndex.set(index);
  };

  const updateSelectedTimeIndex = () => {
    const activeSegmentRef = contentArray[selectedTimeIndex].ref;
    const { offsetLeft, offsetWidth } = activeSegmentRef.current;
    const { style } = controlRef.current;
    style.setProperty('--highlight-width', `${offsetWidth}px`);
    style.setProperty('--highlight-x-pos', `${offsetLeft}px`);
  };

  useEffect(() => {
    updateSelectedTimeIndex();
  }, [selectedTimeIndex, controlRef, contentArray]);

  // useLayoutEffect(() => {
  //   const handleResize = () => {
  //     const element = document.getElementById('divTradeWindow');
  //     if (element === null) return;
  //     const isVisibleNow = window.getComputedStyle(element).display !== 'none';
  //     if (isVisibleNow && !isVisible) {
  //       setIsVisible(true);
  //       updateSelectedTimeIndex();
  //     } else if (!isVisibleNow && isVisible) {
  //       setIsVisible(false);
  //     }
  //   };

  //   window.addEventListener('resize', handleResize);
  //   handleResize();

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [isVisible, selectedTimeIndex]);

  return (
    <div className="relative flex px-0 text-center" ref={controlRef} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
      <div
        className="absolute bottom-0 left-0 right-0 z-0 h-[3px]
          w-[var(--highlight-width)] translate-x-[var(--highlight-x-pos)]
          transform rounded-[2px] bg-[#5465ff] duration-300 ease-in-out"
      />

      <div className="relative inline-flex w-full justify-between overflow-hidden text-center ">
        {contentArray.map((item: any, i: number) => (
          <div
            key={item.label}
            className={`segment z-1 relative ml-4 flex
              w-full cursor-pointer items-center
              justify-center pb-[6px] text-center
              text-mediumEmphasis hover:text-highEmphasis`}
            ref={item.ref}>
            <input
              type="radio"
              value={item.label}
              onChange={() => (isStartLoadingChart ? null : setSelectedTimeIndex(i))}
              checked={i === selectedTimeIndex}
              className="absolute bottom-0 left-0 right-0 top-0 m-0 h-full w-full cursor-pointer opacity-0"
            />
            <label
              htmlFor={item.label}
              className={`block text-[14px] font-normal
                ${i === selectedTimeIndex ? 'font-semibold text-white' : ''}`}>
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

const ChartHeaders = () => {
  const currentAmm = useNanostore($currentAmm);
  const { tradingData } = useTradingData();
  const { isLoading: isStartLoadingChart, chartData } = useChartData();
  const collectionInfo = currentAmm ? getCollectionInformation(currentAmm) : null;

  return (
    <div className="flex w-full flex-row items-center justify-start text-[16px]">
      <div className="left">
        <div className="col my-auto">
          {/* <div className="col pricetitletext my-auto">
            <TitleTips
              titleText="Futures (vAMM Price)"
              tipsText="Resulting price of users' trades in the VAMM system based on the constant product formula"
            />
          </div> */}
          <div className="col newcontenttext mb-[16px]">
            <div className="font-400 flex space-x-[12px] text-[14px] text-highEmphasis">
              <div className="flex items-center space-x-[6px] text-[14px] font-normal">
                {/* <Image className="" src={selectedCollection.logo} width={16} height={16} alt="" /> */}
                <span>{collectionInfo ? collectionInfo.displayCollectionPair : ''}</span>
              </div>
              <div className="font-400 flex text-[14px] text-highEmphasis">
                <SmallPriceIcon priceValue={`${tradingData ? tradingData.oraclePrice.toFixed(2) : '-.--'} (Oracle)`} />
              </div>
            </div>
          </div>
          <div className="flex">
            <PriceWithIcon priceValue={tradingData ? tradingData.vammPrice.toFixed(2) : '-.--'} width={30} height={30} large />
            <PriceIndicator
              priceChangeValue={chartData ? chartData.priceChangeValue : 0}
              priceChangeRatio={chartData ? chartData.priceChangeRatio : 0}
              isStartLoadingChart={isStartLoadingChart}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-end justify-end">
        <ChartTimeTabs
          name="group-1"
          controlRef={useRef()}
          contentArray={[
            { label: '1D', ref: useRef() },
            { label: '1W', ref: useRef() },
            { label: '1M', ref: useRef() },
            { label: '3M', ref: useRef() }
          ]}
          isStartLoadingChart={isStartLoadingChart}
        />
      </div>
    </div>
  );
};

const ChartFooter = (props: any, ref: any) => {
  const DEFAULT_TIME = '-- : -- : --';
  const { isLoading, tradingData } = useTradingData();
  const [timeLabel, setTimeLabel] = useState(DEFAULT_TIME);
  const { fundingPeriod } = useNanostore($collectionConfig);

  const vAMMPrice = !tradingData ? 0 : tradingData.vammPrice;
  const oraclePrice = !tradingData ? 0 : tradingData.oraclePrice;
  const isGapAboveLimit = !tradingData ? false : tradingData.isOverPriceGap;

  const priceGap = vAMMPrice && oraclePrice ? vAMMPrice / oraclePrice - 1 : 0;
  const priceGapPercentage = priceGap * 100;

  let rateLong = '-.--';
  let rateShort = '-.--';
  let longSide = '';
  let shortSide = '';

  if (tradingData && tradingData.fundingRateLong) {
    const numberRawdata = (tradingData.fundingRateLong * 100).toFixed(4);
    const absoluteNumber = Math.abs(Number(numberRawdata));
    rateLong = ` ${absoluteNumber}%`;
    if (Number(numberRawdata) > 0) {
      longSide = 'Pay';
    } else {
      longSide = 'Get';
    }
  }
  if (tradingData && tradingData.fundingRateShort) {
    const numberRawdata = (tradingData.fundingRateShort * 100).toFixed(4);
    const absoluteNumber = Math.abs(Number(numberRawdata));
    rateShort = ` ${absoluteNumber}%`;
    if (Number(numberRawdata) > 0) {
      shortSide = 'Get';
    } else {
      shortSide = 'Pay';
    }
  }

  useEffect(() => {
    let timer: any;
    if (isLoading || !tradingData) {
      setTimeLabel(DEFAULT_TIME);
    } else {
      let endTime = tradingData.nextFundingTime * 1000;
      let hours;
      let minutes;
      let seconds;
      timer = setInterval(() => {
        let difference = endTime - Date.now();
        if (difference < 0) {
          endTime = Date.now() + fundingPeriod * 1000;
          difference = endTime - Date.now();
        }
        hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, '0');
        minutes = Math.floor((difference / 1000 / 60) % 60)
          .toString()
          .padStart(2, '0');
        seconds = Math.floor((difference / 1000) % 60)
          .toString()
          .padStart(2, '0');
        setTimeLabel(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [tradingData, isLoading]);

  return (
    <div className="flex flex-row items-center justify-between text-[14px] font-normal text-[#a8cbff]">
      <div className="flex items-center space-x-[12px]">
        <div>
          <Tooltip
            direction="top"
            content={
              <p className="mx-2 text-center text-b3">
                Price difference between the
                <br /> vAMM and the oracle prices
              </p>
            }>
            <p className="cursor-default text-mediumEmphasis">VAMM - Oracle Price Gap:</p>
          </Tooltip>
        </div>

        <div className="flex items-center space-x-[4px]">
          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
          <p className="text-highEmphasis">{`${priceGapPercentage > 0 ? '+' : ''}${(vAMMPrice - oraclePrice).toFixed(2)} (${Math.abs(
            priceGapPercentage
          ).toFixed(2)}%)`}</p>

          {isGapAboveLimit ? (
            <div>
              <div className="flex items-center">
                <Image src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex space-x-[12px]">
        <TitleTips
          titleText={
            <span className="flex w-[209px] justify-between text-mediumEmphasis">
              <span>Funding Payments</span> <span>({timeLabel}):</span>{' '}
            </span>
          }
          tipsText={
            <div className="text-center">
              The rate of the funding <br />
              payment. Funding payment is <br />
              paid to/by either short or long <br />
              positions based on the <br />
              difference between spot and <br />
              vAMM price. Funding payment <br />
              happens once every 3 hours, <br />
              which is calculated on a 3-hour <br />
              simple weighted rolling average <br />
              basis.
            </div>
          }
          placement="top"
        />
        <div className="col text-highEmphasis">
          Long <span className={longSide === 'Pay' ? 'text-marketRed' : 'text-marketGreen'}>{longSide}</span>
          {rateLong}
          &nbsp; Short <span className={shortSide === 'Pay' ? 'text-marketRed' : 'text-marketGreen'}>{shortSide}</span>
          {rateShort}
        </div>
      </div>
    </div>
  );
};

const ProComponent = () => {
  const { isLoading: isTradingDataLoading, tradingData } = useTradingData();
  const { isLoading: isChartDataLoading, chartData, dailyVolume } = useChartData();
  const selectedTimeIndex = useNanostore($selectedTimeIndex);

  const displayTimeKey = ['24Hr', '1W', '1M', '3M'][selectedTimeIndex];

  return (
    <div className="visible w-[261px] whitespace-nowrap rounded-none bg-black px-[34px] py-[26px]">
      <div className="content ml-[12px] flex flex-col space-y-[24px]">
        <div className="flex text-[12px] text-mediumEmphasis">
          <div className="flex-1">
            <p className="mb-[6px]">{displayTimeKey} High</p>
            <SmallPriceIcon priceValue={chartData?.high} isLoading={isChartDataLoading || !chartData} />
          </div>
          <div className="flex flex-1 flex-col items-end">
            <p className="mb-[6px]">{displayTimeKey} Low</p>
            <SmallPriceIcon priceValue={chartData?.low} isLoading={isChartDataLoading || !chartData} />
          </div>
        </div>
        <div>
          <div className="flex text-[14px] text-mediumEmphasis">
            <div className="flex flex-1 flex-col">
              <span className="text-marketGreen">Long</span>
              <span className={`text-highEmphasis ${isTradingDataLoading || !tradingData ? flashAnim : ''}`}>
                {!tradingData ? '-.--' : `${tradingData.longRatio.toFixed(0)}%`}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-end">
              <span className="text-marketRed">Short</span>
              <span className={`text-highEmphasis ${isTradingDataLoading || !tradingData ? flashAnim : ''}`}>
                {!tradingData ? '-.--' : `${tradingData.shortRatio.toFixed(0)}%`}
              </span>
            </div>
          </div>
          <div className="flex space-x-[3px]">
            <div
              style={{ width: `${tradingData ? tradingData.longRatio.toFixed(0) : 0}%` }}
              className="flex h-[6px] rounded-l-[10px] bg-marketGreen"
            />
            <div
              style={{ width: `${tradingData ? tradingData.shortRatio.toFixed(0) : 0}%` }}
              className="flex h-[6px] rounded-r-[10px] bg-marketRed"
            />
          </div>
        </div>
        <div className="text-medium flex text-[12px] text-mediumEmphasis">
          <div className="flex-1">
            <p className="mb-[6px]">Volume (24Hr)</p>
            <SmallPriceIcon priceValue={!dailyVolume ? '-.--' : dailyVolume.toFixed(2)} isLoading={!dailyVolume || isChartDataLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

function ChartWindows(props: any, ref: any) {
  return (
    <div className="chartWindow mb-[36px]">
      <div className="">
        <ChartHeaders />
        <div className="dividerslim" />
        <div className="chart-pro-container mb-[16px] flex">
          <div className="chartcontainer flex-1">
            <ChartDisplay />
          </div>
          <ProComponent />
        </div>
        <ChartFooter />
      </div>
    </div>
  );
}

export default ChartWindows;
