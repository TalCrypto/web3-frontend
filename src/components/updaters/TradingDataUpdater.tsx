import { getSupportedAMMs } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { getAMMContract, getCHViewerContract } from '@/const/contracts';
import React, { useEffect, useState } from 'react';
import { Chain, useContractReads, useNetwork } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAMM, $isTradingDataInitializing } from '@/stores/trading';

const CollectionUpdater: React.FC<{ chain: Chain; amm: AMM }> = ({ chain, amm }) => {
  const ammContract = getAMMContract(chain, amm);
  if (!ammContract) return null;
  const chViewerContract = getCHViewerContract(chain);
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      { ...ammContract, functionName: 'getSpotPrice' },
      { ...ammContract, functionName: 'getUnderlyingPrice' },
      { ...ammContract, functionName: 'nextFundingTime' },
      { ...ammContract, functionName: 'fundingPeriod' },
      { ...ammContract, functionName: 'longPositionSize' },
      { ...ammContract, functionName: 'shortPositionSize' },
      { ...chViewerContract, functionName: 'getFundingRates', args: [ammContract.address] }
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
  const currentAMM = useNanostore($currentAMM);

  if (!currentAMM || !chain) return null;
  return <CollectionUpdater key={currentAMM} amm={currentAMM} chain={chain} />;
};

export default TradingDataUpdater;
