import { Contract, getAMMContract, getCHViewerContract } from '@/const/contracts';
import React, { useEffect } from 'react';
import { useContractRead } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm, $oraclePrice, $vammPrice, $nextFundingTime, $fundingRates, $openInterests } from '@/stores/trading';
import { ammAbi, chViewerAbi } from '@/const/abi';
import { formatBigInt } from '@/utils/bigInt';
import { $currentChain } from '@/stores/user';

const Updater = ({ ammContract, chViewer }: { ammContract: Contract; chViewer: Contract }) => {
  const { data: vammPrice } = useContractRead({ ...ammContract, abi: ammAbi, functionName: 'getSpotPrice', watch: true });
  const { data: oraclePrice } = useContractRead({ ...ammContract, abi: ammAbi, functionName: 'getUnderlyingPrice', watch: true });
  const { data: nextFundingTime } = useContractRead({ ...ammContract, abi: ammAbi, functionName: 'nextFundingTime', watch: true });
  const { data: longPositionSize } = useContractRead({ ...ammContract, abi: ammAbi, functionName: 'longPositionSize', watch: true });
  const { data: shortPositionSize } = useContractRead({ ...ammContract, abi: ammAbi, functionName: 'shortPositionSize', watch: true });
  const { data: fundingRatesData } = useContractRead({
    ...chViewer,
    abi: chViewerAbi,
    functionName: 'getFundingRates',
    args: [ammContract.address],
    watch: true
  });

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

  if (!ammContract || !chViewer) return null;
  return <Updater ammContract={ammContract} chViewer={chViewer} />;
};

export default TradingDataUpdater;
