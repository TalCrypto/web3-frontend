import { formatterValue } from '@/utils/calculateNumbers';

export function getTradingActionType(item: any) {
  let actionType = '';
  if (formatterValue(item.exchangedPositionSize, 18) === formatterValue(item.positionSizeAfter, 18)) {
    actionType = 'Open';
  } else if (Number(formatterValue(item.positionSizeAfter, 18)) === 0) {
    actionType = 'Full Close';
  } else if (
    Math.sign(Number(formatterValue(item.exchangedPositionSize, 18))) === Math.sign(Number(formatterValue(item.positionSizeAfter, 18)))
  ) {
    actionType = 'Add';
  } else if (
    Math.sign(Number(formatterValue(item.exchangedPositionSize, 18))) !== Math.sign(Number(formatterValue(item.positionSizeAfter, 18)))
  ) {
    actionType = 'Partial Close';
  }

  return actionType;
}

export function getTradingActionTypeFromAPI(item: any, isMobile = false) {
  let actionType = '';
  if (item.type === 'adjust') {
    const collateralNumber = Number(formatterValue(item.collateralChange, 18));
    if (collateralNumber > 0) {
      actionType = 'Add Collateral';
    } else {
      actionType = 'Reduce Collateral';
    }
  } else {
    const liquidationPenaltyNumber = Number(formatterValue(item.liquidationPenalty, 18));
    if (liquidationPenaltyNumber !== 0) {
      const positionSizeAfterNumber = Number(formatterValue(item.positionSizeAfter, 18));
      if (positionSizeAfterNumber === 0) {
        actionType = !isMobile ? 'Full Liquidation' : 'Full Liquid.';
      } else {
        actionType = !isMobile ? 'Partial Liquidation' : 'Partial Liquid.';
      }
    } else if (formatterValue(item.exchangedPositionSize, 18) === formatterValue(item.positionSizeAfter, 18)) {
      actionType = 'Open';
    } else if (Number(formatterValue(item.positionSizeAfter, 18)) === 0) {
      actionType = 'Full Close';
    } else if (
      Math.sign(Number(formatterValue(item.exchangedPositionSize, 18))) === Math.sign(Number(formatterValue(item.positionSizeAfter, 18)))
    ) {
      actionType = 'Add';
    } else if (
      Math.sign(Number(formatterValue(item.exchangedPositionSize, 18))) !== Math.sign(Number(formatterValue(item.positionSizeAfter, 18)))
    ) {
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
