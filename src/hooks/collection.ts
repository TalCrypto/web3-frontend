import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentChain, $userPositionInfos, UserPositionInfo } from '@/stores/user';
import {
  $collectionConfig,
  $dailyVolume,
  $graphData,
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
  graphData: OhlcData[];
  dailyVolume?: number;
  priceChange?: number;
  priceChangePct?: number;
  highPrice?: number;
  lowPrice?: number;
} => {
  const graphData = useNanostore($graphData);
  const dailyVolume = useNanostore($dailyVolume);
  const priceChange = useNanostore($priceChange);
  const priceChangePct = useNanostore($priceChangePct);
  const highPrice = useNanostore($highPrice);
  const lowPrice = useNanostore($lowPrice);
  return { graphData, dailyVolume, priceChange, priceChangePct, highPrice, lowPrice };
};
