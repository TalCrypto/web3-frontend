import { binarySearch } from '@/utils/arrayHelper';

const subgraphUrl = process.env.NEXT_PUBLIC_SUPGRAPH_ENDPOINT ?? '';
const subgraphBackupUrl = process.env.NEXT_PUBLIC_SUPGRAPH_PAID_ENDPOINT ?? '';

const fetchMethod = async (_method: string, _query: string) => {
  const normalFetch = await fetch(subgraphUrl, {
    method: _method,
    body: JSON.stringify({
      query: _query
    })
  });
  if (normalFetch.ok) {
    const resJson = normalFetch.json();
    return resJson;
  }
  const backupFetch = await fetch(subgraphBackupUrl, {
    method: _method,
    body: JSON.stringify({
      query: _query
    })
  });
  const resJson = backupFetch.json();
  return resJson;
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

  const dayTradeData = fetchDayTradeData.data.dayTradeDatas;

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

  const openInterest = {
    balance: BigInt(fetchOpenInterest.data.amm.positionBalance),
    notional: BigInt(fetchOpenInterest.data.amm.openInterestNotional),
    size: BigInt(fetchOpenInterest.data.amm.openInterestSize)
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

  const positions = fetchPositions.data.positionChangedEvents;

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
          amount
        }
    }`
  );

  const positions = fetchAllPositionHistory.data.positionChangedEvents;

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
      amount: BigInt(position.amount)
    };
  });

  return positions.length > 0 ? result : null;
};

export const getMarketHistory = async (ammAddr: string) => {
  const fetchPositions = await fetchMethod(
    'POST',
    `{
      positionChangedEvents(
          first: 20,
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

  const positions = fetchPositions.data.positionChangedEvents;

  const userAddresses: any[] = [];
  const finalPositions: any[] = [];

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

  const fundingPaymentHistory = fetchFundingPaymentHistory.data ? fetchFundingPaymentHistory.data.fundingRateUpdatedEvents : [];
  return fundingPaymentHistory.length > 0 ? fundingPaymentHistory : null;
};

export const getSpotPriceAfter = async (ammAddr: string, timestamp: number, limit: number, offset: number) => {
  const positions = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{ 
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.reserveSnapshottedEvents);

  const result = positions.map((position: any) => ({
    timestamp: Number(position.timestamp),
    spotPrice: BigInt(position.spotPrice)
  }));

  return positions.length > 0 ? result : null;
};

export const getLatestSpotPriceBefore = async (ammAddr: string, timestamp: number) => {
  const positions = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{ 
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.reserveSnapshottedEvents);

  return positions.length > 0
    ? {
        timestamp: Number(positions[0].timestamp),
        spotPrice: BigInt(positions[0].spotPrice)
      }
    : null;
};

export const getGraphDataAfter = async (ammAddr: string, timestamp: number, resolution: number) => {
  const graphDatas = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{ 
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.graphDatas);

  const result = graphDatas.map((data: any) => ({
    start: Number(data.startTime),
    end: Number(data.endTime),
    open: BigInt(data.open),
    close: BigInt(data.close),
    high: BigInt(data.high),
    low: BigInt(data.low),
    volume: BigInt(data.volume)
  }));

  return graphDatas.length > 0 ? result : [];
};

export const getPositionHistoryAfter = async (ammAddr: string, walletAddr: string, timestamp: number) => {
  const positions = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{ 
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.positionChangedEvents);

  const result = positions.map((position: any) => ({
    timestamp: Number(position.timestamp),
    size: BigInt(position.positionSizeAfter),
    notional: BigInt(position.openNotionalAfter),
    margin: BigInt(position.margin)
  }));

  return positions.length > 0 ? result : [];
};

export const getPositionHistoryBefore = async (ammAddr: string, walletAddr: string, timestamp: number) => {
  const positions = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{ 
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.positionChangedEvents);

  const result = {
    timestamp: Number(positions[0].timestamp),
    size: BigInt(positions[0].positionSizeAfter),
    notional: BigInt(positions[0].openNotionalAfter),
    margin: BigInt(positions[0].margin)
  };

  return positions.length > 0 ? result : null;
};

export const getTokenBalanceAfter = async (walletAddr: string, timestamp: number) => {
  const histories = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{ 
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.tokenBalanceHistories);

  const result = histories.map((history: any) => ({
    timestamp: Number(history.timestamp),
    balance: BigInt(history.balance)
  }));

  return histories.length > 0 ? result : [];
};

export const getTokenBalanceBefore = async (walletAddr: string, timestamp: number) => {
  const histories = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{ 
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.tokenBalanceHistories);

  const result = {
    timestamp: Number(histories[0].timestamp),
    balance: BigInt(histories[0].balance)
  };

  return histories.length > 0 ? result : null;
};

export const getMarginChangedEventAfter = async (ammAddr: string, walletAddr: string, timestamp: number) => {
  const events = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{ 
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.marginChangedEvents);

  const result = events.map((event: any) => ({
    timestamp: Number(event.timestamp),
    amount: BigInt(event.amount),
    fundingPayment: BigInt(event.fundingPayment)
  }));

  return events.length > 0 ? result : [];
};

export const getMarginChangedEventBefore = async (ammAddr: string, walletAddr: string, timestamp: number) => {
  const events = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{ 
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.marginChangedEvents);

  const result = events.map((event: any) => ({
    timestamp: Number(event.timestamp),
    amount: BigInt(event.amount),
    fundingPayment: BigInt(event.fundingPayment)
  }));

  return events.length > 0 ? result : [];
};

export const getAllAmmPosition = async (walletAddr: string) => {
  const positions = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{ 
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.ammPositions);

  const result = positions.map((event: any) => ({
    amm: event.amm,
    positionSize: BigInt(event.positionSize)
  }));

  return positions.length > 0 ? result : [];
};
