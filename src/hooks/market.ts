/* eslint-disable no-unused-vars */
import { AMM } from '@/const/collectionList';
import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $collectionConfig } from '@/stores/trading';
import { $currentChain } from '@/stores/user';

export interface CollectionOverview {
  amm: AMM;
  vammPrice?: number;
  oraclePrice?: number;
  priceChangeRatio24h?: number;
  priceChangeRatio7d?: number;
  priceChangeRatio30d?: number;
  priceChange24h?: number;
  priceChange7d?: number;
  priceChange30d?: number;
  volume?: number;
  fundingRateShort?: number;
  fundingRateLong?: number;
}

export interface GetMktOverview {
  isLoading: boolean;
  data?: Array<CollectionOverview>;
}

export const useMarketOverview = (triggerUpdate: boolean): GetMktOverview => {
  const config = useNanostore($collectionConfig);
  const chain = useNanostore($currentChain);
  const [data, setData] = useState<Array<CollectionOverview>>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, [triggerUpdate, chain, config]);
  return { isLoading, data };
};
