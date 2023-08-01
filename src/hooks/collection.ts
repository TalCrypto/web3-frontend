import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentChain, $userPositionInfos, UserPositionInfo, $userFPHistory, $userTotalFP, $userIsWrongNetwork } from '@/stores/user';
import {
  $collectionConfig,
  $dailyVolume,
  $ohlcData,
  $highPrice,
  $lowPrice,
  $oraclePrice,
  $priceChange,
  $priceChangePct,
  $transactionPendings,
  $vammPrice
} from '@/stores/trading';
import { AMM } from '@/const/collectionList';
import { getSupportedAMMs } from '@/const/addresses';
import { SingleValueData } from 'lightweight-charts';
import { getRandomIntInclusive } from '@/utils/number';

export const usePositionInfo = (amm?: AMM): UserPositionInfo | undefined => {
  const positionInfos = useNanostore($userPositionInfos);
  return amm ? positionInfos[amm] : undefined;
};

export const useFundingPaymentHistory = (amm: AMM) => {
  const totalFPs = useNanostore($userTotalFP);
  const fpHistories = useNanostore($userFPHistory);

  return { total: totalFPs[amm], fpRecords: fpHistories[amm] };
};

export const usePositionInfosIsLoading = (): boolean => {
  const chain = useNanostore($currentChain);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const [isLoading, setIsLoading] = useState(true);
  const positionInfos = useNanostore($userPositionInfos);

  useEffect(() => {
    if (chain && !isWrongNetwork) {
      const amms = getSupportedAMMs(chain);
      setIsLoading(!(positionInfos && Object.keys(positionInfos).length === amms.length));
    } else {
      setIsLoading(false);
    }
  }, [positionInfos, chain, isWrongNetwork]);
  return isLoading;
};

export const useIsOverPriceGap = () => {
  const vammPrice = useNanostore($vammPrice);
  const oraclePrice = useNanostore($oraclePrice);
  const collectionConfig = useNanostore($collectionConfig);
  const isOverPriceGap =
    oraclePrice && vammPrice ? Math.abs((vammPrice - oraclePrice) / oraclePrice) >= collectionConfig.liqSwitchRatio : false;
  return isOverPriceGap;
};

export const useTransactionIsPending = (amm?: AMM): boolean => {
  const pendings = useNanostore($transactionPendings);
  return amm ? Boolean(pendings[amm]) : false;
};

export const useChartData = (): {
  graphData: SingleValueData[];
  graphVolData: SingleValueData[];
  graphTwoData: SingleValueData[];
  dailyVolume?: number;
  priceChange?: number;
  priceChangePct?: number;
  highPrice?: number;
  lowPrice?: number;
} => {
  const ohlcData = useNanostore($ohlcData);
  const dailyVolume = useNanostore($dailyVolume);
  const priceChange = useNanostore($priceChange);
  const priceChangePct = useNanostore($priceChangePct);
  const highPrice = useNanostore($highPrice);
  const lowPrice = useNanostore($lowPrice);
  const graphData = ohlcData.map(record => ({ time: record.time, value: record.close }));

  // todo: get graph vol data
  const graphVolData = ohlcData.map(record => ({
    time: record.time,
    value: getRandomIntInclusive(1, record.close * 10),
    color: Math.random() > 0.5 ? 'rgba(120, 243, 99, 0.3)' : 'rgba(255, 86, 86, 0.3)'
  }));

  // todo: second graph oracle / vamm
  const graphTwoData = ohlcData.map(record => ({
    time: record.time,
    value: record.close + 0.01
  }));

  return { graphData, graphVolData, graphTwoData, dailyVolume, priceChange, priceChangePct, highPrice, lowPrice };
};
