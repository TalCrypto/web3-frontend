/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/no-cycle */
/* eslint-disable indent */
import { utils, BigNumber } from 'ethers';
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
  const latestPriceBeforeRange = await getLatestSpotPriceBefore(ammAddr, startRoundTime);

  const rawGraphDatas = await getGraphDataAfter(ammAddr, startRoundTime - 1, interval);
  const graphData: any[] = [];

  let rawGraphDataIndex = 0;

  let high = BigNumber.from(0);
  let low = BigNumber.from(0);
  let volume = BigNumber.from(0);

  for (let i = 0; i < totalRound; i += 1) {
    const currentRoundStartTime = startRoundTime + i * interval;
    const currentRoundEndTime = currentRoundStartTime + interval;

    const rawGraphData = rawGraphDatas[rawGraphDataIndex];

    if (!rawGraphData || currentRoundStartTime < rawGraphData.start) {
      // No raw graph data for this round
      if (graphData.length > 0) {
        // use previous raw graph data if available
        const lastRoundClose = BigNumber.from(graphData[graphData.length - 1].close);
        if (lastRoundClose.gt(high)) {
          high = lastRoundClose;
        }
        if (low.isZero() || lastRoundClose.lt(low)) {
          low = lastRoundClose;
        }
        graphData.push({
          round: i + 1,
          avgPrice: graphData[graphData.length - 1].close,
          open: graphData[graphData.length - 1].close,
          close: graphData[graphData.length - 1].close,
          start: currentRoundStartTime,
          end: currentRoundEndTime
        });
      } else if (latestPriceBeforeRange) {
        // use latest price before range if available
        if (latestPriceBeforeRange.spotPrice.gt(high)) {
          high = latestPriceBeforeRange.spotPrice;
        }
        if (low.isZero() || latestPriceBeforeRange.spotPrice.lt(low)) {
          low = latestPriceBeforeRange.spotPrice;
        }
        graphData.push({
          round: i + 1,
          avgPrice: latestPriceBeforeRange.spotPrice.toString(),
          open: latestPriceBeforeRange.spotPrice.toString(),
          close: latestPriceBeforeRange.spotPrice.toString(),
          start: currentRoundStartTime,
          end: currentRoundEndTime
        });
      }
    } else if (currentRoundStartTime === rawGraphData.start) {
      if (rawGraphData.high.gt(high)) {
        high = rawGraphData.high;
      }
      if (low.isZero() || rawGraphData.low.lt(low)) {
        low = rawGraphData.low;
      }
      volume = volume.add(rawGraphData.volume);
      graphData.push({
        round: i + 1,
        avgPrice: rawGraphData.avgPrice.toString(),
        open: rawGraphData.open.toString(),
        close: rawGraphData.close.toString(),
        start: currentRoundStartTime,
        end: currentRoundEndTime
      });
      rawGraphDataIndex += 1;
    }
  }

  const baseData = graphData[0];
  let priceChangeRatio = BigNumber.from(0);
  let priceChangeValue = BigNumber.from(0);
  if (baseData && rawGraphDatas.length > 1) {
    const basePrice = BigNumber.from(baseData.open);
    const priceNow = rawGraphDatas[rawGraphDatas.length - 1].close;
    priceChangeValue = priceNow.sub(basePrice);
    priceChangeRatio = priceNow.sub(basePrice).mul(utils.parseEther('1')).div(basePrice).mul(100);
  }

  return { graphData, priceChangeValue, priceChangeRatio, high, low, volume };
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
  let currentTokenBalance = previousBalanceHistory == null ? BigNumber.from(0) : previousBalanceHistory.balance;

  const marginsCarryOverToNextRound = previousMarginChangedEvents.map((events: any, index: number) =>
    events
      .filter((event: any) => event.timestamp > roundPositionHistories[index].timestamp)
      .reduce(
        (acc: any, event: any) => acc.add(BigNumber.from(event.amount.toString())).sub(BigNumber.from(event.fundingPayment.toString())),
        BigNumber.from(0)
      )
  );

  const graphData = [];

  for (let i = 0; i < totalRound; i += 1) {
    const currentRoundStartTime = startRoundTime + i * interval;
    const currentRoundEndTime = currentRoundStartTime + interval;

    let currentRoundEstimatedPnL = BigNumber.from(0);
    let currentRoundMargin = BigNumber.from(0);
    let currentRoundPortfolioCollateralValue = BigNumber.from(0);

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
              marginsCarryOverToNextRound[j] = BigNumber.from(0);
            }
          }

          currentRoundMargin = currentRoundMargin.add(marginsCarryOverToNextRound[j]);

          if (roundPositionHistories[j]) {
            const currentEntryPrice = roundPositionHistories[j].size.isZero()
              ? BigNumber.from(0)
              : roundPositionHistories[j].notional.mul(utils.parseEther('1')).div(roundPositionHistories[j].size.abs());
            const currentEstimatedPnL = roundPositionHistories[j].size.isZero()
              ? BigNumber.from(0)
              : BigNumber.from(roundData.close).sub(currentEntryPrice).mul(roundPositionHistories[j].size).div(utils.parseEther('1'));
            currentRoundEstimatedPnL = currentRoundEstimatedPnL.add(currentEstimatedPnL);
            currentRoundMargin = currentRoundMargin.add(roundPositionHistories[j].margin);

            // Handle margin changed event
            if (marginChangedEventHistoryList[j]) {
              let marginSum = BigNumber.from(0);
              let shouldUpdateMarginsCarryOver = false;
              if (!roundPositionHistories[j].marginAdjusted) {
                for (let k = 0; k < marginChangedEventHistoryList[j].length; k += 1) {
                  const event = marginChangedEventHistoryList[j][k];
                  if (event.timestamp >= roundPositionHistories[j].timestamp && event.timestamp < currentRoundEndTime) {
                    currentRoundMargin = currentRoundMargin.add(event.amount).sub(event.fundingPayment);
                    marginSum = marginSum.add(event.amount).sub(event.fundingPayment);
                    shouldUpdateMarginsCarryOver = true;
                  }
                }
                roundPositionHistories[j].marginAdjusted = true;
                if (shouldUpdateMarginsCarryOver) marginsCarryOverToNextRound[j] = marginsCarryOverToNextRound[j].add(marginSum);
              } else {
                for (let k = 0; k < marginChangedEventHistoryList[j].length; k += 1) {
                  const event = marginChangedEventHistoryList[j][k];
                  if (event.timestamp >= currentRoundStartTime && event.timestamp < currentRoundEndTime) {
                    currentRoundMargin = currentRoundMargin.add(event.amount).sub(event.fundingPayment);
                    marginSum = marginSum.add(event.amount).sub(event.fundingPayment);
                    shouldUpdateMarginsCarryOver = true;
                  }
                }
                if (shouldUpdateMarginsCarryOver) marginsCarryOverToNextRound[j] = marginsCarryOverToNextRound[j].add(marginSum);
              }
            }
          }

          currentGraphItems[j] = spotPriceGraphDataList[j].graphData.shift(); // Move to next roundData
        }
      }
    }

    currentRoundPortfolioCollateralValue = currentRoundMargin.add(currentRoundEstimatedPnL);
    const currentRoundAccountValue = currentRoundPortfolioCollateralValue.add(currentTokenBalance);

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
    priceChangeValue: BigNumber.from(0),
    priceChangeRatio: BigNumber.from(0),
    high: BigNumber.from(0),
    low: BigNumber.from(0)
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
