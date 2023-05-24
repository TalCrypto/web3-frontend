/* eslint-disable import/no-cycle */
import { logEvent } from 'firebase/analytics';
import { UAParser } from 'ua-parser-js';
import { apiConnection } from './apiConnection';
import { firebaseAnalytics } from '../const/firebaseConfig';

export const eventParams = {
  language: '',
  time_zone: '',
  browser: '',
  device: '',
  os: '',
  user_agent: '',
  set: async function set(navigator: any) {
    try {
      const parser = new UAParser();
      const parserResults = parser.getResult();

      this.browser = parserResults.browser;
      this.device = parserResults.device;
      this.os = parserResults.os;
      this.user_agent = parserResults.ua;
      this.language = navigator?.language;
      this.time_zone = Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone;
    } catch (error) {
      // console.log(error);
    }
  },
  get: async function get() {
    return {
      language: this.language,
      time_zone: this.time_zone,
      browser: this.browser,
      device: this.device,
      os: this.os,
      user_agent: this.user_agent
    };
  }
};

export const pageTitleParser = (path: any) => {
  const routesObj = {
    marketoverview: 'Market Overview',
    dashboard: 'Dashboard',
    leaderboard: 'Leaderboard',
    comingsoonavatar: 'Avatar',
    comingsoonbattle: 'Battle',
    reward: 'Reward',
    trade: 'Trade'
  };
  if (path === '/') {
    return { parentPath: '', page: 'Trade' };
  }
  const parentPath = path.split('/')[1];
  return { parentPath, page: routesObj[parentPath] };
};

export const generateBatchName = (logs: any) => {
  const batchNameList = [];
  for (let i = 0; i < logs.length; i += 1) {
    batchNameList.push(logs[i].name);
  }
  return batchNameList.join('-');
};

export const logHelper = (eventName: any, holderAddress: any, others: any, deviceType: any) => {
  logEvent(firebaseAnalytics, eventName, {
    wallet: holderAddress.substring(2),
    ...others
  });
  apiConnection.postUserEvent(
    eventName,
    {
      ...others
    },
    holderAddress,
    deviceType
  );
};
