const authUrl = process.env.NEXT_PUBLIC_AUTHENTICATION_API_URL;

export const tradingCompetitionApi = {
  getTopGainer: async function getTopGainer(userAddr: string = '') {
    const url = `${authUrl}/competition/leaderboard/s2/absPnl?userAddress=${userAddr}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getTopFp: async function getTopFp(userAddr: string = '') {
    const url = `${authUrl}/competition/leaderboard/s2/topFundingPayment?userAddress=${userAddr}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getTopVolume: async function getTopVolume(userAddr: string = '', week: number = 1) {
    const url = `${authUrl}/competition/leaderboard/s2/topWeeklyVolume?userAddress=${userAddr}&week=${week}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getTopReferrer: async function getTopReferrer(userAddr: string = '') {
    const url = `${authUrl}/competition/leaderboard/s2/topReferer?userAddress=${userAddr}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getReferrerTeamList: async function getReferrerTeamList(userAddr: string = '') {
    const url = `${authUrl}/competition/leaderboard/s2/refererTeamList?userAddress=${userAddr}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getMyRefereeTeamList: async function getMyRefereeTeamList(userAddr: string = '') {
    const url = `${authUrl}/competition/leaderboard/s2/myRefererTeamList?userAddress=${userAddr}`;
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
