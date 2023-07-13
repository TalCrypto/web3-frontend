/* eslint-disable implicit-arrow-linebreak */

export const formatBigInt = (value: string | bigint | number, decimal = 18): number => Number(value) / 10 ** decimal;

export const parseBigInt = (value: string | number, decimal = 18): bigint =>
  value ? BigInt(Math.round(Number(value) * 10 ** decimal)) : BigInt(0);

export const absBigInt = (n: bigint) => (n < 0n ? -n : n);
