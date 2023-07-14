import { atom } from 'nanostores';

export const $showGetWEthModal = atom<boolean>(false);

export const $showSwitchNetworkErrorModal = atom(false);

export const $isShowMobileModal = atom(false);

export const $isMobileView = atom(false);

export const $isShowApproveModal = atom(false);

export const $isShowMetamaskModal = atom(false);

export const $metamaskModalTarget = atom(0);

export const $isShowDiscordModal = atom(false);
