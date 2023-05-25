export function localeConversion(value: number | string, maximumFractionDigits?: number, minimumFractionDigits: number = 1): string {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits || minimumFractionDigits
  });
}
