import { UserPositionInfos } from '@/stores/user';
import { atom, map } from 'nanostores';

type UserProfileInfo = {
  id: string;
  userAddress: string;
  nonce: number;
  username: string;
  about: string;
  updateNameTimes: number;
  updateTimestamp: number;
  createTimestamp: number;
  updateTime: string;
  createTime: string;
  points: string;
  followers: number;
  ranking: number;
  referralCode: string;
  following: number;
  referralPoints: number;
  amm: string;
  isInputCode: boolean;
  countReferralCode: number;
  hasTraded: boolean;
  netConvergenceVolume: string;
  totalTradingVolume: string;
  isBan: boolean;
  degenScore: string;
  degenScoreMultiplier: string;
  referralUsersCount: number;
  isFollowing: boolean;
};

type UserFollow = {
  isFollowing: boolean;
  followerAddress?: string;
  userAddress?: string;
  followers: number;
  following: number;
  username: string;
  about: string;
  points: number;
  ranking: number;
  amm: string[];
};

type UserAirdropRank = {
  converge: {
    points: number;
    val: string;
  };
  degenScore: string;
  eligible: boolean;
  eligibleCount: number;
  isBan: boolean;
  isInputCode: boolean;
  multiplier: number;
  og: number;
  originalTotal: number;
  rank: number;
  referral: {
    referralSelfRewardPoints: number;
    referringRewardPoints: number;
  };
  referralCode: string;
  referralUser: {
    username: string;
    userAddress: string;
  };
  referredUserCount: number;
  total: number;
  tradeVol: {
    vol: string;
    points: number;
    multiplier: string;
  };
  tradeVolTotal: string;
  userAddress: string;
  username: string;
};

type UserCompetitionRank = {
  eligible: boolean;
  pnl: string;
  rank: string;
  tradeVol: string;
  userAddress: string;
  username: string;
};

export const $activeTab = atom<number>(0);

export const $isUserprofileLoading = atom<boolean>(false);

// user data
export const $userprofileAddress = atom<any>(null);
export const $userInfo = atom<any>(null);
export const $userAirdropRank = atom<any>(null);
export const $userCompetitionRank = atom<any>(null);
export const $userprofilePositionInfos = map<UserPositionInfos>();
export const $userHistories = atom<any[]>([]);
export const $userFollowings = atom<UserFollow[]>([]);
export const $userFollowers = atom<UserFollow[]>([]);

// search data
export const $searchQuery = atom<string>('');
export const $showSearchWindow = atom<boolean>(false);
export const $searchResult = atom<any[]>([]);
