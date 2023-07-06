/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export const MINIMUM_COLLATERAL = 0.01;

export enum TradeActions {
  OPEN = 'Open',
  CLOSE = 'Close',
  ADD = 'Add',
  REDUCE = 'Reduce',
  REVERSE = 'Reverse',
  FULL_LIQ = 'Full Liquid.',
  PARTIAL_LIQ = 'Partial Liquid.'
}

export enum CollateralActions {
  ADD = 'Add Collateral',
  REDUCE = 'Reduce Collateral'
}

export const DAY_RESOLUTION = 300;
export const WEEK_RESOLUTION = 1800;
export const MONTH_RESOLUTION = 7200;
