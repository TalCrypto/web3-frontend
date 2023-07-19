/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import { CollateralActions, TradeActions } from '@/const';
import { formatBigInt } from '@/utils/bigInt';

export function getTradingActionType(item: { exchangedPositionSize: number; liquidationPenalty: number; positionSizeAfter: number }) {
  let actionType = '';
  if (item.liquidationPenalty !== 0) {
    console.log(item.liquidationPenalty);
    if (item.positionSizeAfter === 0) {
      actionType = TradeActions.FULL_LIQ;
    } else {
      actionType = TradeActions.PARTIAL_LIQ;
    }
  } else if (item.exchangedPositionSize === item.positionSizeAfter) {
    actionType = TradeActions.OPEN;
  } else if (item.positionSizeAfter === 0) {
    actionType = TradeActions.CLOSE;
  } else if (
    Math.sign(item.exchangedPositionSize) === Math.sign(item.positionSizeAfter) &&
    Math.abs(item.exchangedPositionSize) < Math.abs(item.positionSizeAfter)
  ) {
    actionType = TradeActions.ADD;
  } else if (
    Math.sign(item.exchangedPositionSize) === Math.sign(item.positionSizeAfter) &&
    Math.abs(item.exchangedPositionSize) > Math.abs(item.positionSizeAfter)
  ) {
    actionType = TradeActions.REVERSE;
  } else if (Math.sign(item.exchangedPositionSize) !== Math.sign(item.positionSizeAfter)) {
    actionType = TradeActions.REDUCE;
  }
  return actionType;
}

export function getCollateralActionType(collateralChange: number) {
  let actionType = '';
  if (collateralChange > 0) {
    actionType = CollateralActions.ADD;
  } else {
    actionType = CollateralActions.REDUCE;
  }
  return actionType;
}

export function getActionTypeFromApi(item: any) {
  if (item.type === 'adjust') {
    return getCollateralActionType(Number(item.collateralChange));
  }
  return getTradingActionType(item);
}

export function getTradingActionTypeFromSubgraph(item: any, isMobile = false) {
  let actionType = '';
  if (item.type === 'adjust') {
    const collateralNumber = item.collateralChange ? formatBigInt(item.collateralChange) : 0;
    if (collateralNumber > 0) {
      actionType = 'Add Collateral';
    } else {
      actionType = 'Reduce Collateral';
    }
  } else {
    const liquidationPenaltyNumber = item.liquidationPenalty ? formatBigInt(item.liquidationPenalty) : 0;
    if (liquidationPenaltyNumber !== 0) {
      const positionSizeAfterNumber = item.positionSizeAfter ? formatBigInt(item.positionSizeAfter) : 0;
      if (positionSizeAfterNumber === 0) {
        actionType = !isMobile ? 'Full Liquidation' : 'Full Liquid.';
      } else {
        actionType = !isMobile ? 'Partial Liquidation' : 'Partial Liquid.';
      }
    } else if (formatBigInt(item.exchangedPositionSize) === formatBigInt(item.positionSizeAfter)) {
      actionType = 'Open';
    } else if (formatBigInt(item.positionSizeAfter) === 0) {
      actionType = 'Full Close';
    } else if (Math.sign(formatBigInt(item.exchangedPositionSize)) === Math.sign(formatBigInt(item.positionSizeAfter))) {
      actionType = 'Add';
    } else if (Math.sign(formatBigInt(item.exchangedPositionSize)) !== Math.sign(formatBigInt(item.positionSizeAfter))) {
      actionType = 'Partial Close';
    }
  }

  console.log({ actionType });
  return actionType;
}

export function getWalletBalanceChange(record: any) {
  const currentRecordType = getActionTypeFromApi(record);
  const recordAmount = Math.abs(record.amount);
  const recordFee = record.fee;
  const recordRealizedPnl = record.realizedPnl;
  const recordRealizedFundingPayment = record.fundingPayment;
  const recordCollateralChange = record.collateralChange;
  const balance =
    currentRecordType === TradeActions.OPEN || currentRecordType === TradeActions.ADD
      ? -Math.abs(recordAmount + recordFee + recordRealizedFundingPayment)
      : currentRecordType === CollateralActions.REDUCE || currentRecordType === CollateralActions.ADD
      ? -(recordCollateralChange + recordRealizedFundingPayment)
      : currentRecordType === TradeActions.CLOSE
      ? Math.abs(recordAmount + recordRealizedPnl - recordFee - recordRealizedFundingPayment)
      : -Math.abs(recordFee);
  return Number(balance.toFixed(4));
}
