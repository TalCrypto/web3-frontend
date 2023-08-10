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
export const $topReferrerRankingList = atom([]);
export const $topVolumeRankingList = atom([]);
export const $referralTeamList = atom([]);
export const $myRefererTeamList = atom([]);

export const $topFundingPaymentUserItem = atom<any>(null);
export const $topGainerUserItem = atom<TopGainerRanking | null>(null);
export const $topReferrerUserItem = atom<any>(null);
export const $topVolumeUserItem = atom<any>(null);
export const $referralUserItem = atom<any>(null);
export const $myRefererUserItem = atom<any>(null);
