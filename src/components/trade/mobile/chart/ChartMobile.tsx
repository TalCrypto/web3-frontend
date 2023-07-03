/* eslint-disable consistent-return */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable operator-linebreak */
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import ChartDisplay from '@/components/common/ChartDisplay';

import { $collectionConfig, $fundingRates, $nextFundingTime, $oraclePrice, $selectedTimeIndex, $vammPrice } from '@/stores/trading';
import { useChartData, useIsOverPriceGap } from '@/hooks/collection';
import { $isMobileView } from '@/stores/modal';

function PriceIndicator(props: any) {
  const { priceChangeValue, priceChangeRatio, isStartLoadingChart } = props;

  return isStartLoadingChart || priceChangeValue === undefined || priceChangeRatio === undefined ? (
    <div
      className={`my-[11px] flex h-[32px] items-center rounded-full
        text-center text-[15px] font-semibold leading-[18px]
        ${priceChangeRatio > 0 ? 'text-marketGreen' : 'text-marketRed'}
        `}>
      <div>
        <div className="col my-auto">-.-- (-.-- %)</div>
      </div>
    </div>
  ) : (
    <div
      className={`my-[11px] flex h-[32px] items-center rounded-full
        text-center text-[15px] font-semibold leading-[18px]
        ${priceChangeRatio > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
      <Image
        alt="Polygon_pos"
        src={priceChangeRatio > 0 ? '/images/components/trade/chart/polygon_pos.svg' : '/images/components/trade/chart/polygon_neg.svg'}
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
  const { isStartLoadingChart, contentArray = [], controlRef } = props;
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

      <div className="relative inline-flex w-full justify-between overflow-hidden text-center">
        {contentArray.map((item: any, i: any) => (
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
              className={`block text-[14px] 
                ${i === selectedTimeIndex ? 'font-semibold text-white' : 'text-mediumEmphasis'}`}>
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

const ChartHeaders = () => {
  const DEFAULT_TIME = '-- : -- : --';
  const [timeLabel, setTimeLabel] = useState(DEFAULT_TIME);
  const { fundingPeriod } = useNanostore($collectionConfig);
  const { priceChange, priceChangePct } = useChartData();

  const vAMMPrice = useNanostore($vammPrice);
  const oraclePrice = useNanostore($oraclePrice);
  const isGapAboveLimit = useIsOverPriceGap();
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

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 px-[20px] pt-[27px]">
        <div className="col-span-1">
          <PriceWithIcon priceValue={vAMMPrice ? vAMMPrice.toFixed(2) : '-.--'} width={30} height={30} large />
          <PriceIndicator priceChangeValue={priceChange} priceChangeRatio={priceChangePct} isStartLoadingChart={!priceChange} />
        </div>

        <div className="col-span-1 text-right">
          <div className="font-400 mb-[8px] mt-[6px] text-[14px]">
            <span className="mr-[6px] text-[12px] text-mediumEmphasis">Oracle:</span>
            <span className="text-[12px] text-highEmphasis">{oraclePrice ? oraclePrice.toFixed(2) : '-.--'}</span>
          </div>

          <div>
            <div className="text-[12px] text-mediumEmphasis">VAMM - Oracle Price Gap:</div>

            <div className="mt-1 flex w-full items-center justify-end text-[12px] text-highEmphasis">
              <p className="text-highEmphasis">
                {`${priceGapPercentage > 0 ? '+' : ''}${((vAMMPrice ?? 0) - (oraclePrice ?? 0)).toFixed(2)}
                (${Math.abs(priceGapPercentage).toFixed(2)}%)`}
              </p>

              {isGapAboveLimit ? (
                <div>
                  <div className="flex items-center">
                    <Image src="/images/common/alert/alert_red.svg" width={20} height={20} alt="" />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="px-[20px] text-[12px]">
        <div className="text-mediumEmphasis">
          <span>Funding Payments</span> <span>({timeLabel}):</span>{' '}
        </div>
        <div className="col text-highEmphasis">
          Long <span className={longSide === 'Pay' ? 'text-marketRed' : 'text-marketGreen'}>{longSide}</span>
          {rateLong}
          &nbsp; Short <span className={shortSide === 'Pay' ? 'text-marketRed' : 'text-marketGreen'}>{shortSide}</span>
          {rateShort}
        </div>
      </div>

      <div className="flex flex-1 items-end justify-end px-[20px]">
        <ChartTimeTabs
          name="group-1"
          controlRef={useRef()}
          contentArray={[
            { label: '1D', ref: useRef() },
            { label: '1W', ref: useRef() },
            { label: '1M', ref: useRef() },
            { label: '3M', ref: useRef() }
          ]}
          isStartLoadingChart={!vAMMPrice}
        />
      </div>
    </div>
  );
};

function ChartMobile() {
  return (
    <div className="bg-lightBlue">
      <ChartHeaders />
      <div className="flex justify-center bg-darkBlue py-6">
        <div className="w-full">
          <ChartDisplay />
        </div>
      </div>
    </div>
  );
}

export default ChartMobile;
