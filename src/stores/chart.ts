// import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export const $isSettingVammOn = persistentAtom<boolean>('chartSettingVammOn', true, {
  encode(val) {
    return val ? 'true' : 'false';
  },
  decode(val) {
    return val === 'true';
  }
});

export const $isSettingOracleOn = persistentAtom<boolean>('chartSettingOracleOn', true, {
  encode(val) {
    return val ? 'true' : 'false';
  },
  decode(val) {
    return val === 'true';
  }
});
