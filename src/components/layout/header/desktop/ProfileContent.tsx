/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
// @ts-nocheck
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { useStore as useNanostore } from '@nanostores/react';
import { $currentChain, $userAddress, $userInfo, $userIsWrongNetwork, $userTotalCollateral, $userWethBalance } from '@/stores/user';
import { useDisconnect, useSwitchNetwork } from 'wagmi';
import { $showSwitchNetworkErrorModal, $showGetWEthModal } from '@/stores/modal';
import { CHAINS } from '@/const/supportedChains';
import PrimaryButton from '@/components/common/PrimaryButton';
import networkNameDisplay from '@/utils/networkName';

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
          <Image src={iconImage} alt="" className="mr-2 h-[18px] w-[18px]" width={18} height={18} />
          {priceValue}
        </div>
      </div>
    </div>
  );
};

const TopContent = () => {
  const router = useRouter();
  const address = useNanostore($userAddress);
  const userInfo = useNanostore($userInfo);
  const isNotSetUsername = !userInfo || !userInfo.username;
  let userName = '';

  if (isNotSetUsername) {
    userName = 'Unnamed';
  } else if (userInfo.username.length > 10) {
    userName = `${userInfo.username.substring(0, 10)}...`;
  } else {
    userName = userInfo.username;
  }

  const clickViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/userprofile/${address ? address.toString() : ''}`);
  };

  return (
    <div className="tops gradient-bg-tops rounded-t-[12px]">
      <div className="user-content p-6 pb-0">
        <div className="title text-[20px]">
          {userName}
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
        <Link href={`/userprofile/${address || ''}`}>
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

const BottomContent = () => {
  const address = useNanostore($userAddress);
  const currentChain = useNanostore($currentChain);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const wethBalance = useNanostore($userWethBalance);
  const displayAddress = address ? `${address.substring(0, 7)}...${address.slice(-3)}` : null;
  const totalCollateral = useNanostore($userTotalCollateral);

  return (
    <div className="bottoms">
      <div className="p-6 text-[18px] font-semibold">Connected Wallet</div>
      <div
        className="connected-wallet mx-6 my-0
        h-[64px] rounded-lg border border-solid border-primaryBlue">
        <div className="content px-4 py-3">
          <div className="start">
            {/* {walletProvider.provider && walletProvider.provider.connection.url === 'metamask' ? (
              <div className="mr-4 h-[34px] w-[34px]">
                <Image src="/images/components/layout/header/metamask-logo.png" width={34} height={34} alt="" />
              </div>
            ) : (
              <div className="mr-4 h-[34px] w-[34px]">
                <Image src="/images/components/layout/header/walletconnect-logo.png" width={34} height={34} alt="" />
              </div>
            )} */}
            <div>
              <div className="gradient-bg !bg-clip-text text-transparent">{displayAddress}</div>
              <div className="text-[12px] font-medium text-mediumEmphasis">{networkNameDisplay(currentChain?.id)}</div>
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
        priceValue={isWrongNetwork ? '0.0000' : (wethBalance + totalCollateral).toFixed(4)}
        isLargeText
        notLastRow={false}
      />
      <div className="mx-6 my-0 h-[1px] bg-[#414368]" />
      <PriceContent
        title="Portfolio Collateral:"
        priceValue={isWrongNetwork ? '0.0000' : totalCollateral.toFixed(4)}
        isLargeText={false}
        notLastRow
      />
      <PriceContent
        title="Wallet Balance:"
        priceValue={isWrongNetwork ? '0.0000' : wethBalance.toFixed(4)}
        isLargeText={false}
        notLastRow={false}
      />
    </div>
  );
};

const ProfileContent = () => {
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();

  const disconnectWalletAction = () => {
    disconnect();
    // setShowDisconnectTooltip(false);
  };

  const switchToDefaultChain = () => {
    if (switchNetwork) {
      switchNetwork(CHAINS[0].id);
    } else {
      $showSwitchNetworkErrorModal.set(true);
    }
  };

  return (
    <div
      className="profile-content z-2 transition-visibility invisible
        absolute right-0 top-[46px] h-0 w-[370px]
        cursor-default rounded-lg bg-secondaryBlue
        opacity-0 transition-opacity duration-300"
      id="profile-content">
      <li className="m-0 list-none p-0">
        <TopContent />
        <BottomContent />
      </li>

      <li className="m-0 list-none p-0">
        <div className="normal-buttons m-6 mt-3">
          {!isWrongNetwork ? (
            <PrimaryButton className="h-[42px] text-[14px] font-semibold" onClick={() => $showGetWEthModal.set(true)}>
              Get WETH
            </PrimaryButton>
          ) : (
            <PrimaryButton className="h-[42px] text-[14px] font-semibold" onClick={switchToDefaultChain}>
              Switch to Arbitrum
            </PrimaryButton>
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

export default ProfileContent;
