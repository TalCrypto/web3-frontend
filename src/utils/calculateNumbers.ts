import { utils } from 'ethers';

export const calculateNumber = (value, toFixedNumber) => (!value ? 0 : Number(utils.formatEther(value.toString())).toFixed(toFixedNumber));
export const isPositive = value => calculateNumber(value, 5) >= 0;
export const formatterValue = (value, toFixedNumber, suffix = '', defaultValue = '0.00') => {
  if (!value) {
    return defaultValue;
  }
  return `${calculateNumber(value, toFixedNumber)} ${suffix}`;
};
export const formatterAbsoluteValue = (value, toFixedNumber, suffix = '') => {
  if (!value) {
    return '0.00';
  }
  const valueAbs = value.abs();
  return `${calculateNumber(valueAbs, toFixedNumber, true)} ${suffix}`;
};
export const calculateUSDC = (value, toFixedNumber) => (!value ? 0 : Number(utils.formatUnits(value.toString(), 6)).toFixed(toFixedNumber));
export const formatterUSDC = (value, toFixedNumber, suffix = '') => {
  if (!value) {
    return '0.00';
  }
  return `${calculateUSDC(value, toFixedNumber)} ${suffix}`;
};
