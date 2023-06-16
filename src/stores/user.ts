import { AMM } from '@/const/collectionList';
import { atom, map } from 'nanostores';
import { Address, Chain } from 'wagmi';

export interface UserInfo {
  username: string;
  about: string;
  userAddress: string;
  amm: string;
  countReferralCode: number;
  createTime: string;
  createTimestamp: number;
  degenScore: string;
  degenScoreMultiplier: string;
  followers: number;
  following: number;
  hasTraded: false;
  id: string;
  isBan: false;
  isInputCode: false;
  netConvergenceVolume: string;
  nonce: number;
  points: string;
  ranking: number;
  referralCode: string;
  referralPoints: number;
  totalTradingVolume: string;
  updateNameTimes: number;
  updateTime: string;
  updateTimestamp: 0;
}

export interface UserPositionInfo {
  amm: Address;
  size: number;
  collateral: number;
  openNotional: number;
  currentNotional: number;
  unrealizedPnl: number;
  marginRatio: number;
  entryPrice: number;
  openLeverage: number;
  liquidationPrice: number;
  vammPrice: number;
  leverage: number;
  fundingPayment: number;
  isLiquidatable: boolean;
}

export type UserPositionInfos = {
  // eslint-disable-next-line no-unused-vars
  [value in AMM]?: UserPositionInfo;
};

export const $userWethBalance = atom(0);
export const $userIsConnecting = atom(true);
export const $userIsConnected = atom(false);
export const $userIsWrongNetwork = atom(false);
export const $userAddress = atom<Address | undefined>();
export const $userInfo = atom<UserInfo | undefined>();
export const $currentChain = atom<Chain | undefined>();
export const $userPositionInfos = map<UserPositionInfos>();

export const setWethBalance = (val: number) => {
  $userWethBalance.set(val);
};

export const setIsConnecting = (val: boolean) => {
  $userIsConnecting.set(val);
};

export const setUserInfo = (val: UserInfo) => {
  $userInfo.set(val);
};
