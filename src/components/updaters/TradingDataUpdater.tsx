import { getSupportedAMMs } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { getAMMContract, getCHViewerContract } from '@/const/contracts';
import React, { useEffect, useState } from 'react';
import { Chain, useContractReads, useNetwork } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm, $isTradingDataInitializing } from '@/stores/trading';
import { ammAbi, chViewerAbi } from '@/const/abi';

const CollectionUpdater: React.FC<{ chain: Chain; amm: AMM }> = ({ chain, amm }) => {
  const ammContract = getAMMContract(chain, amm);
  if (!ammContract) return null;
  const chViewerContract = getCHViewerContract(chain);
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      { ...ammContract, abi: ammAbi, functionName: 'getSpotPrice' },
      { ...ammContract, abi: ammAbi, functionName: 'getUnderlyingPrice' },
      { ...ammContract, abi: ammAbi, functionName: 'nextFundingTime' },
      { ...ammContract, abi: ammAbi, functionName: 'fundingPeriod' },
      { ...ammContract, abi: ammAbi, functionName: 'longPositionSize' },
      { ...ammContract, abi: ammAbi, functionName: 'shortPositionSize' },
      { ...chViewerContract, abi: chViewerAbi, functionName: 'getFundingRates', args: [ammContract.address] }
    ],
    watch: true
  });

  $isTradingDataInitializing.set(isLoading);

  console.log(data, isError, isLoading);

  // const [spotPrice, nextFundingTimeInfo, fundingPeriodInfo, longSize, shortSize, fundingRateInfo] = await multicallProvider.all([
  //   ammContract.getSpotPrice(),
  //   ammContract.nextFundingTime(),
  //   ammContract.fundingPeriod(),
  //   ammContract.longPositionSize(),
  //   ammContract.shortPositionSize(),
  //   clearingHouseViewerContract.getFundingRates(ammAddr)
  // ]);

  return null;
};

const TradingDataUpdater: React.FC = () => {
  const { chain } = useNetwork();
  const currentAmm = useNanostore($currentAmm);

  if (!currentAmm || !chain) return null;
  return <CollectionUpdater amm={currentAmm} chain={chain} />;
};

export default TradingDataUpdater;
