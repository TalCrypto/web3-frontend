/* eslint-disable react-hooks/exhaustive-deps */
import LoadingIndicator from '@/components/common/LoadingIndicator';
import { PriceWithIcon } from '@/components/common/PricWithIcon';
import collectionList from '@/const/collectionList';
import { apiConnection } from '@/utils/apiConnection';
import { calculateNumber } from '@/utils/calculateNumbers';
import { getTradingOverview } from '@/utils/trading';
import { walletProvider } from '@/utils/walletProvider';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { utils } from 'ethers';
import { formatDateTime } from '@/utils/date';

function PaymentRecord(props: any) {
  const { item } = props;
  const timeValue = formatDateTime(item.timestamp, 'L HH:mm');
  const value = Number(calculateNumber(item.fundingPaymentPnl, 6));
  return (
    <div className="content">
      <div className="slider" />
      <div className="time">{timeValue}</div>
      <div className="pnl">
        <PriceWithIcon value={value} />
      </div>
      <div className="redirect" />
    </div>
  );
}

interface ITradingData {
  nextFundingTime: number;
  fundingRateLong: string;
  fundingRateShort: string;
  fundingPeriod: number;
}

const defaultTradingData: ITradingData = {
  nextFundingTime: 0,
  fundingRateLong: '',
  fundingRateShort: '',
  fundingPeriod: 0
};

const FundingPaymentModal = (props: any) => {
  const { setShowFundingPaymentModal, amm } = props;
  const [timeLabel, setTimeLabel] = useState('-- : -- : --');
  const [interval, setI] = useState(null);

  const currentAmm = collectionList.filter(item => item.amm.toUpperCase() === amm.toUpperCase());
  const image = currentAmm.length === 0 ? collectionList[0].image : currentAmm[0].image;
  const collectionShortName = currentAmm.length === 0 ? collectionList[0].shortName : currentAmm[0].shortName;
  const ammAddr = currentAmm.length === 0 ? collectionList[0].amm : currentAmm[0].amm;
  const contract = currentAmm.length === 0 ? collectionList[0].contract : currentAmm[0].contract;
  const closeModal = () => {
    setShowFundingPaymentModal(false);
  };

  const [tradingData, setTradingData] = useState(defaultTradingData);

  const hadKey = Object.keys(tradingData).length > 0;
  const [nextFundingTime, setNextFundingTime] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fpRecords, setFpRecords] = useState([]);
  const [fpTotal, setFpTotal] = useState('');

  let hours = '0';
  let minutes = '0';
  let seconds = '0';
  let rateLong = '-.--';
  let rateShort = '-.--';
  let longSide = '';
  let shortSide = '';

  const fetchInformation = async () => {
    setTradingData(defaultTradingData);
    await getTradingOverview(ammAddr, contract).then(data => {
      setTradingData(data);
    });
  };

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

    setI(intervalTime);
  }

  if (hadKey && nextFundingTime !== tradingData.nextFundingTime) {
    setNextFundingTime(tradingData.nextFundingTime);
    startCountdown();
  }

  if (tradingData && tradingData.fundingRateLong) {
    const rawData = utils.formatEther(tradingData.fundingRateLong);
    const numberRawData = (Number(rawData) * 100).toFixed(4);
    const absoluteNumber = Math.abs(Number(numberRawData));
    rateLong = ` ${absoluteNumber}%`;
    if (Number(numberRawData) > 0) {
      longSide = 'pay';
    } else {
      longSide = 'get';
    }
  }
  if (tradingData && tradingData.fundingRateShort) {
    const rawData = utils.formatEther(tradingData.fundingRateShort);
    const numberRawData = (Number(rawData) * 100).toFixed(4);
    const absoluteNumber = Math.abs(Number(numberRawData));
    rateShort = ` ${absoluteNumber}%`;
    if (Number(numberRawData) > 0) {
      shortSide = 'get';
    } else {
      shortSide = 'pay';
    }
  }

  fetchInformation();

  useEffect(() => {
    setIsLoadingData(true);
    setFpTotal('');
    if (walletProvider.holderAddress) {
      apiConnection.getUserFundingPaymentHistoryWithAmm(walletProvider.holderAddress, ammAddr).then(data => {
        const total = Number(calculateNumber(data.data.total, 6))?.toFixed(6);
        setFpTotal(total);
        setFpRecords(data.data.fundingPaymentPnlHistory);
        setIsLoadingData(false);
      });
    } else {
      setIsLoadingData(false);
    }
  }, [walletProvider.holderAddress]);

  return (
    <div className="funding-payment-popup" onClick={() => setShowFundingPaymentModal(false)}>
      <div className="contents-mod relative" onClick={e => e.stopPropagation()}>
        <div className="title-row">
          <div className="title">
            <Image src={image} alt="" width={24} height={24} />
            {collectionShortName} Funding Payment History
          </div>
          <div className="close">
            <Image
              src="/images/components/common/modal/close.svg"
              alt=""
              className="cursor-pointer"
              width={16}
              height={16}
              onClick={closeModal}
            />
          </div>
        </div>
        <div className="funding-count-row">
          <div className="content flex w-[200px] justify-between">
            <span>Next Funding Payment: </span>
            <span className="time">{timeLabel}</span>
          </div>
        </div>
        <div className="header-row">
          <div className="time">Time</div>
          <div className="pnl">P/L</div>
          <div className="fp-item">
            Long <span className={longSide === 'pay' ? 'down' : 'up'}>{longSide}</span> {rateLong}
            &nbsp; Short <span className={shortSide === 'pay' ? 'down' : 'up'}>{shortSide}</span> {rateShort}
          </div>
        </div>
        <div className={`content-list ${fpRecords.length > 0 ? 'pb-[60px]' : ''}`}>
          {isLoadingData ? (
            <LoadingIndicator />
          ) : fpRecords.length > 0 ? (
            fpRecords.map(item => <PaymentRecord item={item} />)
          ) : (
            <div className="flex h-full">
              <span className="body1 m-auto text-center text-mediumEmphasis">You have no funding payment history.</span>
            </div>
          )}
        </div>
        {fpRecords.length > 0 ? (
          <div className="fundingpayment-table-footer absolute bottom-0 flex w-[100%] items-center justify-end bg-lightBlue">
            <div className="mx-[36px] my-[30px] flex items-center">
              <span className="mr-[36px] text-highEmphasis">Total Received: </span>
              <PriceWithIcon
                priceValue={Number(fpTotal) > 0 ? `+${fpTotal}` : Number(fpTotal) === 0 ? '0.000000' : fpTotal}
                className={Number(fpTotal) > 0 ? 'market up' : Number(fpTotal) === 0 ? 'market normaltext' : 'market down'}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default FundingPaymentModal;
