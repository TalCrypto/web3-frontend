/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { AMM } from '@/const/collectionList';
import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $marketUpdateTrigger } from '@/stores/trading';
import { $currentChain } from '@/stores/user';
import { getAMMByAddress, getSupportedAMMAddresses } from '@/const/addresses';
import { getDailySpotPriceGraphData } from '@/utils/trading';
import { getLatestSpotPriceBefore, getSpotPriceAfter } from '@/utils/subgraph';
import { formatBigInt } from '@/utils/bigInt';
import { usePublicClient } from 'wagmi';
import { getCHViewerContract } from '@/const/contracts';
import { ammAbi, chViewerAbi } from '@/const/abi';

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

export const useMarketOverview = (): GetMktOverview => {
  const marketUpdateTrigger = useNanostore($marketUpdateTrigger);
  const chain = useNanostore($currentChain);
  const [data, setData] = useState<Array<CollectionOverview>>();
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  useEffect(() => {
    async function getGraphData() {
      if (isLoading) return;
      setIsLoading(true);
      const nowTs = Math.round(new Date().getTime() / 1000);
      const ts24hr = nowTs - 1 * 24 * 3600;
      const ts7Days = nowTs - 7 * 24 * 3600;
      const ts30Days = nowTs - 30 * 24 * 3600;
      const ammAddrList = getSupportedAMMAddresses(chain);
      const graphDataList: any = await Promise.all(ammAddrList.map(ammAddr => getDailySpotPriceGraphData(ammAddr)));
      const dailyVolumeList = graphDataList.map((dataArray: any[]) => dataArray.reduce((res, item) => res + item.volume, 0n));
      const priceList24hrAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts24hr)));
      const priceList7daysAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts7Days)));
      const priceList30daysAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts30Days)));
      const vammStartPriceList = await Promise.all(
        ammAddrList.map(async ammAddr => {
          const res = await getSpotPriceAfter(ammAddr, 0, 1, 0);
          if (!res) {
            return Promise.reject();
          }

          return res[0].spotPrice;
        })
      );
      const vammPriceList = await Promise.all(
        ammAddrList.map(ammAddr => {
          const vammPrice = publicClient.readContract({
            address: ammAddr,
            abi: ammAbi,
            functionName: 'getSpotPrice'
          });
          return vammPrice;
        })
      );
      const oraclePriceList = await Promise.all(
        ammAddrList.map(ammAddr => {
          const vammPrice = publicClient.readContract({
            address: ammAddr,
            abi: ammAbi,
            functionName: 'getUnderlyingPrice'
          });
          return vammPrice;
        })
      );
      const chViewer = getCHViewerContract(chain);
      const fundingRatesList = await Promise.all(
        ammAddrList.map(ammAddr => {
          const vammPrice = publicClient.readContract({
            address: chViewer.address,
            abi: chViewerAbi,
            functionName: 'getFundingRates',
            args: [ammAddr]
          });
          return vammPrice;
        })
      );
      const results = [];

      for (let i = 0; i < ammAddrList.length; i += 1) {
        const ammAddr = ammAddrList[i];
        const amm = getAMMByAddress(ammAddr, chain);
        if (!amm) break;
        const price24hrAgo = priceList24hrAgo[i];
        const price7daysAgo = priceList7daysAgo[i];
        const price30daysAgo = priceList30daysAgo[i];
        const basePrice24h = price24hrAgo ? formatBigInt(price24hrAgo.spotPrice) : formatBigInt(vammStartPriceList[i]);
        const basePrice7d = price7daysAgo ? formatBigInt(price7daysAgo.spotPrice) : formatBigInt(vammStartPriceList[i]);
        const basePrice30d = price30daysAgo ? formatBigInt(price30daysAgo.spotPrice) : formatBigInt(vammStartPriceList[i]);

        const result = {
          amm,
          vammPrice: formatBigInt(vammPriceList[i]),
          oraclePrice: formatBigInt(oraclePriceList[i]),
          priceChangeRatio24h: ((formatBigInt(vammPriceList[i]) - basePrice24h) / basePrice24h) * 100,
          priceChangeRatio7d: basePrice7d !== 0 ? ((formatBigInt(oraclePriceList[i]) ?? 0 - basePrice7d) / basePrice7d) * 100 : undefined,
          priceChangeRatio30d:
            basePrice30d !== 0 ? ((formatBigInt(oraclePriceList[i]) ?? 0 - basePrice30d) / basePrice30d) * 100 : undefined,
          priceChange24h: formatBigInt(vammPriceList[i]) - basePrice24h,
          priceChange7d: formatBigInt(vammPriceList[i]) - basePrice7d,
          priceChange30d: formatBigInt(vammPriceList[i]) - basePrice30d,
          volume: formatBigInt(dailyVolumeList[i]),
          fundingRateShort: formatBigInt(fundingRatesList[i][1]),
          fundingRateLong: formatBigInt(fundingRatesList[i][0])
        };
        results.push(result);
      }
      setData(results);
      setIsLoading(false);
    }
    getGraphData();
  }, [chain, marketUpdateTrigger, publicClient]);

  return { isLoading, data };
};
