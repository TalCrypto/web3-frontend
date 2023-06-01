/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { ThreeDots } from 'react-loader-spinner';

import Link from 'next/link';
import Image from 'next/image';

import { walletProvider } from '@/utils/walletProvider';
import { calculateNumber } from '@/utils/calculateNumbers';
import { isUserPointLoading, userPoint } from '@/stores/airdrop';

import { firebaseAuth } from '@/const/firebaseConfig';
import { connectWallet } from '@/utils/Wallet';

import {
  wsIsConnectWalletModalShow,
  wsIsLogin,
  wsWalletAddress,
  wsCurrentChain,
  wsIsWrongNetwork,
  wsWethBalance,
  wsIsShowErrorSwitchNetworkModal,
  wsIsWalletLoading
} from '@/stores/WalletState';

import { setIsWhitelisted, setIsTethCollected } from '@/stores/UserState';

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
  const [showTokenError, setShowTokenError] = useState(false);
  const [isShowGeorliModal, setIsShowGeorliModal] = useState(false);

  const isLogin = useNanostore(wsIsLogin);
  const walletAddress = useNanostore(wsWalletAddress);
  const currentChain = useNanostore(wsCurrentChain);
  const isWrongNetwork = useNanostore(wsIsWrongNetwork);
  const wethBalance = useNanostore(wsWethBalance);
  const isShowErrorSwitchNetworkModal = useNanostore(wsIsShowErrorSwitchNetworkModal);
  // const showTokenError = useNanostore();
  // const isShowGeorliModal = useNanostore();

  // const isMobile = /(webOS|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i.test(navigator.userAgent) || false;
  const isMobile = false;

  const isConnectWalletModalShow = useNanostore(wsIsConnectWalletModalShow);

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
  const eligible = () => Number(tradeVolume) >= 5;

  useEffect(() => {
    const auth = firebaseAuth;
    const localStorageLogin = localStorage.getItem('isLoggedin');
    if (!auth) return;

    auth.onAuthStateChanged(user => {
      if (user && localStorageLogin === 'true') {
        connectWallet(null, false);

        user.getIdToken(true).then(tokenId => {
          walletProvider.firebaseIdToken = tokenId;
        });
      } else {
        wsIsWalletLoading.set(false);
      }
    });
  }, []);

  return (
    <div
      className="navbar-container relative mx-auto flex h-[60px] items-start
        justify-start p-0 py-[14px] text-[16px] font-medium text-white">
      {isLogin ? 'true' : 'false'}

      {/* {!userIsLoginStore ? null : ( */}
      <Link href="/airdrop" className="hidden md:block">
        <div
          className="flex h-[32px] cursor-pointer items-center space-x-[4px] rounded-full
            border-[1px] border-warn px-[16px] py-[6px] text-warn hover:bg-warn/20">
          {userPointIsLoading ? (
            <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
          ) : (
            <>
              <Image src="/images/components/layout/header/user-point.svg" alt="" width={14} height={14} />
              <span className="text-[16px] font-[500] leading-[20px]">{eligible() && !isBan ? localeConversion(total) : '0.0'}</span>
            </>
          )}
        </div>
      </Link>
      {/* )} */}

      {/* {isDataFetched && isLogin ? ( */}
      <div className="hidden md:block">
        <ExtraComponent isWrongNetwork={isWrongNetwork} />
      </div>
      {/* ) : null} */}

      <ConnectWalletButton
        isLogin={isLogin}
        inWrongNetwork={isWrongNetwork}
        accountInfo={{ address: walletAddress, balance: wethBalance }}
        currentChain={currentChain}
        isWrongNetwork={isWrongNetwork}
        callBalance={callBalance}
        userInfo={userInfo}
      />
      {isConnectWalletModalShow ? <ConnectWalletModal /> : null}
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
      <TransferTokenModal />
      <ErrorModal isShow={isShowErrorSwitchNetworkModal} image="/images/components/layout/header/cloudError.svg" />
    </div>
  );
}

export default Web3Area;
