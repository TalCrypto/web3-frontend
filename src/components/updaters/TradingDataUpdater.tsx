import { Contract, getAMMContract, getCHViewerContract } from '@/const/contracts';
import React, { useEffect } from 'react';
import { useContractReads } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $collectionConfig, $currentAmm, $isTradingDataInitializing, $tradingData } from '@/stores/trading';
import { ammAbi, chViewerAbi } from '@/const/abi';
import { formatBigInt } from '@/utils/bigInt';
import { $currentChain } from '@/stores/user';

const Updater = ({ ammContract, chViewerContract }: { ammContract: Contract; chViewerContract: Contract }) => {
  const collectionConfig = useNanostore($collectionConfig);
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

  console.log('data', data);

  const vammPrice = data ? data[0].result : 0n;
  const oraclePrice = data ? data[1].result : 0n;
  const nextFundingTime = data ? data[2].result : 0n;
  const longSize = data ? data[3].result : 0n;
  const shortSize = data ? data[4].result : 0n;
  const fundingRates = data ? data[5].result : null;
  const fundingRateLong = fundingRates ? fundingRates[0] : 0n;
  const fundingRateShort = fundingRates ? fundingRates[1] : 0n;

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

  useEffect(() => {
    $isTradingDataInitializing.set(isLoading);
  }, [isLoading]);

  return null;
};

const TradingDataUpdater: React.FC = () => {
  const chain = useNanostore($currentChain);
  const currentAmm = useNanostore($currentAmm);
  console.log('updater--------------------1');
  if (!currentAmm || !chain) return null;

  const ammContract = getAMMContract(chain, currentAmm);
  console.log('updater--------------------2', chain, currentAmm, ammContract);
  if (!ammContract) return null;
  console.log('updater--------------------3');
  const chViewerContract = getCHViewerContract(chain);

  return <Updater ammContract={ammContract} chViewerContract={chViewerContract} />;
};

export default TradingDataUpdater;
