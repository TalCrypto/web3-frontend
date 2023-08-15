/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { $asHasReferCode, $asReferResponse, $referralList, $userPoint, defaultUserPoint } from '@/stores/airdrop';
import { useStore as useNanostore } from '@nanostores/react';
import { $userIsConnected } from '@/stores/user';
import { toast } from 'react-toastify';
import PrimaryButton from '@/components/common/PrimaryButton';
import ReferUserModal from '@/components/airdrop/desktop/ReferUserModal';
import ResponseModal from '@/components/airdrop/desktop/ResponseModal';
import ShareModal from '@/components/airdrop/desktop/ShareModal';
import Tooltip from '@/components/common/Tooltip';
import { formatBigInt } from '@/utils/bigInt';
import { useWeb3Modal } from '@web3modal/react';
import { $isShowLoginModal } from '@/stores/modal';

function Referral() {
  const router = useRouter();
  const userPointData = useNanostore($userPoint);
  const hasReferCode = useNanostore($asHasReferCode);
  const referResponse = useNanostore($asReferResponse);

  const [targetTooltip, setTargetTooltip] = useState(null);
  const [isReferralPopupShow, setIsReferralPopupShow] = useState(false);

  const isConnected = useNanostore($userIsConnected);
  const referralListData = useNanostore($referralList);

  const userPoint = userPointData || defaultUserPoint;

  const { referralCode } = userPoint;
  const totalReferralPoint = Number(userPoint.referral.referralSelfRewardPoints) + Number(userPoint.referral.referringRewardPoints);
  const totalReferees = userPoint.referredUserCount;
  const eligibleReferees = userPoint.eligibleCount;
  const eligible = () => userPoint?.eligible;
  const isReferralListEmpty = referralListData.length === 0;

  const { open } = useWeb3Modal();

  const eligibleTooltipMessage = (
    <>
      You must have a minimum <br />
      trading volume of 5 WETH notional <br />
      to unlock all the points!
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

  const toastSuccess = (message: any) =>
    toast(
      <div className="flex flex-row items-center justify-center">
        <Image src="/images/components/airdrop/toast/toast-success.png" width={20} height={20} alt="" className="mr-[10px]" />
        {message}
      </div>,
      {
        containerId: 'AIRDROP'
      }
    );

  const notifyCopyLink = () => toastSuccess('Copy Successfully!');

  const copyTextFunc = (text: any) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    }
  };

  const copyCode = (targetElement: any, text = '', isUrlOnly = true) => {
    if (isReferralPopupShow) {
      setIsReferralPopupShow(false);
    }
    setTargetTooltip(targetElement);
    copyTextFunc(`${isUrlOnly ? 'https://app.tribe3.xyz/airdrop/refer?ref=' : ''}${text || referralCode}`);
    notifyCopyLink();
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

  const onBtnConnectWallet = () => {
    $isShowLoginModal.set(true);
  };

  if (!isConnected) {
    return (
      <div className="flex h-[calc(100dvh-400px)] flex-col items-center">
        <p className="mb-6 mt-4">Please connect wallet to get started!</p>
        <PrimaryButton className="px-[14px] py-[7px] !text-[14px] font-semibold" onClick={onBtnConnectWallet}>
          Connect Wallet
        </PrimaryButton>

        {hasReferCode ? <ReferUserModal /> : null}
      </div>
    );
  }

  return (
    <div className="container p-0 pt-7">
      <div className="flex flex-col xl:flex-row xl:space-x-[24px]">
        {/* Left */}
        <div className="mb-[36px] flex h-fit basis-1/2 flex-col xl:flex-col">
          {/* Referral Points */}
          <div className="border-1 h-fit flex-1 flex-col-reverse rounded-[6px] border-[#71AAFF]/20 bg-lightBlue/50">
            <div className="flex-1">
              <div className="flex items-center justify-between px-[24px] py-[24px] md:p-[36px] xl:px-[36px]">
                <h3>My Referral Pts</h3>
                <span className="cursor-pointer font-semibold text-blue-500" onClick={() => router.push('/airdrop/rules')}>
                  View Rules
                </span>
              </div>
              <div className="relative flex flex-col items-center justify-center px-6 pb-6">
                <div className="flex flex-row">
                  <span className="text-[14px]">Referral Total Pts</span>
                  <Tooltip content={tooltipMessage} direction="top">
                    <Image
                      src="/images/components/airdrop/more-info.svg"
                      alt=""
                      className="ml-[6px] mr-0 cursor-pointer"
                      width={16}
                      height={16}
                    />
                  </Tooltip>
                </div>
                <div className="mt-3 flex flex-row items-center">
                  {!eligible() ? (
                    <div>
                      <Tooltip content={eligibleTooltipMessage} direction="top">
                        <div className="flex flex-row items-center">
                          <Image
                            src="/images/components/airdrop/lock.svg"
                            alt=""
                            className="mr-[10px] h-[24px] w-[20px] cursor-pointer"
                            width={20}
                            height={24}
                          />
                          <div className={`flex flex-row items-end ${!eligible() ? 'opacity-50' : ''}`}>
                            <h2 className="text-glow-green text-[32px] font-bold">{totalReferralPoint.toFixed(1)}</h2>&nbsp; Pts
                          </div>
                        </div>
                      </Tooltip>
                    </div>
                  ) : (
                    <div className={`flex flex-row items-end ${!eligible() ? 'opacity-50' : ''}`}>
                      <h2 className="text-glow-green text-[32px] font-bold">{totalReferralPoint.toFixed(1)}</h2>&nbsp; Pts
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t-[1px] border-[#2E4371]" />
              <div className="flex flex-col px-[24px] py-[24px] xl:px-[36px]">
                <div className="flex flex-row">
                  <div className="flex basis-1/2 flex-col text-[14px]">
                    <div>3% referees&#39; points</div>
                    <div className="mt-[12px] text-[15px]">
                      <span className="text-glow-green font-semibold">{userPoint.referral.referringRewardPoints.toFixed(1)}</span>
                      &nbsp; Pts
                    </div>
                  </div>
                  <div className="flex basis-1/2 flex-col text-[14px]">
                    <div>2% own trading points</div>
                    <div className="mt-[12px] text-[15px]">
                      <span className="text-glow-green font-semibold">{userPoint.referral.referralSelfRewardPoints.toFixed(1)}</span>
                      &nbsp; Pts
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Eligible Lists */}
          <div className="border-1 mt-8 flex h-fit flex-1 rounded-[6px] border-[#71AAFF]/20 bg-lightBlue/50">
            <div className="flex-1">
              <div className="flex items-center justify-between px-[24px] py-[24px] md:p-[36px] xl:px-[36px] xl:py-[36px]">
                <div>
                  <h3>My Referees</h3>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[14px]">Eligible Referees / Total Referees </div>
                  <div className="mt-[6px] ">
                    <span className="text-glow-green text-[20px] font-semibold">{eligibleReferees}</span>&nbsp;/&nbsp;
                    <span>{totalReferees}</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#20224980]">
                <div className="px-[24px] py-[24px] xl:px-[36px] xl:py-[36px] ">
                  <h5>{`Referred Users (${referralListData.length})`}</h5>
                </div>
                <div className="flex px-[24px] pb-[12px] text-[14px] text-mediumEmphasis xl:px-[36px]">
                  <div className="basis-4/12">User ID</div>
                  <div className="basis-3/12">Status</div>
                  <div className="basis-2/12">Trading Vol.</div>
                  <div className="basis-3/12 text-right">Pts to Referrer</div>
                </div>
                {isReferralListEmpty ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <div className="text-[15px] text-mediumEmphasis">List is empty, start sharing your code now!</div>
                  </div>
                ) : (
                  <div>
                    <div className="scrollable h-[315px] overflow-y-scroll">
                      {referralListData.map((item: any) => {
                        const displayUsername =
                          item.username === ''
                            ? `${item.userAddress.substring(0, 7)}...${item.userAddress.slice(-3)}`
                            : item.username.length > 10
                            ? `${item.username.substring(0, 10)}...`
                            : item.username;
                        const eligibleStatus = item.eligiable ? 'Eligible' : 'Not Eligible';
                        const volume = formatBigInt(item.tradeVol).toFixed(4);
                        const referralPoints = Number(item.referringRewardPoints).toFixed(1);
                        const redirect = () => {
                          window.location.href = `/userprofile/${item.userAddress}`;
                        };
                        return (
                          <div
                            className="flex cursor-pointer px-[24px] py-[12px] text-[14px]
                            font-normal xl:px-[36px] [&:nth-child(odd)]:bg-[#202249]"
                            onClick={redirect}>
                            <div className="flex basis-4/12 flex-row">
                              <div className="mr-[8px] h-auto w-[3px] self-stretch rounded-[30px] bg-[#2574FB]" />
                              {displayUsername}
                            </div>
                            <div className="basis-3/12">{eligibleStatus}</div>
                            <div className="flex basis-2/12 flex-row items-center">
                              <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={14} height={14} className="mr-1" />
                              <div>{volume}</div>
                            </div>
                            <div className="basis-3/12 text-right font-semibold text-seasonGreen">{`${referralPoints} pts`}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-[36px] pb-[36px] pt-[16px] text-[12px] text-mediumEmphasis ">
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

        {/* Right */}
        <div className="mb-[36px] flex h-fit basis-1/2 flex-col">
          {/* Share */}
          <div
            className="border-1 bg-gradient-blue-referral relative flex h-fit flex-1
              rounded-[6px] border-[#71AAFF]/20 bg-[#202249] p-[24px] md:p-[36px] ">
            <Image
              src="/images/components/airdrop/refer-share-bg.svg"
              alt=""
              className="absolute right-[48px] top-[0px] "
              width={120}
              height={140}
            />
            <div className="flex-1">
              <h3 className="mb-[24px]">📢 My Referral Link</h3>
              <p className="body2 mb-[36px] text-[14px] font-normal">
                Share you referral code to get 3% of their trading volume points, while they can get 2% of their own trading volume points!
              </p>
              <div className="mb-[36px] flex items-center space-x-[12px] md:space-x-[24px]">
                <div
                  className="border-1 flex h-[48px] flex-1 items-center justify-between
                    rounded-[4px] border-[#2E4371]/20 bg-[#0C0D20] px-[16px] py-[8px]">
                  <span className="text-[12px] font-normal text-[#A8CBFFBF]">
                    {`https://app.tribe3.xyz/airdrop/refer?ref=${referralCode}`}
                  </span>
                  <Image
                    className="ml-[6px] mr-0 cursor-pointer"
                    src="/images/components/airdrop/copy-white.svg"
                    alt=""
                    width={16}
                    height={16}
                    onClick={e => copyCode(e.target)}
                  />
                </div>
                <PrimaryButton
                  className="rounded-2 body1e h-[48px] w-[48px] bg-primaryBlue px-[8px] py-[8px]"
                  onClick={() => setIsReferralPopupShow(true)}>
                  <Image className="cursor-pointer" src="/images/components/airdrop/share-white.svg" alt="" width={24} height={24} />
                </PrimaryButton>
              </div>

              <div className="hidden rounded-[16px] bg-gradient-to-r from-gradientBlue to-gradientPink p-[1px] md:block">
                <div className="rounded-[15px] bg-lightBlue p-[24px] outline-dashed outline-2 outline-lightBlue">
                  <div className="flex flex-row items-center">
                    <div className="flex flex-col ">
                      <div className="text-[14px]">🎁 You Will Get</div>
                      <div
                        className="mt-[16px] max-w-[194px] rounded-[12px] border-[1px]
                        border-mediumEmphasis/50 bg-gradient-to-r from-[#F703D94D]
                        via-[#795AF44D] to-[#04AEFC4D] px-[24px] py-[20px] text-[12px] ">
                        <div className="mb-[12px]">
                          <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-row items-end text-start">
                              <div className="flex-row items-center">
                                <span
                                  className="text-glow-green shadow-referral text-[32px]
                                  font-semibold">
                                  3
                                </span>
                                &nbsp; &nbsp;
                                <span
                                  className="text-glow-green shadow-referral text-[20px]
                                  font-semibold">
                                  %
                                </span>
                              </div>
                            </div>
                            <Image src="/images/components/airdrop/tribe.svg" alt="" width={26} height={26} className="ml-[6px] mr-0" />
                          </div>
                        </div>
                        <span className="shadow-referral">of your referees’ trading volume points</span>
                      </div>
                    </div>
                    <div className="mx-9 h-auto w-[1px] self-stretch bg-[#2E4371]" />
                    <div className="flex flex-col">
                      <div className="text-[14px]">🎁 Referees Will Get</div>
                      <div
                        className="mt-[16px] max-w-[194px] rounded-[12px]
                        border-[1px] border-mediumEmphasis/50 bg-gradient-to-r
                        from-[#F703D94D] via-[#795AF44D] to-[#04AEFC4D]
                        px-[24px] py-[20px] text-[12px] ">
                        <div className="mb-[12px]">
                          <div className="flex flex-row items-center justify-between">
                            <div className="flex flex-row items-end text-start">
                              <div className="flex-row items-center">
                                <span className="text-glow-green shadow-referral text-[32px] font-semibold">2</span>
                                &nbsp; &nbsp;
                                <span className="text-glow-green shadow-referral text-[20px] font-semibold">%</span>
                              </div>
                            </div>
                            <Image src="/images/components/airdrop/tribe.svg" alt="" width={26} height={28} className="ml-[6px] mr-0" />
                          </div>
                        </div>
                        <span className="shadow-referral">of their own trading volume points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isReferralPopupShow ? (
        <ShareModal
          setIsShow={setIsReferralPopupShow}
          referralCode={referralCode}
          copyCode={copyCode}
          shareToTwitter={shareToTwitter}
          shareToCopyText={shareToCopyText}
        />
      ) : null}

      {hasReferCode ? <ReferUserModal /> : null}
      {referResponse !== 0 ? <ResponseModal /> : null}
    </div>
  );
}

export default Referral;
