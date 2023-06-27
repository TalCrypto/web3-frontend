/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { AMM } from '@/const/collectionList';
import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $collectionConfig } from '@/stores/trading';
import { $currentChain } from '@/stores/user';
import { getAMMByAddress, getSupportedAMMAddresses, getSupportedAMMs } from '@/const/addresses';
import { getDailySpotPriceGraphData } from '@/utils/trading';
import { getLatestSpotPriceBefore } from '@/utils/subgraph';
import { formatBigInt } from '@/utils/bigInt';
import { Chain, useContractRead } from 'wagmi';
import { getAMMContract, getCHViewerContract } from '@/const/contracts';
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

function getTradingData(chain: Chain) {
  const ammList = getSupportedAMMs();
  const tradingDataList: any = {};
  const chViewer = getCHViewerContract(chain);

  // for (let i = 0; i < ammList.length; i += 1) {
  //   const amm = ammList[i];
  //   const ammContract: any = getAMMContract(chain, amm);

  //   const { data: vammPrice } = useContractRead({ ...ammContract, abi: ammAbi, functionName: 'getSpotPrice' });

  //   // const { data: vammPrice } = useContractRead({
  //   //   address: ammContract.address,
  //   //   abi: ammAbi,
  //   //   functionName: 'getSpotPrice'
  //   // });
  //   console.log(2);

  //   const oraclePrice = useContractRead({
  //     address: ammContract.address,
  //     abi: ammAbi,
  //     functionName: 'getUnderlyingPrice'
  //   });

  //   const fundingRates = useContractRead({
  //     address: chViewer.address,
  //     abi: chViewerAbi,
  //     functionName: 'getFundingRates',
  //     args: [ammContract.address]
  //   });

  //   tradingDataList[ammContract.address] = { vammPrice, oraclePrice, fundingRates };
  // }

  return tradingDataList;
}

export const useMarketOverview = (triggerUpdate: boolean): GetMktOverview => {
  const config = useNanostore($collectionConfig);
  const chain = useNanostore($currentChain);
  const [data, setData] = useState<Array<CollectionOverview>>();
  const [isLoading, setIsLoading] = useState(false);

  const tradingDataList = chain ? getTradingData(chain) : null;

  useEffect(() => {
    setIsLoading(true);
    async function getGraphData() {
      const nowTs = Math.round(new Date().getTime() / 1000);
      const ts24hr = nowTs - 1 * 24 * 3600;
      const ts7Days = nowTs - 7 * 24 * 3600;
      const ts30Days = nowTs - 30 * 24 * 3600;
      const ammAddrList = getSupportedAMMAddresses(chain);
      const graphDataList: any = await Promise.all(ammAddrList.map(ammAddr => getDailySpotPriceGraphData(ammAddr)));
      const priceList24hrAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts24hr)));
      const priceList7daysAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts7Days)));
      const priceList30daysAgo = await Promise.all(ammAddrList.map(ammAddr => getLatestSpotPriceBefore(ammAddr, ts30Days)));
      const results = [];

      for (let i = 0; i < ammAddrList.length; i += 1) {
        const ammAddr = ammAddrList[i];
        const amm = getAMMByAddress(ammAddr, chain);
        if (!amm) break;
        const price24hrAgo = priceList24hrAgo[i];
        const price7daysAgo = priceList7daysAgo[i];
        const price30daysAgo = priceList30daysAgo[i];
        const basePrice24h = price24hrAgo ? formatBigInt(price24hrAgo.spotPrice) : config.startPrice;
        const basePrice7d = price7daysAgo ? formatBigInt(price7daysAgo.spotPrice) : config.startPrice;
        const basePrice30d = price30daysAgo ? formatBigInt(price30daysAgo.spotPrice) : config.startPrice;

        if (!tradingDataList || !tradingDataList[ammAddr]) {
          break;
        }

        const tradingData = tradingDataList[ammAddr];

        const result = {
          amm,
          vammPrice: tradingData.vammPrice,
          oraclePrice: tradingData.oraclePrice,
          priceChangeRatio24h: formatBigInt(graphDataList[i].priceChangeRatio),
          priceChangeRatio7d: basePrice7d !== 0 ? ((tradingData.vammPrice ?? 0 - basePrice7d) / basePrice7d) * 100 : undefined,
          priceChangeRatio30d: basePrice30d !== 0 ? ((tradingData.vammPrice ?? 0 - basePrice30d) / basePrice30d) * 100 : undefined,
          priceChange24h: tradingData.vammPrice - basePrice24h,
          priceChange7d: tradingData.vammPrice - basePrice7d,
          priceChange30d: tradingData.vammPrice - basePrice30d,
          volume: formatBigInt(graphDataList[i].volume),
          fundingRateShort: tradingData.fundingRateShort,
          fundingRateLong: tradingData.fundingRateLong
        };
        results.push(result);
      }
      setData(results);
      setIsLoading(false);
    }
    getGraphData();
  }, [triggerUpdate, chain, config]);

  return { isLoading, data };
};
