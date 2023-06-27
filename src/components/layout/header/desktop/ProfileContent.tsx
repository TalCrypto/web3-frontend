/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { pageTitleParser } from '@/utils/eventLog';
import { apiConnection } from '@/utils/apiConnection';

import { useStore as useNanostore } from '@nanostores/react';
import { firebaseAnalytics } from '@/const/firebaseConfig';
import { $userAddress, $userInfo } from '@/stores/user';
import { useDisconnect, useSwitchNetwork } from 'wagmi';
import { $showSwitchNetworkErrorModal, $showGetWEthModal } from '@/stores/modal';
import { CHAINS } from '@/const/supportedChains';
import PrimaryButton from '@/components/common/PrimaryButton';

interface TopContentProps {
  username: string;
  isNotSetUsername: boolean;
}

const TopContent: React.FC<TopContentProps> = ({ username, isNotSetUsername }) => {
  const address = useNanostore($userAddress);
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);

  const clickViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/userprofile/${address ? address.toString() : ''}`);
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

interface ProfileContentProps {
  balance: number;
  isWrongNetwork: boolean;
}

const ProfileContent: React.ForwardRefRenderFunction<HTMLDivElement, ProfileContentProps> = props => {
  const { balance, isWrongNetwork } = props;
  const userInfo = useNanostore($userInfo);
  const isNotSetUsername = !userInfo || !userInfo.username;
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();

  let userName = '';

  if (isNotSetUsername) {
    userName = 'Unnamed';
  } else if (userInfo.username.length > 10) {
    userName = `${userInfo.username.substring(0, 10)}...`;
  } else {
    userName = userInfo.username;
  }

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
        <TopContent username={userName} isNotSetUsername={isNotSetUsername} />
        {/* <BottomContent balance={balance} isWrongNetwork={isWrongNetwork} /> */}
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
