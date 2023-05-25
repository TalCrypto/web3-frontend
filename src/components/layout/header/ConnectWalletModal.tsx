import React from 'react';
import Image from 'next/image';

interface ConnectWalletModalProps {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  connectWithWalletConnect: () => void;
  connectWithEthereum: () => void;
  setIsWalletLoading: any;
}

export default function ConnectWalletModal({
  isShow,
  setIsShow,
  connectWithWalletConnect,
  connectWithEthereum,
  setIsWalletLoading
}: ConnectWalletModalProps) {
  if (!isShow) {
    return null;
  }

  const connectWallet = (isWC: boolean) => {
    setIsShow(false);
    if (isWC) {
      connectWithWalletConnect();
    } else {
      connectWithEthereum();
    }
  };

  const closeModal = () => {
    setIsWalletLoading(false);
    setIsShow(false);
  };

  const imageSize = 24;

  return (
    <div className="connect-modalbg" onClick={closeModal}>
      <div className="connect-modal" onClick={e => e.stopPropagation()}>
        <div className="close-row">
          <Image src="/images/components/common/modal/close.svg" alt="" className="button" width={16} height={16} onClick={closeModal} />
        </div>
        <div className="content">
          <div className="title">Connect Your Wallet👇</div>
          <div className="wallet-rows">
            <div className="items" onClick={() => connectWallet(false)}>
              <Image src="/images/components/layout/header/okx-logo.svg" alt="" className="logo" width={imageSize} height={imageSize} />
              <div className="name">OKX Wallet</div>
              <div className="desc">Connect to your OKX Wallet.</div>
            </div>
            <div className="items" onClick={() => connectWallet(false)}>
              <Image
                src="/images/components/layout/header/metamask-logo.png"
                alt=""
                className="logo"
                width={imageSize}
                height={imageSize}
              />
              <div className="name">Metamask</div>
              <div className="desc">Connect to your Metamask Wallet.</div>
            </div>
            <div className="items" onClick={() => connectWallet(true)}>
              <Image
                src="/images/components/layout/header/walletconnect-logo.png"
                alt=""
                className="logo"
                width={imageSize}
                height={imageSize}
              />
              <div className="name">WalletConnect</div>
              <div className="desc">Scan with WalletConnect to connect.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
