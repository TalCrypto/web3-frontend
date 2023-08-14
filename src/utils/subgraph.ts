/* eslint-disable no-await-in-loop */
/* eslint-disable no-promise-executor-return */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import { GraphDataTarget } from '@/const';
import { binarySearch } from '@/utils/arrayHelper';

type RetryFunction<T> = () => Promise<T>;
const maxRetry = 3;

// Helper function for sleeping (waiting) asynchronously
function sleep(ms: number): Promise<void> {
  return new Promise((resolve: any) => setTimeout(resolve, ms));
}

async function autoRetryWithMaxRetry<T>(fn: RetryFunction<T>, maxRetryCount: number, initialRetryDelay: number = 1000): Promise<T> {
  const maxRetryAttempts = maxRetryCount + 1;
  let retryAttempt = 1;
  let retryDelay = initialRetryDelay;

  while (retryAttempt <= maxRetryAttempts) {
    try {
      const result: any = await fn();
      if (result?.ok) {
        const resJson = await result.json();
        if (!(resJson?.errors?.length > 0)) return resJson;
      }
      throw new Error('Error occurred, need retry');
    } catch (error: any) {
      if (retryAttempt === maxRetryAttempts) {
        throw new Error(`Exceeded maximum retry count (${maxRetryCount}). Last error: ${error.message}`);
      }
      console.warn(`Retry attempt ${retryAttempt}/${maxRetryCount}: ${error.message}`);
      await sleep(retryDelay);
      retryAttempt += 1;
      retryDelay *= 2; // Exponential backoff - doubling the delay for each retry
    }
  }

  // The code should never reach this point, but to satisfy TypeScript, return a Promise with never resolved value
  return new Promise(() => {});
}

const subgraphUrl = process.env.NEXT_PUBLIC_SUPGRAPH_ENDPOINT ?? '';
const subgraphBackupUrl = process.env.NEXT_PUBLIC_SUPGRAPH_BACKUP_ENDPOINT ?? '';
const subgraphOracleUrl = process.env.NEXT_PUBLIC_SUPGRAPH_ORACLE_ENDPOINT ?? '';

const fetchMethod = async (_method: string, _query: string, target: GraphDataTarget = GraphDataTarget['VAMM']) => {
  let link = subgraphUrl;
  let backupLink = subgraphBackupUrl;

  switch (target) {
    case GraphDataTarget['ORACLE']:
      link = subgraphOracleUrl;
      backupLink = subgraphBackupUrl;
      break;
    default:
      link = subgraphUrl;
      backupLink = subgraphBackupUrl;
      break;
  }

  const normalFetch = fetch(link, {
    method: _method,
    body: JSON.stringify({
      query: _query
    })
  });

  try {
    const resJson = await autoRetryWithMaxRetry(() => normalFetch, maxRetry);
    return resJson;
  } catch (error) {
    const backupFetch = await fetch(backupLink, {
      method: _method,
      body: JSON.stringify({
        query: _query
      })
    });
    const resJson = await backupFetch.json();
    return resJson;
  }
};

export const getLatestDayTradingDetails = async (ammAddr: string) => {
  const fetchDayTradeData = await fetchMethod(
    'POST',
    `{
      dayTradeDatas(
          first: 1,
          orderBy:timestamp,
          orderDirection: desc,
          where: {
            amm: "${ammAddr}"
          }){
          amm
          timestamp
          open
          high
          low
          close
          volume
          txCount
        }
    }`
  );

  const dayTradeData = fetchDayTradeData?.data?.dayTradeDatas;
  if (!dayTradeData) return null;

  const result = {
    amm: dayTradeData[0].amm,
    startTime: Number(dayTradeData[0].timestamp),
    open: BigInt(dayTradeData[0].open),
    high: BigInt(dayTradeData[0].high),
    low: BigInt(dayTradeData[0].low),
    close: BigInt(dayTradeData[0].close),
    volume: BigInt(dayTradeData[0].volume),
    txCount: Number(dayTradeData[0].txCount)
  };

  return dayTradeData.length > 0 ? result : null;
};

export const getOpenInterest = async (ammAddr: string) => {
  const fetchOpenInterest = await fetchMethod(
    'POST',
    `{
      amm(id: "${ammAddr.toLowerCase()}") {
          positionBalance
          openInterestSize
          openInterestNotional
      }
    }`
  );

  const amm = fetchOpenInterest?.data?.amm;
  if (!amm) return null;

  const openInterest = {
    balance: BigInt(amm.positionBalance),
    notional: BigInt(amm.openInterestNotional),
    size: BigInt(amm.openInterestSize)
  };

  return openInterest;
};

export const getPositionHistory = async (ammAddr: string, walletArr: string) => {
  const fetchPositions = await fetchMethod(
    'POST',
    `{
      positionChangedEvents(
          where:{
              amm: "${ammAddr.toLowerCase()}"
              trader: "${walletArr.toLowerCase()}"
          }
          orderBy: timestampIndex,
          orderDirection: desc
        ){
          id
          timestamp
          exchangedPositionSize
          positionSizeAfter
          positionNotional
          spotPrice
          fee
          realizedPnl
        }
    }`
  );

  const positions = fetchPositions?.data?.positionChangedEvents;
  if (!positions) return null;

  const result = positions.map((position: any) => {
    const exchangedPositionSize = BigInt(position.exchangedPositionSize);
    const positionSizeAfter = BigInt(position.positionSizeAfter);
    let type = 'unknown';

    if (positionSizeAfter === 0n) {
      // Close
      type = 'close';
    } else {
      // Open position
      type = exchangedPositionSize < 0n ? 'short' : 'long';
    }

    return {
      timestamp: Number(position.timestamp),
      type,
      exchangedPositionSize,
      positionSizeAfter,
      entryPrice: Math.abs(position.positionNotional) / Math.abs(position.exchangedPositionSize),
      spotPrice: BigInt(position.spotPrice),
      fee: BigInt(position.fee),
      realizedPnl: BigInt(position.realizedPnl),
      txHash: position.id.split('-')[0]
    };
  });

  return positions.length > 0 ? result : null;
};

export const getAllPositionHistory = async (walletArr: string, limit: number, offset: number) => {
  const fetchAllPositionHistory = await fetchMethod(
    'POST',
    `{
      positionChangedEvents(
          first: ${limit},
          skip: ${offset},
          where:{
              trader: "${walletArr.toLowerCase()}"
          }
          orderBy: timestampIndex,
          orderDirection: desc
        ){
          id
          amm
          timestamp
          exchangedPositionSize
          positionSizeAfter
          positionNotional
          spotPrice
          fee
          realizedPnl
          liquidationPenalty
          amount
        }
    }`
  );

  const positions = fetchAllPositionHistory?.data?.positionChangedEvents;
  if (!positions) return null;

  const result = positions.map((position: any) => {
    const exchangedPositionSize = BigInt(position.exchangedPositionSize);
    const positionSizeAfter = BigInt(position.positionSizeAfter);
    let type = 'unknown';
    type = exchangedPositionSize < 0n ? 'short' : 'long';

    return {
      timestamp: Number(position.timestamp),
      amm: position.amm,
      type,
      exchangedPositionSize,
      positionSizeAfter,
      entryPrice: Math.abs(position.positionNotional) / Math.abs(position.exchangedPositionSize),
      spotPrice: BigInt(position.spotPrice),
      fee: BigInt(position.fee),
      realizedPnl: BigInt(position.realizedPnl),
      txHash: position.id.split('-')[0],
      positionNotional: BigInt(position.positionNotional),
      amount: BigInt(position.amount),
      liquidationPenalty: BigInt(position.liquidationPenalty)
    };
  });

  return positions.length > 0 ? result : null;
};

export const getMarketHistory = async (ammAddr: string) => {
  const fetchPositions = await fetchMethod(
    'POST',
    `{
      positionChangedEvents(
          orderBy: timestampIndex,
          orderDirection: desc,
          where:{
            amm: "${ammAddr.toLowerCase()}"
          }
        ){
          id
          amm  
          timestamp
          exchangedPositionSize
          positionNotional
          spotPrice
          positionSizeAfter
          liquidationPenalty
          trader
        }
    }`
  );

  const positions = fetchPositions?.data?.positionChangedEvents;

  const userAddresses: any[] = [];
  const finalPositions: any[] = [];

  if (!(positions.length > 0)) return { userAddresses, finalPositions };
  if (positions.length > 0) {
    positions.map((position: any) => {
      if (binarySearch(userAddresses, position.trader) < 0) {
        userAddresses.push(position.trader);
      }
      finalPositions.push({
        ammAddress: position.amm,
        timestamp: position.timestamp,
        exchangedPositionSize: position.exchangedPositionSize, // BAYC
        positionNotional: position.positionNotional, // ETH paid
        positionSizeAfter: position.positionSizeAfter, // ETH size after
        liquidationPenalty: position.liquidationPenalty,
        spotPrice: position.spotPrice,
        userAddress: position.trader,
        txHash: position.id.split('-')[0]
      });

      return position;
    });
  }

  return { userAddresses, finalPositions };
};

export const getFundingPaymentHistory = async (ammAddr: string) => {
  const fetchFundingPaymentHistory = await fetchMethod(
    'POST',
    `{
      fundingRateUpdatedEvents(
          orderBy: timestamp,
          orderDirection: desc,
          where:{
            amm: "${ammAddr.toLowerCase()}"
          }
        ){
          amm  
          timestamp
          rateLong
          rateShort
          underlyingPrice
        }
    }`
  );

  const fundingPaymentHistory = fetchFundingPaymentHistory?.data ? fetchFundingPaymentHistory.data.fundingRateUpdatedEvents : [];
  return fundingPaymentHistory.length > 0 ? fundingPaymentHistory : [];
};

export const getSpotPriceAfter = async (ammAddr: string, timestamp: number, limit: number, offset: number) => {
  const fetchPositions = await fetchMethod(
    'POST',
    `{ 
      reserveSnapshottedEvents(
      first: ${limit},
      skip: ${offset},
      where:{
        amm: "${ammAddr}",
        timestamp_gt: ${timestamp}
      }
      orderBy: timestampIndex,
      orderDirection: asc
    ){
      timestamp
      spotPrice
    }
  }`
  );

  const positions = fetchPositions.data.reserveSnapshottedEvents;
  if (!(positions.length > 0)) return [];
  const result = positions.map((position: any) => ({
    timestamp: Number(position.timestamp),
    spotPrice: BigInt(position.spotPrice)
  }));

  return positions.length > 0 ? result : [];
};

export const getLatestSpotPriceBefore = async (ammAddr: string, timestamp: number) => {
  const fetchPositions = await fetchMethod(
    'POST',
    `{ 
        reserveSnapshottedEvents(
        first: 1,
        where:{
          amm: "${ammAddr}",
          timestamp_lt: ${timestamp}
        }
        orderBy: timestampIndex,
        orderDirection: desc
      ){
        timestamp
        spotPrice
      }
    }`
  );

  const positions = fetchPositions?.data?.reserveSnapshottedEvents;
  return positions?.length > 0
    ? {
        timestamp: Number(positions[0].timestamp),
        spotPrice: BigInt(positions[0].spotPrice)
      }
    : null;
};

export const getLatestOraclePriceBefore = async (ammAddr: string, timestamp: number) => {
  const fetchPositions = await fetchMethod(
    'POST',
    `{ 
        prices(
        first: 1,
        where:{
          nftAddress: "${ammAddr}",
          timestamp_lt: ${timestamp}
        }
        orderBy: timestamp,
        orderDirection: desc
      ){
        timestamp
        price
      }
    }`
    // GraphDataTarget['ORACLE']
  );

  const positions = fetchPositions?.data?.prices;
  return positions?.length > 0
    ? {
        timestamp: Number(positions[0].timestamp),
        spotPrice: BigInt(positions[0].price)
      }
    : null;
};

export const getGraphDataAfter = async (ammAddr: string, timestamp: number, resolution: number) => {
  const fetchGraphDatas = await fetchMethod(
    'POST',
    `{ 
      graphDatas(
        first: 1000,
        where:{
          amm: "${ammAddr}",
          startTime_gt: ${timestamp},
          resolution: ${resolution}
        }
        orderBy: startTime,
        orderDirection: asc
      ){
        startTime
        endTime
        high
        low
        open
        close
        volume
      }
    }`
  );

  const graphDatas = fetchGraphDatas?.data?.graphDatas;
  if (!(graphDatas?.length > 0)) return [];
  const result = graphDatas.map((data: any) => ({
    start: Number(data.startTime),
    end: Number(data.endTime),
    open: BigInt(data.open),
    close: BigInt(data.close),
    high: BigInt(data.high),
    low: BigInt(data.low),
    volume: BigInt(data.volume)
  }));

  return graphDatas?.length > 0 ? result : [];
};

export const getOracleGraphDataAfter = async (ammAddr: string, timestamp: number, resolution: number) => {
  const fetchGraphDatas = await fetchMethod(
    'POST',
    `{ 
      oracleGraphDatas(
        first: 1000,
        where:{
          nftAddress: "${ammAddr}",
          startTime_gt: ${timestamp},
          resolution: ${resolution}
        }
        orderBy: startTime,
        orderDirection: asc
      ){
        startTime
        endTime
        high
        low
        open
        close
      }
    }`
    // GraphDataTarget['ORACLE']
  );

  const graphDatas = fetchGraphDatas?.data?.oracleGraphDatas;
  if (!(graphDatas?.length > 0)) return [];

  const result = graphDatas.map((data: any) => ({
    start: Number(data.startTime),
    end: Number(data.endTime),
    open: BigInt(data.open),
    close: BigInt(data.close),
    high: BigInt(data.high),
    low: BigInt(data.low)
  }));

  return graphDatas?.length > 0 ? result : [];
};

export const getPositionHistoryAfter = async (ammAddr: string, walletAddr: string, timestamp: number) => {
  const fetchPositions = await fetchMethod(
    'POST',
    `{ 
        positionChangedEvents(
        first: 1000,
        where:{
          trader: "${walletAddr}",
          amm: "${ammAddr}",
          timestamp_gt: ${timestamp}
        }
        orderBy: timestampIndex,
        orderDirection: asc
      ){
        timestamp
        positionSizeAfter
        openNotionalAfter
        margin
      }
    }`
  );

  const positions = fetchPositions?.data?.positionChangedEvents;
  if (!(positions?.length > 0)) return [];

  const result = positions.map((position: any) => ({
    timestamp: Number(position.timestamp),
    size: BigInt(position.positionSizeAfter),
    notional: BigInt(position.openNotionalAfter),
    margin: BigInt(position.margin)
  }));

  return positions?.length > 0 ? result : [];
};

export const getPositionHistoryBefore = async (ammAddr: string, walletAddr: string, timestamp: number) => {
  const fetchPositions = await fetchMethod(
    'POST',
    `{ 
        positionChangedEvents(
        first: 1,
        where:{
          trader: "${walletAddr}",
          amm: "${ammAddr}",
          timestamp_lt: ${timestamp}
        }
        orderBy: timestampIndex,
        orderDirection: desc
      ){
        timestamp
        positionSizeAfter
        openNotionalAfter
        margin
      }
    }`
  );

  const positions = fetchPositions?.data?.positionChangedEvents;
  if (!(positions?.length > 0)) return [];

  const result = {
    timestamp: Number(positions[0].timestamp),
    size: BigInt(positions[0].positionSizeAfter),
    notional: BigInt(positions[0].openNotionalAfter),
    margin: BigInt(positions[0].margin)
  };

  return positions.length > 0 ? result : [];
};

export const getTokenBalanceAfter = async (walletAddr: string, timestamp: number) => {
  const fetchHistory = await fetchMethod(
    'POST',
    `{ 
        tokenBalanceHistories(
        first: 1000,
        where:{
          trader: "${walletAddr}",
          timestamp_gt: ${timestamp}
        }
        orderBy: timestamp,
        orderDirection: asc
      ){
        timestamp
        balance
      }
    }`
  );

  const histories = fetchHistory?.data?.tokenBalanceHistories;
  if (!(histories?.length > 0)) return [];

  const result = histories.map((history: any) => ({
    timestamp: Number(history.timestamp),
    balance: BigInt(history.balance)
  }));

  return histories.length > 0 ? result : [];
};

export const getTokenBalanceBefore = async (walletAddr: string, timestamp: number) => {
  const fetchHistories = await fetchMethod(
    'POST',
    `{ 
      tokenBalanceHistories(
      first: 1,
      where:{
        trader: "${walletAddr}",
        timestamp_lt: ${timestamp}
      }
      orderBy: timestamp,
      orderDirection: desc
    ){
      timestamp
      balance
    }
  }`
  );

  const histories = fetchHistories?.data?.tokenBalanceHistories;
  if (!(histories?.length > 0)) return null;

  const result = {
    timestamp: Number(histories[0].timestamp),
    balance: BigInt(histories[0].balance)
  };

  return histories.length > 0 ? result : null;
};

export const getMarginChangedEventAfter = async (ammAddr: string, walletAddr: string, timestamp: number) => {
  const fetchEvents = await fetchMethod(
    'POST',
    `{ 
        marginChangedEvents(
        first: 1000,
        where:{
          sender: "${walletAddr}",
          amm: "${ammAddr}",
          timestamp_gt: ${timestamp}
        }
        orderBy: timestamp,
        orderDirection: asc
      ){
        timestamp
        amount
        fundingPayment
      }
    }`
  );

  const events = fetchEvents?.data?.marginChangedEvents;
  if (!(events?.length > 0)) return [];

  const result = events.map((event: any) => ({
    timestamp: Number(event.timestamp),
    amount: BigInt(event.amount),
    fundingPayment: BigInt(event.fundingPayment)
  }));

  return events.length > 0 ? result : [];
};

export const getMarginChangedEventBefore = async (ammAddr: string, walletAddr: string, timestamp: number) => {
  const fetchEvents = await fetchMethod(
    'POST',
    `{ 
        marginChangedEvents(
        first: 1000,
        where:{
          sender: "${walletAddr}",
          amm: "${ammAddr}",
          timestamp_lt: ${timestamp}
        }
        orderBy: timestamp,
        orderDirection: desc
      ){
        timestamp
        amount
        fundingPayment
      }
    }`
  );

  const events = fetchEvents?.data?.marginChangedEvents;
  if (!(events?.length > 0)) return [];

  const result = events.map((event: any) => ({
    timestamp: Number(event.timestamp),
    amount: BigInt(event.amount),
    fundingPayment: BigInt(event.fundingPayment)
  }));

  return events.length > 0 ? result : [];
};

export const getAllAmmPosition = async (walletAddr: string) => {
  const fetchPositions = await fetchMethod(
    'POST',
    `{ 
        ammPositions(
        first: 1000,
        where:{
          trader: "${walletAddr}"
        }
      ){
        amm
        positionSize
      }
    }`
  );

  const positions = fetchPositions?.data?.ammPositions;
  if (!(positions?.length > 0)) return [];

  const result = positions.map((event: any) => ({
    amm: event.amm,
    positionSize: BigInt(event.positionSize)
  }));

  return positions.length > 0 ? result : [];
};
