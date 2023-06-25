import { apiConnection } from '@/utils/apiConnection';
import {
  // getOpenInterest,
  getPositionHistory,
  getMarketHistory as getMarketHistoryFromSubgraph,
  getFundingPaymentHistory as getFundingPaymentHistoryFromSubgraph,
  getLatestSpotPriceBefore,
  getGraphDataAfter,
  getPositionHistoryAfter,
  getPositionHistoryBefore,
  getTokenBalanceAfter,
  getTokenBalanceBefore,
  getAllPositionHistory,
  getMarginChangedEventAfter,
  getMarginChangedEventBefore
} from './subgraph';
import { findLastIndex } from './arrayHelper';

export async function getTraderPositionHistory(ammAddr: string, walletAddr: string) {
  return getPositionHistory(ammAddr, walletAddr);
}

export async function getAllTraderPositionHistory(walletAddr: string, limit: number, offset: number) {
  return getAllPositionHistory(walletAddr, limit, offset);
}

export async function getMarketHistory(ammAddr: string) {
  let usernameList: any[] = [];
  const { userAddresses, finalPositions } = await getMarketHistoryFromSubgraph(ammAddr);
  try {
    usernameList = finalPositions.length > 0 ? await apiConnection.getUsernameFromAddress(userAddresses) : [];
  } catch (error) {
    usernameList = [];
  }

  return finalPositions.length > 0
    ? finalPositions.map(position => ({
        ...position,
        userId:
          !usernameList?.[position.userAddress] || usernameList?.[position.userAddress] === position.userAddress
            ? ''
            : usernameList?.[position.userAddress]
      }))
    : [];
}

export async function getFundingPaymentHistory(ammAddr: string) {
  return getFundingPaymentHistoryFromSubgraph(ammAddr);
}

export async function getSpotPriceGraphData(ammAddr: string, startFrom: number, interval: number) {
  const now = new Date().getTime();
  const nowTs = Math.round(now / 1000);
  const startRoundTime = startFrom - (startFrom % interval);
  const totalRound = Math.floor((nowTs - startRoundTime) / interval);

  const result = [];
  const rawGraphData = await getGraphDataAfter(ammAddr, startRoundTime - 1, interval);
  console.log('rawGraphData', rawGraphData);
  if (!rawGraphData || rawGraphData.length === 0) {
    const latestPriceBeforeRange = await getLatestSpotPriceBefore(ammAddr, startRoundTime);
    if (latestPriceBeforeRange) {
      for (let i = 0; i < totalRound; i += 1) {
        const currentRoundStartTime = startRoundTime + i * interval;
        const currentRoundEndTime = currentRoundStartTime + interval - 1;
        result.push({
          start: currentRoundStartTime,
          end: currentRoundEndTime,
          high: latestPriceBeforeRange.spotPrice,
          low: latestPriceBeforeRange.spotPrice,
          open: latestPriceBeforeRange.spotPrice,
          close: latestPriceBeforeRange.spotPrice,
          volume: 0n
        });
      }
    }
  } else {
    // return rawGraphData;
    result.push(rawGraphData[0]);
    let i = 1;
    while (result[result.length - 1].end < nowTs) {
      if (rawGraphData.length < i + 1 || rawGraphData[i].start !== result[result.length - 1].end + 1) {
        result.push({
          start: result[result.length - 1].end + 1,
          end: result[result.length - 1].end + interval,
          high: result[result.length - 1].close,
          low: result[result.length - 1].close,
          open: result[result.length - 1].close,
          close: result[result.length - 1].close,
          volume: 0n
        });
      } else {
        result.push(rawGraphData[i]);
        i += 1;
      }
    }
  }
  return result;
}

export async function getDailySpotPriceGraphData(ammAddr: string) {
  const nowTs = Math.round(new Date().getTime() / 1000);
  const tsYesterday = nowTs - 1 * 24 * 3600;
  return getSpotPriceGraphData(ammAddr, tsYesterday, 300); // 5mins
}

export async function getWeeklySpotPriceGraphData(ammAddr: string) {
  const nowTs = Math.round(new Date().getTime() / 1000);
  const ts7Days = nowTs - 7 * 24 * 3600;
  return getSpotPriceGraphData(ammAddr, ts7Days, 1800); // 30mins
}

export async function getMonthlySpotPriceGraphData(ammAddr: string) {
  const nowTs = Math.round(new Date().getTime() / 1000);
  const ts30Days = nowTs - 30 * 24 * 3600;
  return getSpotPriceGraphData(ammAddr, ts30Days, 7200); // 2hr
}

export async function getThreeMonthlySpotPriceGraphData(ammAddr: string) {
  const nowTs = Math.round(new Date().getTime() / 1000);
  const ts90Days = nowTs - 90 * 24 * 3600;
  return getSpotPriceGraphData(ammAddr, ts90Days, 7200); // 2hr
}

export async function getAccountValueGraphData(ammAddrList: any, walletAddr: string, startFrom: number, interval: number) {
  const now = new Date().getTime();
  const nowTs = Math.round(now / 1000);
  const startRoundTime = startFrom - (startFrom % interval);
  const totalRound = Math.floor((nowTs - startRoundTime) / interval);

  const positionHistoryList = await Promise.all(
    ammAddrList.map(async (ammAddress: string) => getPositionHistoryAfter(ammAddress, walletAddr, startRoundTime - 1))
  );
  const previousPositionList = await Promise.all(
    ammAddrList.map(async (ammAddress: string) => getPositionHistoryBefore(ammAddress, walletAddr, startRoundTime))
  );
  const tokenBalanceHistoryList = await getTokenBalanceAfter(walletAddr, startRoundTime);
  const previousBalanceHistory = await getTokenBalanceBefore(walletAddr, startRoundTime);
  const marginChangedEventHistoryList = await Promise.all(
    ammAddrList.map(async (ammAddress: string) => getMarginChangedEventAfter(ammAddress, walletAddr, startRoundTime - 1))
  ); // [marginChangedEvent[], ...]
  const previousMarginChangedEvents = await Promise.all(
    ammAddrList.map(async (ammAddress: string) => getMarginChangedEventBefore(ammAddress, walletAddr, startRoundTime))
  ); // marginChangedEvent[]

  const spotPriceGraphDataList = await Promise.all(
    ammAddrList.map(async (ammAddress: string) => getSpotPriceGraphData(ammAddress, startFrom, interval))
  );

  const currentGraphItems = spotPriceGraphDataList.map((graphDatas: any) => graphDatas.graphData.shift());
  const roundPositionHistories = previousPositionList;
  let currentTokenBalance = previousBalanceHistory == null ? 0n : previousBalanceHistory.balance;

  const marginsCarryOverToNextRound = previousMarginChangedEvents.map((events: any, index: number) =>
    events
      .filter((event: any) => event.timestamp > roundPositionHistories[index].timestamp)
      .reduce((acc: any, event: any) => acc + BigInt(event.amount.toString()) - BigInt(event.fundingPayment.toString()), 0n)
  );

  const graphData = [];

  for (let i = 0; i < totalRound; i += 1) {
    const currentRoundStartTime = startRoundTime + i * interval;
    const currentRoundEndTime = currentRoundStartTime + interval;

    let currentRoundEstimatedPnL = 0n;
    let currentRoundMargin = 0n;
    let currentRoundPortfolioCollateralValue = 0n;

    for (let j = 0; j < spotPriceGraphDataList.length; j += 1) {
      const roundData = currentGraphItems[j];

      if (roundData) {
        if (roundData.start === currentRoundStartTime) {
          // Handle token balance
          const lastBalanceForThisRoundIndex = findLastIndex(
            tokenBalanceHistoryList,
            (balance: any) => balance.timestamp >= currentRoundStartTime && balance.timestamp < currentRoundEndTime
          );
          if (lastBalanceForThisRoundIndex > -1) {
            tokenBalanceHistoryList.splice(0, lastBalanceForThisRoundIndex);
            currentTokenBalance = tokenBalanceHistoryList.shift().balance;
          }

          // Handle position history
          if (positionHistoryList[j]) {
            const lastPositionForThisRoundIndex = findLastIndex(
              positionHistoryList[j],
              (history: any) => history.timestamp >= currentRoundStartTime && history.timestamp < currentRoundEndTime
            );
            if (lastPositionForThisRoundIndex > -1) {
              positionHistoryList[j].splice(0, lastPositionForThisRoundIndex);
              roundPositionHistories[j] = positionHistoryList[j].shift(); // Move to next positionHistory
              marginsCarryOverToNextRound[j] = 0n;
            }
          }

          currentRoundMargin += marginsCarryOverToNextRound[j];

          if (roundPositionHistories[j]) {
            const currentEntryPrice = roundPositionHistories[j].size.isZero()
              ? 0n
              : (roundPositionHistories[j].notional * BigInt(1e18)) / roundPositionHistories[j].size.abs();
            const currentEstimatedPnL = roundPositionHistories[j].size.isZero()
              ? 0n
              : ((BigInt(roundData.close) - currentEntryPrice) * roundPositionHistories[j].size) / BigInt(1e18);
            currentRoundEstimatedPnL += currentEstimatedPnL;
            currentRoundMargin += roundPositionHistories[j].margin;

            // Handle margin changed event
            if (marginChangedEventHistoryList[j]) {
              let marginSum = 0n;
              let shouldUpdateMarginsCarryOver = false;
              if (!roundPositionHistories[j].marginAdjusted) {
                for (let k = 0; k < marginChangedEventHistoryList[j].length; k += 1) {
                  const event = marginChangedEventHistoryList[j][k];
                  if (event.timestamp >= roundPositionHistories[j].timestamp && event.timestamp < currentRoundEndTime) {
                    currentRoundMargin += event.amount;
                    currentRoundMargin -= event.fundingPayment;
                    marginSum += event.amount;
                    marginSum -= event.fundingPayment;
                    shouldUpdateMarginsCarryOver = true;
                  }
                }
                roundPositionHistories[j].marginAdjusted = true;
                if (shouldUpdateMarginsCarryOver) marginsCarryOverToNextRound[j] += marginSum;
              } else {
                for (let k = 0; k < marginChangedEventHistoryList[j].length; k += 1) {
                  const event = marginChangedEventHistoryList[j][k];
                  if (event.timestamp >= currentRoundStartTime && event.timestamp < currentRoundEndTime) {
                    currentRoundMargin += event.amount;
                    currentRoundMargin -= event.fundingPayment;
                    marginSum += event.amount;
                    marginSum -= event.fundingPayment;
                    shouldUpdateMarginsCarryOver = true;
                  }
                }
                if (shouldUpdateMarginsCarryOver) marginsCarryOverToNextRound[j] += marginSum;
              }
            }
          }

          currentGraphItems[j] = spotPriceGraphDataList[j].graphData.shift(); // Move to next roundData
        }
      }
    }

    currentRoundPortfolioCollateralValue = currentRoundMargin + currentRoundEstimatedPnL;
    const currentRoundAccountValue = currentRoundPortfolioCollateralValue + currentTokenBalance;

    graphData.push({
      round: i + 1,
      avgPrice: currentRoundPortfolioCollateralValue.toString(),
      portfolioCollateralValue: currentRoundPortfolioCollateralValue.toString(),
      totalAccountValue: currentRoundAccountValue.toString(),
      start: currentRoundStartTime,
      end: currentRoundEndTime
    });
  }

  return {
    graphData,
    priceChangeValue: 0n,
    priceChangeRatio: 0n,
    high: 0n,
    low: 0n
  };
}

export async function getDailyAccountValueGraphData(ammAddrList: any, walletAddr: string) {
  const nowTs = Math.round(new Date().getTime() / 1000);
  const tsYesterday = nowTs - 1 * 24 * 3600;
  return getAccountValueGraphData(ammAddrList, walletAddr, tsYesterday, 300); // 5mins
}

export async function getWeeklyAccountValueGraphData(ammAddrList: any, walletAddr: string) {
  const nowTs = Math.round(new Date().getTime() / 1000);
  const ts7Days = nowTs - 7 * 24 * 3600;
  return getAccountValueGraphData(ammAddrList, walletAddr, ts7Days, 1800); // 30mins
}

export async function getMonthlyAccountValueGraphData(ammAddrList: any, walletAddr: string) {
  const nowTs = Math.round(new Date().getTime() / 1000);
  const ts30Days = nowTs - 30 * 24 * 3600;
  return getAccountValueGraphData(ammAddrList, walletAddr, ts30Days, 7200); // 2hr
}
