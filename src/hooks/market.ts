import { AMM } from '@/const/collectionList';
import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $collectionConfig } from '@/stores/trading';
import { Address, useNetwork } from 'wagmi';
import { getAMMByAddress, getAddressConfig, getSupportedAMMAddresses } from '@/const/addresses';
import { getLatestSpotPriceBefore } from '@/utils/subgraph';
import { getDailySpotPriceGraphData, getFundingPaymentHistory, getMarketHistory } from '@/utils/trading';
import { formatBigInt } from '@/utils/bigInt';
import { getAddress } from 'viem';
import { getBaycFromMainnet } from '@/utils/opensea';
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
    // async function getGraphData() {
    //   if (tradingData) {
    //     const nowTs = Math.round(new Date().getTime() / 1000);
    //     const ts24hr = nowTs - 1 * 24 * 3600;
    //     const ts7Days = nowTs - 7 * 24 * 3600;
    //     const ts30Days = nowTs - 30 * 24 * 3600;
    //     const ammAddrList = getSupportedAMMAddresses(chain);
    //     const graphDataList = await Promise.all(ammAddrList.map(ammAddr => getDailySpotPriceGraphData(ammAddr)));
    //     const priceList24hrAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts24hr)));
    //     const priceList7daysAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts7Days)));
    //     const priceList30daysAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts30Days)));
    //     const results = [];
    //     for (let i = 0; i < ammAddrList.length; i += 1) {
    //       const ammAddr = ammAddrList[i];
    //       const amm = getAMMByAddress(ammAddr, chain);
    //       if (!amm) break;
    //       const price24hrAgo = priceList24hrAgo[i];
    //       const price7daysAgo = priceList7daysAgo[i];
    //       const price30daysAgo = priceList30daysAgo[i];
    //       const basePrice24h = price24hrAgo ? formatBigInt(price24hrAgo.spotPrice) : config.startPrice;
    //       const basePrice7d = price7daysAgo ? formatBigInt(price7daysAgo.spotPrice) : config.startPrice;
    //       const basePrice30d = price30daysAgo ? formatBigInt(price30daysAgo.spotPrice) : config.startPrice;

    //       if (!tradingData) break;

    //       const result = {
    //         amm,
    //         vammPrice: tradingData.vammPrice,
    //         oraclePrice: tradingData.oraclePrice,
    //         priceChangeRatio24h: formatBigInt(graphDataList[i].priceChangeRatio),
    //         priceChangeRatio7d: basePrice7d !== 0 ? ((tradingData.vammPrice ?? 0 - basePrice7d) / basePrice7d) * 100 : undefined,
    //         priceChangeRatio30d: basePrice30d !== 0 ? ((tradingData.vammPrice ?? 0 - basePrice30d) / basePrice30d) * 100 : undefined,
    //         priceChange24h: tradingData.vammPrice - basePrice24h,
    //         priceChange7d: tradingData.vammPrice - basePrice7d,
    //         priceChange30d: tradingData.vammPrice - basePrice30d,
    //         volume: formatBigInt(graphDataList[i].volume),
    //         fundingRateShort: tradingData.fundingRateShort,
    //         fundingRateLong: tradingData.fundingRateLong
    //       };
    //       results.push(result);
    //     }
    //     setData(results);
    //     setIsLoading(false);
    //   }
    // }
    // getGraphData();
  }, [triggerUpdate, chain, config]);
  return { isLoading, data };
};
