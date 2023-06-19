import { Contract, getAMMContract, getCHViewerContract } from '@/const/contracts';
import React, { useEffect } from 'react';
import { useContractReads } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $collectionConfig, $currentAmm, $isTradingDataInitializing, $tradingData } from '@/stores/trading';
import { ammAbi, chViewerAbi } from '@/const/abi';
import { formatBigInt } from '@/utils/bigInt';
import { $currentChain } from '@/stores/user';

const Updater = ({ ammContract, chViewer }: { ammContract: Contract; chViewer: Contract }) => {
  const collectionConfig = useNanostore($collectionConfig);
  const { data, isLoading } = useContractReads({
    contracts: [
      { ...ammContract, abi: ammAbi, functionName: 'getSpotPrice' },
      { ...ammContract, abi: ammAbi, functionName: 'getUnderlyingPrice' },
      { ...ammContract, abi: ammAbi, functionName: 'nextFundingTime' },
      { ...ammContract, abi: ammAbi, functionName: 'longPositionSize' },
      { ...ammContract, abi: ammAbi, functionName: 'shortPositionSize' },
      { ...chViewer, abi: chViewerAbi, functionName: 'getFundingRates', args: [ammContract.address] }
    ]
  });

  const vammPrice = data ? data[0].result : undefined;
  const oraclePrice = data ? data[1].result : undefined;
  const nextFundingTime = data ? data[2].result : undefined;
  const longSize = data ? data[3].result : undefined;
  const shortSize = data ? data[4].result : undefined;
  const fundingRates = data ? data[5].result : undefined;
  const fundingRateLong = fundingRates ? fundingRates[0] : undefined;
  const fundingRateShort = fundingRates ? fundingRates[1] : undefined;

  useEffect(() => {
    if (
      vammPrice !== undefined &&
      oraclePrice !== undefined &&
      nextFundingTime !== undefined &&
      longSize !== undefined &&
      shortSize !== undefined &&
      fundingRateLong !== undefined &&
      fundingRateShort !== undefined
    ) {
      const openInterest = longSize + shortSize;
      const shortRatio = openInterest === 0n ? 50 : (formatBigInt(shortSize) / formatBigInt(openInterest)) * 100;
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

  useEffect(() => {
    $isTradingDataInitializing.set(isLoading);
  }, [isLoading]);
  return null;
};

const TradingDataUpdater: React.FC = () => {
  const chain = useNanostore($currentChain);
  const currentAmm = useNanostore($currentAmm);
  const ammContract = getAMMContract(chain, currentAmm);
  const chViewer = getCHViewerContract(chain);

  useEffect(() => {
    $tradingData.set(undefined);
  }, [currentAmm, chain]);
  if (!ammContract || !chViewer) return null;
  return <Updater ammContract={ammContract} chViewer={chViewer} />;
};

export default TradingDataUpdater;
