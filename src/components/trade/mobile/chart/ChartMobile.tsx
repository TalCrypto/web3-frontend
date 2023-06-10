/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { utils, BigNumber } from 'ethers';
import { logEvent } from 'firebase/analytics';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useStore, useStore as useNanostore } from '@nanostores/react';

import { formatterValue, isPositive, calculateNumber } from '@/utils/calculateNumbers';

import { PriceWithIcon } from '@/components/common/PricWithIcon';
import { firebaseAnalytics } from '@/const/firebaseConfig';

import collectionList from '@/const/collectionList';

import {
  getDailySpotPriceGraphData,
  getMonthlySpotPriceGraphData,
  getWeeklySpotPriceGraphData,
  getThreeMonthlySpotPriceGraphData
} from '@/utils/trading';

import TitleTips from '@/components/common/TitleTips';
import { apiConnection } from '@/utils/apiConnection';
import { showPopup, priceGapLimit } from '@/stores/priceGap';

import { wsCurrentChain, wsCurrentToken, wsIsLogin, wsSelectedTimeIndex } from '@/stores/WalletState';
import { walletProvider } from '@/utils/walletProvider';

const flashAnim = 'flash';

const getCollectionInformation = (collectionName: any) => {
  const targetCollection = collectionList.filter(({ collection }) => collection.toUpperCase() === collectionName.toUpperCase());
  return targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
};

function SmallPriceIcon(props: any) {
  const { priceValue = 0, className = '', iconSize = 16, isLoading = false } = props;
  return (
    <div className={`text-14 flex items-center space-x-[6px] text-highEmphasis ${className}`}>
      <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={iconSize} height={iconSize} />
      <span className={`${isLoading ? 'flash' : ''}`}>{priceValue}</span>
    </div>
  );
}

const ChartDisplay = dynamic(() => import('./chartDisplay'), {
  ssr: false
});

function PriceIndicator(props: any) {
  const { priceChangeRatioAndValue } = props;
  const { priceChangeRatio } = priceChangeRatioAndValue;
  const [localPriceChangeRatioAndValue, setLocalPriceChangeRatioAndValue] = useState({
    priceChangeRatio: '',
    priceChangeValue: ''
  });

  const [isPriceChange, setIsPriceChange] = useState(false);

  useEffect(() => {
    setIsPriceChange(true);
    if (priceChangeRatio) {
      setTimeout(() => {
        setLocalPriceChangeRatioAndValue(priceChangeRatioAndValue);
        setIsPriceChange(false);
      }, 300);
    }
  }, [priceChangeRatioAndValue, priceChangeRatio]);

  if (!localPriceChangeRatioAndValue.priceChangeRatio) {
    return null;
  }

  const isLike = isPositive(localPriceChangeRatioAndValue.priceChangeRatio) ? 1 : 0;

  return isPriceChange ? (
    <div
      className={`my-[11px] flex h-[32px] items-center rounded-full
        text-center text-[15px] font-semibold leading-[18px]
        ${isLike ? 'text-marketGreen' : 'text-marketRed'}
        `}>
      <div className="">
        <div className="col my-auto">-.-- (-.-- %)</div>
      </div>
    </div>
  ) : (
    <div
      className={`my-[11px] flex h-[32px] items-center rounded-full
        text-center text-[15px] font-semibold leading-[18px]
        ${isLike ? 'text-marketGreen' : 'text-marketRed'}`}>
      <Image
        alt="Polygon_pos"
        src={
          isPositive(localPriceChangeRatioAndValue.priceChangeRatio)
            ? '/images/components/trade/chart/polygon_pos.svg'
            : '/images/components/trade/chart/polygon_neg.svg'
        }
        width={16}
        height={16}
      />
      <div>
        <div className="mr-4">
          {`${formatterValue(Math.abs(Number(localPriceChangeRatioAndValue.priceChangeValue)), 2, '')}
          (${formatterValue(Math.abs(Number(localPriceChangeRatioAndValue.priceChangeRatio)), 2, '%')})`}
        </div>
      </div>
    </div>
  );
}

function chartButtonLogged(index: any, fullWalletAddress: any, currentCollection: any) {
  const eventName = ['btnDay_pressed', 'btnWeek_pressed', 'btnMonth_pressed'][index];
  if (firebaseAnalytics) {
    logEvent(firebaseAnalytics, eventName, {
      wallet: fullWalletAddress.substring(2),
      collection: currentCollection
    });
  }
  apiConnection.postUserEvent(eventName, {
    wallet: fullWalletAddress,
    collection: currentCollection,
    page: 'Trade'
  });
}

function ChartTimeTabs(props: any) {
  const { setSelectedTimeIndex, isStartLoadingChart, contentArray = [], controlRef } = props;
  const selectedTimeIndex = useNanostore(wsSelectedTimeIndex);

  useEffect(() => {
    const activeSegmentRef = contentArray[selectedTimeIndex].ref;
    const { offsetLeft } = activeSegmentRef.current;
    const { style } = controlRef.current;
    style.setProperty('--highlight-width', '25px');
    style.setProperty('--highlight-x-pos', `${offsetLeft + 8}px`);
  }, [selectedTimeIndex, controlRef, contentArray]);

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
            className={`segment ${isStartLoadingChart ? 'waitCursor' : 'presscursor'}
            z-1 relative flex w-full cursor-pointer items-center justify-center text-center`}
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
              className={`block p-2 text-[14px] 
                ${i === selectedTimeIndex ? 'font-semibold text-white' : 'text-mediumEmphasis'}`}>
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

const ChartHeaders = forwardRef((props: any, ref: any) => {
  const { tradingData, setSelectedTimeIndex, isStartLoadingChart, currentToken } = props;
  const [currentTagMaxAndMinValue, setCurrentTagMaxAndMinValue] = useState({ max: '-.--', min: '-.--' });
  const [priceChangeRatioAndValue, setPriceChangeRatioAndValue] = useState({ priceChangeRatio: '', priceChangeValue: '' });

  useImperativeHandle(ref, () => ({
    reset() {
      setCurrentTagMaxAndMinValue({ max: '-.--', min: '-.--' });
      setPriceChangeRatioAndValue({ priceChangeRatio: '', priceChangeValue: '' });
    },
    setGraphOtherValue(params: any) {
      const { high, low, priceChangeRatio, priceChangeValue } = params;
      setCurrentTagMaxAndMinValue({ max: formatterValue(high, 2), min: formatterValue(low, 2) });
      setPriceChangeRatioAndValue({ priceChangeRatio, priceChangeValue });
    }
  }));

  const vAMMPrice = !tradingData.spotPrice ? 0 : Number(utils.formatEther(tradingData.spotPrice));
  const oraclePrice = !tradingData.twapPrice ? 0 : Number(utils.formatEther(tradingData.twapPrice));
  const priceGap = vAMMPrice && oraclePrice ? vAMMPrice / oraclePrice - 1 : 0;
  const priceGapPercentage = priceGap * 100;

  const priceGapLmt = useStore(priceGapLimit);
  const isGapAboveLimit = priceGapLmt ? Math.abs(priceGap) >= priceGapLmt : false;

  const [timeLabel, setTimeLabel] = useState('-- : -- : --');

  const rateLong = '-.--';
  const rateShort = '-.--';
  let longSide = '';
  let shortSide = '';

  if (tradingData && tradingData.fundingRateLong) {
    const rawdata = utils.formatEther(tradingData.fundingRateLong);
    const numberRawdata = (Number(rawdata) * 100).toFixed(4);
    if (Number(numberRawdata) > 0) {
      longSide = 'Pay';
    } else {
      longSide = 'Get';
    }
  }

  if (tradingData && tradingData.fundingRateShort) {
    const rawdata = utils.formatEther(tradingData.fundingRateShort);
    const numberRawdata = (Number(rawdata) * 100).toFixed(4);
    if (Number(numberRawdata) > 0) {
      shortSide = 'Get';
    } else {
      shortSide = 'Pay';
    }
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 px-[20px] pt-[27px]">
        <div className="col-span-1">
          <PriceWithIcon priceValue={formatterValue(tradingData.spotPrice, 2, '', '-.--')} width={22} height={22} medium />
          <PriceIndicator priceChangeRatioAndValue={priceChangeRatioAndValue} />
        </div>

        <div className="col-span-1 text-right">
          <div className="font-400 mb-[8px] mt-[6px] text-[14px]">
            <span className="mr-[6px] text-[12px] text-mediumEmphasis">Oracle:</span>
            <span className="text-[12px] text-highEmphasis">{formatterValue(tradingData.twapPrice, 2, '', '-.--')}</span>
          </div>

          <div>
            <div className="text-[12px] text-mediumEmphasis">VAMM - Oracle Price Gap:</div>

            <div className="mt-1 flex w-full items-center justify-end text-[12px] text-highEmphasis">
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
        </div>
      </div>

      <div className="px-[20px] text-[12px]">
        <div className="text-mediumEmphasis">
          <span>Funding Payments</span> <span>({timeLabel}):</span>{' '}
        </div>
        <div className="col text-highEmphasis">
          Long <span className={longSide === 'Pay' ? 'pay' : 'receive'}>{longSide}</span>
          {rateLong}
          &nbsp; Short <span className={shortSide === 'Pay' ? 'pay' : 'receive'}>{shortSide}</span>
          {rateShort}
        </div>
      </div>

      <div className="flex flex-1 items-end justify-end px-[20px]">
        <ChartTimeTabs
          name="group-1"
          callback={(val: any) => setSelectedTimeIndex(val)}
          controlRef={useRef()}
          contentArray={[
            { label: '1D', ref: useRef() },
            { label: '1W', ref: useRef() },
            { label: '1M', ref: useRef() },
            { label: '3M', ref: useRef() }
          ]}
          setSelectedTimeIndex={setSelectedTimeIndex}
          isStartLoadingChart={isStartLoadingChart}
        />
      </div>
    </div>
  );
});

const ProComponent = forwardRef((props: any, ref: any) => {
  const { visible, onVisibleChanged, tradingData, currentToken } = props;
  const [currentTagMaxAndMinValue, setCurrentTagMaxAndMinValue] = useState({ max: '-.--', min: '-.--' });
  const [priceChangeRatioAndValue, setPriceChangeRatioAndValue] = useState({ priceChangeRatio: '', priceChangeValue: '' });
  const [dayVolume, setDayVolume] = useState(tradingData.dayVolume);
  const selectedTimeIndex = useNanostore(wsSelectedTimeIndex);
  const displayTimeKey = ['24Hr', '1W', '1M', '3M'][selectedTimeIndex];

  useImperativeHandle(ref, () => ({
    reset() {
      setCurrentTagMaxAndMinValue({ max: '-.--', min: '-.--' });
      setPriceChangeRatioAndValue({ priceChangeRatio: '', priceChangeValue: '' });
    },
    setGraphOtherValue(params: any) {
      const { high, low, priceChangeRatio, priceChangeValue } = params;
      setCurrentTagMaxAndMinValue({ max: formatterValue(high, 2), min: formatterValue(low, 2) });
      setPriceChangeRatioAndValue({ priceChangeRatio, priceChangeValue });
    }
  }));

  // handle trading data changed, set volume
  useEffect(() => {
    if (tradingData.dayVolume) {
      setDayVolume(tradingData.dayVolume);
    }
  }, [tradingData]);

  // handle interval each 10s fetch volume
  useEffect(() => {
    if (!currentToken) {
      return;
    }

    const interval = setInterval(() => {
      const { amm: currentAmm } = getCollectionInformation(currentToken);
      getDailySpotPriceGraphData(currentAmm).then(dayTradingDetails => {
        const vol = dayTradingDetails == null ? BigNumber.from(0) : dayTradingDetails.volume;
        setDayVolume(vol);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [currentToken]);

  // animation
  useEffect(() => {
    const element = document.querySelector('.pro-data-container');
    // if (!visible) {
    //   element.classList.add('display-none');
    //   if (onVisibleChanged) onVisibleChanged(visible);
    //   return;
    // }

    // using animate.stye
    // if (visible) {
    //   element.classList.remove('animate__animated', 'animate__slideOutRight');
    //   element.classList.add('animate__animated', 'animate__slideInRight');
    // } else {
    //   element.classList.remove('animate__animated', 'animate__slideInRight');
    //   element.classList.add('animate__animated', 'animate__slideOutRight');
    // }

    const timer1 = setTimeout(() => {
      if (onVisibleChanged) onVisibleChanged(visible);
    }, 500);

    return () => {
      clearTimeout(timer1);
    };

    // if (visible) {
    //   // element.classList.remove('display-none');
    //   element.style.width = '261px';
    //   if (onVisibleChanged) onVisibleChanged(visible);
    // } else {
    //   // element.classList.add('display-none');
    //   element.style.width = '0px';
    //   if (onVisibleChanged) onVisibleChanged(visible);
    // }
  }, [visible, onVisibleChanged]);

  return (
    <div
      className={`w-full whitespace-nowrap rounded-none bg-darkBlue
        px-[21px] py-[24px] ${visible ? 'visible' : ''}`}>
      <div className="content flex flex-col space-y-[24px]">
        <div className="flex text-[14px] text-mediumEmphasis">
          <div className="flex-1">
            <p className="text-normal mb-[6px] text-[12px]">{displayTimeKey} High</p>
            <SmallPriceIcon
              priceValue={!currentTagMaxAndMinValue.max ? '-.--' : currentTagMaxAndMinValue.max}
              isLoading={currentTagMaxAndMinValue.max === '-.--'}
              className="text-normal text-[15px]"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <p className="text-normal mb-[6px] text-[12px]">{displayTimeKey} Low</p>
            <SmallPriceIcon
              priceValue={!currentTagMaxAndMinValue.min ? '-.--' : currentTagMaxAndMinValue.min}
              isLoading={currentTagMaxAndMinValue.min === '-.--'}
              className="text-normal text-[15px]"
            />
          </div>
        </div>
        <div>
          <div className="text-14 flex text-mediumEmphasis">
            <div className="flex flex-1 flex-col">
              <span className="text-marketGreen">Long</span>
              <span className={`text-highEmphasis ${!tradingData.longRatio ? flashAnim : ''}`}>
                {!tradingData.longRatio ? '-.--' : formatterValue(tradingData.longRatio, 0, '%')}
              </span>
            </div>
            <div className="flex flex-1 flex-col text-right">
              <span className="text-marketRed">Short</span>
              <span className={`text-highEmphasis ${!tradingData.longRatio ? flashAnim : ''}`}>
                {!tradingData.shortRatio ? '-.--' : formatterValue(tradingData.shortRatio, 0, '%')}
              </span>
            </div>
          </div>
          <div className="flex space-x-[3px]">
            <div
              style={{ width: `${calculateNumber(tradingData.longRatio, 0)}%` }}
              className="flex h-[6px] rounded-l-[10px] bg-marketGreen"
            />
            <div
              style={{ width: `${calculateNumber(tradingData.shortRatio, 0)}%` }}
              className="flex h-[6px] rounded-r-[10px] bg-marketRed"
            />
          </div>
        </div>
        <div className="text-medium flex text-[12px]">
          <div className="flex-1">
            <p className="mb-[6px]">Volume (24Hr)</p>
            <SmallPriceIcon priceValue={!dayVolume ? '-.--' : formatterValue(dayVolume, 2)} isLoading={!dayVolume} />
          </div>
        </div>
      </div>
    </div>
  );
});

function ChartMobile(props: any, ref: any) {
  const { tradingData } = props;
  const [isStartLoadingChart, setIsStartLoadingChart] = useState(false);
  const [lineChartData, setLineChartData] = useState([]);

  const chartProContainerRef = useRef(null);
  const graphHeaderRef = useRef();
  const proRef = useRef();
  const fullWalletAddress = walletProvider.holderAddress;
  const currentToken = useNanostore(wsCurrentToken);
  const selectedTimeIndex = useNanostore(wsSelectedTimeIndex);

  const fetchChartData = async function fetchChartData() {
    setIsStartLoadingChart(true);
    const { amm: currentAmm } = getCollectionInformation(currentToken); // from tokenRef.current
    let chartData: any = {};
    if (selectedTimeIndex === 0) {
      chartData = await getDailySpotPriceGraphData(currentAmm);
    } else if (selectedTimeIndex === 1) {
      chartData = await getWeeklySpotPriceGraphData(currentAmm);
    } else if (selectedTimeIndex === 2) {
      chartData = await getMonthlySpotPriceGraphData(currentAmm);
    } else {
      chartData = await getThreeMonthlySpotPriceGraphData(currentAmm);
    }
    const graphRef: any = graphHeaderRef.current;
    graphRef?.setGraphOtherValue(chartData);
    const pRef: any = proRef.current;
    pRef?.setGraphOtherValue(chartData);
    // console.log('fetchChartData, set chart data and pro component', chartData);

    const dynamicDataSet = chartData.graphData.map((params: any) => {
      const { end, avgPrice } = params;
      return { time: end, value: utils.formatEther(avgPrice) };
    });
    setLineChartData(dynamicDataSet);
    // graphDataRef.current.setGb raphValue(dynamicDataSet);
    setIsStartLoadingChart(false);
  };

  useImperativeHandle(ref, () => ({ fetchChartData }));

  useEffect(() => {
    const gRef: any = graphHeaderRef.current;
    gRef.reset();
    // graphDataRef.current.reset();
    const pRef: any = proRef.current;
    fetchChartData();
  }, [currentToken, selectedTimeIndex]); // from tokenRef.current

  const handleSelectedTimeIndex = (index: any) => {
    chartButtonLogged(index, fullWalletAddress, currentToken); // from tokenRef.current
    wsSelectedTimeIndex.set(index);
  };

  return (
    <div className="chartWindow">
      <div className="">
        <ChartHeaders
          ref={graphHeaderRef}
          tradingData={tradingData}
          setSelectedTimeIndex={handleSelectedTimeIndex}
          isStartLoadingChart={isStartLoadingChart}
        />
        <div ref={chartProContainerRef}>
          <ChartDisplay
            lineChartData={lineChartData}
            isStartLoadingChart={isStartLoadingChart}
            chartProContainerRef={chartProContainerRef}
          />
        </div>
      </div>
    </div>
  );
}

export default forwardRef(ChartMobile);
