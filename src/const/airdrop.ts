/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

export interface AirdropTabInfo {
  title: string;
  image: string;
  route: string;
}

export enum AirdropTabIndex {
  Overview = 0,
  Referral = 1,
  Leaderboard = 2,
  Rules = 3
}

export type AirdropTabInfos = {
  [value in AirdropTabIndex]: AirdropTabInfo;
};

export const airdropTabsInfo: AirdropTabInfos = {
  0: {
    title: 'Overview',
    image: '/images/components/airdrop/tabs/overview.svg',
    route: ''
  },
  1: {
    title: 'Referral',
    image: '/images/components/airdrop/tabs/referral.svg',
    route: 'refer'
  },
  2: {
    title: 'Leaderboard',
    image: '/images/components/airdrop/tabs/leaderboard.svg',
    route: 'leaderboard'
  },
  3: {
    title: 'Rules',
    image: '/images/components/airdrop/tabs/rules.svg',
    route: 'rules'
  }
};
