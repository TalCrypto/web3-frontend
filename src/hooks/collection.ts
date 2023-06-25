import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentChain, $userPositionInfos, UserPositionInfo } from '@/stores/user';
import {
  $dailyVolume,
  $graphData,
  $highPrice,
  $isChartDataInitializing,
  $isTradingDataInitializing,
  $lowPrice,
  $priceChange,
  $priceChangePct,
  $tradingData,
  $transactionPendings,
  CollectionTradingData
} from '@/stores/trading';
import { AMM } from '@/const/collectionList';
import { getSupportedAMMs } from '@/const/addresses';
import { OhlcData } from 'lightweight-charts';

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
    } else {
      setIsLoading(false);
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

export const useChartData = (): {
  isLoading: boolean;
  graphData: OhlcData[];
  dailyVolume?: number;
  priceChange?: number;
  priceChangePct?: number;
  highPrice?: number;
  lowPrice?: number;
} => {
  const isLoading = useNanostore($isChartDataInitializing);
  const graphData = useNanostore($graphData);
  const dailyVolume = useNanostore($dailyVolume);
  const priceChange = useNanostore($priceChange);
  const priceChangePct = useNanostore($priceChangePct);
  const highPrice = useNanostore($highPrice);
  const lowPrice = useNanostore($lowPrice);
  return { isLoading, graphData, dailyVolume, priceChange, priceChangePct, highPrice, lowPrice };
};
