import { atom } from 'nanostores';

export const defaultUserPoint = {
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
export const userPoint = atom({ ...defaultUserPoint });

export const isUserPointLoading = atom(false);

export const setUserPoint = data => {
  userPoint.set(data);
};

// leaderboard
export const leaderboard = atom([]);

export const setLeaderboard = data => {
  leaderboard.set(data);
};

export const isLeaderboardLoading = atom(false);
