import React, { useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { wsFullWalletAddress, wsIsLogin, wsIsWalletLoading, wsIsWrongNetwork, wsWethBalance } from '@/stores/WalletState';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import Link from 'next/link';
import { withRouter } from 'next/router';
// import { localeConversion } from '@/utils/localeConversion';
// import { calculateNumber } from '@/utils/calculateNumbers';
// import { userPoint } from '@/stores/airdrop';
import { $isShowMobileModal } from '@/stores/common';

const MobileMenu = (props: any) => {
  const { setIsShowMobileMenu } = props;
  const isLogin = useNanostore(wsIsLogin);
  const isWalletLoading = useNanostore(wsIsWalletLoading);
  const isWrongNetwork = useNanostore(wsIsWrongNetwork);

  const fullWalletAddress = useNanostore(wsFullWalletAddress);
  const wethBalance = useNanostore(wsWethBalance);

  const [isShowSocialFooter, setIsShowSocialFooter] = useState(false);
  const [isOthersOpen, setIsOthersOpen] = useState(false);
  const { router } = props;

  const walletAddressToShow = (addr: any) => {
    if (!addr) {
      return '';
    }
    return `${addr.substring(0, 7)}...${addr.slice(-3)}`;
  };

  const onBtnConnectClick = () => {
    if (!isLogin) {
      // connectWallet(() => {}, false);
    } else if (isWrongNetwork) {
      // updateTargetNetwork();
    }
  };

  const onBtnDisonnectClick = () => {
    // disconnectWallet(null);
  };

  const onBtnCopyAddressClick = () => {
    navigator.clipboard.writeText(fullWalletAddress);
  };

  const onBtnGetWethClick = () => {
    // getTestToken();
  };

  const onBtnClickSocial = () => {
    setIsShowSocialFooter(!isShowSocialFooter);
  };

  // const userPointData = useNanostore(userPoint);
  // const { total, tradeVol, isBan } = userPointData;
  // const tradeVolume = calculateNumber(tradeVol.vol, 4);
  // const eligible = () => Number(tradeVolume) >= 5;

  // const points = eligible() && !isBan ? localeConversion(total) : '0.0';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-10  h-screen w-full
        overflow-auto bg-lightBlue">
      <div className="flex h-full pt-[18px]">
        <div className="w-full pl-[20px] text-[14px] text-highEmphasis">
          <div className="flex w-full items-center">
            <div className="mr-3 w-[60px]">
              <Image className="mr-[6px]" src="/images/mobile/common/avatar.svg" alt="" width={60} height={60} />
            </div>
            <div className="max-w-[calc(100%-50px)] ">
              <div className="mb-3 overflow-hidden text-ellipsis text-[20px] font-semibold">EMMMMMMMMMMMA</div>
              <span className="w-auto rounded-[12px] bg-[#71562E] px-[8px] py-1 text-[14px] ">
                {/* Points: <span className="font-semibold">{points}</span> */}
              </span>
            </div>
          </div>
          <div className="scrollable mt-[36px] h-[calc(100%-361px)] overflow-y-scroll">
            <div className="pb-[35px]">
              <Link
                href="/portfolio"
                className={`
                ${router.route.toLowerCase() === '/portfolio' ? 'mobile-menu-active font-semibold' : ''}
              `}>
                Portfolio
              </Link>
            </div>
            <div className="pb-[35px]">
              <Link
                href="/trade"
                className={`
                ${router.route.toLowerCase() === '/trade' ? 'mobile-menu-active font-semibold' : ''}
              `}>
                Trade
              </Link>
            </div>
            {/* ${router.route.toLowerCase() === '/others' ? 'mobile-menu-active font-semibold' : ''} */}
            <div className="flex items-center pb-[35px]" onClick={() => setIsOthersOpen(!isOthersOpen)}>
              {/* <Link href="/others">Others</Link> */}
              Others
              <Image
                className={`ml-2 ${isOthersOpen ? 'rotate-90' : ''}`}
                src="/images/mobile/common/angle-right.png"
                alt=""
                width={6}
                height={10}
              />
            </div>
            {isOthersOpen ? (
              <>
                <div className="ml-5 pb-[35px]">
                  <Link
                    href="/airdrop"
                    className={`${router.route.toLowerCase() === '/airdrop' ? 'mobile-menu-active font-semibold' : ''}`}>
                    Avatar
                    <span
                      className="ml-[6px] rounded-[2px] border-[1px] border-comingSoon px-[3px]
                    py-[1px] text-[8px] text-comingSoon">
                      SOON
                    </span>
                  </Link>
                </div>
                <div className="ml-5 pb-[35px]">
                  <Link
                    href="/airdrop"
                    className={`${router.route.toLowerCase() === '/airdrop' ? 'mobile-menu-active font-semibold' : ''}`}>
                    Battle
                    <span
                      className="ml-[6px] rounded-[2px] border-[1px] border-comingSoon px-[3px]
                    py-[1px] text-[8px] text-comingSoon">
                      SOON
                    </span>
                  </Link>
                </div>
              </>
            ) : null}

            <div className="pb-[35px]">
              <Link
                href="/airdrop"
                className={`
            ${router.route.toLowerCase() === '/airdrop' ? 'mobile-menu-active font-semibold' : ''}
            `}>
                Airdrop
              </Link>
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
                  Get WETH
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
    </div>
  );
};

export default withRouter(MobileMenu);
