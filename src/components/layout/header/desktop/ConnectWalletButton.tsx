/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
import React, { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { ThreeDots } from 'react-loader-spinner';

import Image from 'next/image';
import ProfileContent from '@/components/layout/header/desktop/ProfileContent';
import { $userIsConnecting, $userInfo, $userWethBalance, $userIsWrongNetwork, $userIsConnected } from '@/stores/user';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useNetwork } from 'wagmi';

const ConnectWalletButton: React.FC = () => {
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const isConnecting = useNanostore($userIsConnecting);
  const isConnected = useNanostore($userIsConnected);
  const wethBalance = useNanostore($userWethBalance);
  const userInfo = useNanostore($userInfo);
  const { open } = useWeb3Modal();
  const [showUserName, setShowUserName] = useState('');

  // if (isNotSetUsername) {
  //   showUserName = '';
  // } else if (userInfo.username && userInfo.username.length <= 10) {
  //   showUserName = userInfo.username;
  // } else if (userInfo.username && userInfo.username.length > 10) {
  //   showUserName = `${userInfo.username.substring(0, 10)}...`;
  // } else {
  //   showUserName = '';
  // }

  useEffect(() => {
    if (userInfo) {
      if (userInfo.username && userInfo.username.length <= 10) {
        setShowUserName(userInfo.username);
      } else if (userInfo.username.length > 10) {
        setShowUserName(`${userInfo.username.substring(0, 10)}...`);
      } else if (userInfo.userAddress) {
        setShowUserName(`${userInfo.userAddress.substring(0, 7)}...${userInfo.userAddress.slice(-3)}`);
      }
    }
  }, [userInfo]);

  return (
    <div className={`navbar-outer${isConnected ? ' connected' : ''}`}>
      <button
        type="button"
        className={`navbar-button ${!isConnected ? 'not-connected' : 'connected'}`}
        onClick={() => (isWrongNetwork ? open({ route: 'SelectNetwork' }) : !isConnected ? open() : null)}>
        <div className="btn-connect-before absolute bottom-0 left-0 right-0 top-0 z-10 rounded-full p-[1px]" />
        <div className="flex flex-row items-center justify-center px-5" id="login-btn">
          {isConnecting ? (
            <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
          ) : (
            <>
              {isConnected ? (
                <>
                  <span className="text-transparent">{showUserName}</span>
                  <Image
                    src="/images/components/layout/header/connect_button.svg"
                    width={24}
                    height={24}
                    alt=""
                    className="mx-2 my-0 h-[24px] w-[24px]"
                  />
                  <span>{`${wethBalance.toFixed(2)} WETH`}</span>
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

      <ProfileContent balance={wethBalance} isWrongNetwork={isWrongNetwork ?? false} />
    </div>
  );
};

export default ConnectWalletButton;
