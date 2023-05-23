import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ThreeDots } from 'react-loader-spinner';

// import ExtraComponent from './ExtraComponent';
// import ConnectWalletButton from './ConnectWalletButton';
// import GeneralModal from './GeneralModal';
// import TransferTokenModal from './TransferTokenModal';
// import ErrorModal from './ErrorModal';
// import ConnectWalletModal from './ConnectWalletModal';

function Web3Area() {
  // const userIsLoginStore = false;
  // const userPointIsLoading = false;
  // const isDataFetched = false;
  // const isLogin = false;

  return (
    <div className="navbar-container py-[14px]">
      {/* {!userIsLoginStore ? null : (
        <Link href="/airdrop">
          <div className="flex items-center space-x-[4px] h-[32px] px-[16px] py-[6px]
            border-[1px] border-warn hover:bg-warn/20 text-warn rounded-full cursor-pointer">
            {userPointIsLoading ? (
              <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
            ) : (
              <>
                <Image src="/static/icon/icon-point.svg" alt="" width={14} height={14} />
                <span className="text-[16px] font-[500] leading-[19.5px]">{(eligible() && !isBan) ? localeConversion(total) : '0.0'}</span>
              </>
            )}
          </div>
        </Link>
      )} */}

      {/* {isDataFetched && isLogin ? (
        <ExtraComponent
          // logEventByName={logEventByName}
          // getTestToken={getTestToken}
          // isWrongNetwork={isWrongNetwork}
          // updateTargetNetwork={updateTargetNetwork}
          // accountInfo={{ address: walletAddress, balance: wethBalance }}
        />
      ) : null} */}

      {/* <ConnectWalletButton
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
      /> */}

      {/* <GeneralModal
        isShow={showTokenError}
        setIsShow={setShowTokenError}
        // title={tokenErrorTitle}
        // description={tokenErrorMsg}
        buttonLabel="Close"
        // onClickSubmit={toggleShowTokenError}
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
      /> */}

      {/* <TransferTokenModal
        isShow={isShowTransferTokenModal}
        setIsShow={setIsShowTransferTokenModal}
      /> */}

      {/* <ErrorModal
        isShow={isShowErrorSwitchNetworkModal}
        setIsShow={setIsShowErrorSwitchNetworkModal}
        image="/static/cloudError.svg"
      /> */}

      {/* <ConnectWalletModal
        isShow={isConnectWalletModalShow}
        setIsShow={setIsConnectWalletModalShow}
        connectWithWalletConnect={connectWithWalletConnect}
        connectWithEthereum={connectWithEthereum}
        setIsWalletLoading={setIsWalletLoading}
      /> */}
    </div>
  );
}

export default Web3Area;
