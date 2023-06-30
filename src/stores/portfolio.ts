import { atom } from 'nanostores';

export const psBalanceOriginData = {
  total: '0',
  unrealized: '0',
  portfolio: '0',
  available: '0',
  totalIncrease: '0',
  portfolioIncrease: '0',
  totalRatio: '0',
  portfolioRatio: '0'
};

export const $psShowBalance = atom(true);

export const $psBalance = atom(psBalanceOriginData);

export const $psUserPosition = atom([]);

export const $psSelectedCollectionAmm = atom();

export const $psShowFundingPayment = atom(false);

export const $psShowShareIndicator = atom(false);

export const $psShowHistory = atom(false);

export const $psSelectedTimeIndex = atom(0);

export const $psLineChartData = atom();

export const $psHistogramChartData = atom();
