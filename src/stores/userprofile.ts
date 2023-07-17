import { atom } from 'nanostores';

export const $activeTab = atom<number>(0);

export const $isUserprofileLoading = atom<boolean>(false);

// user data
export const $userprofileAddress = atom<any>(null);
export const $userInfo = atom<any>(null);
export const $userRanking = atom<any>(null);
export const $userPosition = atom<any>(null);
export const $userHistory = atom<any[]>([]);
export const $userFollowings = atom<any[]>([]);
export const $userFollowers = atom<any[]>([]);

// search data
export const $searchQuery = atom<string>('');
export const $showSearchWindow = atom<boolean>(false);
export const $searchResult = atom<any[]>([]);
