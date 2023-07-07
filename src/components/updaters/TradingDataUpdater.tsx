import { Contract, getAMMContract, getCHViewerContract } from '@/const/contracts';
import React, { useEffect, useState } from 'react';
import { useContractReads } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm, $oraclePrice, $vammPrice, $nextFundingTime, $fundingRates, $openInterests } from '@/stores/trading';
import { ammAbi, chViewerAbi } from '@/const/abi';
import { formatBigInt } from '@/utils/bigInt';
import { $currentChain } from '@/stores/user';

const Updater = ({ ammContract, chViewer }: { ammContract: Contract; chViewer: Contract }) => {
  const { data } = useContractReads({
    contracts: [
      { ...ammContract, abi: ammAbi, functionName: 'getSpotPrice' },
      { ...ammContract, abi: ammAbi, functionName: 'getUnderlyingPrice' },
      { ...ammContract, abi: ammAbi, functionName: 'nextFundingTime' },
      { ...ammContract, abi: ammAbi, functionName: 'longPositionSize' },
      { ...ammContract, abi: ammAbi, functionName: 'shortPositionSize' },
      { ...chViewer, abi: chViewerAbi, functionName: 'getFundingRates', args: [ammContract.address] }
    ],
    watch: true
  });

  const vammPrice = data ? data[0].result : undefined;
  const oraclePrice = data ? data[1].result : undefined;
  const nextFundingTime = data ? data[2].result : undefined;
  const longPositionSize = data ? data[3].result : undefined;
  const shortPositionSize = data ? data[4].result : undefined;
  const fundingRatesData = data ? data[5].result : undefined;

  useEffect(() => {
    if (vammPrice !== undefined) {
      $vammPrice.set(formatBigInt(vammPrice));
    } else {
      $vammPrice.set(vammPrice);
    }
  }, [vammPrice]);

  useEffect(() => {
    if (oraclePrice !== undefined) {
      $oraclePrice.set(formatBigInt(oraclePrice));
    } else {
      $oraclePrice.set(oraclePrice);
    }
  }, [oraclePrice]);

  useEffect(() => {
    if (nextFundingTime !== undefined) {
      $nextFundingTime.set(Number(nextFundingTime));
    } else {
      $nextFundingTime.set(nextFundingTime);
    }
  }, [nextFundingTime]);

  useEffect(() => {
    if (fundingRatesData) {
      const fundingRateLong = fundingRatesData[0];
      const fundingRateShort = fundingRatesData[1];
      $fundingRates.set({ longRate: formatBigInt(fundingRateLong), shortRate: formatBigInt(fundingRateShort) });
    } else {
      $fundingRates.set(undefined);
    }
  }, [fundingRatesData]);

  useEffect(() => {
    if (longPositionSize !== undefined && shortPositionSize !== undefined) {
      const openInterest = longPositionSize + shortPositionSize;
      const shortRatio = openInterest === 0n ? 50 : (formatBigInt(shortPositionSize) / formatBigInt(openInterest)) * 100;
      const longRatio = 100 - shortRatio;
      $openInterests.set({ longRatio, shortRatio });
    } else {
      $openInterests.set(undefined);
    }
  }, [longPositionSize, shortPositionSize]);

  return null;
};

const TradingDataUpdater: React.FC = () => {
  const chain = useNanostore($currentChain);
  const currentAmm = useNanostore($currentAmm);
  const ammContract = getAMMContract(chain, currentAmm);
  const chViewer = getCHViewerContract(chain);

  if (!currentAmm || !ammContract || !chViewer) return null;

  return <Updater ammContract={ammContract} chViewer={chViewer} />;
};

export default TradingDataUpdater;
