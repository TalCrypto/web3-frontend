/* eslint-disable operator-linebreak */
import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userIsConnected } from '@/stores/user';
import Image from 'next/image';
import { BoxGradient, BoxLocked } from '@/components/common/Box';
import { $userPoint, $userPrevPoint, defaultUserPoint } from '@/stores/airdrop';

function OverviewMobile() {
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
  const isConnected = useNanostore($userIsConnected);

  if (!isConnected) {
    //   return <WalletNotConnected connectWallet={connectWallet} />;
  }

  // testing
  // const tradeVolIsHidden = false;
  const convergIsHidden = false;
  const referralIsHidden = false;
  const ogPointsIsHidden = false;

  const eligible = () => userPoint?.isEligible;

  const tradeVolTotal = userPoint ? userPoint.tradeVol.vol : defaultUserPoint.tradeVol.vol;
  const maxEligibilityTradeVol = Number(5).toFixed(2);

  return (
    <div>
      {eligible() ? (
        <div className="mb-9 flex-1 px-5">
          <h3 className="mb-[24px] flex text-[24px] font-bold">☑️ Eligibility</h3>
          <BoxGradient>
            <div className="flex bg-[right_6rem_bottom] p-6">
              <div>
                <p className="mb-9 text-[14px] font-normal text-highEmphasis">
                  A minimum of <span className="body2e text-seasonGreen">5 WETH</span> notional volume.
                </p>

                <p className="body1e mb-[15px]">
                  {!eligible()
                    ? `${Number(tradeVolTotal).toFixed(2)} / ${maxEligibilityTradeVol} WETH`
                    : `${maxEligibilityTradeVol} / ${maxEligibilityTradeVol} WETH ✅`}
                </p>
                {/* progressbar */}
                <div className="overflow-clip rounded-[5px] border-[1px] border-mediumEmphasis/50 bg-darkBlue/50">
                  <div
                    className="h-[8px] rounded-[5px]"
                    style={{
                      width: eligible() ? '100%' : `${((Number(tradeVolTotal) / 5) * 100).toFixed(2)}%`,
                      background: 'linear-gradient(265.04deg, #F703D9 -10.63%, #795AF4 42.02%, #04AEFC 103.03%)'
                    }}
                  />
                </div>
              </div>
            </div>
          </BoxGradient>
        </div>
      ) : null}

      <div className="bg-darkBlue px-5 pb-9">
        <h3 className="mb-6 text-[24px] font-bold">Season 2 Summary</h3>
        <div className="relative overflow-clip rounded-[6px] bg-gradient-to-r from-gradientBlue via-[#795AF4] to-gradientPink p-[1px]">
          <div className="rounded-[6px] bg-lightBlue">
            <div className="bg-gradient-blue p-9 text-center">
              <p className="text-[20px] font-semibold">Total Pts</p>
              <p className="mb-3 text-[14px] font-normal">with Multiplier</p>
              <div className="flex items-end justify-center">
                <p className="text-glow-green text-[48px] font-bold leading-[48px]">{total.toFixed(1)}</p>
                <p>Pts</p>
              </div>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
            <div className="flex justify-between p-6">
              <div>
                <p className="body2 mb-3">Current Multiplier</p>
                <h3 className="text-[20px] font-normal">{multiplier}X</h3>
              </div>
              <div className="text-right">
                <p className="body2 mb-3">My Rank</p>
                <h3 className="text-[20px] font-normal">{rank > 0 ? rank : 'Unranked'}</h3>
              </div>
            </div>
          </div>
          {/* lock */}
          {!eligible() ? <BoxLocked blur={0} iconClassName="mt-[-120px]" /> : null}
        </div>

        {/* Season 1 Points */}
        <div className="mt-6">
          <div className="overflow-clip rounded-[6px] bg-gradient-to-r from-gradientBlue via-[#795AF4] to-gradientPink p-[1px]">
            <div className="relative rounded-[6px] bg-lightBlue">
              <Image src="/images/components/airdrop/season1-tag.svg" width={60} height={60} alt="" className="absolute left-0 top-0 " />
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-[20px] font-semibold leading-[20px]">Season 1 Points</div>
                  <div className="text-[15px] font-normal leading-[20px]">
                    <span className="text-glow-yellow text-[20px] font-semibold">{prevTotal.toFixed(1)}</span> Pts
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="mr-[6px] text-[15px] font-normal text-mediumEmphasis">06.June.2023</div>
                  <div className="text-[16px] font-semibold text-warn">ENDED</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-darkBlue">
        <div className="mb-1 px-5 text-[20px] font-semibold">Points Details</div>

        {/* Trading Volume */}
        <div className="relative mb-1 flex items-center justify-between px-5 py-2">
          <div className="z-[2] flex flex-row items-center text-[14px]">
            <div className="mr-[6px]">
              <Image src="/images/components/airdrop/trading-vol.svg" width={26} height={26} alt="" />
            </div>
            Trading Vol.
          </div>
          <div className="flex items-center">
            <p className="text-glow-green mr-[6px] text-[20px] font-bold leading-[36px]">{tradeVol.points.toFixed(1)}</p>
            <p className="mt-[3px] text-[15px]">Pts</p>
          </div>
          {!eligible() ? <BoxLocked blur={0} iconWidth={20} iconHeight={20} /> : null}
        </div>

        {/* Referral */}
        <div className="relative mb-1 flex items-center justify-between px-5 py-2">
          <div className="z-[2] flex flex-row items-center text-[14px]">
            <div className="mr-[6px]">
              <Image src="/images/components/airdrop/trading-vol.svg" width={26} height={26} alt="" />
            </div>
            Referral
          </div>

          <div className="flex items-center">
            <p className="text-glow-green mr-[6px] text-[20px] font-bold leading-[36px]">
              {referralIsHidden ? '****' : (referral.referralSelfRewardPoints + referral.referringRewardPoints).toFixed(1)}
            </p>
            <p className="mt-[3px] text-[15px]">Pts</p>
          </div>
          {!eligible() ? <BoxLocked blur={0} iconWidth={20} iconHeight={20} /> : null}
        </div>

        {/* Others */}
        <div className="relative mb-1 flex items-center justify-between px-5 py-2">
          <div className="z-[2] flex flex-row items-center text-[14px]">
            <div className="mr-[6px]">
              <Image src="/images/components/airdrop/trading-vol.svg" width={26} height={26} alt="" />
            </div>
            Others
          </div>

          <div className="flex items-center">
            <p className="text-glow-green mr-[6px] text-[20px] font-bold leading-[36px]">{ogPointsIsHidden ? '****' : og.toFixed(1)}</p>
            <p className="mt-[3px] text-[15px]">Pts</p>
          </div>
          {!eligible() ? <BoxLocked blur={0} iconWidth={20} iconHeight={20} /> : null}
        </div>
      </div>

      <div className="bg-darkBlue">
        <div className="mb-[6px] bg-lightBlue px-5 py-6">
          <div className="mb-4 text-[16px] font-semibold">
            <span className="text-gradient-vertical">Bonus Points</span>
          </div>

          <div className="flex items-center justify-between bg-lightBlue">
            <div className="max-w-[70%]">
              <div className="flex items-center justify-start text-[20px] font-semibold">
                <div className="mr-[6px]">
                  <Image src="/images/components/airdrop/net-conv.svg" width={26} height={26} alt="" />
                </div>
                <span className="text-[14px] font-normal">Net Converg. Trading Vol.</span>
              </div>
            </div>
            <div>
              <div className="relative flex items-center justify-start text-[15px] font-normal">
                <div className="flex items-end text-[15px]">
                  <span className="text-glow-green mr-[6px] text-[20px] font-semibold">
                    {Number(converge.points) > 0 ? '+' : ''} {convergIsHidden ? '****' : converge.points.toFixed(1)}
                  </span>
                  Pts
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[14px] text-mediumEmphasis">
            At the end of the season, bonus points will be added to your total points after multiplier, which will boost your ranking even
            further!
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewMobile;
