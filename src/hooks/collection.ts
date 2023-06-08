import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userPositionInfos, UserPositionInfo } from '@/stores/user';
import { $tradingData, $transactionPendings, CollectionTradingData } from '@/stores/trading';
import { CollectionInfo, getCollectionInformation, AMM } from '@/const/collectionList';

export const usePositionInfo = (amm: AMM | undefined): UserPositionInfo | undefined => {
  const positionInfos = useNanostore($userPositionInfos);
  const [positionInfo, setPositionInfo] = useState<UserPositionInfo | undefined>();
  useEffect(() => {
    if (amm && positionInfos[amm]) {
      setPositionInfo(positionInfos[amm]);
    }
  }, [amm, positionInfos]);
  return positionInfo;
};

export const useTradingData = (amm: AMM | undefined): CollectionTradingData | undefined => {
  const tradingData = useNanostore($tradingData);
  const [ammTradingData, setAmmTradingData] = useState<CollectionTradingData | undefined>();
  useEffect(() => {
    if (amm && tradingData[amm]) {
      setAmmTradingData(tradingData[amm]);
    }
  }, [amm, tradingData]);
  return ammTradingData;
};

export const useTransactionIsPending = (amm: AMM | undefined): boolean => {
  const pendings = useNanostore($transactionPendings);
  const [isPending, setIsPending] = useState(false);
  useEffect(() => {
    if (amm && pendings[amm]) {
      setIsPending(Boolean(pendings[amm]));
    }
  }, [amm, pendings]);
  return isPending;
};

export const useCollectionInfo = (amm: AMM | undefined): CollectionInfo | undefined => {
  const [info, setInfo] = useState<CollectionInfo | undefined>();
  useEffect(() => {
    if (amm) {
      setInfo(getCollectionInformation(amm));
    }
  }, [amm]);
  return info;
};
