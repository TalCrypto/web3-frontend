import { atom } from 'nanostores';

// nanostores docs: https://github.com/nanostores/nanostores

const show = atom(false);
const message = atom([]);
const link = atom('');

// wrapper shortcut for set store
const setIsShow = (value: boolean) => {
  show.set(value);
  if (!value) link.set('');
};

const setMessage = (value: []) => {
  message.set(value);
};

const setLink = (value: string) => {
  link.set(value);
};

export default {
  show,
  message,
  link,
  setIsShow,
  setMessage,
  setLink
};
