export function localeConversion(value: number | string, maximumFractionDigits?: number, minimumFractionDigits: number = 1): string {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits || minimumFractionDigits
  });
}

export function convertStringToNumber(stringValue: string) {
  // Remove non-numeric characters
  const numericString = stringValue.replace(/[^0-9.-]+/g, '');

  // Parse the numeric string into a number
  const numberValue = parseFloat(numericString);

  return numberValue;
}
