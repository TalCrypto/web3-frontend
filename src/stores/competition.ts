import { atom } from 'nanostores';

export interface LeaderboardItem {
  eligible: boolean;
  rank: string;
  userAddress: string;
  username: string;
  netConvergenceVol?: string;
  pnl?: string;
}

// leaderboard
export const $isCompetitionLeaderboardLoading = atom<boolean>(false);
export const $mainLeaderboard = atom<LeaderboardItem[]>([]);
export const $firstLeaderboard = atom<LeaderboardItem[]>([]);
export const $secondLeaderboard = atom<LeaderboardItem[]>([]);
export const $thirdLeaderboard = atom<LeaderboardItem[]>([]);

// current user based on leaderboard
export const $mlCurrentUser = atom<any>(null);
export const $flCurrentUser = atom<any>(null);
export const $slCurrentUser = atom<any>(null);
export const $tlCurrentUser = atom<any>(null);
