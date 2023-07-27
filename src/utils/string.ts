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

/**
 * copy text to clipboard function, returned nothing only function
 * @param str
 * @returns
 */
export function copyToClp(str?: string) {
  if (!str) return;
  if (!navigator.clipboard) {
    const doc = document;
    const txtNode = doc.createTextNode(str);
    const w = window;
    const b: any = doc.body;
    b.appendChild(txtNode);
    if (b.createTextRange) {
      const textRange = b.createTextRange();
      textRange.moveToElementText(txtNode);
      textRange.select();
      doc.execCommand('copy');
    } else {
      const range = doc.createRange();
      const g: any = w.getSelection;
      range.selectNodeContents(txtNode);
      g().removeAllRanges();
      g().addRange(range);
      doc.execCommand('copy');
      g().removeAllRanges();
    }
    txtNode.remove();
    return;
  }
  navigator.clipboard.writeText(str);
}
