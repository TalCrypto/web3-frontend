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

import { disconnectWallet, getTestToken, updateTargetNetwork } from '@/utils/Wallet';
import { useStore as useNanostore } from '@nanostores/react';
import { wsCurrentChain, wsIsWrongNetwork } from '@/stores/WalletState';

interface PriceContentProps {
  priceValue: string;
  title: string;
  isLargeText: boolean;
  notLastRow: boolean;
}

const PriceContent: React.FC<PriceContentProps> = ({ priceValue, title, isLargeText = false, notLastRow = false }) => {
  const iconImage = '/images/components/layout/header/eth-tribe3.svg';
  return (
    <div className={`total-value-row p-6 ${notLastRow ? 'pb-0' : ''}`}>
      <div className="text-[14px] font-normal text-mediumEmphasis">{title}</div>
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
          <span className="text gradient-bg-tops-text !bg-clip-text text-[12px] font-semibold text-highEmphasis">NO TITLE</span>
        </div>
      </div>
      <div className="px-6 pb-0 pt-2 text-[14px] font-medium text-mediumEmphasis">User ID</div>
      <div className="view-page-row px-[24px] py-[14px]">
        <div />
        <Link href={`/userprofile/${walletProvider.holderAddress}`}>
          <div className="button cursor-pointer text-[16px] font-semibold text-primaryBlue" onClick={clickViewProfile}>
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
  balance: number;
  callBalance: { portfolio: string };
}

const BottomContent: React.FC<BottomContentProps> = ({ address, balance, callBalance }) => {
  const currentChain = useNanostore(wsCurrentChain);
  const currentNetworkName = NetworkNameDisplay(currentChain);
  const isWrongNetwork = useNanostore(wsIsWrongNetwork);

  return (
    <div className="bottoms">
      <div className="p-6 text-[18px] font-semibold">Connected Wallet</div>
      <div
        className="connected-wallet mx-6 my-0
        h-[64px] rounded-lg border border-solid border-primaryBlue">
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
              <div className="text-[12px] font-medium text-mediumEmphasis">{currentNetworkName}</div>
            </div>
          </div>
          <div className="flex items-center">
            {isWrongNetwork ? (
              <div className="mr-1 text-[12px] font-medium text-marketRed">
                Wrong <br /> Network
              </div>
            ) : null}
            <div className={`h-2 w-2 rounded-full ${!isWrongNetwork ? 'bg-marketGreen' : 'bg-marketRed'}`} />
          </div>
        </div>
      </div>
      <PriceContent
        title="Total Account Value:"
        priceValue={isWrongNetwork ? '0.0000' : (Number(balance) + Number(callBalance.portfolio)).toFixed(4)}
        isLargeText
        notLastRow={false}
      />
      <div className="mx-6 my-0 h-[1px] bg-[#414368]" />
      <PriceContent
        title="Portfolio Collateral:"
        priceValue={isWrongNetwork ? '0.0000' : Number(callBalance.portfolio).toFixed(4)}
        isLargeText={false}
        notLastRow
      />
      <PriceContent
        title="Wallet Balance:"
        priceValue={isWrongNetwork ? '0.0000' : Number(balance).toFixed(4)}
        isLargeText={false}
        notLastRow={false}
      />
    </div>
  );
};

interface ProfileContentProps {
  address: string;
  balance: number;
  showDisconnectTooltip: boolean;
  setShowDisconnectTooltip: (value: boolean) => void;
  callBalance: { portfolio: string };
  userInfo: { username: string } | null;
}

const ProfileContent: React.ForwardRefRenderFunction<HTMLDivElement, ProfileContentProps> = (props, ref) => {
  const { address, balance, showDisconnectTooltip, setShowDisconnectTooltip, callBalance, userInfo } = props;
  const isNotSetUsername = !userInfo || !userInfo.username;
  const isWrongNetwork = useNanostore(wsIsWrongNetwork);

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

  const onGeWethClick = async () => {
    await getTestToken(null, null);
  };

  return (
    <div
      className="profile-content z-2 transition-visibility invisible
        absolute right-0 top-[46px] h-0 w-[370px]
        cursor-default rounded-lg bg-secondaryBlue
        opacity-0 transition-opacity duration-300"
      id="profile-content">
      <li className="m-0 list-none p-0">
        <TopContent username={userName} isNotSetUsername={isNotSetUsername} />
        <BottomContent address={address} balance={balance} callBalance={callBalance} />
      </li>

      <li className="m-0 list-none p-0">
        <div className="normal-buttons m-6 mt-3">
          {!isWrongNetwork ? (
            <div
              className="btn-switch-goerli h-[42px] cursor-pointer rounded-lg
                bg-primaryBlue text-[14px] font-semibold text-white"
              onClick={onGeWethClick}>
              Get WETH
            </div>
          ) : (
            <div
              className="btn-switch-goerli h-[42px] cursor-pointer rounded-lg
            bg-primaryBlue text-[14px] font-semibold text-white"
              onClick={updateTargetNetwork}>
              Switch to Arbitrum
            </div>
          )}
          <div
            className="function-btn mt-6 cursor-pointer text-[16px]
              font-semibold text-primaryBlue"
            onClick={disconnectWalletAction}>
            Disconnect Wallet
          </div>
        </div>
      </li>
    </div>
  );
};

export default React.forwardRef(ProfileContent);
