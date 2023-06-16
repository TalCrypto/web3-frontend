import { getAMMContract, getCHViewerContract } from '@/const/contracts';
import React, { useEffect } from 'react';
import { useContractReads, useNetwork } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $collectionConfig, $currentAmm, $isTradingDataInitializing, $tradingData } from '@/stores/trading';
import { ammAbi, chViewerAbi } from '@/const/abi';
import { formatBigInt } from '@/utils/bigInt';

const TradingDataUpdater: React.FC = () => {
  const { chain } = useNetwork();
  const currentAmm = useNanostore($currentAmm);
  const collectionConfig = useNanostore($collectionConfig);
  if (!currentAmm || !chain) return null;
  const ammContract = getAMMContract(chain, currentAmm);
  if (!ammContract) return null;
  const chViewerContract = getCHViewerContract(chain);
  const { data, isLoading } = useContractReads({
    contracts: [
      { ...ammContract, abi: ammAbi, functionName: 'getSpotPrice' },
      { ...ammContract, abi: ammAbi, functionName: 'getUnderlyingPrice' },
      { ...ammContract, abi: ammAbi, functionName: 'nextFundingTime' },
      { ...ammContract, abi: ammAbi, functionName: 'longPositionSize' },
      { ...ammContract, abi: ammAbi, functionName: 'shortPositionSize' },
      { ...chViewerContract, abi: chViewerAbi, functionName: 'getFundingRates', args: [ammContract.address] }
    ],
    watch: true
  });

  $isTradingDataInitializing.set(isLoading);
  if (!data) return null;
  const vammPrice = data[0].result;
  const oraclePrice = data[1].result;
  const nextFundingTime = data[2].result;
  const longSize = data[3].result;
  const shortSize = data[4].result;
  const fundingRates = data[5].result;
  const fundingRateLong = fundingRates ? fundingRates[0] : null;
  const fundingRateShort = fundingRates ? fundingRates[1] : null;

  useEffect(() => {
    if (
      vammPrice &&
      oraclePrice &&
      nextFundingTime &&
      longSize &&
      shortSize &&
      fundingRateLong &&
      fundingRateShort &&
      collectionConfig.liqSwitchRatio
    ) {
      const openInterest = longSize + shortSize;
      const shortRatio = openInterest === 0n ? 50 : formatBigInt(shortSize) / formatBigInt(openInterest);
      const longRatio = 100 - shortRatio;
      const numVammPrice = formatBigInt(vammPrice);
      const numOraclePrice = formatBigInt(oraclePrice);
      const isOverPriceGap = Math.abs((numVammPrice - numOraclePrice) / numOraclePrice) >= collectionConfig.liqSwitchRatio;
      $tradingData.set({
        vammPrice: numVammPrice,
        oraclePrice: numOraclePrice,
        shortSize: formatBigInt(shortSize),
        longSize: formatBigInt(longSize),
        shortRatio,
        longRatio,
        nextFundingTime: Number(nextFundingTime),
        fundingRateLong: formatBigInt(fundingRateLong),
        fundingRateShort: formatBigInt(fundingRateShort),
        isOverPriceGap
      });
    }
  }, [vammPrice, oraclePrice, nextFundingTime, longSize, shortSize, fundingRateLong, fundingRateShort, collectionConfig]);

  return null;
};

export default TradingDataUpdater;
