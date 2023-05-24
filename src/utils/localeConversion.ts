/* eslint-disable default-param-last */
export function localeConversion(value, minimumFractionDigits = 1, maximumFractionDigits) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits || minimumFractionDigits
  });
}
