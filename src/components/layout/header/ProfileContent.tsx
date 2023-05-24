/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useState } from 'react';
import Link from 'next/link';
import { logEvent } from 'firebase/analytics';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { pageTitleParser } from '@/utils/eventLog';
import { apiConnection } from '@/utils/apiConnection';
import { firebaseAnalytics } from '@/const/firebaseConfig';
import NetworkNameDisplay from '@/utils/NetworkNameDisplay';
import { walletProvider } from '@/utils/walletProvider';

function PriceContent(props) {
  const { priceValue, isLargeText = false, title, notLastRow = false } = props;
  const iconImage = '../images/components/layout/header/eth-tribe3.svg';
  return (
    <div className={`total-value-row ${notLastRow ? 'not-last' : ''}`}>
      <div className="title">{title}</div>
      <div className="price-content">
        <div className="">
          <div className={`icon-row${isLargeText ? ' large-text' : ''}`}>
            <Image src={iconImage} alt="" className="icon" width="16" height="16" />
            {priceValue}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopContent(props) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const { username, isNotSetUsername } = props;

  const clickViewProfile = e => {
    e.preventDefault();
    const eventName = 'wallet_view_profile_pressed';

    const fullWalletAddress = walletProvider.holderAddress;

    logEvent(firebaseAnalytics, eventName, {
      wallet: fullWalletAddress.substring(2)
    });
    apiConnection.postUserEvent(eventName, {
      page
    });

    router.push(`/userprofile/${walletProvider.holderAddress}`);
  };

  return (
    <div className="tops">
      <div className="user-content">
        <div className="title">
          {username}
          {isNotSetUsername ? (
            <Link href="/userprofile/update">
              <div className="icon">
                <Image src="/images/components/layout/header/update-name.png" width={18} height={18} alt="" />
              </div>
            </Link>
          ) : null}
        </div>
        <div className="grade">
          <div className="crown">
            <Image src="/images/components/layout/header/crown_silver.png" width={17} height={18} alt="" />
          </div>
          <span className="text no-title">NO TITLE</span>
        </div>
      </div>
      <div className="desc">User ID</div>
      <div className="view-page-row">
        <div />
        <Link href={`/userprofile/${walletProvider.holderAddress}`}>
          <div className="button flex content-center items-center" onClick={clickViewProfile}>
            <span>View Profile</span>
            <div className="ml-[4px]">
              <Image src="/images/components/layout/header/arrow-right.png" width={10} height={10} alt="" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function BottomContent(props) {
  const { address, inWrongNetwork, currentChain, balance, callBalance } = props;
  const currentNetworkName = NetworkNameDisplay(currentChain);

  return (
    <div className="bottoms">
      <div className="connected-title">Connected Wallet</div>
      <div className="connected-wallet">
        <div className="content">
          <div className="start">
            {walletProvider.provider && walletProvider.provider.connection.url === 'metamask' ? (
              <div className="icon">
                <Image src="/images/components/layout/header/metamask-logo.png" width={34} height={34} alt="" />
              </div>
            ) : (
              <div className="icon">
                <Image src="/images/components/layout/header/walletconnect-logo.png" width={34} height={34} alt="" />
              </div>
            )}
            <div>
              <div className="wallet">{address}</div>
              <div className="network">{currentNetworkName}</div>
            </div>
          </div>
          <div className="end">
            {inWrongNetwork ? (
              <div className="wrong-network">
                Wrong
                <br />
                Network
              </div>
            ) : null}
            <div className={`status ${!inWrongNetwork ? 'correct' : 'wrong'}`} />
          </div>
        </div>
      </div>
      <PriceContent
        title="Total Account Value:"
        priceValue={inWrongNetwork ? '0.0000' : (Number(balance) + Number(callBalance.portfolio)).toFixed(4)}
        isLargeText
      />
      <div className="dividers" />
      <PriceContent
        title="Portfolio Collateral:"
        priceValue={inWrongNetwork ? '0.0000' : Number(callBalance.portfolio).toFixed(4)}
        notLastRow
      />
      <PriceContent title="Wallet Balance:" priceValue={inWrongNetwork ? '0.0000' : Number(balance).toFixed(4)} />
    </div>
  );
}

function NormalButtonSet(props) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const { disconnectWallet, setShowDisconnectTooltip, getTestToken, disconnectWalletAction } = props;

  const clickGetgoerliEth = e => {
    // e.preventDefault();
    const eventName = 'wallet_get_goerli_eth_pressed';

    const fullWalletAddress = walletProvider.holderAddress;

    logEvent(firebaseAnalytics, eventName, {
      wallet: fullWalletAddress.substring(2)
    });
    apiConnection.postUserEvent(eventName, {
      page
    });
  };

  return (
    <div className="normal-buttons">
      <div className="btn-switch-goerli" onClick={getTestToken}>
        Get WETH
      </div>
      <div className="function-btn" onClick={disconnectWalletAction}>
        Disconnect Wallet
      </div>
    </div>
  );
}

function IncorrectNetworkButtonSet(props) {
  const { updateTargetNetwork, disconnectWalletAction } = props;

  return (
    <div className="normal-buttons">
      <div className="btn-switch-goerli" onClick={updateTargetNetwork}>
        Switch to Arbitrum
      </div>
      <div className="function-btn" onClick={disconnectWalletAction}>
        Disconnect Wallet
      </div>
    </div>
  );
}

function ProfileContent(props, ref) {
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
    <>
      <div className="empty-margin" />
      <div className="profile-content" id="profile-content">
        <li>
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
          <li>
            <NormalButtonSet
              disconnectWallet={disconnectWallet}
              setShowDisconnectTooltip={setShowDisconnectTooltip}
              getTestToken={getTestToken}
              disconnectWalletAction={disconnectWalletAction}
            />
          </li>
        ) : (
          <li>
            <IncorrectNetworkButtonSet updateTargetNetwork={updateTargetNetwork} disconnectWalletAction={disconnectWalletAction} />
          </li>
        )}
      </div>
    </>
  );
}

export default forwardRef(ProfileContent);
