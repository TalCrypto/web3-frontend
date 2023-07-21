/**
 * trim string to with max length, returned string followed by '...'
 * @param {string} str
 * @param {number} maxLength
 * @returns string
 */
export const trimString = (str: any, maxLength: any) => {
  if (!str) return '';
  if (str.length > maxLength) return `${str.substring(0, maxLength)}...`;
  return str;
};

/**
 * trim wallet address and add elipsis '...' in the middle
 * @param str
 * @returns
 */
export function trimAddress(str?: string) {
  if (!str) return '';
  if (str.length > 10) {
    return `${str.substring(0, 7)}...${str.slice(-3)}`;
  }
  return str;
}
