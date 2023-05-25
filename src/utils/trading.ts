/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable implicit-arrow-linebreak */
import { Contract as MulticallContract, Provider as MulticallProvider } from '@tribe3/ethers-multicall';
import { ethers, utils, BigNumber } from 'ethers';
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
  getMarginChangedEventBefore,
  getAllAmmPosition
} from './subgraph';
import { getLatestTwapPrice } from './oracle';
import { findLastIndex } from './arrayHelper';
import collectionList from '../const/collectionList';

const EthDater = require('ethereum-block-by-date');

const clearingHouseABI = require('../abi/clearingHouse.json');
const clearingHouseViewerABI = require('../abi/clearingHouseViewer.json');
const ammABI = require('../abi/amm.json');
const tokenABI = require('../abi/token.json');

const tokenAddr = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const clearingHouseAddr = process.env.NEXT_PUBLIC_CLEARING_ADDRESS;
const clearingHouseViewerAddr = process.env.NEXT_PUBLIC_CLEARING_HOUSE_VIEWER_ADDRESS;

const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY;
const suportChainId = process.env.NEXT_PUBLIC_SUPPORT_CHAIN ?? '';
const provider = new ethers.providers.AlchemyProvider(process.env.NEXT_PUBLIC_ALCHEMY_PROVIDER, infuraKey);
const multicallProvider = new MulticallProvider(provider, parseInt(suportChainId));
const dater = new EthDater(provider);
// const blockNumberMap:any[] = new Map();
const blockNumberMap: any[] = [];
// const TWAP_INTERVAL = 10800;

// struct PositionInfo {
//     int256 positionSize; // the contract size of a position
//     int256 openMargin; // the margin that is collateralized when opening
//     int256 margin; // openMargin + fundingPayment + unrealizedPnl
//     int256 unrealizedPnl; // the unrealized profit and loss of a position
//     int256 fundingPayment; // the funding payment that a position has received since opening the position
//     int256 marginRatio; // (openMargin + fundingPayment + unrealizedPnl) / positionNotional
//     int256 liquidationPrice; // the price at which a position is liquidated
//     uint256 openLeverage; // the leverage that was used when opening a position
//     uint256 leverage; // the current leverage, positionNotional / (openMargin + fundingPayment + unrealizedPnl)
//     uint256 openNotional; // the notional value of a position when it is opened
//     uint256 positionNotional; // the current notional value of a position
//     uint256 avgEntryPrice; // the average executed price of the current position size
//     uint256 spotPrice; // the current vAmm price
//     bool isLiquidatable;
// }

export async function getTraderPositionInfo(ammAddr: string, walletAddr: string) {
  try {
    const clearingHouseViewerContract = new MulticallContract(clearingHouseViewerAddr, clearingHouseViewerABI);
    const [positionInfo] = await multicallProvider.all([
      clearingHouseViewerContract.getTraderPositionInfoWithoutPriceImpact(ammAddr, walletAddr)
      // get PositionInfo struct without price impact
    ]);

    const collection = collectionList.filter(item => item.amm === ammAddr)[0];
    if (positionInfo.positionSize.isZero()) {
      return null;
    }
    return {
      pair: collection.name,
      size: positionInfo.positionSize,
      sizeAbs: positionInfo.positionSize.abs(),
      realMargin: positionInfo.margin,
      openNotional: positionInfo.openNotional,
      currentNotional: positionInfo.positionNotional,
      unrealizedPnl: positionInfo.unrealizedPnl,
      marginRatio: positionInfo.marginRatio.mul(100),
      entryPrice: positionInfo.avgEntryPrice,
      leverage: positionInfo.openLeverage,
      liquidationPrice: positionInfo.liquidationPrice.isNegative() ? BigNumber.from(0) : positionInfo.liquidationPrice,
      spotPrice: positionInfo.spotPrice,
      remainMarginLeverage: positionInfo.leverage,
      fundingPayment: positionInfo.fundingPayment,
      amm: ammAddr,
      isLiquidatable: positionInfo.isLiquidatable
    };
  } catch (err) {
    return null;
  }
}

export async function getTraderPositionInfosByAmmAddressList(ammAddrList: any, walletAddr: string) {
  return (await Promise.all(ammAddrList.map((address: any) => getTraderPositionInfo(address, walletAddr)))).filter(
    position => position !== null
  );
}

export async function getMarginAdjustmentEstimation(ammAddr: string, walletAddr: string, adjustment: BigNumber, side: number) {
  // side: 0 for increase, 1 for decrease
  try {
    let signedAdjustment = adjustment;
    if (side === 1) signedAdjustment = adjustment.mul(-1);
    const clearingHouseViewerContract = new MulticallContract(clearingHouseViewerAddr, clearingHouseViewerABI);
    const [positionInfo] = await multicallProvider.all([
      clearingHouseViewerContract.getMarginAdjustmentEstimation(ammAddr, walletAddr, signedAdjustment) // returns PositionInfo struct
    ]);
    if (positionInfo.positionSize.isZero()) {
      return null;
    }
    const marginRatioPercentage = positionInfo.marginRatio.mul(100);
    return {
      marginRatio: marginRatioPercentage,
      leverage: positionInfo.leverage,
      liquidationPrice: positionInfo.liquidationPrice.isNegative() ? BigNumber.from(0) : positionInfo.liquidationPrice,
      isLiquidatable: positionInfo.isLiquidatable
    };
  } catch (err) {
    return null;
  }
}

// struct TxSummary {
//   // the quote asset amount trader will send if open position, will receive if close
//   uint256 exchangedQuoteAssetAmount;
//   // if realizedPnl + realizedFundingPayment + margin is negative, it's the abs value of it
//   uint256 badDebt;
//   // the base asset amount trader will receive if open position, will send if close
//   int256 exchangedPositionSize;
//   // funding payment incurred during this position response
//   // realizedPnl = unrealizedPnl * closedRatio
//   int256 realizedPnl;
//   // positive = trader transfer margin to vault, negative = trader receive margin from vault
//   // it's 0 when reducePosition, its addedMargin when _increasePosition
//   // it's min(0, openMargin + realizedFundingPayment + realizedPnl) when _closePosition
//   int256 marginToVault;
//   // fee to the insurance fund
//   uint256 spreadFee;
//   // fee to the toll pool which provides rewards to the token stakers
//   uint256 tollFee;
//   // the executed price of a standalone tx
//   uint256 entryPrice;
//   // (entryPrice - spotPrice) / spotPrice
//   int256 priceImpact;
// }

// struct OpenPositionEstResp {
//   // the estimated position info after having opened a position
//   PositionInfo positionInfo;
//   TxSummary txSummary;
// }

export async function getOpenPositionEstimation(ammAddr: string, walletAddr: string, amount: BigNumber, leverage: any, side: string) {
  const openNotional = amount.mul(leverage).div(utils.parseEther('1'));

  const clearingHouseViewerContract = new MulticallContract(clearingHouseViewerAddr, clearingHouseViewerABI);
  const [positionEst] = await multicallProvider.all([
    clearingHouseViewerContract.getOpenPositionEstimation(ammAddr, walletAddr, side === 'long' ? 0 : 1, openNotional, leverage)
    // returns OpenPositionEstResp struct
  ]);
  const { positionInfo, txSummary } = positionEst;
  if (txSummary.exchangedPositionSize.isZero()) {
    return null;
  }
  const newPosition = {
    type: positionInfo.positionSize.gt(0) ? 'long' : 'short',
    size: positionInfo.positionSize,
    sizeAbs: positionInfo.positionSize.abs(),
    openNotional: positionInfo.openNotional,
    marginRatio: positionInfo.marginRatio.mul(100),
    entryPrice: positionInfo.avgEntryPrice,
    leverage: positionInfo.leverage,
    liquidationPrice: positionInfo.liquidationPrice.isNegative() ? BigNumber.from(0) : positionInfo.liquidationPrice,
    marketValue: positionInfo.positionNotional,
    positionNotional: positionInfo.positionNotional,
    newRemainMargin: positionInfo.margin,
    isLiquidatable: positionInfo.isLiquidatable
  };
  return {
    exposure: txSummary.exchangedPositionSize,
    entryPrice: txSummary.entryPrice,
    priceImpact: txSummary.priceImpact.mul(100),
    fee: txSummary.spreadFee.add(txSummary.tollFee),
    cost: txSummary.spreadFee.add(txSummary.tollFee).add(txSummary.marginToVault),
    newPosition,
    collateral: newPosition.newRemainMargin
  };
}

export async function getTradingOverview(ammAddr: string, nftAddr: string) {
  const [dayTradingDetails, nftTwapPrice] = await Promise.all([getDailySpotPriceGraphData(ammAddr), getLatestTwapPrice(nftAddr)]);

  const ammContract = new MulticallContract(ammAddr, ammABI);
  const clearingHouseViewerContract = new MulticallContract(clearingHouseViewerAddr, clearingHouseViewerABI);

  const [spotPrice, nextFundingTimeInfo, fundingPeriodInfo, longSize, shortSize, fundingRateInfo] = await multicallProvider.all([
    ammContract.getSpotPrice(),
    ammContract.nextFundingTime(),
    ammContract.fundingPeriod(),
    ammContract.longPositionSize(),
    ammContract.shortPositionSize(),
    clearingHouseViewerContract.getFundingRates(ammAddr)
  ]);

  const nextFundingTime = Number(nextFundingTimeInfo);
  const openInterest = longSize.add(shortSize);
  const shortRatio = openInterest.isZero() ? utils.parseEther('50') : shortSize.mul(utils.parseEther('100')).div(openInterest);
  const longRatio = utils.parseEther('100').sub(shortRatio);
  const fundingPeriod = Number(fundingPeriodInfo.toString());
  const todayHigh = dayTradingDetails == null ? BigNumber.from(0) : dayTradingDetails.high;
  const todayLow = dayTradingDetails == null ? BigNumber.from(0) : dayTradingDetails.low;
  const dayVolume = dayTradingDetails == null ? BigNumber.from(0) : dayTradingDetails.volume;
  return {
    spotPrice,
    twapPrice: nftTwapPrice,
    shortSize,
    longSize,
    shortRatio,
    longRatio,
    nextFundingTime,
    fundingRateLong: fundingRateInfo.fundingRateLong,
    fundingRateShort: fundingRateInfo.fundingRateShort,
    todayHigh,
    todayLow,
    dayVolume,
    fundingPeriod
  };
}

export async function getTraderPositionHistory(ammAddr: string, walletAddr: string) {
  return getPositionHistory(ammAddr, walletAddr);
}

export async function getAllTraderPositionHistory(walletAddr: string, limit: number, offset: number) {
  return getAllPositionHistory(walletAddr, limit, offset);
}

export async function getMarketHistory(ammAddr: string) {
  return getMarketHistoryFromSubgraph(ammAddr);
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

export async function getDashboardCardDetails(ammAddrList: any, walletAddr: string) {
  const clearingHouseViewerContract = new MulticallContract(clearingHouseViewerAddr, clearingHouseViewerABI);

  const clearingHouseContract = new MulticallContract(clearingHouseAddr, clearingHouseABI);

  const tokenContract = new MulticallContract(tokenAddr, tokenABI);

  let balance: any = BigNumber.from(0);
  balance = await multicallProvider.all([tokenContract.balanceOf(walletAddr)]);
  const notionalAndPnlList = await multicallProvider.all(
    ammAddrList.map((address: string) => clearingHouseContract.getPositionNotionalAndUnrealizedPnl(address, walletAddr, 0))
  );
  const marginRatioList: any[] = [];

  for (let i = 0; i < ammAddrList.length; i += 1) {
    try {
      const [marginRatio] = await multicallProvider.all([clearingHouseViewerContract.getMarginRatio(ammAddrList[i], walletAddr)]);
      marginRatioList.push(BigNumber.from(marginRatio.toString()));
    } catch (e) {
      marginRatioList.push(BigNumber.from(0));
    }
  }

  const totalUnrealizedPnl = notionalAndPnlList.reduce(
    (acc, curr) => acc.add(BigNumber.from(curr.unrealizedPnl.toString())),
    BigNumber.from(0)
  );
  const realMarginList = notionalAndPnlList.map((notionalAndPnl, index) =>
    notionalAndPnl.positionNotional.mul(marginRatioList[index]).div(utils.parseEther('1'))
  );
  const totalRealMargin = realMarginList.reduce((acc, curr) => acc.add(curr), BigNumber.from(0));

  const totalCollateralValue = totalRealMargin;
  const totalAccountValue = totalCollateralValue.add(BigNumber.from(balance.toString()));

  const ytd = new Date();
  ytd.setDate(ytd.getDate());
  ytd.setHours(0, 0, 0, 0);

  let blockNumber;

  if (blockNumberMap[ytd.getTime()]) {
    blockNumber = blockNumberMap[ytd.getTime()];
  } else {
    const ytdBlock = await dater.getDate(ytd, true, false);
    blockNumber = ytdBlock.block;
    blockNumberMap[ytd.getTime()] = blockNumber;
  }

  let ytdBalance = BigNumber.from(0);
  [ytdBalance] = await multicallProvider.all([tokenContract.balanceOf(walletAddr)], blockNumber);

  const ytdNotionalAndPnlList = await multicallProvider.all(
    ammAddrList.map((address: string) => clearingHouseContract.getPositionNotionalAndUnrealizedPnl(address, walletAddr, 0)),
    blockNumber
  );
  const ytdMarginRatioList: any[] = [];

  for (let i = 0; i < ammAddrList.length; i += 1) {
    try {
      const [ytdMarginRatio] = await multicallProvider.all(
        [clearingHouseViewerContract.getMarginRatio(ammAddrList[i], walletAddr)],
        blockNumber
      );
      ytdMarginRatioList.push(BigNumber.from(ytdMarginRatio.toString()));
    } catch (e) {
      ytdMarginRatioList.push(BigNumber.from(0));
    }
  }

  const ytdRealMarginList = ytdNotionalAndPnlList.map((notionalAndPnl, index) =>
    notionalAndPnl.positionNotional.mul(ytdMarginRatioList[index]).div(utils.parseEther('1'))
  );
  const ytdTotalRealMargin = ytdRealMarginList.reduce((acc, curr) => acc.add(curr), BigNumber.from(0));

  const ytdTotalCollateralValue = ytdTotalRealMargin;
  const ytdTotalAccountValue = ytdTotalCollateralValue.add(ytdBalance);

  const totalAccountValueChangeValue = totalAccountValue.sub(ytdTotalAccountValue);
  const totalAccountValueChangeRatio = ytdTotalAccountValue.isZero()
    ? BigNumber.from(0)
    : totalAccountValueChangeValue.mul(utils.parseEther('1')).div(ytdTotalAccountValue).mul(100);

  const totalCollateralValueChangeValue = totalCollateralValue.sub(ytdTotalCollateralValue);
  const totalCollateralValueChangeRatio = ytdTotalCollateralValue.isZero()
    ? BigNumber.from(0)
    : totalCollateralValueChangeValue.mul(utils.parseEther('1')).div(ytdTotalCollateralValue).mul(100);

  return {
    totalUnrealizedPnl,
    totalAccountValue,
    totalAccountValueChangeValue,
    totalAccountValueChangeRatio,
    totalCollateralValue,
    totalCollateralValueChangeValue,
    totalCollateralValueChangeRatio
  };
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

export async function getMarketOverview(ammAddrList: any, nftAddrList: any, walletAddr: string) {
  const positions = walletAddr ? await getAllAmmPosition(walletAddr) : [];
  const nowTs = Math.round(new Date().getTime() / 1000);
  const ts24hr = nowTs - 1 * 24 * 3600;
  const ts7Days = nowTs - 7 * 24 * 3600;
  const ts30Days = nowTs - 30 * 24 * 3600;
  const apiResults = await Promise.all(
    ammAddrList
      .map((ammAddr: string) => getDailySpotPriceGraphData(ammAddr))
      .concat(nftAddrList.map((nftAddr: string) => getLatestTwapPrice(nftAddr)))
      .concat(ammAddrList.map((ammAddr: string) => getLatestSpotPriceBefore(ammAddr, ts24hr)))
      .concat(ammAddrList.map((ammAddr: string) => getLatestSpotPriceBefore(ammAddr, ts7Days)))
      .concat(ammAddrList.map((ammAddr: string) => getLatestSpotPriceBefore(ammAddr, ts30Days)))
  );
  const graphDataList = apiResults.slice(0, ammAddrList.length);
  const oraclePriceList = apiResults.slice(ammAddrList.length, ammAddrList.length * 2);
  const priceList24hrAgo = apiResults.slice(ammAddrList.length * 2, ammAddrList.length * 3);
  const priceList7daysAgo = apiResults.slice(ammAddrList.length * 3, ammAddrList.length * 4);
  const priceList30daysAgo = apiResults.slice(ammAddrList.length * 4);

  const ammContractList = ammAddrList.map((ammAddr: string) => new MulticallContract(ammAddr, ammABI));
  const clearingHouseViewerContract = new MulticallContract(clearingHouseViewerAddr, clearingHouseViewerABI);

  const contractResults = await multicallProvider.all(
    ammContractList
      .map((ammContract: any) => ammContract.getSpotPrice())
      .concat(ammContractList.map((ammContract: any) => ammContract.reserveSnapshots(0)))
      .concat(ammContractList.map((ammContract: any) => clearingHouseViewerContract.getFundingRates(ammContract.address)))
  );

  const futureList = contractResults.slice(0, ammContractList.length);
  const startingReserveList = contractResults.slice(ammContractList.length, ammContractList.length * 2);
  const fundingInfoList = contractResults.slice(ammContractList.length * 2, ammContractList.length * 3);

  const overview = [];

  for (let i = 0; i < ammAddrList.length; i += 1) {
    const futurePrice = futureList[i];
    const { fundingRateLong, fundingRateShort } = fundingInfoList[i];
    const startingPrice = startingReserveList[i].quoteAssetReserve.mul(utils.parseEther('1')).div(startingReserveList[i].baseAssetReserve);
    let hasPosition = false;
    for (let j = 0; j < positions.length; j += 1) {
      if (positions[j].amm.toLowerCase() === ammAddrList[i].toLowerCase() && !positions[j].positionSize.isZero()) {
        hasPosition = true;
        break;
      }
    }

    const basePrice24h = priceList24hrAgo[i] ? priceList24hrAgo[i].spotPrice : startingPrice;
    const basePrice7d = priceList7daysAgo[i] ? priceList7daysAgo[i].spotPrice : startingPrice;
    const basePrice30d = priceList30daysAgo[i] ? priceList30daysAgo[i].spotPrice : startingPrice;

    overview.push({
      hasPosition,
      amm: ammAddrList[i],
      futurePrice,
      spotPrice: oraclePriceList[i],
      priceChangeRatio24h: graphDataList[i].priceChangeRatio,
      priceChangeRatio7d: futurePrice.sub(basePrice7d).mul(utils.parseEther('1')).div(basePrice7d).mul(100),
      priceChangeRatio30d: futurePrice.sub(basePrice30d).mul(utils.parseEther('1')).div(basePrice30d).mul(100),
      priceChange24h: futurePrice.sub(basePrice24h),
      priceChange7d: futurePrice.sub(basePrice7d),
      priceChange30d: futurePrice.sub(basePrice30d),
      volume: graphDataList[i].volume,
      fundingRateShort,
      fundingRateLong
    });
  }

  return overview;
}
