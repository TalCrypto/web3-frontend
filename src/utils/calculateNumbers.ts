/* eslint-disable implicit-arrow-linebreak */
import { utils, BigNumber } from 'ethers';

export const calculateNumber = (value: any, toFixedNumber: number): string => {
  if (!value) {
    return Number(utils.formatEther(0)).toFixed(toFixedNumber);
  }

  return Number(utils.formatEther(value.toString())).toFixed(toFixedNumber);
};

export const isPositive = (value: any): boolean => Number(calculateNumber(value, 5)) >= 0;

export const formatterValue = (value: number, toFixedNumber: number, suffix = '', defaultValue = '0.00'): string => {
  if (!value) {
    return `${defaultValue} ${suffix}`;
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
