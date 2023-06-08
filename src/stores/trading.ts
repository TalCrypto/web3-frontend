import { AMM, DEFAULT_AMM } from '@/const/collectionList';
import { atom, map } from 'nanostores';

export interface CollectionTradingData {
  spotPrice: string;
  oraclePrice: string;
  twapPrice: string;
  shortSize: string;
  longSize: string;
  shortRatio: string;
  longRatio: string;
  nextFundingTime: string;
  fundingRateLong: string;
  fundingRateShort: string;
  todayHigh: string;
  todayLow: string;
  dayVolume: string;
  fundingPeriod: string;
}

type TradingData = {
  // eslint-disable-next-line no-unused-vars
  [value in AMM]?: CollectionTradingData;
};

type TransactionPendings = {
  // eslint-disable-next-line no-unused-vars
  [value in AMM]?: boolean;
};

export const $tradingData = map<TradingData>({});

export const $currentAMM = atom<AMM | undefined>();

export const $transactionPendings = map<TransactionPendings>();
