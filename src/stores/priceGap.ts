import { atom, map } from 'nanostores';

// nanostores docs: https://github.com/nanostores/nanostores

/**
 * Price Gap
 */

// Indicate that alert tooltip has shown for the first time load page
export const showPopup = map({
  DEGODS: false,
  CAPTAINZ: false,
  BAYC: false,
  MAYC: false,
  AZUKI: false,
  C: false
});

// Price gap limit from smartcontract
export const priceGapLimit = atom<any>(null);
