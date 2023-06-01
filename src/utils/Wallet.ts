/* eslint-disable prefer-destructuring */
import { walletProvider } from '@/utils/walletProvider';
import { utils } from 'ethers';
import { setIsWhitelisted, setIsTethCollected, userIsLogin, userWalletAddress } from '@/stores/UserState';
import { apiConnection } from '@/utils/apiConnection';
import {
  wsCurrentChain,
  wsIsLogin,
  wsIsWrongNetwork,
  wsWalletAddress,
  wsWethBalance,
  wsUserInfo,
  wsIsConnectWalletModalShow,
  wsIsShowErrorSwitchNetworkModal,
  wsIsShowTransferTokenModal,
  wsBalance,
  wsIsWalletLoading,
  wsIsApproveRequired
} from '@/stores/WalletState';

async function fetchUserData() {
  const isTargetNetwork = await walletProvider.isTargetNetwork();
  if (isTargetNetwork) {
    try {
      // const [isTeth, isWhitelist, isInputCode] = await Promise.allSettled([
      //   walletProvider.checkIsTethCollected(),
      //   walletProvider.checkIsWhitelisted(),
      //   walletProvider.checkIsInputCode()
      // ]);
      setIsWhitelisted(walletProvider.isWhitelisted);
      setIsTethCollected(walletProvider.isTethCollected);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject();
    }
  } else {
    return Promise.reject();
  }
}

const handleLoginSuccess = async () => {
  const localStorageShowModal = localStorage.getItem('isModalShown');
  if (localStorageShowModal === undefined || localStorageShowModal === null) {
    localStorage.setItem('isModalShown', 'false');
  }

  walletProvider.checkIsWhitelisted();

  const currentNetwork = await walletProvider.provider?.getNetwork();
  const isTargetNetwork = process.env.NEXT_PUBLIC_SUPPORT_CHAIN === Number(currentNetwork.chainId).toString();

  wsIsWrongNetwork.set(!isTargetNetwork);
  wsWethBalance.set(Number(walletProvider.wethBalance));
  const localShowModal = localStorageShowModal === 'false' || localStorageShowModal === undefined || localStorageShowModal === null;
  if ((Number(walletProvider.wethBalance) === 0 || !isTargetNetwork) && localShowModal) {
    localStorage.setItem('isModalShown', 'true');
  }

  wsIsLogin.set(true);
  if (isTargetNetwork) {
    walletProvider.checkAllowance().then((value: any) => {
      wsIsApproveRequired.set(value === 0);
    });
    // .catch((e: any) => {
    // console.log(e);
    // });
  }
};

// const logout = () => {
//   setFullWalletAddress('');
//   setIsLoginState(false);
//   setIsApproveRequired(false);
//   resetOtherState();
// };

const handleConnectedWalletUpdate = (holderAddress: string, callback: any) => {
  wsWalletAddress.set(`${holderAddress.substring(0, 7)}...${holderAddress.slice(-3)}`);
  walletProvider.checkIsTargetNetworkWithChain().then((result: any) => {
    wsCurrentChain.set(result.holderChain);
    wsIsWrongNetwork.set(!result.result);
  });
  wsWethBalance.set(Number(walletProvider.wethBalance));
  wsIsLogin.set(true);
  if (callback) {
    callback();
  }
  apiConnection.getUserInfo(walletProvider.holderAddress).then(result => {
    wsUserInfo.set(result.data);
    wsIsWalletLoading.set(false);
    // handleLoginSuccess(result.data);
  });
  handleLoginSuccess();
  // userState store
  userWalletAddress.set(walletProvider.holderAddress);
  userIsLogin.set(true);
};

function successfulConnectWalletCallback(callback: any = null) {
  if (localStorage.getItem('isLoggedin') === null || localStorage.getItem('isLoggedin') === 'false') {
    // logEventByName('connectWallet_pressed');
  }
  localStorage.setItem('isLoggedin', 'true');
  // logEventByName('wallet_login');
  handleConnectedWalletUpdate(walletProvider.holderAddress, callback);
}

const resetState = () => {
  wsWalletAddress.set('');
  userWalletAddress.set('');
  userIsLogin.set(false);
  wsIsLogin.set(false);
  wsIsWalletLoading.set(false);
  wsWethBalance.set(0);
  localStorage.setItem('isLoggedin', 'false');
};

export const addEventListener = () => {
  if (!walletProvider.provider) return;

  walletProvider.provider.provider.on('chainChanged', (chainId: any) => {
    wsCurrentChain.set(Number(chainId));
    wsIsWrongNetwork.set(process.env.NEXT_PUBLIC_SUPPORT_CHAIN !== Number(chainId).toString());
  });
  walletProvider.provider.provider.on('accountsChanged', (addresses: any) => {
    walletProvider.holderAddress = addresses[0];
    // debounceCheck();
  });
};

export const connectWallet = (callback: any, initial = false) => {
  wsIsWalletLoading.set(true);
  if (initial) {
    wsIsConnectWalletModalShow.set(true);
  } else {
    const callFunction = initial ? walletProvider.initialConnectWallet() : walletProvider.connectWallet();
    callFunction
      .then(() => {
        successfulConnectWalletCallback(callback);
      })
      .catch(() => resetState());
  }
};

export const disconnectWallet = (callback: any = null) => {
  // logEventByName('wallet_disconnect_pressed');
  walletProvider.disconnectWallet().then(() => {
    resetState();
    if (callback) {
      callback();
    }
    // handleLogout();
  });
};

export const updateTargetNetwork = (callback: any = null) => {
  // logEventByName('switchGoerli_pressed');
  const networkId = utils.hexValue(Number(process.env.NEXT_PUBLIC_SUPPORT_CHAIN || 42161));
  if (!walletProvider.provider) return;

  walletProvider.provider.provider
    .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `${networkId}` }] })
    // .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xA4B1' }] })
    .then(() => {
      handleConnectedWalletUpdate(walletProvider.holderAddress, callback);
      // handleCallback(false);
    })
    .catch((error: any) => {
      if (error.code === 4902) {
        walletProvider.addArbitrumGoerli();
      }
      wsIsShowErrorSwitchNetworkModal.set(true);
      // handleCallback(false);
    });
};

export const getTestToken = async (callback: any = null, successHandle: any = null) => {
  // logEventByName('getTeth_pressed');
  wsIsShowTransferTokenModal.set(true);
  const isGoerliEthCollected = await walletProvider.checkIsGoerliEthCollected();
  if (!isGoerliEthCollected) {
    // setIsShowGeorliModal(true);
    if (callback && typeof callback === 'function') callback();
    return;
  }

  walletProvider
    .getTestToken()
    .then(() => {
      // logEventByName('callbacks_gettesttoken_success');
      fetchUserData()
        .then(() => {
          wsBalance.set(walletProvider.wethBalance);
          if (successHandle && typeof successHandle === 'function') successHandle();
          wsWethBalance.set(walletProvider.wethBalance);
          // handleCallback(false);
          if (callback && typeof callback === 'function') callback();
        })
        .catch(() => {
          if (callback && typeof callback === 'function') callback();
        });
    })
    .catch((error: any) => {
      // const errorMessage = {};
      // logEventByName('callbacks_gettesttoken_fail', { error_code: error?.error?.code.toString() });
      if (callback && typeof callback === 'function') callback();

      if (!error.error) {
        // errorMessage = { title: 'Error when getting test tokens', message: error.message };
        return;
      }
      if (error.error.message === 'execution reverted: You have already claimed') {
        // errorMessage = {
        //   title: 'Failed to claim test TETH!',
        //   message: <div>Failed to claim test TETH! Each user will only be entitled to receive a maximum of 20 TETH.</div>
        // };
      } else {
        // const errmsg = error.error.message;
        // const spiltErrorMsg = errmsg.split('reverted: ');
        // const targetMsg = spiltErrorMsg[1];
        // errorMessage = {
        //   title: 'Error when getting test tokens',
        //   message: targetMsg
        // };
      }
      // handleCallback(true, errorMessage);
    });
};

export async function connectWithWalletConnect() {
  await walletProvider
    .initialConnectWallet(true)
    .then(() => {
      successfulConnectWalletCallback();
    })
    .catch(() => resetState());
}

export async function connectWithEthereum() {
  await walletProvider
    .initialConnectWallet(false)
    .then(() => {
      successfulConnectWalletCallback();
    })
    .catch(() => resetState());
}
