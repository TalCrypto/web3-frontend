/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
export const MINIMUM_COLLATERAL = 0.01;

export enum TradeActions {
  OPEN = 'Open',
  CLOSE = 'Full Close',
  ADD = 'Add',
  REDUCE = 'Partial Close',
  REVERSE = 'Reverse',
  FULL_LIQ = 'Full Liquidation',
  FULL_LIQ_MOBILE = 'Full Liquid.',
  PARTIAL_LIQ = 'Partial Liquidation',
  PARTIAL_LIQ_MOBILE = 'Partial Liquid.'
}

export enum CollateralActions {
  ADD = 'Add Collateral',
  REDUCE = 'Reduce Collateral'
}

export const DAY_RESOLUTION = 300;
export const WEEK_RESOLUTION = 1800;
export const MONTH_RESOLUTION = 7200;
