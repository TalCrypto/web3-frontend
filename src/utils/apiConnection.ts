/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
// import React from 'react';
import { eventParams, generateBatchName } from './eventLog';
import { storage } from './storage';
import { isReferralListLoading, setReferralList } from '../stores/airdrop';

const apiUrl = process.env.NEXT_PUBLIC_DASHBOARD_API_URL;
const authUrl = process.env.NEXT_PUBLIC_AUTHENTICATION_API_URL;
const leaderboardUrl = process.env.NEXT_PUBLIC_LEADERBOARD_USER_RANKING;

type ApiResponse<T> = {
  message: string;
  code: number;
  data: T;
};

export type SearchUserData = {
  isFollowing: boolean;
  userAddress: string;
  followers: number;
  following: number;
  username?: string;
  about: string;
  points: string;
  ranking: number;
};

export const apiConnection = {
  getDashboardContent: async function getDashboardContent(address: string, timestamp = Math.floor(Date.now() / 1000)) {
    const dashboardApiUrl = `${apiUrl}/allPositions?trader=${address}&timestamp=${timestamp}`;
    let returnData = {};
    try {
      await fetch(dashboardApiUrl)
        .then(res => res.json())
        .then(result => {
          returnData = result.data;
        });
      return Promise.resolve(returnData);
    } catch (error) {
      return Promise.reject();
    }
  },
  getWalletChartContent: async function getWalletChartContent(address: string, timeIndex: number) {
    let timeRelatedKey = 'dailyAccountValueGraph';
    switch (timeIndex) {
      case 1:
        timeRelatedKey = '1m';
        break;
      case 2:
        timeRelatedKey = '2m';
        break;
      case 3:
        timeRelatedKey = '6m';
        break;
      // case 3:
      //   timeRelatedKey = 'competition';
      //   break;
      default:
        timeRelatedKey = '1w';
    }
    const walletChartUrl = `${authUrl}/getPnlGraphData?userAddress=${address}&resolution=${timeRelatedKey}`;

    let returnData = {};
    try {
      await fetch(walletChartUrl)
        .then(res => res.json())
        .then(result => {
          returnData = result.data;
        });
      return Promise.resolve(returnData);
    } catch (error) {
      return Promise.reject();
    }
  },
  followUser: async function followUser(followerAddress: any, firebaseToken: any, userAddress: string) {
    const url = `${authUrl}/users/follow`;
    const headers = { 'auth-token': firebaseToken, 'Content-Type': 'application/json' };
    const body = { userAddress, followerAddress };
    try {
      const call = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      const result = await call.json();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  unfollowUser: async function unfollowUser(followerAddress: any, firebaseToken: any, userAddress: any) {
    const url = `${authUrl}/users/unfollow`;
    const headers = { 'auth-token': firebaseToken, 'Content-Type': 'application/json' };
    const body = { userAddress, followerAddress };
    try {
      const call = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      const result = await call.json();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getUserInfo: async function getUserInfo(address: any) {
    const url = `${authUrl}/users?publicAddress=${address}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  updateUserInfo: async function updateUserInfo(username: string, about: string, firebaseToken: string, userAddress: string) {
    const url = `${authUrl}/users/update`;
    const headers = { 'auth-token': firebaseToken, 'Content-Type': 'application/json' };
    const body = { userAddress, username, about };
    try {
      const call = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers
      });
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getUserFollowers: async function getUserFollowers(targetUser: any, user: any) {
    const url = `${authUrl}/followers/list`;
    const body = { user, targetUser, pageNo: 1, pageSize: 30 };
    const headers = { 'Content-Type': 'application/json' };
    try {
      const call = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers
      });
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getUserFollowings: async function getUserFollowings(targetUser: any, user: any) {
    const url = `${authUrl}/following/list`;
    const body = { user, targetUser, pageNo: 1, pageSize: 30 };
    const headers = { 'Content-Type': 'application/json' };
    try {
      const call = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers
      });
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getUserLeaderboard: async function getUserLeaderboard(address: string) {
    const url = `${leaderboardUrl}/${address}/3`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  searchUser: async function searchUser(query: string, holderAddress: string) {
    const url = `${authUrl}/users/search`;
    const body = { keyword: query, userAddress: holderAddress, pageSize: 30, pageNo: 1 };
    try {
      const callPost = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = (await callPost.json()) as ApiResponse<SearchUserData[] | null>;
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getTargetUserInfo: async function getTargetUserInfo(targetUser: any, user: any) {
    const url = `${authUrl}/users/info`;
    const body = { targetUser, user };
    try {
      const callPost = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await callPost.json();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  finishTrade: async function finishTrade(txHash: any, firebaseToken: string, userAddress: string) {
    const url = `${authUrl}/users/trade/completed`;
    const headers = { 'auth-token': firebaseToken, 'Content-Type': 'application/json' };
    const body = { txHash, userAddress };
    try {
      const callPost = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      const result = await callPost.json();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  useReferralCode: async function useReferralCode(code: any, firebaseToken: any, userAddress: string) {
    const url = `${authUrl}/users/referral/code`;
    const body = { code, userAddress };
    const headers = { 'auth-token': firebaseToken, 'Content-Type': 'application/json' };
    try {
      const call = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers
      });
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getIPInformation: async function getIPInformation() {
    // const url = 'https://api.ipregistry.co/?key=tryout';
  },
  getPointHistoryList: async function getPointHistoryList(address: string) {
    const url = `${authUrl}/achievement/history?userAddress=${address}&pageSize=30&pageNo=1`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  postUserEvent: async function postUserEvent(eventName: string, fields: any, wallet: string, deviceType = 'desktop') {
    const url = `${authUrl}/users/event`;
    const defaultParams = await eventParams.get();
    const params = {
      ...defaultParams,
      ...fields,
      wallet: wallet.substring(2),
      time_visit: new Date().toString()
    };

    if (params?.device) {
      params.device.type = deviceType;
    }

    const body = { name: eventName, params };
    await storage.addEventLogs(body);
    const eventLogData = storage.eventLogs;

    if (eventLogData?.length > 9) {
      if (!storage.eventLogsLoading && [10, 11].includes(eventLogData?.length)) {
        try {
          storage.setEventLogsLoading(true);
          const batchName = await generateBatchName(eventLogData);
          const callPost = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ name: batchName, params: eventLogData }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const result = await callPost.json();
          storage.setEventLogsLoading(false);
          if (storage.eventLogs.length === 10) storage.setEventLogs([]);
          return Promise.resolve(result);
        } catch (error) {
          return Promise.reject(error);
        }
      } else {
        eventLogData.splice(0, 10);
        storage.setEventLogs(eventLogData);
      }
    }

    return Promise.resolve();
  },
  checkUserIsWhitelisted: async function checkUserIsWhitelisted(address: string) {
    const url = `${authUrl}/users/whitelist/${address}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  checkUserHasPartialClose: async function checkUserHasPartialClose(address: string) {
    const url = `${authUrl}/users/hasPartialClosed?userAddress=${address}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  validateUserTradingState: async function validateUserTradingState(firebaseToken: string, userAddress: string) {
    const url = `${authUrl}/users/trade/validateState`;
    const body = { userAddress };
    const headers = { 'auth-token': firebaseToken, 'Content-Type': 'application/json' };
    try {
      const call = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers
      });
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getUserFundingPaymentHistoryWithAmm: async function getUserFundingPaymentHistoryWithAmm(userAddress: any, ammAddress: any) {
    const url = `${authUrl}/fundingPaymentHistory?trader=${userAddress}&amm=${ammAddress}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getUserTradingHistory: async function getUserTradingHistory(userAddress: string, ammAddress = '') {
    const url = `${authUrl}/tradeHistory?trader=${userAddress}${!ammAddress ? '' : `&amm=${ammAddress}`}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getUserPoint: async function getUserPoint(userAddress: string, targetSeason = 0) {
    const url = `${authUrl}/points/${userAddress}?show=tradeVol,referral,og,converge&season=${targetSeason}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  getUserPointLite: async function getUserPointLite(userAddress: string) {
    const url = `${authUrl}/points/${userAddress}?show=tradeVol,referral,og,converge`;
    let defaultData = { total: 0, rank: 0 };
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;

      if (data?.total) {
        defaultData = data;
      }

      return Promise.resolve(defaultData);
    } catch (err) {
      return Promise.reject(defaultData);
    }
  },
  getLeaderboard: async function getLeaderboard(targetSeason = 0) {
    const url = `${authUrl}/points/rank?show=tradeVol,referral,og,converge&pageSize=250&season=${targetSeason}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getUsernameFromAddress: async function getUsernameFromAddress(userAddressList: any) {
    const url = `${authUrl}/users/username`;
    const body = { userAddressList };
    const headers = { 'Content-Type': 'application/json' };
    try {
      const call = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers
      });
      const result = await call.json();
      return Promise.resolve(result.data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getReferralList: async function getReferralList(userAddress: string) {
    const url = `${authUrl}/points/referral/reward/detail/${userAddress}`;
    try {
      isReferralListLoading.set(true);
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      setReferralList(data);
      isReferralListLoading.set(false);
      return Promise.resolve(data);
    } catch (err) {
      isReferralListLoading.set(false);
      return Promise.reject(err);
    }
  },
  getUsernameFromReferral: async function getUsernameFromReferral(referralCode: any) {
    const url = `${authUrl}/users/referral/code/userinfo?code=${referralCode}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getAbsPnlLeaderboard: async function getAbsPnlLeaderboard(userAddress = '', pageNo = 1) {
    const url = `${authUrl}/competition/leaderboard/absPnl?pageNo=${pageNo}&userAddress=${userAddress}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getRealizedPnlPercentageLeaderboard: async function getRealizedPnlPercentageLeaderboard(userAddress = '', pageNo = 1) {
    const url = `${authUrl}/competition/leaderboard/realisedPnl?pageNo=${pageNo}&userAddress=${userAddress}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getNetConvergenceLeaderboard: async function getNetConvergenceLeaderboard(userAddress = '', pageNo = 1) {
    const url = `${authUrl}/competition/leaderboard/netConvergenceVol?pageNo=${pageNo}&userAddress=${userAddress}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getTopLosersLeaderboard: async function getTopLosersLeaderboard(userAddress = '', pageNo = 1) {
    const url = `${authUrl}/competition/leaderboard/topLoser?pageNo=${pageNo}&userAddress=${userAddress}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
