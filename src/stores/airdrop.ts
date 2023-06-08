import { atom } from 'nanostores';

export interface UserPoint {
  rank: number;
  multiplier: number;
  total: number;
  userAddress: string;
  username: string;
  referralUser: Record<string, any>;
  eligibleCount: number;
  referralCode: string;
  isBan: boolean;
  isInputCode: boolean;
  tradeVol: {
    vol: string;
    points: number;
    multiplier: string;
  };
  referredUserCount: number;
  referral: {
    referralSelfRewardPoints: number;
    referringRewardPoints: number;
  };
  og: number;
  converge: {
    points: number;
    val: string;
  };
  degenscore: number;
}

export const defaultUserPoint: UserPoint = {
  rank: 0,
  multiplier: 1,
  total: 0,
  userAddress: '',
  username: '',
  referralUser: {},
  eligibleCount: 0,
  referralCode: '',
  isBan: false,
  isInputCode: false,
  tradeVol: {
    vol: '0',
    points: 0,
    multiplier: '1'
  },
  referredUserCount: 0,
  referral: {
    referralSelfRewardPoints: 0,
    referringRewardPoints: 0
  },
  og: 0,
  converge: {
    points: 0,
    val: '0'
  },
  degenscore: 0
};

// user points
export const $userPoint = atom<UserPoint | undefined>();

export const isUserPointLoading = atom(false);

export const setUserPoint = (data: UserPoint) => {
  $userPoint.set(data);
};

// leaderboard
export const leaderboard = atom<any[]>([]);

export const setLeaderboard = (data: any[]) => {
  leaderboard.set(data);
};

export const isLeaderboardLoading = atom(false);

// referral
export const referralList = atom([]);

export const setReferralList = (data: any) => {
  referralList.set(data);
};
export const isReferralListLoading = atom(false);
