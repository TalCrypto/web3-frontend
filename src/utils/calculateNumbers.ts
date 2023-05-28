/* eslint-disable implicit-arrow-linebreak */
import { utils, BigNumber } from 'ethers';

export const calculateNumber = (value: any, toFixedNumber: number): number =>
  !value ? 0 : Number(Number(utils.formatEther(value.toString())).toFixed(toFixedNumber));

export const isPositive = (value: BigNumber): boolean => calculateNumber(value, 5) >= 0;

export const formatterValue = (value: BigNumber, toFixedNumber: number, suffix = '', defaultValue = '0.00'): string => {
  if (!value) {
    return defaultValue;
  }
  return `${calculateNumber(value, toFixedNumber)} ${suffix}`;
};

export const formatterAbsoluteValue = (value: BigNumber, toFixedNumber: number, suffix = ''): string => {
  if (!value) {
    return '0.00';
  }
  const valueAbs = value.abs();
  return `${calculateNumber(valueAbs, toFixedNumber)} ${suffix}`;
};

export const calculateUSDC = (value: BigNumber, toFixedNumber: number): string =>
  !value ? '0' : Number(utils.formatUnits(value.toString(), 6)).toFixed(toFixedNumber);

export const formatterUSDC = (value: BigNumber, toFixedNumber: number, suffix = ''): string => {
  if (!value) {
    return '0.00';
  }
  return `${calculateUSDC(value, toFixedNumber)} ${suffix}`;
};
