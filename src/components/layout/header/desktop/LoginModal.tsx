import React from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';
import { $isShowLoginModal } from '@/stores/modal';
// import { useWeb3Modal } from '@web3modal/react';
import { useConnect } from 'wagmi';

interface Platform {
  title: string;
  icon: string;
  desc: string;
  redirect: () => void;
}

const PlatformButton: React.FC<Platform> = ({ title, icon, desc, redirect }) => (
  <div
    className="z-[2] mt-[12px] flex min-h-[110px] w-[100%] cursor-pointer flex-col
    items-center justify-center space-y-[6px] rounded-[4px] border-[1px] border-[#2574FB]
    py-[6px] hover:bg-[#2574fb33]"
    onClick={redirect}>
    <Image src={icon} width={24} height={24} alt="" />
    <div className="text-[16px] font-[600] text-[#fff] ">{title}</div>
    <div className="text-[12px] font-[400] text-[#fff]">{desc}</div>
  </div>
);

export default function LoginModal() {
  const isShowLoginModal = useNanostore($isShowLoginModal);
  // const { open } = useWeb3Modal();
  const { connect, connectors } = useConnect();

  if (!isShowLoginModal) return null;

  const closeModal = () => {
    $isShowLoginModal.set(false);
  };

  const redirectMetamask = () => {
    const connector = connectors[1];
    connect({ connector });
    closeModal();
  };

  const redirectWalletConnect = () => {
    closeModal();
    // open();
    $isShowLoginModal.set(true);
  };

  return (
    <div
      className="fixed inset-0 z-20 flex h-screen items-center
        justify-center overflow-auto bg-black bg-opacity-40"
      onClick={closeModal}>
      <div
        className="relative my-[36px] w-[500px] rounded-xl bg-lightBlue px-[16px] py-[16px]
          text-[14px] font-normal leading-normal"
        onClick={e => e.stopPropagation()}>
        <div className="items-initial flex content-center justify-end">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="relative flex flex-col items-start justify-center px-[20px] pb-[20px]">
          <div className="mb-[12px]">
            <div className="text-[15px] font-semibold text-highEmphasis">Connect Your Wallet👇</div>
          </div>
          <PlatformButton
            icon="/icons/providers/metamask.png"
            title="Metamask"
            desc="Connect to your Metamask Wallet."
            redirect={redirectMetamask}
          />
          <PlatformButton
            icon="/icons/providers/okx.png"
            title="OKX Wallet"
            desc="Connect to your OKX Wallet."
            redirect={redirectMetamask}
          />
          <PlatformButton
            icon="/icons/providers/walletconnect.png"
            title="WalletConnect"
            desc="Scan with WalletConnect to connect."
            redirect={redirectWalletConnect}
          />
        </div>
        <Image
          src="/images/components/common/modal/modal-logo.svg"
          width={170}
          height={165}
          alt=""
          className="absolute bottom-0 right-0 mr-3 flex items-end"
        />
      </div>
    </div>
  );
}
