/* eslint-disable no-unused-vars */
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';

import AirdropPoint from '@/components/layout/header/desktop/AirdropPoint';
import { $showSwitchNetworkErrorModal } from '@/stores/modal';
import ConnectWalletButton from './ConnectWalletButton';
import TransferTokenModal from './TransferTokenModal';
import ErrorModal from './ErrorModal';

// async function fetchUserData() {
//   const isTargetNetwork = await walletProvider.isTargetNetwork();
//   if (isTargetNetwork) {
//     try {
//       // const [isTeth, isWhitelist, isInputCode] = await Promise.allSettled([
//       //   walletProvider.checkIsTethCollected(),
//       //   walletProvider.checkIsWhitelisted(),
//       //   walletProvider.checkIsInputCode()
//       // ]);
//       setIsWhitelisted(walletProvider.isWhitelisted);
//       setIsTethCollected(walletProvider.isTethCollected);
//       return Promise.resolve(true);
//     } catch (error) {
//       return Promise.reject();
//     }
//   } else {
//     return Promise.reject();
//   }
// }

function Web3Area() {
  const isShowErrorSwitchNetworkModal = useNanostore($showSwitchNetworkErrorModal);

  // const showTokenError = useNanostore();
  // const isShowGeorliModal = useNanostore();

  // const isMobile = /(webOS|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i.test(navigator.userAgent) || false;
  // const isMobile = false;

  // const isConnectWalletModalShow = useNanostore(wsIsConnectWalletModalShow);

  // State from the navigation
  // const balanceOriginData = {
  //   total: '0',
  //   unrealized: '0',
  //   portfolio: '0',
  //   available: '0',
  //   totalIncrease: '0',
  //   portfolioIncrease: '0',
  //   totalRatio: '0',
  //   portfolioRatio: '0'
  // };
  // const [callBalance, setCallBalance] = useState(balanceOriginData);
  // const [isDataFetched, setIsDataFetched] = useState(false);
  // const [tokenErrorTitle, setTokenErrorTitle] = useState('');

  // // State from the index
  // const [balance, setBalance] = useState(0);

  // normal
  // const userWalletAddressStore = useNanostore(userWalletAddress);
  // const userPointIsLoading = useNanostore(isUserPointLoading);
  // const userPointData = useNanostore(userPoint);

  // const { multiplier, total, tradeVol, isBan } = userPointData;
  // const tradeVolume = calculateNumber(tradeVol.vol, 4);
  // const eligible = () => Number(tradeVolume) >= 5;

  // addEventListener();

  // useEffect(() => {
  //   const auth = firebaseAuth;
  //   const localStorageLogin = localStorage.getItem('isLoggedin');
  //   if (!auth) return;

  //   auth.onAuthStateChanged(user => {
  //     if (user && localStorageLogin === 'true') {
  //       connectWallet(null, false);

  //       user.getIdToken(true).then(tokenId => {
  //         walletProvider.firebaseIdToken = tokenId;
  //       });
  //     } else {
  //       wsIsWalletLoading.set(false);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   const holderAddr = walletProvider.holderAddress;
  //   if (holderAddr) {
  //     // walletProvider.getUserCollectionsInfo(walletProvider.holderAddress).then(userPosition => {
  //     //   const portfolio = userPosition.reduce(
  //     //     (pre: any, item: any) => (!item ? Number(pre) + 0 : Number(pre) + Number(calculateNumber(item.realMargin, 4))),
  //     //     0
  //     //   );
  //     //   setCallBalance({
  //     //     portfolio,
  //     //     available: walletProvider.wethBalance
  //     //   });
  //     // });
  //     apiConnection.getUserInfo(holderAddr).then(result => {
  //       setUserInfo(result.data);
  //     });
  //   }

  //   if (walletProvider.holderAddress) {
  //     // new initial data
  //     // getInitialData();

  //     walletProvider.isDataFetch = true;
  //     setIsDataFetch(true); // userState store
  //     fetchUserData()
  //       .then(val => {
  //         setIsDataFetched(val); // local state
  //         setIsDataFetch(false); // userState store
  //         walletProvider.isDataFetch = false;
  //         wsIsWalletLoading.set(false);
  //       })
  //       .catch(() => {
  //         setIsDataFetch(false);
  //         walletProvider.isDataFetch = false;
  //         wsIsWalletLoading.set(false);
  //       });

  //     // check if user has partial close
  //     apiConnection.checkUserHasPartialClose().then((res: any) => {
  //       const { hasPartialClose } = res.data;
  //       setIsHasPartialClose(hasPartialClose);
  //     });

  //     // check if user has traded once
  //     if (walletProvider.firebaseIdToken) {
  //       apiConnection.validateUserTradingState(walletProvider.firebaseIdToken).then((res: any) => {
  //         setIsHasTraded(res.data?.hasTraded);
  //         setIsInputCode(res.data?.isInputCode);
  //       });
  //     }

  //     // get user point
  //     apiConnection.getUserPoint();

  //     // // get leaderboard rank
  //     // if (router.pathname === '/airdrop') {
  //     //   apiConnection.getLeaderboard();
  //     // }
  //   }
  // }, [walletProvider.holderAddress]);

  return (
    <div
      className="navbar-container relative mx-auto flex h-[60px] items-start
        justify-start p-0 py-[14px] text-[16px] font-medium text-white">
      <AirdropPoint />
      {/* {isDataFetched && isLogin ? (
        <div className="hidden md:block">
          <ExtraComponent />
        </div>
      ) : null} */}

      <ConnectWalletButton />
      {/* {isConnectWalletModalShow ? <ConnectWalletModal /> : null} */}
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
      {/* <GeneralModal
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
      /> */}
      <ErrorModal isShow={isShowErrorSwitchNetworkModal} image="/images/components/layout/header/cloudError.svg" />
    </div>
  );
}

export default Web3Area;
