/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { $asHasReferCode, $asReferResponse, $referralList, $userPoint, defaultUserPoint } from '@/stores/airdrop';
import { useStore as useNanostore } from '@nanostores/react';
import MobileTooltip from '@/components/common/mobile/Tooltip';
import { $userIsConnected } from '@/stores/user';
import PrimaryButton from '@/components/common/PrimaryButton';
import { useWeb3Modal } from '@web3modal/react';
import ReferUserMobileModal from '@/components/airdrop/mobile/ReferUserMobileModal';
import ShareMobileModal from '@/components/airdrop/mobile/ShareMobileModal';
import ResponseModal from '@/components/airdrop/mobile/ResponseModal';
import { useConnect } from 'wagmi';

function ReferralMobile() {
  const router = useRouter();
  const userPointData = useNanostore($userPoint);
  const hasReferCode = useNanostore($asHasReferCode);
  const referralListData = useNanostore($referralList);
  const referResponse = useNanostore($asReferResponse);

  const userPoint = userPointData || defaultUserPoint;

  const { referralCode } = userPoint;
  const totalReferralPoint = Number(userPoint.referral.referralSelfRewardPoints) + Number(userPoint.referral.referringRewardPoints);
  const totalReferees = userPoint.referredUserCount;
  const eligibleReferees = userPoint.eligibleCount;
  const eligible = () => userPoint?.eligible;
  const isReferralListEmpty = referralListData.length === 0;

  const isConnected = useNanostore($userIsConnected);
  const [isReferralPopupShow, setIsReferralPopupShow] = useState(false);

  const { connect, connectors } = useConnect();
  const { open } = useWeb3Modal();

  const eligibleTooltipMessage = (
    <>
      You must have a minimum <br /> trading volume of 5 WETH notional <br /> to unlock all the points!
    </>
  );
  const tooltipMessage = (
    <>
      Total referral points includes 3% <br />
      of your referees’ trading volume <br />
      points and 2 % bonus points <br />
      on your trading volume
    </>
  );

  const onBtnConnectWallet = () => {
    let isInjected = false;

    for (let i = 0; i < connectors.length; i += 1) {
      const connector = connectors[i];
      if (connector?.id.includes('injected')) {
        connect({ connector });
        isInjected = true;
        break;
      }
    }

    if (!isInjected) {
      open();
    }
  };

  if (!isConnected) {
    return (
      <div className="flex h-[calc(100dvh-325px)] flex-col items-center">
        <p className="mb-6 mt-4">Please connect wallet to get started!</p>
        <PrimaryButton className="px-[14px] py-[7px] !text-[14px] font-semibold" onClick={onBtnConnectWallet}>
          Connect Wallet
        </PrimaryButton>

        {hasReferCode ? <ReferUserMobileModal /> : null}
      </div>
    );
  }

  const copyTextFunc = (text: any) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    }
  };

  const copyCode = (targetElement: any, text = '', isUrlOnly = true) => {
    if (isReferralPopupShow) {
      setIsReferralPopupShow(false);
    }
    // setTargetTooltip(targetElement);
    copyTextFunc(`${isUrlOnly ? 'https://app.tribe3.xyz/airdrop/refer?ref=' : ''}${text || referralCode}`);
    // notifyCopyLink();
  };

  const shareToCopyText = () => `📢 Use my referral link to enjoy extra Tribe3 points!
  🎉 Long & short Blue-chips NFTs with leverage at any amount on ${referralCode?.toUpperCase()}`;

  const shareToTwitter = () => {
    // logHelper('reward_my_referral_code_share_twitter_pressed', walletProvider.holderAddress, { page: 'Reward' });
    setIsReferralPopupShow(false);
    const encodeItem = `🎉 Long & short Blue-chips NFTs with leverage at any amount on
      https://app.tribe3.xyz/airdrop/refer?ref=${referralCode?.toUpperCase()}
      \n📢 Use my referral link to enjoy extra Tribe3 points!
      \n@Tribe3Official`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(encodeItem)}`);
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex h-fit basis-1/2 flex-col bg-darkBlue">
          {/* Share */}
          <div
            className="relative flex h-fit flex-1 rounded-[6px]
              border-[#71AAFF]/20 bg-lightBlue px-5 py-6">
            <div className="flex-1">
              <h3 className="mb-6 text-[20px] font-semibold">📢 My Referral Link</h3>
              <p className="mb-6 text-[14px] font-normal text-highEmphasis">
                Share you referral code to get 3% of their trading volume points, while they can get 2% of their own trading volume points!
              </p>
              <div
                className="border-1 mb-6 flex h-[48px] flex-1 items-center justify-between rounded-[4px]
                  border-[#2E4371]/20 bg-secondaryBlue px-4 py-2">
                <span className="text-[12px] font-normal text-mediumEmphasis">
                  {`https://app.tribe3.xyz/airdrop/refer?ref=${referralCode}`}
                </span>
                <div className="flex">
                  <Image
                    onClick={() => setIsReferralPopupShow(true)}
                    className="cursor-pointer"
                    src="/images/components/airdrop/share-white.svg"
                    alt=""
                    width={20}
                    height={20}
                  />

                  <Image
                    onClick={e => copyCode(e.target)}
                    className="ml-4 mr-0 cursor-pointer"
                    src="/images/components/airdrop/copy-white.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                </div>
              </div>

              <div className="rounded-[6px] bg-gradient-to-r from-gradientBlue to-gradientPink p-[1px]">
                <div className="rounded-[6px] bg-lightBlue px-4 py-6 outline-dashed outline-2 outline-lightBlue">
                  <div className="flex flex-row items-center justify-between">
                    <div className="mr-2 flex flex-col">
                      <div className="text-[14px] font-semibold">🎁 You Will Get</div>
                      <div
                        className="mt-4 max-w-[194px] rounded-[12px] border-[1px] border-mediumEmphasis/50
                        bg-gradient-to-r from-[#F703D94D] via-[#795AF44D] to-[#04AEFC4D] px-6 py-3">
                        <div className="mb-3">
                          <div className="flex flex-row items-center justify-between leading-[32px]">
                            <div className="flex flex-row items-end text-start">
                              <div className="flex-row items-center">
                                <span className="text-glow-green text-[32px] font-semibold">3</span>
                                &nbsp; &nbsp;
                                <span className="text-glow-green text-[20px] font-semibold">%</span>
                              </div>
                            </div>
                            <Image src="/images/components/airdrop/tribe.svg" alt="" width={26} height={26} className="ml-[6px] mr-0" />
                          </div>
                        </div>
                        <div className="text-[12px] leading-[16px]">
                          of your referees’ <br />
                          trading volume <br />
                          points
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-[14px] font-semibold">🎁 Referees Will Get</div>
                      <div
                        className="mt-4 max-w-[194px] rounded-[12px] border-[1px] border-mediumEmphasis/50
                        bg-gradient-to-r from-[#F703D94D] via-[#795AF44D] to-[#04AEFC4D] px-6 py-3">
                        <div className="mb-3">
                          <div className="flex flex-row items-center justify-between leading-[32px]">
                            <div className="flex flex-row items-end text-start">
                              <div className="flex-row items-center">
                                <span className="text-glow-green text-[32px] font-semibold">2</span>
                                &nbsp; &nbsp;
                                <span className="text-glow-green text-[20px] font-semibold">%</span>
                              </div>
                            </div>
                            <Image src="/images/components/airdrop/tribe.svg" alt="" width={32} height={32} className="ml-[6px] mr-0" />
                          </div>
                        </div>
                        <div className="text-[12px] leading-[16px]">
                          of their own <br />
                          trading volume <br />
                          points
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left */}
          <div className="mb-9 mt-1 flex h-fit basis-1/2 flex-col">
            {/* Referral Points */}
            <div className="border-1 h-fit flex-1 flex-col-reverse rounded-[6px] border-[#71AAFF]/20 bg-lightBlue">
              <div className="flex-1">
                <div className="flex items-center justify-between px-5 py-6">
                  <h3 className="text-[20px] font-semibold">My Referral Pts</h3>
                </div>
                <div className="mx-5 flex flex-col pb-6 text-[20px]">
                  <div className="flex flex-row">
                    <span className="text-[14px]">Referral Total Pts.</span>
                    <MobileTooltip direction="top" content={tooltipMessage}>
                      <Image src="/images/components/airdrop/more-info.svg" alt="" className="ml-[6px] mr-0" width={16} height={16} />
                    </MobileTooltip>
                  </div>
                  <div className="mt-3 flex flex-row">
                    {!eligible() ? (
                      <div>
                        <MobileTooltip direction="top" content={eligibleTooltipMessage}>
                          <div className="flex flex-row items-center">
                            <Image
                              src="/images/components/airdrop/lock.svg"
                              alt=""
                              className="mr-[10px] h-[24px] w-[20px] "
                              width={20}
                              height={24}
                            />
                            <div className={`text-[15px] font-normal ${!eligible() ? 'opacity-50' : ''}`}>
                              <span className="text-glow-green mr-[6px] text-[20px] font-semibold">{totalReferralPoint.toFixed(1)}</span>Pts
                            </div>
                          </div>
                        </MobileTooltip>
                      </div>
                    ) : (
                      <div className={`flex flex-row items-end ${!eligible() ? 'opacity-50' : ''}`}>
                        <h2 className="text-glow-green text-[32px] font-bold">{totalReferralPoint.toFixed(1)}</h2>&nbsp; Pts
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t-[1px] border-[#2E4371]" />

                <div className="flex flex-col px-5 py-6 ">
                  <div className="flex flex-row">
                    <div className="flex basis-1/2 flex-col text-[14px]">
                      <div>3% Referees&#39; Pts</div>
                      <div className="mt-[12px] text-[15px]">
                        <span className="text-glow-green font-semibold">{userPoint.referral.referringRewardPoints.toFixed(1)}</span>
                        &nbsp; Pts.
                      </div>
                    </div>
                    <div className="flex basis-1/2 flex-col text-[14px]">
                      <div>2% own trading Pts.</div>
                      <div className="mt-[12px] text-[15px]">
                        <span className="text-glow-green font-semibold">{userPoint.referral.referralSelfRewardPoints.toFixed(1)}</span>
                        &nbsp; Pts.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligible Lists */}
            <div className="border-1 mt-8 flex h-fit flex-1 rounded-[6px] border-[#71AAFF]/20">
              <div className="flex-1">
                <div className="px-5 py-6">
                  <div>
                    <h3 className="mb-6 text-[20px] font-semibold">My Referees</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[14px]">Eligible / Total Referees </div>
                    <div className="mt-[6px] ">
                      <span className="text-glow-green text-[20px] font-semibold">{eligibleReferees}</span>&nbsp;/&nbsp;
                      <span>{totalReferees}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="px-5 py-6">
                    <h5 className="text-[15px] font-semibold">{`Referred Users (${referralListData.length})`}</h5>
                  </div>
                  <div className="flex px-5 pb-3 text-[14px] text-mediumEmphasis ">
                    <div className="basis-8/12">User ID</div>
                    <div className="basis-4/12 text-right">Status</div>
                  </div>
                  {isReferralListEmpty ? (
                    <div className="flex min-h-[100px] items-center justify-center">
                      <div className="text-center text-[15px] text-mediumEmphasis">
                        List is empty,
                        <br /> start sharing your code now!
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="scrollable max-h-[315px] overflow-y-scroll">
                        {referralListData.map((item: any) => {
                          const displayUsername =
                            item.username === ''
                              ? `${item.userAddress.substring(0, 7)}...${item.userAddress.slice(-3)}`
                              : item.username.length > 10
                              ? `${item.username.substring(0, 10)}...`
                              : item.username;
                          const eligibleStatus = item.eligiable ? 'Eligible' : 'Not Eligible';
                          const redirect = () => {
                            window.location.href = `/userprofile/${item.userAddress}`;
                          };

                          return (
                            <div className="flex cursor-pointer px-5 py-3 text-[14px] [&:nth-child(odd)]:bg-[#202249]" onClick={redirect}>
                              <div className="flex basis-8/12 flex-row">
                                <div className="mr-2 h-auto w-[3px] self-stretch rounded-[30px] bg-[#2574FB]" />
                                {displayUsername}
                              </div>
                              <div className="basis-4/12 text-right">{eligibleStatus}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="px-9 pt-4 text-[12px] text-mediumEmphasis ">
                        Referees with at least 5 WETH trading volume will be counted as eligible referees.&nbsp;
                        <span className="cursor-pointer font-semibold text-blue-500" onClick={() => router.push('/airdrop/rules')}>
                          View Rules
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReferralPopupShow ? (
        <ShareMobileModal
          setIsShow={setIsReferralPopupShow}
          referralCode={referralCode}
          copyCode={copyCode}
          shareToTwitter={shareToTwitter}
          shareToCopyText={shareToCopyText}
        />
      ) : null}

      {hasReferCode ? <ReferUserMobileModal /> : null}
      {referResponse !== 0 ? <ResponseModal /> : null}
    </div>
  );
}

export default ReferralMobile;
