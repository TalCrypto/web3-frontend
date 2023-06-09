import { AMM } from '@/const/collectionList';
import { useEffect, useState } from 'react';

export interface CollectionOverview {
  hasPosition: boolean;
  amm: AMM;
  futurePrice: number;
  spotPrice: number;
  priceChangeRatio24h: number;
  priceChangeRatio7d: number;
  priceChangeRatio30d: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  volume: number;
  fundingRateShort: number;
  fundingRateLong: number;
}

export type MarketOverview = {
  // eslint-disable-next-line no-unused-vars
  [value in AMM]?: CollectionOverview;
};

export interface GetMktOverview {
  isLoading: boolean;
  data?: MarketOverview;
}

export const useMarketOverview = (triggerUpdate: boolean): GetMktOverview => {
  const [data, setData] = useState<MarketOverview>();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // TODO setIsUpdating(true)
  }, [triggerUpdate]);
  return { isLoading, data };
};
