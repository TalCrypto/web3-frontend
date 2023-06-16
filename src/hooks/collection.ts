import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentChain, $userPositionInfos, UserPositionInfo } from '@/stores/user';
import {
  $chartData,
  $dailyVolume,
  $isTradingDataInitializing,
  $tradingData,
  $transactionPendings,
  ChartData,
  CollectionTradingData
} from '@/stores/trading';
import { AMM } from '@/const/collectionList';
import { useNetwork } from 'wagmi';
import { getSupportedAMMs } from '@/const/addresses';

export const usePositionInfo = (amm?: AMM): UserPositionInfo | undefined => {
  const positionInfos = useNanostore($userPositionInfos);
  return amm ? positionInfos[amm] : undefined;
};

export const usePositionInfosIsLoading = (): boolean => {
  const chain = useNanostore($currentChain);
  const [isLoading, setIsLoading] = useState(true);
  const positionInfos = useNanostore($userPositionInfos);

  useEffect(() => {
    if (chain) {
      const amms = getSupportedAMMs(chain);
      setIsLoading(!(positionInfos && Object.keys(positionInfos).length === amms.length));
    }
  }, [positionInfos, chain]);
  return isLoading;
};

export const useTradingData = (): { isLoading: boolean; tradingData?: CollectionTradingData } => {
  const tradingData = useNanostore($tradingData);
  const isLoading = useNanostore($isTradingDataInitializing);
  return { isLoading, tradingData };
};

export const useTransactionIsPending = (amm?: AMM): boolean => {
  const pendings = useNanostore($transactionPendings);
  return amm ? Boolean(pendings[amm]) : false;
};

export const useChartData = (): { isLoading: boolean; chartData?: ChartData; dailyVolume?: number } => {
  const isLoading = useNanostore($isTradingDataInitializing);
  const chartData = useNanostore($chartData);
  const dailyVolume = useNanostore($dailyVolume);
  return { isLoading, chartData, dailyVolume };
};
