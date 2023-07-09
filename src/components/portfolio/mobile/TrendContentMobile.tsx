/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $accumulatedDailyPnl, $psSelectedTimeIndex, $psShowBalance, $psTimeDescription } from '@/stores/portfolio';
import Image from 'next/image';
import PortfolioChart from '@/components/portfolio/mobile/PortfolioChart';
import { $isMobileView } from '@/stores/modal';
import MobileTooltip from '@/components/common/mobile/Tooltip';

function TrendContentMobile() {
  const isMobileView = useNanostore($isMobileView);

  const isShowBalance = useNanostore($psShowBalance);
  const selectedTimeIndex = useNanostore($psSelectedTimeIndex);

  const controlRef: any = useRef();

  const contentArray = [
    { label: '1W', ref: useRef() },
    { label: '1M', ref: useRef() },
    { label: '2M', ref: useRef() },
    { label: 'Competition', ref: useRef() }
  ];

  const totalAccountValueDiff = useNanostore($accumulatedDailyPnl);

  const clickSelectedTimeIndex = (index: number) => {
    $psSelectedTimeIndex.set(index);
  };

  const updateSelectedTimeIndex = () => {
    const activeSegmentRef: any = contentArray[selectedTimeIndex].ref;
    if (!activeSegmentRef.current) {
      return;
    }
    const { offsetLeft, offsetWidth } = activeSegmentRef.current;
    const { style } = controlRef.current;
    style.setProperty('--highlight-width', `${offsetWidth}px`);
    style.setProperty('--highlight-x-pos', `${offsetLeft}px`);
  };

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

  useEffect(() => {
    updateSelectedTimeIndex();
  }, [selectedTimeIndex, controlRef, contentArray]);

  return (
    <div className="w-full bg-lightBlue">
      <div className="flex items-center bg-darkBlue px-5 pb-4 pt-9">
        <div className="h-[20px] w-[3px] rounded-[1px] bg-primaryBlue" />
        <div className="ml-2 text-[18px] font-semibold text-highEmphasis">Realized P/L</div>
      </div>

      <div className="relative w-full" ref={controlRef}>
        <div
          className="absolute left-0 right-0 top-[28px] z-0 h-[2px]
            w-[var(--highlight-width)] translate-x-[var(--highlight-x-pos)]
            transform rounded-[2px] bg-[#5465ff] duration-300 ease-in-out"
        />

        <div
          className="mt-2 flex w-full items-center justify-between border-b-[1px]
          border-b-[#71AAFF]/[.12] px-6 text-[12px]">
          {contentArray.map((item: any, index: any) => (
            <div
              className={`mb-3 cursor-pointer text-[12px]
                    ${index === 3 ? 'text-competition' : ''} 
                    ${selectedTimeIndex === index ? 'selected' : ''}
                  `}
              key={`time_${item.label}`}
              onClick={() => clickSelectedTimeIndex(index)}
              ref={item.ref}>
              {item.label}
            </div>
          ))}
        </div>

        <div className="flex items-start justify-between px-5 py-6">
          <div>
            <div className="mb-1 flex items-center justify-center">
              <div className="text-[12px] font-normal text-highEmphasis">Accumulated Realized P/L</div>
              <MobileTooltip
                content={
                  <>
                    <div className="mb-3 text-[15px] font-semibold">Accumulated Realized P/L</div>
                    <div className="text-[12px] font-normal">
                      Realized P/L is the sum of funding payment and P/L from price change. P/L from price change is included in realized
                      P/L when a position is partially/fully closed/liquidated
                    </div>
                  </>
                }>
                <Image
                  src="/images/components/trade/history/more_info.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="ml-[6px] cursor-pointer"
                />
              </MobileTooltip>
            </div>
            <div className="text-[12px] text-highEmphasis">{$psTimeDescription[selectedTimeIndex]}</div>
          </div>

          <div>
            <div
              className={`${
                isShowBalance && totalAccountValueDiff > 0
                  ? 'text-marketGreen'
                  : isShowBalance && totalAccountValueDiff < 0
                  ? 'text-marketRed'
                  : ''
              } flex items-center justify-center text-[20px] font-semibold`}>
              <Image src="/images/common/symbols/eth-tribe3.svg" width={20} height={20} alt="" className="mr-1" />
              {!isShowBalance ? '****' : totalAccountValueDiff > 0 ? `+${totalAccountValueDiff}` : totalAccountValueDiff}
              {/* {!isShowBalance ? null : <span>{` (${Math.abs(totalAccountValueDiffInPercent)}%)`}</span>} */}
            </div>
          </div>
        </div>

        <div className="h-[6px] w-full bg-darkBlue" />

        <div className="w-full px-5">
          <PortfolioChart />
        </div>

        <div className="flex justify-between px-9 pt-9">
          <div>
            <div className="m-auto mb-4 h-[2px] w-[30px] bg-secondaryPink" />
            <div className="mb-8 text-center text-[12px] text-mediumEmphasis">Accumulated Realized P/L</div>
          </div>

          <div>
            <div className="m-auto mb-2 flex h-[8px] w-[30px]">
              <div className="h-full w-[15px] bg-marketGreen" />
              <div className="h-full w-[15px] bg-marketRed" />
            </div>
            <div className="text-center text-[12px] text-mediumEmphasis">Daily Realized P/L</div>
          </div>
        </div>

        <div className="h-[6px] w-full bg-darkBlue" />
      </div>
    </div>
  );
}

export default TrendContentMobile;
