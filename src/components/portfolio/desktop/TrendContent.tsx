/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from 'react';
import PrimaryButton from '@/components/common/PrimaryButton';
import { useStore as useNanostore } from '@nanostores/react';
import { $psSelectedTimeIndex, $psShowBalance } from '@/stores/portfolio';
import Image from 'next/image';
import PortfolioChart from '@/components/portfolio/desktop/PortfolioChart';
import { $userIsConnected, $userIsWrongNetwork, $userWethBalance } from '@/stores/user';
import { useWeb3Modal } from '@web3modal/react';
import { $isMobileView } from '@/stores/modal';

function TrendContent() {
  const { open } = useWeb3Modal();

  const isConnected = useNanostore($userIsConnected);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const wethBalance = useNanostore($userWethBalance);

  const isShowBalance = useNanostore($psShowBalance);
  const selectedTimeIndex = useNanostore($psSelectedTimeIndex);

  const controlRef: any = useRef();
  const isMobileView = useNanostore($isMobileView);

  const contentArray = [
    { label: '1W', ref: useRef() },
    { label: '1M', ref: useRef() },
    { label: '2M', ref: useRef() },
    { label: 'Competition', ref: useRef() }
  ];

  const totalAccountValueDiff = '0.0';

  const onBtnConnectWallet = () => {
    open();
  };

  const onBtnUpdateTargetNetwork = () => {
    open({ route: 'SelectNetwork' });
  };

  const onBtnGetTeth = () => {};

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
    <div
      className="ml-0 mt-6 w-full flex-1 justify-center
        rounded-[12px] bg-lightBlue 2xl:ml-6 2xl:mt-0
    ">
      <div className="flex items-center px-9 pb-4 pt-9">
        <div className="h-[20px] w-[3px] rounded-[1px] bg-primaryBlue" />
        <div className="ml-2 text-[20px] font-semibold text-highEmphasis">Realized P/L</div>
      </div>

      {!isConnected ? (
        <div className="border-t-[1px] border-secondaryBlue">
          <div
            className="mb-6 mt-[66px]
            text-center text-mediumEmphasis">
            Please connect to your wallet to get started.
          </div>
          <div className="flex justify-center">
            <PrimaryButton className="px-[14px] py-[7px] !text-[14px] font-semibold" onClick={onBtnConnectWallet}>
              Connect Wallet
            </PrimaryButton>
          </div>
        </div>
      ) : isWrongNetwork ? (
        <div className="border-t-[1px] border-secondaryBlue">
          <div
            className="mb-6 mt-[52px] text-center
            leading-[28px] text-mediumEmphasis">
            You’re not connected to the Arbitrum network, <br />
            please proceed to switch to Arbitrum.
          </div>
          <div className="flex justify-center">
            <PrimaryButton className="px-[14px] py-[7px] !text-[14px] font-semibold" onClick={onBtnUpdateTargetNetwork}>
              Switch to Arbitrum
            </PrimaryButton>
          </div>
        </div>
      ) : wethBalance === 0 ? (
        <div className="border-t-[1px] border-secondaryBlue">
          <div
            className="mb-6 mt-[52px] text-center
            leading-[28px] text-mediumEmphasis">
            To get started, get WETH first.
          </div>
          <div className="flex justify-center">
            <PrimaryButton className="px-[14px] py-[7px] !text-[14px] font-semibold" onClick={onBtnGetTeth}>
              Get WETH
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex w-full 2xl:h-[calc(100%-42px)]">
          <div className="ml-6 mr-6 mt-2 w-full">
            <PortfolioChart />
          </div>

          <div className="relative mt-[-40px] flex h-full flex-1 flex-col" ref={controlRef}>
            <div
              className="absolute left-0 right-0 top-[34px] z-0 h-[3px]
                w-[var(--highlight-width)] translate-x-[var(--highlight-x-pos)]
                transform rounded-[2px] bg-[#5465ff] duration-300 ease-in-out"
            />

            <div className="mb-5 flex items-center justify-center">
              {contentArray.map((item: any, index: any) => (
                <div
                  className={`cursor-pointer text-[12px]
                    hover:font-semibold hover:text-highEmphasis
                    ${index === 3 ? '' : 'mr-3'}
                    ${
                      selectedTimeIndex === index
                        ? 'font-semibold text-highEmphasis'
                        : index === 3
                        ? 'text-competition'
                        : 'text-mediumEmphasis'
                    }
                  `}
                  key={`time_${item.label}`}
                  onClick={() => clickSelectedTimeIndex(index)}
                  ref={item.ref}>
                  {item.label}
                </div>
              ))}
            </div>
            <div className="w-[217px] flex-1 bg-darkBlue/[.5]">
              <div className="mb-1 mt-9 flex items-center justify-center">
                <div className="text-[12px] font-normal text-highEmphasis">Accumulated Realized P/L</div>
                <Image
                  src="/images/components/trade/history/more_info.svg"
                  alt=""
                  width={12}
                  height={12}
                  className="ml-[6px] cursor-pointer"
                />
              </div>
              <div className="mb-3 flex justify-center text-[12px] text-highEmphasis">(1 Week)</div>

              <div
                className={`${
                  isShowBalance && Number(totalAccountValueDiff) > 0
                    ? 'text-marketGreen'
                    : isShowBalance && Number(totalAccountValueDiff) < 0
                    ? 'text-marketRed'
                    : ''
                } mb-[60px] flex items-center justify-center text-[16px] font-semibold`}>
                <Image src="/images/common/symbols/eth-tribe3.svg" width={20} height={20} alt="" className="mr-1" />
                {!isShowBalance ? '****' : Number(totalAccountValueDiff) > 0 ? `+${totalAccountValueDiff}` : totalAccountValueDiff}
              </div>

              <div className="m-auto mb-3 h-[2px] w-[30px] bg-secondaryPink" />
              <div className="mb-4 text-center text-[12px] text-mediumEmphasis">Accumulated Realized P/L</div>

              <div className="m-auto mb-2 flex h-[8px] w-[30px]">
                <div className="h-full w-[15px] bg-marketGreen" />
                <div className="h-full w-[15px] bg-marketRed" />
              </div>
              <div className="pb-[42px] text-center text-[12px] text-mediumEmphasis">Daily Realized P/L</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrendContent;
