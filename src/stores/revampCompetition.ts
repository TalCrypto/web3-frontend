import { atom } from 'nanostores';

export type TopGainerRanking = {
  pnl: string;
  pointPrize: number;
  rank: string;
  usdtPrize: number;
  userAddress?: string;
  username: string;
};

export type TopFundingPaymentRanking = {
  fundingPayment: string;
  pointPrize: number;
  rank: string;
  usdtPrize: number;
  userAddress?: string;
  username: string;
};

export type TopVolumeRanking = {
  weeklyTradedVolume: string;
  pointPrize: number;
  rank: string;
  usdtPrize: number;
  userAddress?: string;
  username: string;
};

export type TopReferrerRanking = {
  refereeCount: number;
  totalVolume: string;
  pointPrize: number;
  rank: string;
  usdtPrize: number;
  userAddress?: string;
  username: string;
};

export const $triggerKey = atom(false);

// data handling
export const $isDataLoading = atom(false);

export const $topFundingPaymentRankingList = atom<TopFundingPaymentRanking[]>([]);
export const $topGainerRankingList = atom<TopGainerRanking[]>([]);
export const $topReferrerRankingList = atom<TopReferrerRanking[]>([]);
export const $topVolumeRankingList = atom<TopVolumeRanking[]>([]);
export const $topFundingPaymentUserItem = atom<TopFundingPaymentRanking | null>(null);
export const $topGainerUserItem = atom<TopGainerRanking | null>(null);
export const $topReferrerUserItem = atom<TopReferrerRanking | null>(null);
export const $topVolumeUserItem = atom<TopVolumeRanking | null>(null);
