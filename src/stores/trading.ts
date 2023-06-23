import { AMM } from '@/const/collectionList';
import { atom, map } from 'nanostores';
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

export interface ChartData {
  data: Array<ChartGraphRecord>;
  priceChangeValue: number;
  priceChangeRatio: number;
  high: number;
  low: number;
  volume: number;
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

export const $selectedTimeIndex = atom(0);

export const $isChartDataInitializing = atom(false);

export const $chartData = atom<ChartData | undefined>();

export const $dailyVolume = atom<number | undefined>();

export const $collectionConfig = map<CollectionConfig>();

export const $futureMarketHistory = atom<MarketHistoryRecord[]>([]);

export const $fundingRatesHistory = atom<FundingRatesRecord[]>([]);

export const $spotMarketHistory = atom<any[]>([]);
