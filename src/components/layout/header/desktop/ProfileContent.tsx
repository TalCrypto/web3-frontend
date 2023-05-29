/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { forwardRef } from 'react';
import Link from 'next/link';
// import { logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { pageTitleParser } from '@/utils/eventLog';
import { apiConnection } from '@/utils/apiConnection';
// import { firebaseAnalytics } from '@/const/firebaseConfig';
import NetworkNameDisplay from '@/utils/NetworkNameDisplay';
import { walletProvider } from '@/utils/walletProvider';

interface PriceContentProps {
  priceValue: string;
  title: string;
  isLargeText: boolean;
  notLastRow: boolean;
}

const PriceContent: React.FC<PriceContentProps> = ({ priceValue, title, isLargeText = false, notLastRow = false }) => {
  const iconImage = '../images/components/layout/header/eth-tribe3.svg';
  return (
    <div className={`total-value-row p-6 ${notLastRow ? 'pb-0' : ''}`}>
      <div className="text-[14px] font-normal text-[#a8cbffbf]">{title}</div>
      <div className="price-content">
        <div
          className={`icon-row 
            ${isLargeText ? 'text-[24px] font-semibold' : 'text-[16px] font-medium'}`}>
          <Image src={iconImage} alt="" className="mr-2 h-[18px] w-[18px]" width="18" height="18" />
          {priceValue}
        </div>
      </div>
    </div>
  );
};

interface TopContentProps {
  username: string;
  isNotSetUsername: boolean;
}

const TopContent: React.FC<TopContentProps> = ({ username, isNotSetUsername }) => {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);

  const clickViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    const eventName = 'wallet_view_profile_pressed';

    const fullWalletAddress = walletProvider.holderAddress;

    // logEvent(firebaseAnalytics, eventName, {
    //   wallet: fullWalletAddress.substring(2)
    // });
    apiConnection.postUserEvent(eventName, {
      page
    });

    router.push(`/userprofile/${walletProvider.holderAddress}`);
  };

  return (
    <div className="tops gradient-bg-tops rounded-t-[12px]">
      <div className="user-content p-6 pb-0">
        <div className="title text-[20px]">
          {username}
          {isNotSetUsername ? (
            <Link href="/userprofile/update">
              <div className="ml-[4px] cursor-pointer">
                <Image src="/images/components/layout/header/update-name.png" width={18} height={18} alt="" />
              </div>
            </Link>
          ) : null}
        </div>
        <div className="flex">
          <div className="mr-[4px]">
            <Image src="/images/components/layout/header/crown_silver.png" width={17} height={18} alt="" />
          </div>
          <span
            className="text gradient-bg-tops-text text-opacity-87 !bg-clip-text text-[12px]
            font-semibold text-white">
            NO TITLE
          </span>
        </div>
      </div>
      <div className="px-6 pb-0 pt-2 text-[14px] font-medium text-[#a8cbffbf]">User ID</div>
      <div className="view-page-row px-[24px] py-[14px]">
        <div />
        <Link href={`/userprofile/${walletProvider.holderAddress}`}>
          <div className="button cursor-pointer text-[16px] font-semibold text-[#2574fb]" onClick={clickViewProfile}>
            <span>View Profile</span>
            <div className="ml-[4px]">
              <Image src="/images/components/layout/header/arrow-right.png" width={10} height={10} alt="" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

interface BottomContentProps {
  address: string;
  inWrongNetwork: boolean;
  currentChain: number;
  balance: number;
  callBalance: { portfolio: string };
}

const BottomContent: React.FC<BottomContentProps> = ({ address, inWrongNetwork, currentChain, balance, callBalance }) => {
  const currentNetworkName = NetworkNameDisplay(currentChain);

  return (
    <div className="bottoms">
      <div className="p-6 text-[18px] font-semibold">Connected Wallet</div>
      <div
        className="connected-wallet mx-6 my-0
        h-[64px] rounded-lg border border-solid border-[#2574fb]">
        <div className="content px-4 py-3">
          <div className="start">
            {walletProvider.provider && walletProvider.provider.connection.url === 'metamask' ? (
              <div className="mr-4 h-[34px] w-[34px]">
                <Image src="/images/components/layout/header/metamask-logo.png" width={34} height={34} alt="" />
              </div>
            ) : (
              <div className="mr-4 h-[34px] w-[34px]">
                <Image src="/images/components/layout/header/walletconnect-logo.png" width={34} height={34} alt="" />
              </div>
            )}
            <div>
              <div className="gradient-bg !bg-clip-text text-transparent">{address}</div>
              <div className="text-[12px] font-medium text-[#a8cbffbf]">{currentNetworkName}</div>
            </div>
          </div>
          <div className="flex items-center">
            {inWrongNetwork ? (
              <div className="mr-1 text-[12px] font-medium text-[#ff5656]">
                Wrong <br /> Network
              </div>
            ) : null}
            <div className={`h-2 w-2 rounded-full ${!inWrongNetwork ? 'bg-[#78f363]' : 'bg-[#ff5656]'}`} />
          </div>
        </div>
      </div>
      <PriceContent
        title="Total Account Value:"
        priceValue={inWrongNetwork ? '0.0000' : (Number(balance) + Number(callBalance.portfolio)).toFixed(4)}
        isLargeText
        notLastRow={false}
      />
      <div className="mx-6 my-0 h-[1px] bg-[#414368]" />
      <PriceContent
        title="Portfolio Collateral:"
        priceValue={inWrongNetwork ? '0.0000' : Number(callBalance.portfolio).toFixed(4)}
        isLargeText={false}
        notLastRow
      />
      <PriceContent
        title="Wallet Balance:"
        priceValue={inWrongNetwork ? '0.0000' : Number(balance).toFixed(4)}
        isLargeText={false}
        notLastRow={false}
      />
    </div>
  );
};

interface NormalButtonSetProps {
  disconnectWallet: () => void;
  setShowDisconnectTooltip: (value: boolean) => void;
  getTestToken: () => void;
  disconnectWalletAction: () => void;
}

const NormalButtonSet: React.FC<NormalButtonSetProps> = ({
  disconnectWallet,
  setShowDisconnectTooltip,
  getTestToken,
  disconnectWalletAction
}) => {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);

  const clickGetgoerliEth = (e: React.MouseEvent) => {
    // e.preventDefault();
    const eventName = 'wallet_get_goerli_eth_pressed';

    const fullWalletAddress = walletProvider.holderAddress;

    // logEvent(firebaseAnalytics, eventName, {
    //   wallet: fullWalletAddress.substring(2)
    // });
    apiConnection.postUserEvent(eventName, {
      page
    });
  };

  return (
    <div className="normal-buttons m-6 mt-3">
      <div
        className="btn-switch-goerli h-[42px] cursor-pointer rounded-lg
          bg-[#2574fb] text-[14px] font-semibold text-white"
        onClick={getTestToken}>
        Get WETH
      </div>
      <div
        className="function-btn font-semiboldtext-[#2574fb] mt-6
          cursor-pointer text-[16px]"
        onClick={disconnectWalletAction}>
        Disconnect Wallet
      </div>
    </div>
  );
};

interface IncorrectNetworkButtonSetProps {
  updateTargetNetwork: () => void;
  disconnectWalletAction: () => void;
}

const IncorrectNetworkButtonSet: React.FC<IncorrectNetworkButtonSetProps> = ({ updateTargetNetwork, disconnectWalletAction }) => (
  <div className="normal-buttons m-6 mt-3">
    <div
      className="btn-switch-goerli h-[42px] cursor-pointer rounded-lg
          bg-[#2574fb] text-[14px] font-semibold text-white"
      onClick={updateTargetNetwork}>
      Switch to Arbitrum
    </div>
    <div
      className="function-btn font-semiboldtext-[#2574fb] mt-6
          cursor-pointer text-[16px]"
      onClick={disconnectWalletAction}>
      Disconnect Wallet
    </div>
  </div>
);

interface ProfileContentProps {
  address: string;
  inWrongNetwork: boolean;
  currentChain: number;
  balance: number;
  showDisconnectTooltip: boolean;
  disconnectWallet: () => void;
  setShowDisconnectTooltip: (value: boolean) => void;
  getTestToken: () => void;
  isWrongNetwork: boolean;
  updateTargetNetwork: () => void;
  callBalance: { portfolio: string };
  userInfo: { username: string } | null;
}

const ProfileContent: React.ForwardRefRenderFunction<HTMLDivElement, ProfileContentProps> = (props, ref) => {
  const {
    address,
    inWrongNetwork,
    currentChain,
    balance,
    showDisconnectTooltip,
    disconnectWallet,
    setShowDisconnectTooltip,
    getTestToken,
    isWrongNetwork,
    updateTargetNetwork,
    callBalance,
    userInfo
  } = props;
  const isNotSetUsername = !userInfo || !userInfo.username;

  let userName = '';

  if (isNotSetUsername) {
    userName = 'Unnamed';
  } else if (userInfo.username.length > 10) {
    userName = `${userInfo.username.substring(0, 10)}...`;
  } else {
    userName = userInfo.username;
  }

  const disconnectWalletAction = () => {
    disconnectWallet();
    setShowDisconnectTooltip(false);
  };

  return (
    <div
      className="profile-content z-2 transition-visibility invisible
        absolute right-0 top-[46px] h-0 w-[370px]
        cursor-default rounded-lg bg-gray-900
        opacity-0 transition-opacity duration-300 dark:bg-gray-800
      "
      id="profile-content">
      <li className="m-0 list-none p-0">
        <TopContent username={userName} isNotSetUsername={isNotSetUsername} />
        <BottomContent
          address={address}
          inWrongNetwork={inWrongNetwork}
          currentChain={currentChain}
          balance={balance}
          callBalance={callBalance}
        />
      </li>
      {!isWrongNetwork ? (
        <li className="m-0 list-none p-0">
          <NormalButtonSet
            disconnectWallet={disconnectWallet}
            setShowDisconnectTooltip={setShowDisconnectTooltip}
            getTestToken={getTestToken}
            disconnectWalletAction={disconnectWalletAction}
          />
        </li>
      ) : (
        <li className="m-0 list-none p-0">
          <IncorrectNetworkButtonSet updateTargetNetwork={updateTargetNetwork} disconnectWalletAction={disconnectWalletAction} />
        </li>
      )}
    </div>
  );
};

export default React.forwardRef(ProfileContent);
