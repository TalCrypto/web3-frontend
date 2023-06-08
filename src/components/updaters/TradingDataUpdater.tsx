import { getAddressConfig } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { Contract, Contracts, getContracts } from '@/const/contracts';
import React, { useEffect, useState } from 'react';
import { Address, useAccount, useContractRead, useContractReads, useNetwork } from 'wagmi';

const CollectionUpdater: React.FC<{ chViewer: Contract; amm: Contract }> = ({ chViewer, amm }) => {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      { ...amm, functionName: 'getSpotPrice' },
      { ...amm, functionName: 'getUnderlyingPrice' },
      { ...amm, functionName: 'nextFundingTime' },
      { ...amm, functionName: 'fundingPeriod' },
      { ...amm, functionName: 'longPositionSize' },
      { ...amm, functionName: 'shortPositionSize' },
      { ...chViewer, functionName: 'getFundingRates', args: [amm.address] }
    ],
    watch: true
  });

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

const PositionInfoUpdater: React.FC<{ chViewer: Contract; ammAddr: Address }> = ({ chViewer, ammAddr }) => {
  const { address } = useAccount();
  if (!address) return null;
  const { data, isError, isLoading } = useContractRead({
    ...chViewer,
    functionName: 'getTraderPositionInfoWithoutPriceImpact',
    args: [ammAddr, address],
    watch: true
  });

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
  const [amms, setAmms] = useState<Array<keyof typeof AMM> | undefined>();
  const [contracts, setContracts] = useState<Contracts | undefined>();
  useEffect(() => {
    if (chain) {
      const ammArray = getAddressConfig(chain, chain.unsupported ?? false);
      const ammKeys = Object.keys(ammArray.amms) as Array<keyof typeof AMM>;
      setAmms(ammKeys);
      const conts = getContracts(chain, chain.unsupported ?? false);
      setContracts(conts);
    }
  }, [chain]);

  if (!amms || !contracts) return null;

  return (
    <>
      {amms.map(ammKey => {
        const amm: Contract | undefined = contracts.amms[AMM[ammKey]];
        if (!amm) return null;
        return <CollectionUpdater key={ammKey} chViewer={contracts.chViewer} amm={amm} />;
      })}
      {amms.map(ammKey => {
        const amm: Contract | undefined = contracts.amms[AMM[ammKey]];
        if (!amm) return null;
        return <PositionInfoUpdater key={ammKey} chViewer={contracts.chViewer} ammAddr={amm.address} />;
      })}
    </>
  );
};

export default TradingDataUpdater;
