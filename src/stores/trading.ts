import { AMM } from '@/const/collectionList';
import { OhlcData } from 'lightweight-charts';
import { atom, computed, map } from 'nanostores';
import { Address } from 'wagmi';

export interface CollectionTradingData {
  vammPrice: number;
  oraclePrice: number;
  shortSize: number;
  longSize: number;
  shortRatio: number;
  longRatio: number;
  nextFundingTime: number;
  fundingRateLong: number;
  fundingRateShort: number;
  isOverPriceGap: boolean;
}

export type TransactionPendings = {
  // eslint-disable-next-line no-unused-vars
  [value in AMM]?: boolean;
};

export interface ChartGraphRecord {
  round: number;
  avgPrice: number;
  open: number;
  close: number;
  start: number;
  end: number;
}

export interface FundingRatesRecord {
  amm: Address;
  timestamp: number;
  underlyingPrice: number;
  rateLong: number;
  rateShort: number;
  amountLong: number;
  amountShort: number;
}

export interface MarketHistoryRecord {
  ammAddress: string;
  timestamp: number;
  exchangedPositionSize: number;
  positionNotional: number;
  positionSizeAfter: number;
  liquidationPenalty: number;
  spotPrice: number;
  userAddress: Address;
  userId: string;
  txHash: string;
}

export interface CollectionConfig {
  fundingPeriod: number;
  liqSwitchRatio: number;
  initMarginRatio: number;
  startPrice: number;
}

export const $tradingData = atom<CollectionTradingData | undefined>();

export const $isTradingDataInitializing = atom(false);

export const $currentAmm = atom<AMM | undefined>();

export const $transactionPendings = map<TransactionPendings>();

export const $collectionConfig = map<CollectionConfig>();

export const $futureMarketHistory = atom<MarketHistoryRecord[]>([]);

export const $fundingRatesHistory = atom<FundingRatesRecord[]>([]);

export const $spotMarketHistory = atom<any[]>([]);

export const $selectedTimeIndex = atom(0);

export const $isChartDataInitializing = atom(false);

export const $graphData = atom<OhlcData[]>([]);

export const $priceChange = computed($graphData, graphData => {
  if (graphData && graphData.length > 0) {
    const basePrice = graphData[0].open;
    const nowPrice = graphData[graphData.length - 1].close;
    return nowPrice - basePrice;
  }
  return undefined;
});

export const $priceChangePct = computed($graphData, graphData => {
  if (graphData && graphData.length > 0) {
    const basePrice = graphData[0].open;
    const nowPrice = graphData[graphData.length - 1].close;
    return ((nowPrice - basePrice) / basePrice) * 100;
  }
  return undefined;
});

export const $lowPrice = computed($graphData, graphData => {
  if (graphData && graphData.length > 0) {
    let lowPrice = 0;
    graphData.forEach(({ low }) => {
      if (lowPrice === 0 || low < lowPrice) {
        lowPrice = low;
      }
    });
    return lowPrice;
  }
  return undefined;
});

export const $highPrice = computed($graphData, graphData => {
  if (graphData && graphData.length > 0) {
    let highPrice = 0;
    graphData.forEach(({ high }) => {
      if (high > highPrice) {
        highPrice = high;
      }
    });
    return highPrice;
  }
  return undefined;
});

export const $dailyVolume = atom<number | undefined>();
