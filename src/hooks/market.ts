import { AMM } from '@/const/collectionList';
import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $tradingData } from '@/stores/trading';
import { useNetwork } from 'wagmi';
import { getAddressConfig } from '@/const/addresses';
import { getLatestSpotPriceBefore } from '@/utils/subgraph';
import { getDailySpotPriceGraphData } from '@/utils/trading';

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
  const tradingData = useNanostore($tradingData);
  const { chain } = useNetwork();
  const [data, setData] = useState<Array<CollectionOverview>>();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    async function getGraphData() {
      if (chain && tradingData) {
        const nowTs = Math.round(new Date().getTime() / 1000);
        const ts24hr = nowTs - 1 * 24 * 3600;
        const ts7Days = nowTs - 7 * 24 * 3600;
        const ts30Days = nowTs - 30 * 24 * 3600;
        const ammAddrs = getAddressConfig(chain, chain?.unsupported ?? false).amms;
        const amms = Object.keys(ammAddrs) as Array<AMM>;
        const ammAddrList = amms.map(amm => ammAddrs[amm]) as Array<string>;
        const graphDataList = await Promise.all(ammAddrList.map(ammAddr => getDailySpotPriceGraphData(ammAddr)));
        const priceList24hrAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts24hr)));
        const priceList7daysAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts7Days)));
        const priceList30daysAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts30Days)));
        const results = [];
        for (let i = 0; i < amms.length; i += 1) {
          const amm = amms[i];
          const basePrice24h = Number(priceList24hrAgo[i].spotPrice / BigInt(1e18));
          const basePrice7d = Number(priceList7daysAgo[i].spotPrice / BigInt(1e18));
          const basePrice30d = Number(priceList30daysAgo[i].spotPrice / BigInt(1e18));
          const ammTradingData = tradingData[amm];

          if (!ammTradingData) return;

          const result = {
            amm,
            vammPrice: ammTradingData.vammPrice,
            oraclePrice: ammTradingData.oraclePrice,
            priceChangeRatio24h: Number(graphDataList[i].priceChangeRatio / BigInt(1e18)),
            priceChangeRatio7d: basePrice7d !== 0 ? ((ammTradingData.vammPrice ?? 0 - basePrice7d) / basePrice7d) * 100 : undefined,
            priceChangeRatio30d: basePrice30d !== 0 ? ((ammTradingData.vammPrice ?? 0 - basePrice30d) / basePrice30d) * 100 : undefined,
            priceChange24h: ammTradingData.vammPrice - basePrice24h,
            priceChange7d: ammTradingData.vammPrice - basePrice7d,
            priceChange30d: ammTradingData.vammPrice - basePrice30d,
            volume: Number(graphDataList[i].volume / BigInt(1e18)),
            fundingRateShort: ammTradingData.fundingRateShort,
            fundingRateLong: ammTradingData.fundingRateLong
          };
          results.push(result);
        }
        setData(results);
        setIsLoading(false);
      }
    }
    getGraphData();
  }, [triggerUpdate, tradingData, chain]);
  return { isLoading, data };
};
