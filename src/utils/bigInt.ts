export const formatBigIntString = (value: string, decimal = 18): number => Number(BigInt(value) / BigInt(10 ** decimal));
