import { AMM } from '@/const/collectionList';
import { $userPositionInfos } from '@/stores/user';
import { atom, computed } from 'nanostores';

export const $psShowBalance = atom(true);

export const $psUserPosition = computed($userPositionInfos, userPositionInfos => {
  const amms = Object.keys(userPositionInfos) as AMM[];
  return amms.map(amm => userPositionInfos[amm]).filter(posInfo => posInfo && posInfo.size !== 0);
});

export const $psSelectedCollectionAmm = atom();

export const $psShowFundingPayment = atom(false);

export const $psShowShareIndicator = atom(false);

export const $psShowHistory = atom(false);

export const $psSelectedTimeIndex = atom(0);

export const $psLineChartData = atom();

export const $psHistogramChartData = atom();
