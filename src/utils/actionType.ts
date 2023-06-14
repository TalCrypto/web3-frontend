import { PositionHistoryRecord } from '@/hooks/psHistory';
import { formatterValue } from '@/utils/calculateNumbers';

export function getTradingActionType(item: any) {
  let actionType = '';
  if (formatterValue(item.exchangedPositionSize, 18) === formatterValue(item.positionSizeAfter, 18)) {
    actionType = 'Open';
  } else if (item.positionSizeAfter === 0) {
    actionType = 'Full Close';
  } else if (Math.sign(item.exchangedPositionSize) === Math.sign(item.positionSizeAfter)) {
    actionType = 'Add';
  } else if (Math.sign(item.exchangedPositionSize) !== Math.sign(item.positionSizeAfter)) {
    actionType = 'Partial Close';
  }

  return actionType;
}

export function getTradingActionTypeFromAPI(
  item: { type: string; collateralChange: number; exchangedPositionSize: number; liquidationPenalty: number; positionSizeAfter: number },
  isMobile = false
) {
  let actionType = '';
  if (item.type === 'adjust') {
    const collateralNumber = item.collateralChange;
    if (collateralNumber > 0) {
      actionType = 'Add Collateral';
    } else {
      actionType = 'Reduce Collateral';
    }
  } else {
    const liquidationPenaltyNumber = item.liquidationPenalty;
    if (liquidationPenaltyNumber !== 0) {
      const positionSizeAfterNumber = item.positionSizeAfter;
      if (positionSizeAfterNumber === 0) {
        actionType = !isMobile ? 'Full Liquidation' : 'Full Liquid.';
      } else {
        actionType = !isMobile ? 'Partial Liquidation' : 'Partial Liquid.';
      }
    } else if (item.exchangedPositionSize === item.positionSizeAfter) {
      actionType = 'Open';
    } else if (item.positionSizeAfter === 0) {
      actionType = 'Full Close';
    } else if (Math.sign(item.exchangedPositionSize) === Math.sign(item.positionSizeAfter)) {
      actionType = 'Add';
    } else if (Math.sign(item.exchangedPositionSize) !== Math.sign(item.positionSizeAfter)) {
      actionType = 'Partial Close';
    }
  }

  return actionType;
}

export function getTradingActionTypeOnAdjustCollateral(item: any) {
  let actionType = '';
  if (Number(formatterValue(item.amount, 18)) > 0) {
    actionType = 'Add Collateral';
  } else {
    actionType = 'Reduce Collateral';
  }
  return actionType;
}
