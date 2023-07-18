/* eslint-disable operator-linebreak */
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userIsConnected } from '@/stores/user';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { BoxGradient, BoxLocked, NewBoxLock } from '@/components/common/Box';
import { $userPoint, $userPrevPoint, defaultUserPoint } from '@/stores/airdrop';
import PrimaryButton from '@/components/common/PrimaryButton';
import Tooltip from '@/components/common/Tooltip';
import { formatBigInt } from '@/utils/bigInt';
import WalletNotConnected from '@/components/airdrop/desktop/WalletNotConnected';

function Overview() {
  const userPoint = useNanostore($userPoint);
  const userPrevPoint = useNanostore($userPrevPoint);

  const rank = userPoint ? userPoint.rank : defaultUserPoint.rank;
  const multiplier = userPoint ? userPoint.multiplier : defaultUserPoint.multiplier;
  const total = userPoint ? userPoint.total : defaultUserPoint.total;
  const tradeVol = userPoint ? userPoint.tradeVol : defaultUserPoint.tradeVol;
  const referral = userPoint ? userPoint.referral : defaultUserPoint.referral;
  const og = userPoint ? userPoint.og : defaultUserPoint.og;
  const converge = userPoint ? userPoint.converge : defaultUserPoint.converge;

  const prevTotal = userPrevPoint ? userPrevPoint.total : defaultUserPoint.total;
  const tradeVolTotal = userPoint ? formatBigInt(userPoint.tradeVolTotal) : formatBigInt(defaultUserPoint.tradeVolTotal);

  const isConnected = useNanostore($userIsConnected);
  const router = useRouter();

  if (!isConnected) {
    return <WalletNotConnected />;
  }

  // testing
  const convergIsHidden = false;
  const referralIsHidden = false;
  const ogPointsIsHidden = false;

  const partnershipMultiplier = Number(tradeVol.multiplier);
  const convergeVolume = convergIsHidden ? 0 : converge.val;
  const eligible = () => userPoint?.eligible;

  const maxEligibilityTradeVol = Number(5).toFixed(2);

  return (
    <div className="flex flex-col-reverse 2xl:flex-row 2xl:space-x-[28px]">
      <div className={`flex flex-1 flex-col ${eligible() ? 'flex-col-reverse' : ''} `}>
        <div className="mb-[48px] flex-1">
          <h3 className="mb-[24px] flex text-[24px] font-bold">Eligibility</h3>
          <BoxGradient>
            <div
              className={`flex bg-[right_6rem_bottom] px-6 py-9 md:px-9 ${
                !eligible() ? '' : "bg-[url('/images/components/airdrop/complete-badge.svg')] bg-no-repeat"
              } `}>
              <div>
                {!eligible() ? (
                  <p className="mb-[36px] text-[14px] font-normal text-highEmphasis">
                    A minimum of <span className="body2e text-seasonGreen">5 WETH</span> notional value.
                  </p>
                ) : (
                  <p className="mb-[36px] text-[14px] font-normal text-highEmphasis">
                    A minimum of <span className="body2e text-seasonGreen">5 WETH</span> lifetime notional volume.
                  </p>
                )}

                <p className="mb-[15px] text-[15px] font-semibold">
                  {!eligible()
                    ? `${tradeVolTotal.toFixed(2)} / ${maxEligibilityTradeVol} WETH`
                    : `${maxEligibilityTradeVol} / ${maxEligibilityTradeVol} WETH ✅`}
                </p>
                {/* progressbar */}
                <div className="w-[350px] rounded-[5px] border-[1px] border-mediumEmphasis/50 bg-darkBlue/50">
                  <div
                    className="h-[8px] rounded-[5px]"
                    style={{
                      width: eligible() ? '100%' : `${((Number(tradeVolTotal) / 5) * 100).toFixed(2)}%`,
                      background: 'linear-gradient(265.04deg, #F703D9 -10.63%, #795AF4 42.02%, #04AEFC 103.03%)'
                    }}
                  />
                </div>
              </div>
              {!eligible() ? (
                <div className="hidden flex-1 items-center justify-end md:flex">
                  <PrimaryButton
                    className="rounded-2 min-w-[72px] px-[20px] py-[12px] text-[14px] font-semibold"
                    onClick={() => router.push('/trade/milady')}>
                    Trade Now !
                  </PrimaryButton>
                </div>
              ) : (
                <div className="hidden flex-1 items-end justify-end md:flex">
                  <p className="text-[18px] font-semibold text-marketGreen">COMPLETED!</p>
                </div>
              )}
            </div>
          </BoxGradient>
        </div>

        <div className="mb-[48px] flex-1">
          <h3 className="mb-[24px] text-[24px] font-bold">Points Details</h3>

          <div>
            <div className="flex flex-row justify-between">
              {/* Trading Volume */}
              <div className="mr-[16px] 2xl:w-[240px] 3xl:w-[256px]">
                <BoxGradient>
                  <div className="relative h-[200px] flex-col pt-[24px]">
                    {!eligible() ? <NewBoxLock /> : null}
                    <div className="px-5">
                      <div className="z-[2] flex flex-row items-center justify-start text-[20px] font-semibold leading-[24px]">
                        <div className="mr-[6px] h-[26px] w-[26px]">
                          <Image src="/images/components/airdrop/trading-vol.svg" width={26} height={26} alt="" />
                        </div>
                        Trading Vol.
                        <span className="ml-[6px] cursor-pointer">
                          <Tooltip
                            direction="top"
                            content={
                              <p className="mx-2 text-center text-b3">
                                Trading Volume (Notional ) will be <br />
                                counted for every action of open <br />
                                position, add position, partially <br />
                                close and fully close position. <br />
                              </p>
                            }>
                            <Image src="/images/components/airdrop/more-info.svg" width={12} height={12} alt="" />
                          </Tooltip>
                        </span>
                      </div>
                      <div className="mt-6">
                        <div
                          className="flex flex-row items-center justify-start
                          text-[15px] font-normal leading-[18px] text-[#A8CBFFBF]">
                          <div className="mr-[6px] h-[16px] w-[16px]">
                            <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
                          </div>
                          {formatBigInt(tradeVol.vol).toFixed(4)}
                        </div>
                        <div className="ml-[26px] mt-[10px] flex items-center justify-start">
                          <Image src="/images/components/airdrop/season2-arrow.svg" width={24} height={24} alt="" />
                        </div>
                      </div>
                      <div className="mt-[11px] flex h-[39px] flex-row items-end">
                        <p className="text-glow-green mr-[6px] text-[32px] font-bold leading-[36px]">{tradeVol.points.toFixed(1)}</p>
                        <p>Pts</p>
                      </div>
                    </div>
                    {partnershipMultiplier > 1 ? (
                      <div
                        className="mt-[3px] flex flex-row items-center
                            justify-center text-[12px] font-semibold text-primaryBlue">
                        {partnershipMultiplier}X partnership multiplier applied
                        <span className="ml-1">
                          <Image src="/images/components/airdrop/checklist.svg" width={10} height={10} alt="" />
                        </span>
                      </div>
                    ) : (
                      <div className="mt-[33px]" />
                    )}
                  </div>
                </BoxGradient>
              </div>

              {/* Referral */}
              <div className="mr-[16px] 2xl:w-[200px] 3xl:w-[256px]">
                <BoxGradient>
                  <div className="relative flex h-[200px] flex-col px-7 py-[24px]">
                    {!eligible() ? <NewBoxLock /> : null}
                    <div className="z-[2] flex flex-row items-center justify-start text-[20px] font-semibold leading-[24px]">
                      <div className="mr-[6px] h-[26px] w-[26px]">
                        <Image src="/images/components/airdrop/referral-blue.svg" width={26} height={26} alt="" />
                      </div>
                      Referral
                      <span className="ml-[6px] cursor-pointer">
                        <Tooltip
                          direction="top"
                          content={
                            <p>
                              Both referee and referrer will <br />
                              get pts through trading.
                            </p>
                          }>
                          <Image src="/images/components/airdrop/more-info.svg" width={12} height={12} alt="" />
                        </Tooltip>
                      </span>
                    </div>
                    <div className="mt-6">
                      <div
                        className="flex flex-row items-center justify-start
                        text-[15px] font-normal leading-[18px] text-[#A8CBFFBF]">
                        {referralIsHidden ? '****' : referral.referralSelfRewardPoints.toFixed(1)} Pts +{' '}
                        {referralIsHidden ? '****' : referral.referringRewardPoints.toFixed(1)} Pts
                      </div>
                      <div className="ml-[26px] mt-[10px] flex items-center justify-start">
                        <Image src="/images/components/airdrop/season2-arrow.svg" width={24} height={24} alt="" />
                      </div>
                    </div>
                    <div className="mt-3 flex h-[39px] flex-row items-end">
                      <p className="text-glow-green mr-[6px] text-[32px] font-bold leading-[36px]">
                        {referralIsHidden ? '****' : (referral.referralSelfRewardPoints + referral.referringRewardPoints).toFixed(1)}
                      </p>
                      <p>Pts</p>
                    </div>
                  </div>
                </BoxGradient>
              </div>

              {/* Others */}
              <div className="2xl:w-[240px] 3xl:w-[256px]">
                <BoxGradient>
                  <div className="relative flex h-[200px] flex-col px-5 py-[24px]">
                    {!eligible() ? <NewBoxLock /> : null}
                    <div className="z-[2] flex flex-row items-center justify-start text-[20px] font-semibold leading-[24px]">
                      <div className="mr-[6px] h-[26px] w-[26px]">
                        <Image src="/images/components/airdrop/og-points.svg" width={26} height={26} alt="" />
                      </div>
                      Others
                    </div>
                    <div>
                      <div
                        className="mt-6 flex flex-row items-center
                          justify-start text-[12px] font-normal text-[#A8CBFFBF]">
                        Tribe3 protocol contribution on beta, communities, campaigns, testnet etc.
                      </div>
                    </div>
                    <div className="mt-3 flex h-[39px] flex-row items-end">
                      <div className="text-glow-green mr-[6px] text-[32px] font-bold leading-[36px]">
                        <p className="text-glow-green text-h4 md:text-h2">{ogPointsIsHidden ? '****' : og.toFixed(1)}</p>
                      </div>
                      <p>Pts</p>
                    </div>
                  </div>
                </BoxGradient>
              </div>
            </div>
          </div>

          <div className="mt-9 text-[16px] font-bold">
            <span className="text-gradient-vertical">Bonus Points</span>
          </div>

          <div className="mt-6 hidden rounded-[16px] bg-gradient-to-r from-gradientBlue to-gradientPink p-[1px] md:block">
            <div className="rounded-[15px] bg-lightBlue px-6 py-9 outline-dashed outline-2 outline-lightBlue">
              <div className="flex flex-row items-center justify-between">
                <div className="max-w-[66%]">
                  <div className="flex flex-row items-center justify-start text-[20px] font-semibold">
                    <div className="mr-[6px] h-[26px] w-[26px]">
                      <Image src="/images/components/airdrop/net-conv.svg" width={26} height={26} alt="" />
                    </div>
                    <span>Net Converg. Trading Vol.</span>
                    <span className="ml-[6px] cursor-pointer">
                      <Tooltip
                        direction="top"
                        content={
                          <p>
                            Trades that help to close the <br />
                            price gap between futures and <br />
                            spot price will be counted as <br />
                            convergence trade.
                          </p>
                        }>
                        <Image src="/images/components/airdrop/more-info.svg" width={12} height={12} alt="" />
                      </Tooltip>
                    </span>
                  </div>
                  <div className="mt-6 text-[15px] font-normal text-[#A8CBFFBF]">
                    At the end of the season, bonus points will be added to your total points after multiplier, which will boost your
                    ranking even further!
                  </div>
                </div>
                <div>
                  <div className="relative flex flex-row items-center justify-start text-[15px] font-normal">
                    {!eligible() ? <NewBoxLock /> : null}
                    <div className="mr-[6px] h-[16px] w-[16px]">
                      <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
                    </div>
                    <span className="text-[#A8CBFFBF]">{convergIsHidden ? '****' : formatBigInt(convergeVolume).toFixed(4)}</span>
                    <Image src="/images/components/airdrop/season2-arrow.svg" width={24} height={24} className="mx-3 -rotate-90" alt="" />
                    <div className="flex flex-row items-center">
                      <span className="text-glow-green text-[16px] font-semibold">
                        {Number(converge.points) > 0 ? '+' : ''} {convergIsHidden ? '****' : converge.points.toFixed(1)}
                      </span>
                      &nbsp;Pts.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-[36px] xl:min-w-[460px]">
        <h3 className="mb-[24px] text-[24px] font-bold">Season 2 Summary</h3>
        <div className="relative rounded-[6px] bg-gradient-to-r from-gradientBlue via-[#795AF4] to-gradientPink p-[1px]">
          <div className="rounded-[6px] bg-lightBlue">
            <div className="bg-gradient-blue p-[52px] text-center">
              <p className="text-[20px] font-semibold">Total Pts</p>
              <p className="mb-[12px] text-[14px] font-normal">After Multiplier</p>
              <div className="flex items-end justify-center">
                <p className="text-glow-green text-[48px] font-bold leading-[48px]">{total.toFixed(1)}</p>
                <p>Pts</p>
              </div>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
            <div className="flex justify-between p-[36px]">
              <div>
                <p className="body2 mb-[12px]">Current Multiplier</p>
                <h3 className="text-[20px] font-bold">{multiplier}X</h3>
              </div>
              <div className="text-right">
                <p className="body2 mb-[12px]">My Rank</p>
                <h3 className="text-[20px] font-bold">{rank > 0 ? rank : 'Unranked'}</h3>
              </div>
            </div>
          </div>
          {/* lock */}
          {!eligible() ? <BoxLocked blur={0} iconClassName="mt-[-120px]" /> : null}
        </div>

        {/* Season 1 Points */}
        <div className="mt-9">
          <div className="rounded-[6px] bg-gradient-to-r from-gradientBlue via-[#795AF4] to-gradientPink p-[1px]">
            <div className="relative rounded-[6px] bg-lightBlue">
              <Image
                src="/images/components/airdrop/season1-bg.svg"
                width={128}
                height={131}
                alt=""
                className="absolute bottom-0 right-[68px]"
              />
              <Image src="/images/components/airdrop/season1-tag.svg" width={64} height={64} alt="" className="absolute left-0 top-0 " />
              <div className="p-[36px]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[20px] font-semibold leading-[20px]">Season 1 Points</div>
                    <div className="mt-3 text-[15px] font-normal leading-[20px]">
                      <span className="text-glow-yellow text-[20px] font-semibold">{prevTotal.toFixed(1)}</span> Pts.
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-[15px] font-normal text-mediumEmphasis">06.June.2023</div>
                    <div className="mt-2 text-[16px] font-semibold text-warn">ENDED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
