/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { utils } from 'ethers';
import { ThreeDots } from 'react-loader-spinner';

import Link from 'next/link';
import Image from 'next/image';

import { apiConnection } from '@/utils/apiConnection';
import { walletProvider } from '@/utils/walletProvider';
import { calculateNumber } from '@/utils/calculateNumbers';
import { isUserPointLoading, userPoint } from '@/stores/airdrop';

import {
  setIsWhitelisted,
  setIsTethCollected,
  setIsWalletLoading,
  userIsWrongNetwork,
  userIsLogin,
  userWalletAddress
} from '@/stores/UserState';
import { localeConversion } from '@/utils/localeConversion';

import ConnectWalletButton from './ConnectWalletButton';
import ExtraComponent from './ExtraComponent';
import GeneralModal from './GeneralModal';
import TransferTokenModal from './TransferTokenModal';
import ErrorModal from './ErrorModal';
import ConnectWalletModal from './ConnectWalletModal';

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

function Web3Area() {
  const [isLogin, setIsLogin] = useState(false);
  const [isConnectWalletModalShow, setIsConnectWalletModalShow] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [currentChain, setCurrentChain] = useState(0);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [wethBalance, setWethBalance] = useState(0);
  const [isShowErrorSwitchNetworkModal, setIsShowErrorSwitchNetworkModal] = useState(false);
  const [showTokenError, setShowTokenError] = useState(false);
  const [isShowGeorliModal, setIsShowGeorliModal] = useState(false);
  // const isMobile = /(webOS|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i.test(navigator.userAgent) || false;
  const isMobile = false;

  // State from the navigation
  const balanceOriginData = {
    total: '0',
    unrealized: '0',
    portfolio: '0',
    available: '0',
    totalIncrease: '0',
    portfolioIncrease: '0',
    totalRatio: '0',
    portfolioRatio: '0'
  };
  const [callBalance, setCallBalance] = useState(balanceOriginData);
  const [userInfo, setUserInfo] = useState({});
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isShowTransferTokenModal, setIsShowTransferTokenModal] = useState(false);
  const [tokenErrorTitle, setTokenErrorTitle] = useState('');

  // State from the index
  const [balance, setBalance] = useState(0);

  // normal
  // const userWalletAddressStore = useNanostore(userWalletAddress);
  // const userIsWrongNetworkStore = useNanostore(userIsWrongNetwork);
  const userPointIsLoading = useNanostore(isUserPointLoading);
  const userPointData = useNanostore(userPoint);

  const { multiplier, total, tradeVol, isBan } = userPointData;
  const tradeVolume = calculateNumber(tradeVol.vol, 4);
  const eligible = () => tradeVolume >= 5;

  const handleConnectedWalletUpdate = (holderAddress, callback) => {
    setWalletAddress(`${holderAddress.substring(0, 7)}...${holderAddress.slice(-3)}`);
    walletProvider.checkIsTargetNetworkWithChain().then(result => {
      setCurrentChain(result.holderChain);
      setIsWrongNetwork(!result.result);
      userIsWrongNetwork.set(!result.result); // userState store
    });
    setWethBalance(Number(walletProvider.wethBalance));
    setIsLogin(true);
    if (callback) {
      callback();
    }
    apiConnection.getUserInfo(walletProvider.holderAddress).then(result => {
      setUserInfo(result.data);
      setIsWalletLoading(false);
      // handleLoginSuccess(result.data);
    });
    // handleLoginSuccess();
    // userState store
    userWalletAddress.set(walletProvider.holderAddress);
    userIsLogin.set(true);
  };

  function successfulConnectWalletCallback(callback) {
    if (localStorage.getItem('isLoggedin') === null || localStorage.getItem('isLoggedin') === 'false') {
      // logEventByName('connectWallet_pressed');
    }
    localStorage.setItem('isLoggedin', 'true');
    // logEventByName('wallet_login');
    handleConnectedWalletUpdate(walletProvider.holderAddress, callback);
  }

  const resetState = () => {
    setWalletAddress('');
    userWalletAddress.set('');
    userIsLogin.set(false);
    setIsLogin(false);
    setIsWalletLoading(false);
    setWethBalance(0);
    localStorage.setItem('isLoggedin', 'false');
  };

  const connectWallet = (callback, initial = false) => {
    setIsWalletLoading(true);
    if (initial) {
      setIsConnectWalletModalShow(true);
    } else {
      const callFunction = initial ? walletProvider.initialConnectWallet() : walletProvider.conectWallet();
      callFunction
        .then(() => {
          successfulConnectWalletCallback(callback);
        })
        .catch(() => resetState());
    }
  };

  const disconnectWallet = callback => {
    // logEventByName('wallet_disconnect_pressed');
    walletProvider.disconnectWallet().then(() => {
      resetState();
      if (callback) {
        callback();
      }
      // handleLogout();
    });
  };

  // const handleCallback = (hadError, error) => {
  //   if (!hadError) {
  //   }
  //   // setShowTokenError(true);
  //   // setTokenErrorTitle(error.title);
  //   // setTokenErrorMsg(error.message);
  // };

  const updateTargetNetwork = callback => {
    // logEventByName('switchGoerli_pressed');
    const networkId = utils.hexValue(Number(process.env.NEXT_PUBLIC_SUPPORT_CHAIN || 42161));
    walletProvider.provider.provider
      .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `${networkId}` }] })
      // .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xA4B1' }] })
      .then(() => {
        handleConnectedWalletUpdate(walletProvider.holderAddress, callback);
        // handleCallback(false);
      })
      .catch(error => {
        if (error.code === 4902) {
          walletProvider.addArbitrumGoerli();
        }
        setIsShowErrorSwitchNetworkModal(true);
        // handleCallback(false);
      });
  };

  const getTestToken = async (callback, successHandle) => {
    // logEventByName('getTeth_pressed');
    setIsShowTransferTokenModal(true);
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
            if (setBalance && typeof setBalance === 'function') setBalance(walletProvider.wethBalance);
            if (successHandle && typeof successHandle === 'function') successHandle();
            setWethBalance(walletProvider.wethBalance);
            // handleCallback(false);
            if (callback && typeof callback === 'function') callback();
          })
          .catch(() => {
            if (callback && typeof callback === 'function') callback();
          });
      })
      .catch(error => {
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
          const errmsg = error.error.message;
          const spiltErrorMsg = errmsg.split('reverted: ');
          const targetMsg = spiltErrorMsg[1];
          // errorMessage = {
          //   title: 'Error when getting test tokens',
          //   message: targetMsg
          // };
        }
        // handleCallback(true, errorMessage);
      });
  };

  async function connectWithWalletConnect() {
    await walletProvider
      .initialConnectWallet(true)
      .then(() => {
        successfulConnectWalletCallback();
      })
      .catch(() => resetState());
  }

  async function connectWithEthereum() {
    await walletProvider
      .initialConnectWallet(false)
      .then(() => {
        successfulConnectWalletCallback();
      })
      .catch(() => resetState());
  }

  // const userIsLoginStore = false;
  // const userPointIsLoading = false;
  // const isDataFetched = false;
  // const isLogin = false;

  return (
    <div className="navbar-container py-[14px]">
      {/* {!userIsLoginStore ? null : ( */}
      <Link href="/airdrop">
        <div
          className="flex h-[32px] cursor-pointer items-center space-x-[4px] rounded-full
            border-[1px] border-warn px-[16px] py-[6px] text-warn hover:bg-warn/20">
          {userPointIsLoading ? (
            <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
          ) : (
            <>
              <Image src="/images/components/layout/header/user-point.svg" alt="" width={14} height={14} />
              <span className="text-[16px] font-[500] leading-[19.5px]">{eligible() && !isBan ? localeConversion(total) : '0.0'}</span>
            </>
          )}
        </div>
      </Link>
      {/* )} */}

      {/* {isDataFetched && isLogin ? ( */}
      <ExtraComponent
        // logEventByName={logEventByName}
        getTestToken={getTestToken}
        isWrongNetwork={isWrongNetwork}
        updateTargetNetwork={updateTargetNetwork}
        accountInfo={{ address: walletAddress, balance: wethBalance }}
      />
      {/* ) : null} */}

      <ConnectWalletButton
        handleClick={doLoginAction => (doLoginAction ? connectWallet(() => {}, true) : null)}
        isLogin={isLogin}
        inWrongNetwork={isWrongNetwork}
        accountInfo={{ address: walletAddress, balance: wethBalance }}
        currentChain={currentChain}
        disconnectWallet={() => disconnectWallet()}
        getTestToken={getTestToken}
        isWrongNetwork={isWrongNetwork}
        updateTargetNetwork={() => updateTargetNetwork()}
        callBalance={callBalance}
        userInfo={userInfo}
      />

      <ConnectWalletModal
        isShow={isConnectWalletModalShow}
        setIsShow={setIsConnectWalletModalShow}
        connectWithWalletConnect={connectWithWalletConnect}
        connectWithEthereum={connectWithEthereum}
        setIsWalletLoading={setIsWalletLoading}
      />

      {/* 
      <GeneralModal
        isShow={showTokenError}
        setIsShow={setShowTokenError}
        title={tokenErrorTitle}
        description={tokenErrorMsg}
        buttonLabel="Close"
        onClickSubmit={toggleShowTokenError}
        mobile={isMobile}
      /> */}

      <GeneralModal
        isShow={isShowGeorliModal}
        setIsShow={setIsShowGeorliModal}
        title="Get Goerli ETH"
        description="Goerli ETH is required to trade with Tribe3."
        buttonLabel="Get Goerli ETH"
        onClickSubmit={() => {
          // open in new tab
          const url = 'https://goerlifaucet.com/';
          window.open(url, '_blank');
          setIsShowGeorliModal(false);
        }}
        mobile={isMobile}
      />

      <TransferTokenModal isShow={isShowTransferTokenModal} setIsShow={setIsShowTransferTokenModal} />

      <ErrorModal
        isShow={isShowErrorSwitchNetworkModal}
        setIsShow={setIsShowErrorSwitchNetworkModal}
        image="/images/components/layout/header/cloudError.svg"
      />
    </div>
  );
}

export default Web3Area;
