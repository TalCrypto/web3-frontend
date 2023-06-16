export const formatBigInt = (value: string | bigint | number, decimal = 18): number => Number(value) / 10 ** decimal;

export const parseBigInt = (value: string | number, decimal = 18): bigint => BigInt(Number(value) * 10 ** decimal);
