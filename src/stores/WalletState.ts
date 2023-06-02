import { atom } from 'nanostores';

// nanostores docs: https://github.com/nanostores/nanostores

export const wsIsLogin = atom(false);

export const wsBalance = atom(0);
export const wsWethBalance = atom(0);

export const wsIsShowTransferTokenModal = atom(false);
export const wsIsShowErrorSwitchNetworkModal = atom(false);

export const wsIsConnectWalletModalShow = atom(false);

export const wsWalletAddress = atom('');
export const wsCurrentChain = atom(0);
export const wsUserInfo = atom(null);

export const wsIsWrongNetwork = atom(false);
export const wsIsWalletLoading = atom(false);

export const wsIsApproveRequired = atom(false);

export const wsChatInterval = atom(0);

export const wsFullWalletAddress = atom('');

export const wsCurrentToken = atom('');
