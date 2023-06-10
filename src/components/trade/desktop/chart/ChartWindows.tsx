/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

import { utils, BigNumber } from 'ethers';
import { logEvent } from 'firebase/analytics';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';

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

import { wsIsLogin, wsChatInterval, wsCurrentToken, wsSelectedTimeIndex } from '@/stores/WalletState';
import { walletProvider } from '@/utils/walletProvider';
import Tooltip from '@/components/common/Tooltip';

const flashAnim = 'flash';

const getCollectionInformation = (collectionName: any) => {
  const targetCollection = collectionList.filter(({ collection }) => collection.toUpperCase() === collectionName.toUpperCase());
  return targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
};

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

function PriceIndicator(props: any) {
  const { priceChangeRatioAndValue } = props;
  const { priceChangeRatio, priceChangeValue } = priceChangeRatioAndValue;
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
      className={`my-[11px] ml-3 mr-4 flex h-[32px] items-center rounded-full border-[1px]
        text-center text-[15px] font-semibold leading-[18px]
        ${isLike ? 'border-marketGreen text-marketGreen' : 'border-marketRed text-marketRed'}`}>
      <div className="col mx-4 my-auto flex items-center">
        <div className="col my-auto">-.-- (-.-- %)</div>
      </div>
    </div>
  ) : (
    <div
      className={`my-[11px] ml-3 mr-4 flex h-[32px] items-center rounded-full border-[1px]
        text-center text-[15px] font-semibold leading-[18px]
        ${isLike ? 'border-marketGreen text-marketGreen' : 'border-marketRed text-marketRed'}`}>
      <Image
        alt="Polygon_pos"
        src={
          isPositive(localPriceChangeRatioAndValue.priceChangeRatio)
            ? '/images/components/trade/chart/polygon_pos.svg'
            : '/images/components/trade/chart/polygon_neg.svg'
        }
        className="ml-4 mr-2"
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

function chartButtonLogged(index: any, currentCollection: any) {
  const eventName = ['btnDay_pressed', 'btnWeek_pressed', 'btnMonth_pressed'][index];
  const fullWalletAddress = walletProvider.holderAddress;

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
  const { isStartLoadingChart, setSelectedTimeIndex, contentArray = [], controlRef } = props;
  const selectedTimeIndex = useNanostore(wsSelectedTimeIndex);

  useEffect(() => {
    const activeSegmentRef = contentArray[selectedTimeIndex].ref;
    const { offsetLeft } = activeSegmentRef.current;
    const { style } = controlRef.current;
    style.setProperty('--highlight-width', `25px`);
    style.setProperty('--highlight-x-pos', `${offsetLeft + 8}px`);
  }, [selectedTimeIndex, controlRef, contentArray]);

  return (
    <div className="relative flex px-0 text-center" ref={controlRef} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
      <div
        className="absolute bottom-0 left-0 right-0 z-0 h-[3px]
          w-[var(--highlight-width)] translate-x-[var(--highlight-x-pos)]
          transform rounded-[2px] bg-[#5465ff] duration-300 ease-in-out"
      />

      <div className="relative inline-flex w-full justify-between overflow-hidden text-center ">
        {contentArray.map((item: any, i: any) => (
          <div
            key={item.label}
            className={`segment text-mediumEmphasis hover:text-highEmphasis ${i === selectedTimeIndex ? 'active' : ''} ${
              isStartLoadingChart ? 'waitCursor' : 'presscursor'
            }
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
              className={`block p-2 text-[16px] 
                ${i === selectedTimeIndex ? 'font-semibold text-white' : ''}`}>
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

const ChartHeaders = forwardRef((props: any, ref: any) => {
  const { tradingData, setSelectedTimeIndex, isStartLoadingChart } = props;
  const [currentTagMaxAndMinValue, setCurrentTagMaxAndMinValue] = useState({ max: '-.--', min: '-.--' });
  const [priceChangeRatioAndValue, setPriceChangeRatioAndValue] = useState({ priceChangeRatio: '', priceChangeValue: '' });
  const currentToken = useNanostore(wsCurrentToken);

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

  const selectedCollection = getCollectionInformation(currentToken); // from tokenRef.current

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
                <span>{selectedCollection.displayCollectionPair}</span>
              </div>
              <div className="font-400 flex text-[14px] text-highEmphasis">
                <SmallPriceIcon priceValue={`${formatterValue(tradingData.twapPrice, 2, '', '-.--')} (Oracle)`} />
              </div>
            </div>
          </div>
          <div className="flex">
            <PriceWithIcon priceValue={formatterValue(tradingData.spotPrice, 2, '', '-.--')} width={30} height={30} large />
            <PriceIndicator priceChangeRatioAndValue={priceChangeRatioAndValue} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-end justify-end">
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

const ChartFooter = forwardRef((props: any, ref: any) => {
  const { tradingData } = props;
  const currentToken = useNanostore(wsCurrentToken);
  const selectedCollection = getCollectionInformation(currentToken); // from tokenRef.current

  const vAMMPrice = !tradingData.spotPrice ? 0 : Number(utils.formatEther(tradingData.spotPrice));
  const oraclePrice = !tradingData.twapPrice ? 0 : Number(utils.formatEther(tradingData.twapPrice));

  const priceGap = vAMMPrice && oraclePrice ? vAMMPrice / oraclePrice - 1 : 0;
  const priceGapPercentage = priceGap * 100;
  const priceGapLmt = useNanostore(priceGapLimit);

  const isGapAboveLimit = priceGapLmt ? Math.abs(priceGap) >= priceGapLmt : false;
  const popup: any = showPopup.get();
  const isAlertTooltipHasShown = selectedCollection ? popup[selectedCollection.collection] : false;

  const [showAlertOverlay, setShowAlertOverlay] = useState(false);

  const [timeLabel, setTimeLabel] = useState('-- : -- : --');
  const [nextFundingTime, setNextFundingTime] = useState(0);
  const hadKey = Object.keys(tradingData).length > 0;

  const interval = useNanostore(wsChatInterval);

  let hours = '';
  let minutes = '';
  let seconds = '';
  let rateLong = '-.--';
  let rateShort = '-.--';
  let longSide = '';
  let shortSide = '';

  // react to pricegap store, so tooltip can show on first load
  useEffect(() => {
    if (!isAlertTooltipHasShown) {
      setShowAlertOverlay(isGapAboveLimit);
    } else {
      setShowAlertOverlay(false);
    }
  }, [isGapAboveLimit, isAlertTooltipHasShown]);

  if (tradingData && tradingData.fundingRateLong) {
    const rawdata = utils.formatEther(tradingData.fundingRateLong);
    const numberRawdata = (Number(rawdata) * 100).toFixed(4);
    const absoluteNumber = Math.abs(Number(numberRawdata));
    rateLong = ` ${absoluteNumber}%`;
    if (Number(numberRawdata) > 0) {
      longSide = 'Pay';
    } else {
      longSide = 'Get';
    }
  }
  if (tradingData && tradingData.fundingRateShort) {
    const rawdata = utils.formatEther(tradingData.fundingRateShort);
    const numberRawdata = (Number(rawdata) * 100).toFixed(4);
    const absoluteNumber = Math.abs(Number(numberRawdata));
    rateShort = ` ${absoluteNumber}%`;
    if (Number(numberRawdata) > 0) {
      shortSide = 'Get';
    } else {
      shortSide = 'Pay';
    }
  }

  function startCountdown() {
    if (!hadKey) {
      setTimeLabel('-- : -- : --');
      return;
    }
    let endTime = tradingData.nextFundingTime * 1000;
    const { fundingPeriod } = tradingData;
    if (interval !== null) {
      clearInterval(interval);
    }
    const intervalTime: any = setInterval(() => {
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
    wsChatInterval.set(intervalTime);
  }

  if (hadKey && nextFundingTime !== tradingData.nextFundingTime) {
    setNextFundingTime(tradingData.nextFundingTime);
    startCountdown();
  }

  const handleToggleAlertOverlay = (show: any) => {
    if (show) {
      setShowAlertOverlay(true);
    } else if (isAlertTooltipHasShown) {
      // hide on mouse exit, only if has shown
      setShowAlertOverlay(false);
    }
  };

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
            <p className="cursor-default">VAMM - Oracle Price Gap:</p>
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
            <span className="flex w-[209px] justify-between">
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
});

const ProComponent = forwardRef((props: any, ref: any) => {
  const selectedTimeIndex = useNanostore(wsSelectedTimeIndex);
  const { visible, onVisibleChanged, tradingData, currentToken } = props;
  const [currentTagMaxAndMinValue, setCurrentTagMaxAndMinValue] = useState({ max: '-.--', min: '-.--' });
  const [priceChangeRatioAndValue, setPriceChangeRatioAndValue] = useState({ priceChangeRatio: '', priceChangeValue: '' });
  const [dayVolume, setDayVolume] = useState(tradingData.dayVolume);
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

    const timer1 = setTimeout(() => {
      if (onVisibleChanged) onVisibleChanged(visible);
    }, 500);

    return () => {
      clearTimeout(timer1);
    };
  }, [visible, onVisibleChanged]);

  return (
    <div className={`w-[261px] whitespace-nowrap rounded-none bg-black px-[34px] py-[26px] ${visible ? 'visible' : ''}`}>
      <div className="content ml-[12px] flex flex-col space-y-[24px]">
        <div className="flex text-[12px] text-mediumEmphasis">
          <div className="flex-1">
            <p className="mb-[6px]">{displayTimeKey} High</p>
            <SmallPriceIcon
              priceValue={!currentTagMaxAndMinValue.max ? '-.--' : currentTagMaxAndMinValue.max}
              isLoading={currentTagMaxAndMinValue.max === '-.--'}
            />
          </div>
          <div className="flex flex-1 flex-col items-end">
            <p className="mb-[6px]">{displayTimeKey} Low</p>
            <SmallPriceIcon
              priceValue={!currentTagMaxAndMinValue.min ? '-.--' : currentTagMaxAndMinValue.min}
              isLoading={currentTagMaxAndMinValue.min === '-.--'}
            />
          </div>
        </div>
        <div>
          <div className="flex text-[14px] text-mediumEmphasis">
            <div className="flex flex-1 flex-col">
              <span className="text-marketGreen">Long</span>
              <span className={`text-highEmphasis ${!tradingData.longRatio ? flashAnim : ''}`}>
                {!tradingData.longRatio ? '-.--' : formatterValue(tradingData.longRatio, 0, '%')}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-end">
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
        <div className="text-medium flex text-[12px] text-mediumEmphasis">
          <div className="flex-1">
            <p className="mb-[6px]">Volume (24Hr)</p>
            <SmallPriceIcon priceValue={!dayVolume ? '-.--' : formatterValue(dayVolume, 2)} isLoading={!dayVolume} />
          </div>
        </div>
      </div>
    </div>
  );
});

function ChartWindows(props: any, ref: any) {
  const { tradingData } = props;
  const [isStartLoadingChart, setIsStartLoadingChart] = useState(false);
  const [lineChartData, setLineChartData] = useState([]);

  const chartProContainerRef = useRef(null);
  const graphHeaderRef = useRef();
  const proRef = useRef();
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

    const dynamicDataSet = chartData.graphData.map((params: any) => {
      const { end, avgPrice } = params;
      return { time: end, value: utils.formatEther(avgPrice) };
    });
    setLineChartData(dynamicDataSet);
    setIsStartLoadingChart(false);
  };

  useImperativeHandle(ref, () => ({ fetchChartData }));

  useEffect(() => {
    const gRef: any = graphHeaderRef.current;
    gRef.reset();
    const pRef: any = proRef.current;
    pRef.reset();
    fetchChartData();
  }, [currentToken, selectedTimeIndex]); // from tokenRef.current

  const handleSelectedTimeIndex = (index: any) => {
    chartButtonLogged(index, currentToken); // from tokenRef.current
    wsSelectedTimeIndex.set(index);
  };

  return (
    <div className="chartWindow mb-[36px]">
      <div className="">
        <ChartHeaders
          ref={graphHeaderRef}
          tradingData={tradingData}
          setSelectedTimeIndex={handleSelectedTimeIndex}
          isStartLoadingChart={isStartLoadingChart}
        />
        <div className="dividerslim" />
        <div ref={chartProContainerRef} className="chart-pro-container mb-[16px] flex">
          <div className="chartcontainer flex-1">
            <ChartDisplay
              lineChartData={lineChartData}
              isStartLoadingChart={isStartLoadingChart}
              chartProContainerRef={chartProContainerRef}
            />
          </div>
          <ProComponent ref={proRef} tradingData={tradingData} />
        </div>
        <ChartFooter tradingData={tradingData} setSelectedTimeIndex={handleSelectedTimeIndex} isStartLoadingChart={isStartLoadingChart} />
      </div>
    </div>
  );
}

export default forwardRef(ChartWindows);
