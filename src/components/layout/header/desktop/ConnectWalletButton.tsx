/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
import React, { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';
import ProfileContent from '@/components/layout/header/desktop/ProfileContent';

import { wsIsWalletLoading } from '@/stores/WalletState';

import { connectWallet } from '@/utils/Wallet';

interface ConnectWalletButtonProps {
  isLogin: boolean;
  inWrongNetwork: boolean;
  accountInfo: {
    address: string;
    balance: number;
  };
  currentChain: number;
  // getTestToken: any;
  isWrongNetwork: boolean;
  // updateTargetNetwork: () => void;
  callBalance: any;
  userInfo: any;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = props => {
  const { isLogin, inWrongNetwork, accountInfo, currentChain, isWrongNetwork, callBalance, userInfo } = props;

  const { address, balance } = accountInfo;
  const showWethBalaceLabel = !isLogin ? '' : inWrongNetwork ? '-.-- WETH' : `${Number(balance).toFixed(2)} WETH`;
  const [showDisconnectTooltip, setShowDisconnectTooltip] = useState(false);
  const isNotSetUsername = !userInfo || !userInfo.username;

  let showUserName = '';

  if (isNotSetUsername) {
    showUserName = '';
  } else if (userInfo.username && userInfo.username.length <= 10) {
    showUserName = userInfo.username;
  } else if (userInfo.username && userInfo.username.length > 10) {
    showUserName = `${userInfo.username.substring(0, 10)}...`;
  } else {
    showUserName = '';
  }

  const isWalletLoading = useNanostore(wsIsWalletLoading);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  useEffect(() => {
    setIsBalanceLoading(true);
    const timer = setTimeout(() => setIsBalanceLoading(false), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [balance]);

  const handleClick = () => {
    if (isWalletLoading) return;
    connectWallet(() => {}, true);
  };

  return (
    <div className={`navbar-outer${isLogin ? ' connected' : ''}`}>
      <button type="button" className={`navbar-button ${!isLogin ? 'not-connected' : 'connected'}`} onClick={handleClick}>
        <div className="btn-connect-before absolute bottom-0 left-0 right-0 top-0 z-10 rounded-full p-[2px]" />
        <div className={`container ${!isLogin ? 'flex flex-row-reverse' : ''}`} id="login-btn">
          {isWalletLoading ? (
            <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
          ) : (
            <>
              {isLogin ? (
                <>
                  <span className="text-transparent">{isNotSetUsername ? address : isLogin ? showUserName : ''}</span>
                  <Image
                    src="/images/components/layout/header/connect_button.svg"
                    width={24}
                    height={24}
                    alt=""
                    className="mx-2 my-0 h-[24px] w-[24px]"
                  />
                  <span>{showWethBalaceLabel}</span>
                  {isWrongNetwork ? (
                    <Image
                      src="/images/components/layout/header/incorrect-network.png"
                      alt=""
                      width={24}
                      height={24}
                      className="mx-2 my-0 h-[24px] w-[24px]"
                    />
                  ) : null}
                </>
              ) : (
                <>
                  <span>Connect Wallet</span>
                  <Image
                    src="/images/components/layout/header/connect_button.svg"
                    width={24}
                    height={24}
                    alt=""
                    className="mx-2 my-0 h-[24px] w-[24px]"
                  />
                </>
              )}
            </>
          )}
        </div>
      </button>

      <ProfileContent
        address={address}
        inWrongNetwork={inWrongNetwork}
        currentChain={currentChain}
        balance={balance}
        showDisconnectTooltip={showDisconnectTooltip}
        setShowDisconnectTooltip={setShowDisconnectTooltip}
        // getTestToken={getTestToken}
        isWrongNetwork={isWrongNetwork}
        // updateTargetNetwork={updateTargetNetwork}
        // isLogin={isLogin}
        callBalance={callBalance}
        userInfo={userInfo}
      />
    </div>
  );
};

export default ConnectWalletButton;
