import { CollateralActions, PositionActions } from '@/const';

export function getTradingActionType(item: { exchangedPositionSize: number; liquidationPenalty: number; positionSizeAfter: number }) {
  let actionType = '';
  if (item.liquidationPenalty !== 0) {
    if (item.positionSizeAfter === 0) {
      actionType = PositionActions.FULL_LIQ;
    } else {
      actionType = PositionActions.PARTIAL_LIQ;
    }
  } else if (item.exchangedPositionSize === item.positionSizeAfter) {
    actionType = PositionActions.OPEN;
  } else if (item.positionSizeAfter === 0) {
    actionType = PositionActions.CLOSE;
  } else if (
    Math.sign(item.exchangedPositionSize) === Math.sign(item.positionSizeAfter) &&
    Math.abs(item.exchangedPositionSize) < Math.abs(item.positionSizeAfter)
  ) {
    actionType = PositionActions.ADD;
  } else if (
    Math.sign(item.exchangedPositionSize) === Math.sign(item.positionSizeAfter) &&
    Math.abs(item.exchangedPositionSize) > Math.abs(item.positionSizeAfter)
  ) {
    actionType = PositionActions.REVERSE;
  } else if (Math.sign(item.exchangedPositionSize) !== Math.sign(item.positionSizeAfter)) {
    actionType = PositionActions.REDUCE;
  }
  return actionType;
}

export function getCollateralActionType(collateralChange: number) {
  let actionType = '';
  if (collateralChange > 0) {
    actionType = `${CollateralActions.ADD} Collateral`;
  } else {
    actionType = `${CollateralActions.REDUCE} Collateral`;
  }
  return actionType;
}
