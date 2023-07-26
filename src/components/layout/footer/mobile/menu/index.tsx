import React, { useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import Link from 'next/link';
import { $isShowMobileModal, $showSwitchNetworkErrorModal, $isShowMobileTncModal } from '@/stores/modal';
import { useRouter } from 'next/router';
import {
  $userAddress,
  $userIsConnected,
  $userIsConnecting,
  $userIsWrongNetwork,
  $userWethBalance,
  $userDisplayName,
  $userTotalCollateral
} from '@/stores/user';
import { useConnect, useDisconnect, useSwitchNetwork } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { DEFAULT_CHAIN } from '@/const/supportedChains';
import { $userPoint } from '@/stores/airdrop';
import { localeConversion } from '@/utils/localeConversion';

const MobileMenu = (props: any) => {
  const { setIsShowMobileMenu } = props;
  const isConnected = useNanostore($userIsConnected);
  const isWalletLoading = useNanostore($userIsConnecting);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);

  const address = useNanostore($userAddress);
  const wethBalance = useNanostore($userWethBalance);
  const userPoint = useNanostore($userPoint);
  const username = useNanostore($userDisplayName);
  const userTotalCollateral = useNanostore($userTotalCollateral);

  const [isShowSocialFooter, setIsShowSocialFooter] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const [isSwapWidgetOpen, setIsSwapWidgetOpen] = useState(false);
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  const { open } = useWeb3Modal();
  const { switchNetwork } = useSwitchNetwork();

  const walletAddressToShow = (addr: any) => {
    if (!addr) {
      return '';
    }
    return `${addr.substring(0, 7)}...${addr.slice(-3)}`;
  };

  const onBtnConnectClick = () => {
    if (!isConnected) {
      const localStorageTncApproved = localStorage.getItem('isTncApproved') === 'true';
      if (!localStorageTncApproved) {
        $isShowMobileTncModal.set(true);
        return;
      }

      let isInjected = false;

      for (let i = 0; i < connectors.length; i += 1) {
        const connector = connectors[i];
        if (connector?.name.toLowerCase().includes('metamask')) {
          connect({ connector });
          isInjected = true;
          break;
        }
      }

      if (!isInjected) {
        open();
      }
    } else if (isWrongNetwork) {
      if (switchNetwork) {
        switchNetwork(DEFAULT_CHAIN.id);
      } else {
        $showSwitchNetworkErrorModal.set(true);
      }
    }
  };

  const onBtnDisonnectClick = () => {
    disconnect();
  };

  function showSnackBar() {
    const snackbar = document.getElementById('snackbar');
    if (snackbar) {
      snackbar.className = 'snackbar show';
      setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '');
      }, 3000);
    }
  }

  const onBtnCopyAddressClick = () => {
    navigator.clipboard.writeText(address || '');
    showSnackBar();
  };

  const onBtnGetWethClick = () => {
    setIsSwapWidgetOpen(true);
  };

  const onBtnClickSocial = () => {
    setIsShowSocialFooter(!isShowSocialFooter);
  };

  const onGotoPage = (url: string) => {
    setIsShowMobileMenu(false);
    $isShowMobileModal.set(false);
    router.push(url);
  };

  const redirectExternal = (url: string) => {
    setIsSwapWidgetOpen(false);
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-10  h-screen w-full
        overflow-auto bg-lightBlue">
      <div className="flex h-full pt-[18px]">
        <div className="w-full pl-[20px] text-[14px] text-highEmphasis">
          {isConnected ? (
            <div className="flex w-full items-center">
              <div className="mr-3 w-[60px]">
                <Image className="mr-[6px]" src="/images/mobile/common/avatar.svg" alt="" width={60} height={60} />
              </div>
              <div className="max-w-[calc(100%-50px)] ">
                <div className="mb-3 overflow-hidden text-ellipsis text-[20px] font-semibold">{username}</div>
                <span className="w-auto rounded-[12px] bg-[#71562E] px-[8px] py-1 text-[14px] ">
                  Points: <span className="font-semibold">{localeConversion(userPoint?.total || 0, 2, 2)}</span>
                </span>
              </div>
            </div>
          ) : null}
          <div className="scrollable mt-[36px] h-[calc(100%-361px)] overflow-y-scroll">
            <div className="pb-[35px]">
              <div onClick={() => onGotoPage('/portfolio')}>
                <span
                  className={`
                ${router.route.toLowerCase() === '/portfolio' ? 'mobile-menu-active font-semibold' : ''}
              `}>
                  Portfolio
                </span>
              </div>
            </div>
            <div className="pb-[35px]">
              <div onClick={() => onGotoPage('/trade')}>
                <span
                  className={`
                ${router.route.toLowerCase() === '/trade' ? 'mobile-menu-active font-semibold' : ''}
              `}>
                  Trade
                </span>
              </div>
            </div>
            {/* ${router.route.toLowerCase() === '/others' ? 'mobile-menu-active font-semibold' : ''} */}
            {/* <div className="flex items-center pb-[35px]" onClick={() => setIsOthersOpen(!isOthersOpen)}>
              Others
              <Image
                className={`ml-2 ${isOthersOpen ? 'rotate-90' : ''}`}
                src="/images/mobile/common/angle-right.png"
                alt=""
                width={6}
                height={10}
              />
            </div> */}
            {/* {isOthersOpen ? (
              <>
                <div className="ml-5 pb-[35px]">
                  <div
                    onClick={() => onGotoPage('/airdrop')}
                    className={`${router.route.toLowerCase() === '/avatar' ? 'mobile-menu-active font-semibold' : ''}`}>
                    Avatar
                    <span
                      className="ml-[6px] rounded-[2px] border-[1px] border-comingSoon px-[3px]
                        py-[1px] text-[8px] text-comingSoon">
                      SOON
                    </span>
                  </div>
                </div>
                <div className="ml-5 pb-[35px]">
                  <div
                    onClick={() => onGotoPage('/airdrop')}
                    className={`${router.route.toLowerCase() === '/battle' ? 'mobile-menu-active font-semibold' : ''}`}>
                    Battle
                    <span
                      className="ml-[6px] rounded-[2px] border-[1px] border-comingSoon px-[3px]
                    py-[1px] text-[8px] text-comingSoon">
                      SOON
                    </span>
                  </div>
                </div>
              </>
            ) : null} */}

            <div className="pb-[35px]">
              <div onClick={() => onGotoPage('/airdrop')}>
                <span
                  className={`
                ${router.route.toLowerCase() === '/airdrop' ? 'mobile-menu-active font-semibold' : ''}
              `}>
                  Airdrop
                </span>
              </div>
            </div>

            <div className="pb-[35px]">
              <div onClick={() => onGotoPage('/competition')}>
                <div className="flex flex-row items-center">
                  <Image className="mr-[4px]" src="/images/common/fire.svg" width={15} height={15} alt="Competition Icon" />
                  <span
                    className={`glow-yellow relative flex ${
                      router.route.toLowerCase() === '/competition' ? 'mobile-menu-active font-semibold' : ''
                    }`}>
                    Competition
                    <div
                      className="absolute right-0 top-0 mr-[-6px] mt-[-2px] rounded-br-[6px] rounded-tl-[6px] 
                    bg-gradient-to-b from-[#FF9D56] to-[#B23333] px-[3px] py-[2px] text-[6px] font-bold italic leading-[6px]">
                      END
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <div className="pb-[35px]">
              <div onClick={() => window.open('/terms', '_blank')}>
                <span
                  className={`
                ${router.route.toLowerCase() === '/terms' ? 'mobile-menu-active font-semibold' : ''}
              `}>
                  Terms & Conditions
                </span>
              </div>
            </div>
          </div>
        </div>
        {isShowSocialFooter ? (
          <div
            className="absolute left-0 top-0 z-10 h-full w-full"
            onClick={() => {
              setIsShowSocialFooter(false);
            }}>
            <div
              className="fixed right-[20px] top-[75px] rounded-[4px]
                bg-secondaryBlue text-[14px] text-highEmphasis">
              <div className="flex h-[52px] w-[160px] items-center pl-5">
                <Link href="https://discord.com/invite/v9xrD3rK9j" className="flex" target="_blank">
                  <Image className="mr-[6px]" src="/images/components/layout/footer/discord.svg" alt="" width={18} height={18} />
                  Discord
                </Link>
              </div>
              <div className="flex h-[52px] w-[160px] items-center pl-5">
                <Link href="https://twitter.com/Tribe3Official" className="flex" target="_blank">
                  <Image className="mr-[6px]" src="/images/components/layout/footer/twitter.svg" alt="" width={18} height={18} />
                  Twitter
                </Link>
              </div>
              <div className="flex h-[52px] w-[160px] items-center pl-5">
                <Link href="https://t.me/OfficialTribe3" className="flex" target="_blank">
                  <Image className="mr-[6px]" src="/images/components/layout/footer/telegram.svg" alt="" width={18} height={18} />
                  Telegram
                </Link>
              </div>
              <div className="flex h-[52px] w-[160px] items-center pl-5">
                <Link href="https://mirror.xyz/tribe3.eth" className="flex" target="_blank">
                  <Image className="mr-[6px]" src="/images/components/layout/footer/mirror.svg" alt="" width={18} height={18} />
                  Mirror
                </Link>
              </div>
              <div className="flex h-[52px] w-[160px] items-center pl-5">
                <Link href="https://tribe3.gitbook.io/tribe3/" className="flex" target="_blank">
                  <Image className="mr-[6px]" src="/images/components/layout/footer/docs.svg" alt="" width={18} height={18} />
                  Docs
                </Link>
              </div>
            </div>
          </div>
        ) : null}
        <Image
          src="/images/mobile/menu/social.svg"
          alt=""
          className="fixed bottom-[260px] right-[20px]"
          width={40}
          height={40}
          onClick={onBtnClickSocial}
        />
      </div>

      <div className="fixed bottom-0 h-[250px] w-full bg-secondaryBlue">
        <div className="fixed bottom-[50px] h-[200px] w-full text-center">
          {!isConnected ? (
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
                {walletAddressToShow(address)}
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
                <PriceWithIcon
                  priceValue={Number(wethBalance + userTotalCollateral).toFixed(4)}
                  className="text-[20px]"
                  width={22}
                  height={22}
                />
              </div>
              <div
                className="mb-[24px] mt-[11px] text-[14px] font-normal
                text-mediumEmphasis">
                {walletAddressToShow(address)}
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
                  Get WETH
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 h-[50px] w-full px-[50px]">
          {isConnected ? (
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
            className="fixed bottom-[5px] right-[20px]"
            width={40}
            height={40}
            onClick={() => {
              setIsShowMobileMenu(false);
              $isShowMobileModal.set(false);
            }}
          />
        </div>
      </div>

      <div className="snackbar" id="snackbar">
        Copied to clipboard
      </div>

      <div
        className={`transition-left fixed bottom-0 w-full
          ${isSwapWidgetOpen ? 'left-0' : 'left-[100%]'}
          bg-secondaryBlue duration-500
        `}>
        <div className="h-[250px] px-[20px] pb-[6px] pt-[24px] ">
          <div className="font-[600] text-[#fff] ">Bridge ETH / WETH to Arbitrum👇</div>
          <div className="mt-[16px] flex flex-row">
            <div
              className="flex w-auto flex-row 
                items-center justify-center rounded-[4px] border-[1px] border-[#2574FB] 
                px-[12px] py-[6px] align-middle text-[14px] text-[#fff] "
              onClick={() => redirectExternal('https://bridge.arbitrum.io/')}>
              <Image className="mr-[6px]" src="/icons/providers/arbitrum.png" alt="" width={24} height={24} />
              Arbitrum
            </div>
            <div />
          </div>
          <div className="mt-[24px]">
            <div className="font-[600] text-[#fff] ">Wrap ETH on Arbitrum👇</div>
          </div>
          <div className="mt-[16px] flex flex-row">
            <div
              className="flex w-auto flex-row 
                items-center justify-center rounded-[4px] border-[1px] border-[#2574FB] 
                px-[12px] py-[6px] align-middle text-[14px] text-[#fff] "
              onClick={() => redirectExternal('https://app.uniswap.org/#/swap/')}>
              <Image className="mr-[6px]" src="/icons/providers/uniswap.png" alt="" width={24} height={24} />
              Uniswap
            </div>
            <div />
          </div>
          <div className="flex flex-row justify-end">
            <Image
              src="/images/mobile/common/close.svg"
              alt=""
              width={40}
              height={40}
              onClick={() => {
                setIsSwapWidgetOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
