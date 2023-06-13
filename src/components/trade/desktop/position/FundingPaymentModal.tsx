/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
import { PriceWithIcon } from '@/components/common/PricWithIcon';
import { apiConnection } from '@/utils/apiConnection';
import { calculateNumber } from '@/utils/calculateNumbers';
import { walletProvider } from '@/utils/walletProvider';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { utils } from 'ethers';
import { formatDateTime } from '@/utils/date';
import { ThreeDots } from 'react-loader-spinner';
import collectionList from '@/const/collectionList';
import { useStore as useNanostore } from '@nanostores/react';
import { wsCurrentToken, wsFullWalletAddress } from '@/stores/WalletState';

const FundingPaymentModal = (props: any) => {
  const { setShowFundingPaymentModal, tradingData } = props;

  const currentToken = useNanostore(wsCurrentToken);
  const currentCollection = collectionList.filter((item: any) => item.collection.toUpperCase() === currentToken.toUpperCase())[0];

  const [isLoading, setIsLoading] = useState(false);
  const [fpRecords, setFpRecords] = useState([]);
  const [fpTotal, setFpTotal] = useState(0);
  const [timeLabel, setTimeLabel] = useState('-- : -- : --');
  const [interval, setI] = useState(null);
  const [nextFundingTime, setNextFundingTime] = useState(0);
  const fullWalletAddress = useNanostore(wsFullWalletAddress);

  const currentAmm = currentCollection.amm;
  const hadKey = Object.keys(tradingData).length > 0;
  let hours = '';
  let minutes = '';
  let seconds = '';
  let rateLong = '-.--';
  let rateShort = '-.--';
  let longSide = '';
  let shortSide = '';

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

  useEffect(() => {
    setIsLoading(true);
    setFpTotal(0);
    if (walletProvider.holderAddress) {
      apiConnection.getUserFundingPaymentHistoryWithAmm(walletProvider.holderAddress, currentAmm).then(data => {
        const total: any = Number(calculateNumber(data.data.total, 6))?.toFixed(6);
        setFpTotal(total);
        setFpRecords(data.data.fundingPaymentPnlHistory);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [fullWalletAddress]);

  return (
    <div
      className="fixed bottom-0 left-0 top-0 z-10 flex  h-full
      w-full items-center justify-center bg-black/[.2] backdrop-blur-[4px]"
      onClick={() => setShowFundingPaymentModal(false)}>
      <div
        className="relative h-[600px] w-[800px] rounded-[12px] border-[1px]
        border-[#71aaff38] bg-lightBlue text-[14px] font-normal text-mediumEmphasis"
        onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-[26px]">
          <div className="flex items-center space-x-[6px]">
            <Image src={currentCollection.image} width={24} height={24} alt="" />
            <p className="font-600 text-[16px] text-highEmphasis">{currentCollection.shortName} Funding Payment History</p>
          </div>
          <div className="flex">
            <div className="flex-1" />
            <div className="flex flex-col items-end">
              <span className="flex w-[203px] justify-between text-[12px] text-highEmphasis">
                <span>Next Funding Payment : </span>
                <span className="font-600">{timeLabel}</span>
              </span>
            </div>
          </div>
          <div className="absolute right-6 top-6 cursor-pointer" onClick={() => setShowFundingPaymentModal(false)}>
            <Image src="/images/components/common/modal/close.svg" width={16} height={16} alt="" />
          </div>
        </div>
        <div className="body">
          <div className="collection-table">
            <div className="px-3 pb-6">
              <div className="flex">
                <div className="min-w-[190px] px-[18px]">Time</div>
                <div className="min-w-[190px] px-[18px]">P/L</div>
                <div className="mr-[12px] flex flex-1 justify-end text-highEmphasis">
                  Long &nbsp;<span className={longSide === 'pay' ? 'text-marketRed' : 'text-marketGreen'}>{longSide}</span>
                  &nbsp;{rateLong}
                  &nbsp; Short &nbsp;<span className={shortSide === 'pay' ? 'text-marketRed' : 'text-marketGreen'}>{shortSide}</span>
                  &nbsp;{rateShort}
                </div>
              </div>
            </div>
            <div className={`scrollable max-h-[460px] overflow-y-scroll ${fpRecords.length > 0 ? 'pb-[60px]' : ''}`}>
              {isLoading ? (
                <div className="flex min-w-[400px] items-center justify-center">
                  <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
                </div>
              ) : fpRecords.length > 0 ? (
                fpRecords.map((item: any, idx: any) => {
                  const timeValue = formatDateTime(item.timestamp, 'L HH:mm');
                  const value = Number(calculateNumber(item.fundingPaymentPnl, 6))?.toFixed(6);
                  return (
                    <div
                      className={`flex p-3
                      ${idx % 2 === 0 ? 'bg-[#1c1d3f]' : 'bg-lightBlue'}`}
                      key={`fp-row-${idx}`}>
                      <div className="flex min-w-[190px] items-center px-[18px]">
                        <div className="mr-2 h-[24px] w-[2px] rounded-[2px] bg-[#4287f5]" />
                        <p className="text-[16px]">{timeValue}</p>
                      </div>
                      <div className="min-w-[190px] px-[18px]">
                        <PriceWithIcon
                          priceValue={Number(value) > 0 ? `+${value}` : Number(value) === 0 ? '0.000000' : value}
                          className={Number(value) > 0 ? 'text-marketGreen' : Number(value) === 0 ? '' : 'text-marketRed'}
                        />
                      </div>
                      <div className="flex-2" />
                    </div>
                  );
                })
              ) : (
                <div className="item-center flex justify-center">
                  <span className="body1 my-52 text-center text-mediumEmphasis">You have no funding payment history.</span>
                </div>
              )}
            </div>
          </div>
          {fpRecords.length > 0 ? (
            <div
              className="absolute bottom-0 flex w-[100%] items-center justify-end
                rounded-b-[12px] border-t-[1px] border-t-[#71aaff38] bg-lightBlue">
              <div className="mx-[36px] my-[30px] flex items-center">
                <span className="mr-[36px] text-highEmphasis">Total Received: </span>
                <PriceWithIcon
                  priceValue={fpTotal > 0 ? `+${fpTotal}` : fpTotal === 0 ? '0.000000' : fpTotal}
                  className={fpTotal > 0 ? 'text-marketGreen' : fpTotal === 0 ? '' : 'text-marketRed'}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FundingPaymentModal;
