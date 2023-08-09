const authUrl = process.env.NEXT_PUBLIC_AUTHENTICATION_API_URL;

export const tradingCompetitionApi = {
  getTopGainer: async function getTopGainer(userAddr: string = '') {
    const url = `${authUrl}/competition/leaderboard/s2/absPnl${!userAddr ? '' : `?userAddress=${userAddr}`}`;
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
    const url = `${authUrl}/competition/leaderboard/s2/topFundingPayment${!userAddr ? '' : `?userAddress=${userAddr}`}`;
    try {
      const call = await fetch(url);
      const result = await call.json();
      const { data } = result;
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  },
  getTopVolume: async function getTopVolume(userAddr: string = '') {
    const url = `${authUrl}/competition/leaderboard/s2/topWeeklyVolume${!userAddr ? '' : `?userAddress=${userAddr}`}`;
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
    const url = `${authUrl}/competition/leaderboard/s2/topReferer${!userAddr ? '' : `?userAddress=${userAddr}`}`;
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
