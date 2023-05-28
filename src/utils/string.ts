/**
 * trim string to with max length, returned string followed by '...'
 * @param {string} str
 * @param {number} maxLength
 * @returns string
 */
export const trimString = (str: any, maxLength: any) => {
  if (str.length > maxLength) return `${str.substring(0, maxLength)}...`;
  return str;
};
