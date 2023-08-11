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

export type ReferralUser = {
  userAddress: string;
  username: string;
  rank?: string;
  totalVolume?: string;
  tradedVolume?: string;
  teamPointPrize?: number;
  teamUsdtPrize?: number;
  pointPrize: number;
  usdtPrize: number;
};

export type MyRefererUser = {
  userAddress: string;
  username: string;
  rank?: string;
  totalVolume?: string;
  tradedVolume?: string;
  teamPointPrize?: number;
  teamUsdtPrize?: number;
  pointPrize: number;
  usdtPrize: number;
};

// data handling
export const $isDataLoading = atom(false);

export const $topFundingPaymentRankingList = atom<TopFundingPaymentRanking[]>([]);
export const $topGainerRankingList = atom<TopGainerRanking[]>([]);
export const $topReferrerRankingList = atom<TopReferrerRanking[]>([]);
export const $topVolumeRankingList = atom<TopVolumeRanking[]>([]);
export const $referralTeamList = atom<ReferralUser[]>([]);
export const $myRefererTeamList = atom<MyRefererUser[]>([]);

export const $userVolumeList = atom<TopVolumeRanking[]>([]);

export const $topFundingPaymentUserItem = atom<TopFundingPaymentRanking | null>(null);
export const $topGainerUserItem = atom<TopGainerRanking | null>(null);
export const $topReferrerUserItem = atom<TopReferrerRanking | null>(null);
export const $topVolumeUserItem = atom<TopVolumeRanking | null>(null);
export const $referralUserItem = atom<ReferralUser | null>(null);
export const $myRefererUserItem = atom<MyRefererUser | null>(null);
