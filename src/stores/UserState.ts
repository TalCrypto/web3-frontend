import { atom } from 'nanostores';

// nanostores docs: https://github.com/nanostores/nanostores

export const dataFetch = atom(false);
export const whitelisted = atom(false);
export const wethCollected = atom(false);
export const inputCode = atom(false);
export const hasPartialClose = atom(false);
export const hasTraded = atom(false);
export const userWalletAddress = atom('');
export const userIsLogin = atom(false);
export const userIsWrongNetwork = atom(false);

// wrapper shortcut for set store
export const setIsDataFetch = (value: boolean) => {
  dataFetch.set(value);
};

export const setIsWhitelisted = (value: boolean) => {
  whitelisted.set(value);
};

export const setIsWethCollected = (value: boolean) => {
  wethCollected.set(value);
};

export const setIsInputCode = (value: boolean) => {
  inputCode.set(value);
};

export const setIsHasPartialClose = (value: boolean) => {
  hasPartialClose.set(value);
};

export const setIsHasTraded = (value: boolean) => {
  hasTraded.set(value);
};
