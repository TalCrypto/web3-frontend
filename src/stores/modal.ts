import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export const $showGetWEthModal = atom<boolean>(false);

export const $showSwitchNetworkErrorModal = atom(false);

export const $isShowMobileModal = atom(false);

export const $isMobileView = atom(false);

export const $isShowApproveModal = atom(false);

export const $isShowMetamaskModal = atom(false);

export const $metamaskModalTarget = atom(0);

// export const $isShowDiscordModal = atom(false);

export const $isShowLoginModal = atom(false);

export const $isShowMobileTokenModal = atom(false);

export const $isShowMobileTncModal = atom(false);

export const $isBannerShow = atom(true);

export const $isShowDiscordModal = persistentAtom<boolean>('isShowDiscordModal', false, {
  encode(val) {
    return val ? 'true' : 'false';
  },
  decode(val) {
    return val === 'true';
  }
});
