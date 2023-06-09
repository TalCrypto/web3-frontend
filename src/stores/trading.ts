import { AMM } from '@/const/collectionList';
import { atom, map } from 'nanostores';

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
  todayHigh: number;
  todayLow: number;
  dayVolume: number;
  fundingPeriod: number;
}

export type TradingData = {
  // eslint-disable-next-line no-unused-vars
  [value in AMM]?: CollectionTradingData;
};

export type TransactionPendings = {
  // eslint-disable-next-line no-unused-vars
  [value in AMM]?: boolean;
};

export const $tradingData = map<TradingData>({});

export const $currentAMM = atom<AMM | undefined>();

export const $transactionPendings = map<TransactionPendings>();
