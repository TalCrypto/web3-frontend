import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { wsIsLogin, wsIsWalletLoading, wsIsWrongNetwork, wsWethBalance } from '@/stores/WalletState';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';
import { connectWallet, disconnectWallet, updateTargetNetwork } from '@/utils/Wallet';
import { walletProvider } from '@/utils/walletProvider';
import { PriceWithIcon } from '@/components/common/PricWithIcon';

const MobileMenu = (props: any) => {
  const { setIsShowMobileMenu } = props;
  const isLogin = useNanostore(wsIsLogin);
  const isWalletLoading = useNanostore(wsIsWalletLoading);
  const isWrongNetwork = useNanostore(wsIsWrongNetwork);

  const fullWalletAddress = walletProvider.holderAddress;
  const wethBalance = useNanostore(wsWethBalance);

  const walletAddressToShow = (addr: any) => {
    if (!addr) {
      return '';
    }
    return `${addr.substring(0, 7)}...${addr.slice(-3)}`;
  };

  const onBtnConnectClick = () => {
    if (!isLogin) {
      connectWallet(() => {}, false);
    } else if (isWrongNetwork) {
      updateTargetNetwork();
    }
  };

  const onBtnDisonnectClick = () => {
    disconnectWallet(null);
  };

  const onBtnCopyAddressClick = () => {
    navigator.clipboard.writeText(fullWalletAddress);
  };

  const onBtnGetWethClick = () => {
    // getTestToken();
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-10 flex h-screen w-full
        items-center justify-center overflow-auto bg-lightBlue">
      <div className="fixed bottom-0 h-[250px] w-full bg-secondaryBlue">
        <div className="fixed bottom-[50px] h-[200px] w-full text-center">
          {!isLogin ? (
            <div className="mx-5">
              <div
                className="mb-[36px] mt-[62px] text-[14px] font-normal
                text-mediumEmphasis">
                Please connect your wallet.
              </div>
              <div
                className="mb-[24px] flex h-[46px] w-full cursor-pointer
                  items-center justify-center rounded-[4px] bg-primaryBlue px-[10px]
                  py-[14px] text-[16px] font-semibold text-highEmphasis"
                onClick={onBtnConnectClick}>
                {isWalletLoading ? (
                  <div className="flex justify-center">
                    <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
                  </div>
                ) : (
                  'Connect'
                )}
              </div>
            </div>
          ) : isWrongNetwork ? (
            <div className="mx-5">
              <div className="mt-[30px] flex items-center justify-center">
                <PriceWithIcon priceValue="-.--" className="text-[20px]" width={22} height={22} />
              </div>
              <div
                className="mb-[36px] mt-[11px] text-[14px] font-normal
                text-mediumEmphasis">
                {walletAddressToShow(fullWalletAddress)}
              </div>
              <div
                className="mb-[24px] flex h-[46px] w-full cursor-pointer
                  items-center justify-center rounded-[4px] bg-primaryBlue px-[10px]
                  py-[14px] text-[16px] font-semibold text-highEmphasis"
                onClick={onBtnConnectClick}>
                {isWalletLoading ? (
                  <div className="flex justify-center">
                    <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
                  </div>
                ) : (
                  'Switch to Arbitrum'
                )}
              </div>
            </div>
          ) : (
            <div className="mx-[26px]">
              <div className="mt-[20px] flex items-center justify-center">
                <PriceWithIcon priceValue={wethBalance} className="text-[20px]" width={22} height={22} />
              </div>
              <div
                className="mb-[24px] mt-[11px] text-[14px] font-normal
                text-mediumEmphasis">
                {walletAddressToShow(fullWalletAddress)}
              </div>
              <div className="mb-[24px] flex items-center justify-between">
                <div
                  className="justify-cen flex flex-col items-center
                    text-[12px] text-highEmphasis"
                  onClick={onBtnDisonnectClick}>
                  <Image src="/images/mobile/common/disconnect.svg" alt="" className="mb-2" width={40} height={40} />
                  Disconnect
                </div>
                <div
                  className="justify-cen flex flex-col items-center
                    text-[12px] text-highEmphasis"
                  onClick={onBtnCopyAddressClick}>
                  <Image src="/images/mobile/common/copy_address.svg" alt="" className="mb-2" width={40} height={40} />
                  Copy Address
                </div>
                <div
                  className="justify-cen flex flex-col items-center
                    text-[12px] text-highEmphasis"
                  onClick={onBtnGetWethClick}>
                  <Image src="/images/mobile/common/get_weth.svg" alt="" className="mb-2" width={40} height={40} />
                  Get Weth
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 h-[50px] w-full px-[50px]">
          {isLogin ? (
            <div className="flex h-full items-center justify-center">
              <div
                className={`mr-[6px] h-[6px] w-[6px] rounded-full
                ${!isWrongNetwork ? 'bg-marketGreen' : 'bg-marketRed'}`}
              />
              <div
                className={`mr-1 text-[14px]
                  ${!isWrongNetwork ? 'text-marketGreen' : 'text-marketRed'}
                `}>
                {isWrongNetwork ? 'Wrong Network' : 'Connected'}
              </div>
            </div>
          ) : null}

          <Image
            src="/images/mobile/common/close.svg"
            alt=""
            className="fixed bottom-[5px] right-[10px]"
            width={40}
            height={40}
            onClick={() => setIsShowMobileMenu(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
