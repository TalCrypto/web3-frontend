import { atom } from 'nanostores';

// nanostores docs: https://github.com/nanostores/nanostores

const processing = atom(false);

// wrapper shortcut for set store
const setIsProcessing = (value: any) => {
  processing.set(value);
};

export default {
  processing,
  setIsProcessing
};
