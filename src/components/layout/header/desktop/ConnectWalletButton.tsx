/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { ThreeDots } from 'react-loader-spinner';

import Image from 'next/image';
import ProfileContent from '@/components/layout/header/desktop/ProfileContent';
import { $userIsConnecting, $userWethBalance, $userIsWrongNetwork, $userIsConnected, $userDisplayName } from '@/stores/user';
import { useWeb3Modal } from '@web3modal/react';
import { useSwitchNetwork } from 'wagmi';
import { DEFAULT_CHAIN } from '@/const/supportedChains';
import { $showSwitchNetworkErrorModal, $isShowLoginModal } from '@/stores/modal';

const ConnectWalletButton: React.FC = () => {
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const isConnecting = useNanostore($userIsConnecting);
  const isConnected = useNanostore($userIsConnected);
  const wethBalance = useNanostore($userWethBalance);
  const userDisplayName = useNanostore($userDisplayName);
  const isShowLoginModal = useNanostore($isShowLoginModal);

  const { open } = useWeb3Modal();
  const { switchNetwork } = useSwitchNetwork();

  const updateTargetNetwork = () => {
    if (switchNetwork) {
      switchNetwork(DEFAULT_CHAIN.id);
    } else {
      $showSwitchNetworkErrorModal.set(true);
    }
  };

  const openLoginModal = () => {
    $isShowLoginModal.set(true);
  };

  return (
    <div className={`navbar-outer${isConnected ? ' connected' : ''}`}>
      <button
        type="button"
        className={`navbar-button ${!isConnected ? 'not-connected' : 'connected'}`}
        onClick={() => (isWrongNetwork ? updateTargetNetwork() : !isConnected ? openLoginModal() : null)}>
        <div className="btn-connect-before absolute bottom-0 left-0 right-0 top-0 z-10 rounded-full p-[1px]" />
        <div className="flex flex-row items-center justify-center px-5" id="login-btn">
          {isConnecting || isShowLoginModal ? (
            <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
          ) : (
            <>
              {isConnected ? (
                <>
                  <span className="text-transparent">{userDisplayName}</span>
                  <Image
                    src="/images/components/layout/header/connect_button.svg"
                    width={24}
                    height={24}
                    alt=""
                    className="mx-2 my-0 h-[24px] w-[24px]"
                  />
                  <span>{`${isWrongNetwork ? '-.--' : wethBalance.toFixed(2)} WETH`}</span>
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

      <ProfileContent />
    </div>
  );
};

export default ConnectWalletButton;
