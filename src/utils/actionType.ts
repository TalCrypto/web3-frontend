import { CollateralActions, TradeActions } from '@/const';

export function getTradingActionType(item: { exchangedPositionSize: number; liquidationPenalty: number; positionSizeAfter: number }) {
  let actionType = '';
  if (item.liquidationPenalty !== 0) {
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
