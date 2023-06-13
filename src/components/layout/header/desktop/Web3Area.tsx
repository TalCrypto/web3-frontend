/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { ThreeDots } from 'react-loader-spinner';

import Link from 'next/link';
import Image from 'next/image';

import { walletProvider } from '@/utils/walletProvider';
import { calculateNumber } from '@/utils/calculateNumbers';
import { isUserPointLoading, userPoint } from '@/stores/airdrop';

import { firebaseAuth } from '@/const/firebaseConfig';
import { connectWallet, addEventListener } from '@/utils/Wallet';

import {
  wsIsConnectWalletModalShow,
  wsIsLogin,
  wsWalletAddress,
  wsWethBalance,
  wsIsShowErrorSwitchNetworkModal,
  wsIsWalletLoading,
  wsFullWalletAddress
} from '@/stores/WalletState';

import {
  setIsWhitelisted,
  setIsWethCollected,
  setIsDataFetch,
  setIsHasPartialClose,
  setIsHasTraded,
  setIsInputCode
} from '@/stores/UserState';

import { localeConversion } from '@/utils/localeConversion';
import { apiConnection } from '@/utils/apiConnection';

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
      // const [isWeth, isWhitelist, isInputCode] = await Promise.allSettled([
      //   walletProvider.checkIsWethCollected(),
      //   walletProvider.checkIsWhitelisted(),
      //   walletProvider.checkIsInputCode()
      // ]);
      setIsWhitelisted(walletProvider.isWhitelisted);
      setIsWethCollected(walletProvider.isWethCollected);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject();
    }
  } else {
    return Promise.reject();
  }
}

function Web3Area() {
  const [isShowGeorliModal, setIsShowGeorliModal] = useState(false);

  const isLogin = useNanostore(wsIsLogin);
  const walletAddress = useNanostore(wsWalletAddress);
  const wethBalance = useNanostore(wsWethBalance);
  const isShowErrorSwitchNetworkModal = useNanostore(wsIsShowErrorSwitchNetworkModal);

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
  const [callBalance, setCallBalance] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [tokenErrorTitle, setTokenErrorTitle] = useState('');

  const fullWalletAddress = useNanostore(wsFullWalletAddress);

  // State from the index
  const [balance, setBalance] = useState(0);

  // normal
  // const userWalletAddressStore = useNanostore(userWalletAddress);
  const userPointIsLoading = useNanostore(isUserPointLoading);
  const userPointData = useNanostore(userPoint);

  const { multiplier, total, tradeVol, isBan } = userPointData;
  const tradeVolume = calculateNumber(tradeVol.vol, 4);
  const eligible = () => Number(tradeVolume) >= 5;

  addEventListener();

  useEffect(() => {
    const auth = firebaseAuth;
    const localStorageLogin = localStorage.getItem('isLoggedin');
    alert(localStorage.getItem('isLoggedin'));
    alert(localStorageLogin);
    if (!auth) return;

    alert(2);

    auth.onAuthStateChanged(user => {
      alert(5);
      alert(localStorageLogin === 'true');
      if (user && localStorageLogin === 'true') {
        alert(3);
        connectWallet(null, false);
        alert(4);

        user.getIdToken(true).then(tokenId => {
          walletProvider.firebaseIdToken = tokenId;
        });
      } else {
        wsIsWalletLoading.set(false);
      }
    });
  }, []);

  useEffect(() => {
    const holderAddr = fullWalletAddress;
    if (holderAddr) {
      walletProvider.getUserCollectionsInfo(fullWalletAddress).then((userPosition: any) => {
        const portfolio = userPosition.reduce(
          (pre: any, item: any) => (!item ? Number(pre) + 0 : Number(pre) + Number(calculateNumber(item.realMargin, 4))),
          0
        );
        setCallBalance({
          portfolio,
          available: walletProvider.wethBalance
        });
      });
      apiConnection.getUserInfo(holderAddr).then(result => {
        setUserInfo(result.data);
      });
    }

    if (fullWalletAddress) {
      // new initial data
      // getInitialData();

      walletProvider.isDataFetch = true;
      setIsDataFetch(true); // userState store
      fetchUserData()
        .then(val => {
          setIsDataFetched(val); // local state
          setIsDataFetch(false); // userState store
          walletProvider.isDataFetch = false;
          wsIsWalletLoading.set(false);
        })
        .catch(() => {
          setIsDataFetch(false);
          walletProvider.isDataFetch = false;
          wsIsWalletLoading.set(false);
        });

      // check if user has partial close
      apiConnection.checkUserHasPartialClose().then((res: any) => {
        const { hasPartialClose } = res.data;
        setIsHasPartialClose(hasPartialClose);
      });

      // check if user has traded once
      if (walletProvider.firebaseIdToken) {
        apiConnection.validateUserTradingState(walletProvider.firebaseIdToken).then((res: any) => {
          setIsHasTraded(res.data?.hasTraded);
          setIsInputCode(res.data?.isInputCode);
        });
      }

      // get user point
      apiConnection.getUserPoint();

      // // get leaderboard rank
      // if (router.pathname === '/airdrop') {
      //   apiConnection.getLeaderboard();
      // }
    }
  }, [fullWalletAddress]);

  return (
    <div
      className="navbar-container relative mx-auto flex h-[60px] items-start
        justify-start p-0 py-[14px] text-[16px] font-medium text-white">
      {!isLogin ? null : (
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
      )}

      {isLogin ? (
        <div className="hidden md:block">
          <ExtraComponent />
        </div>
      ) : null}

      <ConnectWalletButton
        isLogin={isLogin}
        accountInfo={{ address: walletAddress, balance: wethBalance }}
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
