import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userPositionInfos, UserPositionInfo } from '@/stores/user';
import { $tradingData, $transactionPendings, CollectionTradingData } from '@/stores/trading';
import { AMM } from '@/const/collectionList';
import { useNetwork } from 'wagmi';
import { getSupportedAMMs } from '@/const/addresses';

export const usePositionInfo = (amm?: AMM): UserPositionInfo | undefined => {
  const positionInfos = useNanostore($userPositionInfos);
  return amm ? positionInfos[amm] : undefined;
};

export const usePositionInfosIsLoading = (): boolean => {
  const { chain } = useNetwork();
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

export const useTradingData = (amm?: AMM): CollectionTradingData | undefined => {
  const tradingData = useNanostore($tradingData);
  return amm ? tradingData[amm] : undefined;
};

export const useTransactionIsPending = (amm?: AMM): boolean => {
  const pendings = useNanostore($transactionPendings);
  return amm ? Boolean(pendings[amm]) : false;
};
