/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useStore as useNanostore, useStore } from '@nanostores/react';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import { getCollectionInformation } from '@/const/collectionList';

import Tooltip from '@/components/common/Tooltip';
import {
  $collectionConfig,
  $currentAmm,
  $fundingRates,
  $nextFundingTime,
  $openInterests,
  $oraclePrice,
  $selectedTimeIndex,
  $tsIsShowPriceGapOverModal,
  $vammPrice
} from '@/stores/trading';
import { useChartData, useIsOverPriceGap } from '@/hooks/collection';
import ChartDisplay from '@/components/trade/common/ChartDisplay';
import { $isMobileView } from '@/stores/modal';
import { SmallPriceIcon } from '@/components/portfolio/common/PriceLabelComponents';
import ShowPriceGapOverModal from '@/components/trade/desktop/chart/ShowPriceGapOverModal';
import CheckBox from '@/components/common/CheckBox';
import { $isSettingOracleOn, $isSettingVammOn } from '@/stores/chart';

const flashAnim = 'flash';

function PriceIndicator(props: { priceChangeValue: number | undefined; priceChangeRatio: number | undefined }) {
  const { priceChangeValue, priceChangeRatio } = props;

  return priceChangeValue === undefined || priceChangeRatio === undefined ? (
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
          {Math.abs(priceChangeValue).toFixed(2)} ({`${Math.abs(priceChangeRatio).toFixed(2)}%`})
        </div>
      </div>
    </div>
  );
}

function ChartTimeTabs(props: any) {
  const { contentArray = [], controlRef, isStartLoadingChart } = props;
  const selectedTimeIndex = useNanostore($selectedTimeIndex);
  const isMobileView = useNanostore($isMobileView);

  const setSelectedTimeIndex = (index: number) => {
    $selectedTimeIndex.set(index);
  };

  const updateSelectedTimeIndex = () => {
    const activeSegmentRef = contentArray[selectedTimeIndex].ref;
    if (activeSegmentRef.current === null) {
      return;
    }
    const { offsetLeft, offsetWidth } = activeSegmentRef.current;
    const { style } = controlRef.current;
    style.setProperty('--highlight-width', `${offsetWidth}px`);
    style.setProperty('--highlight-x-pos', `${offsetLeft}px`);
  };

  useEffect(() => {
    updateSelectedTimeIndex();
  }, [selectedTimeIndex, controlRef, contentArray]);

  useEffect(() => {
    const handleResize = () => {
      updateSelectedTimeIndex();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileView, selectedTimeIndex]);

  return (
    <div className="relative flex px-0 text-center" ref={controlRef}>
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

const ChartSetting = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const isSettingVammOn = useStore($isSettingVammOn);
  const isSettingOracleOn = useStore($isSettingOracleOn);

  return (
    <div className="flex space-x-[18px]">
      {isSettingOracleOn ? (
        <div className="flex items-center space-x-2 rounded">
          <div className="inline-block h-[4px] w-[13px] rounded-[2px] bg-[#FF62D3]" />
          <p className="select-none text-b3">VAMM Price</p>
        </div>
      ) : null}
      {isSettingOracleOn ? (
        <div className="flex items-center space-x-2 rounded">
          <div className="inline-block h-[4px] w-[13px] rounded-[2px] bg-[#1B9C94]" />
          <p className="select-none text-b3">Oracle Price</p>
        </div>
      ) : null}
      <div className="relative">
        <div
          className="cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            document.addEventListener('click', () => setIsMenuVisible(false));
            setIsMenuVisible(!isMenuVisible);
          }}>
          <Image src="/images/components/trade/chart/settings.svg" alt="" width={20} height={20} />
        </div>
        <div
          onClick={e => e.stopPropagation()}
          className={`${
            isMenuVisible ? '' : 'hidden'
          } absolute left-0 top-5 mt-[6px] flex w-[160px] flex-col rounded-[6px] border border-[#2E4371] bg-secondaryBlue p-1 shadow-lg`}>
          <div className="flex cursor-not-allowed items-center space-x-2 rounded p-3 transition hover:bg-white/10">
            <CheckBox disabled checked={isSettingVammOn} />
            <div className="inline-block h-[4px] w-[13px] rounded-[2px] bg-[#FF62D3]" />
            <p className="text-b3">VAMM Price</p>
          </div>
          <div
            className="flex cursor-pointer items-center space-x-2 rounded p-3 transition hover:bg-white/10"
            onClick={() => $isSettingOracleOn.set(!isSettingOracleOn)}>
            <CheckBox checked={isSettingOracleOn} />
            <div className="inline-block h-[4px] w-[13px] rounded-[2px] bg-[#1B9C94]" />
            <p className="text-b3">Oracle Price</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartHeaders = () => {
  const currentAmm = useNanostore($currentAmm);
  const oraclePrice = useNanostore($oraclePrice);
  const vammPrice = useNanostore($vammPrice);
  const { priceChange, priceChangePct } = useChartData();
  const collectionInfo = currentAmm ? getCollectionInformation(currentAmm) : null;

  return (
    <div className="flex w-full flex-row items-center justify-start text-[16px]">
      <div className="left">
        <div className="col my-auto">
          <div className="col newcontenttext mb-[16px]">
            <div className="font-400 flex space-x-[12px] text-[14px] text-highEmphasis">
              <div className="flex items-center space-x-[6px] text-[14px] font-normal">
                <span>{collectionInfo ? collectionInfo.displayCollectionPair : ''}</span>
              </div>
              <div className="font-400 flex text-[14px] text-highEmphasis">
                <SmallPriceIcon priceValue={`${oraclePrice ? oraclePrice.toFixed(2) : '-.--'} (Oracle)`} />
              </div>
            </div>
          </div>
          <div className="flex">
            <PriceWithIcon priceValue={vammPrice ? vammPrice.toFixed(2) : '-.--'} width={30} height={30} large />
            <PriceIndicator priceChangeValue={priceChange} priceChangeRatio={priceChangePct} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end space-x-[8px]">
        <ChartSetting />
        <ChartTimeTabs
          name="group-1"
          controlRef={useRef()}
          contentArray={[
            { label: '1D', ref: useRef() },
            { label: '1W', ref: useRef() },
            { label: '1M', ref: useRef() },
            { label: '3M', ref: useRef() }
          ]}
          isStartLoadingChart={!vammPrice}
        />
      </div>
    </div>
  );
};

const ChartFooter = () => {
  const DEFAULT_TIME = '-- : -- : --';
  const [timeLabel, setTimeLabel] = useState(DEFAULT_TIME);
  const { fundingPeriod } = useNanostore($collectionConfig);

  const vAMMPrice = useNanostore($vammPrice);
  const oraclePrice = useNanostore($oraclePrice);
  const isGapAboveLimit = useIsOverPriceGap();
  const isShowPriceGapOverModal = useNanostore($tsIsShowPriceGapOverModal);

  const fundingRates = useNanostore($fundingRates);
  const nextFundingTime = useNanostore($nextFundingTime);

  const priceGap = vAMMPrice && oraclePrice ? vAMMPrice / oraclePrice - 1 : 0;
  const priceGapPercentage = priceGap * 100;

  let rateLong = '-.--';
  let rateShort = '-.--';
  let longSide = '';
  let shortSide = '';

  if (fundingRates) {
    const numberRawdata = (fundingRates.longRate * 100).toFixed(4);
    const absoluteNumber = Math.abs(Number(numberRawdata));
    rateLong = ` ${absoluteNumber}%`;
    if (Number(numberRawdata) > 0) {
      longSide = 'Pay';
    } else {
      longSide = 'Get';
    }
  }
  if (fundingRates) {
    const numberRawdata = (fundingRates.shortRate * 100).toFixed(4);
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
    if (!nextFundingTime) {
      setTimeLabel(DEFAULT_TIME);
    } else {
      let endTime = nextFundingTime * 1000;
      let hours;
      let minutes;
      let seconds;
      timer = setInterval(() => {
        let difference = endTime - Date.now();
        if (difference < 0) {
          endTime = Date.now() + fundingPeriod * 1000;
          difference = endTime - Date.now();
        }
        if (Number.isNaN(difference)) {
          setTimeLabel(DEFAULT_TIME);
          return;
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
  }, [nextFundingTime]);

  const priceGapPercentageSign = Number(priceGapPercentage.toFixed(2)) > 0 ? '+' : '';

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
            <p className="cursor-default text-mediumEmphasis">vAMM - Oracle Price Gap:</p>
          </Tooltip>
        </div>

        <div className="flex items-center space-x-[4px]">
          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
          <p className="text-highEmphasis">
            {`${priceGapPercentageSign}${(vAMMPrice ? vAMMPrice - (oraclePrice ?? 0) : -(oraclePrice ?? 0)).toFixed(2)}
            (${priceGapPercentage.toFixed(2)}%)`}
          </p>

          {isGapAboveLimit ? (
            <div className="relative">
              {isShowPriceGapOverModal ? (
                <>
                  <Image className="cursor-pointer" src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />
                  <ShowPriceGapOverModal />{' '}
                </>
              ) : (
                <Tooltip
                  direction="top"
                  content={
                    <p className="!text-left">
                      vAMM - Oracle Price gap &gt; 10%, <br />
                      Liquidation now occurs at Oracle <br />
                      Price (note that P&L is still <br />
                      calculated based on vAMM <br />
                      price)
                    </p>
                  }>
                  <Image className="cursor-pointer" src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />
                </Tooltip>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex space-x-[12px]">
        <Tooltip
          direction="top"
          content={
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
          }>
          <span className="flex w-[209px] justify-between text-mediumEmphasis">
            <span>Funding Payments</span> <span>({timeLabel}):</span>{' '}
          </span>
        </Tooltip>
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
  const openInterests = useNanostore($openInterests);
  const { highPrice, lowPrice, dailyVolume } = useChartData();
  const selectedTimeIndex = useNanostore($selectedTimeIndex);

  const displayTimeKey = ['24Hr', '1W', '1M', '3M'][selectedTimeIndex];

  return (
    <div className="visible w-[261px] whitespace-nowrap rounded-none bg-black px-[34px] py-[26px]">
      <div className="content ml-3 flex flex-col space-y-[24px]">
        <div className="flex text-[12px] text-mediumEmphasis">
          <div className="flex-1">
            <p className="mb-[6px]">{displayTimeKey} High</p>
            <SmallPriceIcon priceValue={highPrice?.toFixed(2)} isLoading={!highPrice} />
          </div>
          <div className="flex flex-1 flex-col items-end">
            <p className="mb-[6px]">{displayTimeKey} Low</p>
            <SmallPriceIcon priceValue={lowPrice?.toFixed(2)} isLoading={!lowPrice} />
          </div>
        </div>
        <div>
          <div className="flex text-[14px] text-mediumEmphasis">
            <div className="flex flex-1 flex-col">
              <span className="text-marketGreen">Long</span>
              <span className={`text-highEmphasis ${!openInterests ? flashAnim : ''}`}>
                {!openInterests ? '-.--' : `${openInterests.longRatio.toFixed(0)}%`}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-end">
              <span className="text-marketRed">Short</span>
              <span className={`text-highEmphasis ${!openInterests ? flashAnim : ''}`}>
                {!openInterests ? '-.--' : `${openInterests.shortRatio.toFixed(0)}%`}
              </span>
            </div>
          </div>
          <div className="flex space-x-[3px]">
            <div
              style={{ width: `${openInterests ? openInterests.longRatio.toFixed(0) : 0}%` }}
              className="flex h-[6px] rounded-l-[10px] bg-marketGreen"
            />
            <div
              style={{ width: `${openInterests ? openInterests.shortRatio.toFixed(0) : 0}%` }}
              className="flex h-[6px] rounded-r-[10px] bg-marketRed"
            />
          </div>
        </div>
        <div className="text-medium flex text-[12px] text-mediumEmphasis">
          <div className="flex-1">
            <p className="mb-[6px]">Volume (24Hr)</p>
            <SmallPriceIcon
              priceValue={dailyVolume === undefined ? '-.--' : dailyVolume.toFixed(2)}
              isLoading={dailyVolume === undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function ChartWindows(props: any, ref: any) {
  return (
    <div className="chartWindow mb-[36px]">
      <div>
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
