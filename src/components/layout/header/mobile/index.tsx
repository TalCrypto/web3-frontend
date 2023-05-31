/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { walletProvider } from '@/utils/walletProvider';
import { apiConnection } from '@/utils/apiConnection';

import { wsIsWalletLoading } from '@/stores/WalletState';
import { userIsWrongNetwork, userIsLogin, userWalletAddress } from '@/stores/UserState';

function MobileHeader() {
  const [isShowMenu, setIsShowMenu] = useState(false);

  const [walletAddress, setWalletAddress] = useState('');
  const [currentChain, setCurrentChain] = useState(0);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const [address, setAddress] = useState('');

  const getTestTeth = async () => {};

  const resetState = () => {
    setAddress('');
    setWalletAddress('');
    userWalletAddress.set('');
    userIsLogin.set(false);
    wsIsWalletLoading.set(false);
    localStorage.setItem('isLoggedin', 'false');
  };

  const disconnectWallet = () => {
    walletProvider.disconnectWallet().then(() => {
      resetState();
    });
  };

  const handlePopOverItemClick = (index: any) => {
    if (index === 1) {
      disconnectWallet();
    } else if (index === 2) {
      // get goerlieth
      window.open('https://goerlifaucet.com/');
    } else {
      getTestTeth();
    }
    setIsShowMenu(false);
  };

  const handleConnectedWalletUpdate = (holderAddress: string, callback: any) => {
    setAddress(holderAddress);
    setWalletAddress(`${holderAddress.substring(0, 7)}...${holderAddress.slice(-3)}`);
    walletProvider.checkIsTargetNetworkWithChain().then((result: any) => {
      setCurrentChain(result.holderChain);
      setIsWrongNetwork(!result.result);
      userIsWrongNetwork.set(!result.result); // userState store
    });
    if (callback) {
      callback();
    }
    apiConnection.getUserInfo(walletProvider.holderAddress).then(result => {
      wsIsWalletLoading.set(false);
      // handleLoginSuccess(result.data);
    });
    // handleLoginSuccess();
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

  const handleClickConnectButton = async () => {
    if (address === '') {
      await walletProvider
        .initialConnectWallet(false)
        .then(() => {
          successfulConnectWalletCallback();
        })
        .catch(() => resetState());
    } else {
      setIsShowMenu(!isShowMenu);
    }
  };

  useEffect(() => {
    const handleBodyClick = (event: any) => {
      if (!event.target.closest('.btn-connect') && !event.target.closest('.popover') && isShowMenu) {
        setIsShowMenu(false);
      }
    };
    document.body.addEventListener('click', handleBodyClick);
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, [isShowMenu]);

  return (
    <div className="relative h-[48px] w-full py-2">
      <div className="absolute bottom-0 left-0 flex h-full w-full items-center justify-between px-5">
        <div className="mr-[10px] flex items-center justify-start">
          <button
            onClick={() => {
              window.location.href = '/';
            }}>
            <Image src="/images/mobile/components/layout/header/tribe3_logo_large.png" className="" alt="" width={96} height={24} />
          </button>
        </div>
        <div className="ml-[10px] flex items-center justify-start">
          <button
            className="btn-connect relative 
            flex h-[25px] flex-initial items-center justify-center rounded-[100px]
            border-0 px-2 py-1 text-[14px] font-medium text-white/[.87]"
            onClick={handleClickConnectButton}>
            <div
              className="btn-connect-before absolute bottom-0 left-0 right-0 top-0 z-10 rounded-full
                p-[2px]"
            />

            {address === '' ? (
              <Image src="/images/components/layout/header/connect_button.svg" alt="" className="mr-2" width={20} height={20} />
            ) : null}
            {address === '' ? 'Connect' : walletAddress}
            {address !== '' ? <Image src="/images/mobile/common/gift.svg" alt="" className="ml-2" width={20} height={20} /> : null}
          </button>

          {isShowMenu ? (
            <div className="popover absolute right-[20px] top-[50px] z-[1] w-[150px] rounded bg-[#202249]">
              <div
                className="flex py-3 pl-4 text-[14px] font-medium text-white/[.87]"
                onClick={() => {
                  // logEventByName('reward_pressed');
                  window.location.href = '/reward';
                }}>
                Referral
                <Image src="/images/mobile/common/gift.svg" className="ml-3" alt="" width={20} height={20} />
              </div>
              <div className="mx-[10px] my-5  h-[1px] w-[130px] bg-[#c3d8ff]/[.48]" />
              <div className="py-3 pl-4 text-[14px] font-medium text-white/[.87]" onClick={() => handlePopOverItemClick(1)}>
                Disconnect
              </div>
              <div className="py-3 pl-4 text-[14px] font-medium text-white/[.87]" onClick={() => handlePopOverItemClick(2)}>
                Get GoerliETH
              </div>
              <div className="py-3 pl-4 text-[14px] font-medium text-white/[.87]" onClick={() => handlePopOverItemClick(3)}>
                Get TETH
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MobileHeader;
