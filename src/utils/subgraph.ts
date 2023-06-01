import { BigNumber, utils } from 'ethers';
import { binarySearch } from '@/utils/arrayHelper';

const subgraphUrl = process.env.NEXT_PUBLIC_SUPGRAPH_ENDPOINT ?? '';

export const getLatestDayTradingDetails = async (ammAddr: string) => {
  const dayTradeData = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.dayTradeDatas);

  const result = {
    amm: dayTradeData[0].amm,
    startTime: Number(dayTradeData[0].timestamp),
    open: BigNumber.from(dayTradeData[0].open),
    high: BigNumber.from(dayTradeData[0].high),
    low: BigNumber.from(dayTradeData[0].low),
    close: BigNumber.from(dayTradeData[0].close),
    volume: BigNumber.from(dayTradeData[0].volume),
    txCount: Number(dayTradeData[0].txCount)
  };

  return dayTradeData.length > 0 ? result : null;
};

export const getOpenInterest = async (ammAddr: string) => {
  const openInterest = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{
                amm(id: "${ammAddr.toLowerCase()}") {
                    positionBalance
                    openInterestSize
                    openInterestNotional
                }
              }`
    })
  })
    .then(res => res.json())
    .then(resJson => ({
      balance: BigNumber.from(resJson.data.amm.positionBalance),
      notional: BigNumber.from(resJson.data.amm.openInterestNotional),
      size: BigNumber.from(resJson.data.amm.openInterestSize)
    }))
    .catch(() => null);

  return openInterest;
};

export const getPositionHistory = async (ammAddr: string, walletArr: string) => {
  const positions = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.positionChangedEvents);

  const result = positions.map((position: any) => {
    const exchangedPositionSize = BigNumber.from(position.exchangedPositionSize);
    const positionSizeAfter = BigNumber.from(position.positionSizeAfter);
    let type = 'unknown';

    if (positionSizeAfter.eq(0)) {
      // Close
      type = 'close';
    } else {
      // Open position
      type = exchangedPositionSize.isNegative() ? 'short' : 'long';
    }

    return {
      timestamp: Number(position.timestamp),
      type,
      exchangedPositionSize,
      positionSizeAfter,
      entryPrice: Math.abs(position.positionNotional) / Math.abs(position.exchangedPositionSize),
      spotPrice: BigNumber.from(position.spotPrice),
      fee: BigNumber.from(position.fee),
      realizedPnl: BigNumber.from(position.realizedPnl),
      txHash: position.id.split('-')[0]
    };
  });

  return positions.length > 0 ? result : null;
};

export const getAllPositionHistory = async (walletArr: string, limit: number, offset: number) => {
  const positions = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.positionChangedEvents);

  const result = positions.map((position: any) => {
    const exchangedPositionSize = BigNumber.from(position.exchangedPositionSize);
    const positionSizeAfter = BigNumber.from(position.positionSizeAfter);
    let type = 'unknown';
    type = exchangedPositionSize.isNegative() ? 'short' : 'long';

    return {
      timestamp: Number(position.timestamp),
      amm: position.amm,
      type,
      exchangedPositionSize,
      positionSizeAfter,
      entryPrice: Math.abs(position.positionNotional) / Math.abs(position.exchangedPositionSize),
      spotPrice: BigNumber.from(position.spotPrice),
      fee: BigNumber.from(position.fee),
      realizedPnl: BigNumber.from(position.realizedPnl),
      txHash: position.id.split('-')[0],
      positionNotional: BigNumber.from(position.positionNotional),
      amount: BigNumber.from(position.amount)
    };
  });

  return positions.length > 0 ? result : null;
};

export const getMarketHistory = async (ammAddr: string) => {
  const positions = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{
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
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.positionChangedEvents);

  const userAddresses: any[] = [];
  const finalPositions: any[] = [];

  if (positions.length > 0) {
    positions.map((position: any) => {
      if (binarySearch(userAddresses, position.trader) < 0) {
        userAddresses.push(position.trader);
      }
      finalPositions.push({
        amm: position.amm,
        timestamp: Number(position.timestamp),
        exchangedPositionSize: BigNumber.from(position.exchangedPositionSize), // BAYC
        positionNotional: BigNumber.from(position.positionNotional), // ETH paid
        positionSizeAfter: BigNumber.from(position.positionSizeAfter), // ETH size after
        liquidationPenalty: BigNumber.from(position.liquidationPenalty),
        spotPrice: BigNumber.from(position.spotPrice),
        userAddress: position.trader,
        txHash: position.id.split('-')[0]
      });

      return position;
    });
  }

  return { userAddresses, finalPositions };
};

export const getFundingPaymentHistory = async (ammAddr: string) => {
  const fundingPaymentHistory = await fetch(subgraphUrl, {
    method: 'POST',
    body: JSON.stringify({
      query: `{
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
    })
  })
    .then(res => res.json())
    .then(resJson => (resJson.data ? resJson.data.fundingRateUpdatedEvents : []));

  const result = fundingPaymentHistory.map((history: any) => {
    const rateLong = BigNumber.from(history.rateLong);
    const rateShort = BigNumber.from(history.rateShort);
    const underlyingPrice = BigNumber.from(history.underlyingPrice);
    const amountLong = underlyingPrice.mul(rateLong).div(utils.parseEther('1'));
    const amountShort = underlyingPrice.mul(rateLong).div(utils.parseEther('1'));

    return {
      amm: history.amm,
      timestamp: Number(history.timestamp),
      underlyingPrice,
      rateLong,
      rateShort,
      amountLong,
      amountShort
    };
  });

  return fundingPaymentHistory.length > 0 ? result : null;
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
    spotPrice: BigNumber.from(position.spotPrice)
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

  const result = {
    timestamp: Number(positions[0] ? positions[0].timestamp : 0),
    spotPrice: BigNumber.from(positions[0] ? positions[0].spotPrice : 0)
  };

  return positions.length > 0 ? result : null;
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
                average
              }
            }`
    })
  })
    .then(res => res.json())
    .then(resJson => resJson.data.graphDatas);

  const result = graphDatas.map((data: any) => ({
    start: Number(data.startTime),
    end: Number(data.endTime),
    open: BigNumber.from(data.open),
    close: BigNumber.from(data.close),
    high: BigNumber.from(data.high),
    low: BigNumber.from(data.low),
    volume: BigNumber.from(data.volume),
    avgPrice: BigNumber.from(data.average)
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
    size: BigNumber.from(position.positionSizeAfter),
    notional: BigNumber.from(position.openNotionalAfter),
    margin: BigNumber.from(position.margin)
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
    size: BigNumber.from(positions[0].positionSizeAfter),
    notional: BigNumber.from(positions[0].openNotionalAfter),
    margin: BigNumber.from(positions[0].margin)
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
    balance: BigNumber.from(history.balance)
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
    balance: BigNumber.from(histories[0].balance)
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
    amount: BigNumber.from(event.amount),
    fundingPayment: BigNumber.from(event.fundingPayment)
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
    amount: BigNumber.from(event.amount),
    fundingPayment: BigNumber.from(event.fundingPayment)
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
    positionSize: BigNumber.from(event.positionSize)
  }));

  return positions.length > 0 ? result : [];
};
