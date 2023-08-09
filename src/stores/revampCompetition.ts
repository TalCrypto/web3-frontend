import { atom } from 'nanostores';

export const $triggerKey = atom(false);

// data handling
export const $isDataLoading = atom(false);

export const $topFundingPaymentRankingList = atom([]);
export const $topGainerRankingList = atom([]);
export const $topReferrerRankingList = atom([]);
export const $topVolumeRankingList = atom([]);
export const $topFundingPaymentUserItem = atom<any>(null);
export const $topGainerUserItem = atom<any>(null);
export const $topReferrerUserItem = atom<any>(null);
export const $topVolumeUserItem = atom<any>(null);
