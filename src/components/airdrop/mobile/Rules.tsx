import React from 'react';
import { BoxGradient, BoxGradientBluePink } from '@/components/common/Box';
import Image from 'next/image';

function RulesMobile() {
  return (
    <div className="bg-darkBlue">
      <div className="">
        {/* Tribe3 Airdrop Season 2  - Rules */}
        <div className="mb-9 px-5">
          <h3 className="mb-6 text-[20px] font-semibold">Tribe3 Airdrop Season 2 - Rules</h3>

          <h5 className="mb-6 text-[15px] font-semibold">The wait is over! 🎉</h5>
          <p className="text-[14px] leading-[24px]">
            Tribe3 mainnet is live and users will be entitled to Tribe3 token airdrop by trading on Tribe3. <br />
            The more Tribe3 points, more Tribe3 token you will get.
          </p>
        </div>

        {/* How to get Tribe3 Points ⬇️ */}
        <div className="relative mb-6 px-5">
          <h3 className="mb-6 text-[16px] font-semibold">How to get Tribe3 Points ⬇️</h3>
          <div className="mb-9">
            <BoxGradient>
              <div className="flex min-h-[112px] items-center space-x-[12px] p-[24px]">
                <div className="flex w-[100px] flex-col items-center">
                  <div className="mb-2">
                    <Image src="/images/components/airdrop/approved.svg" width={48} height={48} alt="" />
                  </div>
                  <h5 className="text-center text-[15px] font-semibold text-highEmphasis">Eligibility</h5>
                </div>

                <div className="flex flex-1 items-center">
                  <p className="text-b2 leading-[20px]">
                    Users must have a minimum trading volume of <span className="text-b2e">5 WETH notional</span> to unlock all the points!
                  </p>
                </div>
              </div>
            </BoxGradient>
          </div>

          <div className="absolute left-[14px] top-[170px] z-10 h-[113px] w-[30px]">
            <Image src="/images/components/airdrop/arrow-curved.svg" width={24} height={80} alt="" />
          </div>
        </div>

        <div className="mb-9 px-5">
          <BoxGradient>
            <div className="flex min-h-[112px] items-center space-x-[12px] p-[24px]">
              <div className="mt-1 flex w-[100px] flex-col items-center">
                <div className="mb-2">
                  <Image src="/images/components/airdrop/holding-box.svg" width={48} height={48} alt="" />
                </div>
                <h5 className="text-center text-[15px] font-semibold text-highEmphasis">4 Ways to Get Pts</h5>
              </div>

              <div className="mt-2 flex flex-1 items-center">
                <p className="text-[14px] font-normal leading-[20px]">
                  a. Trading Volume <br />
                  b. Converg. Trading Vol. <br />
                  c. Referral <br />
                  d. Others.
                </p>
              </div>
            </div>
          </BoxGradient>
        </div>

        {/* a. Trading Volume Points */}
        <div className="mb-6 px-5">
          <h4 className="mb-6 text-[15px] font-semibold">a. Trading Volume Points</h4>
          <div className="mb-6 flex flex-col space-y-[24px]">
            <div className="flex items-center space-x-[8px] text-center">
              <div
                className="flex min-h-[130px] min-w-[120px] flex-1 flex-col items-center
                        justify-center rounded-[12px] border-[1px] border-warn p-[8px]">
                <Image src="/images/components/airdrop/ethereum.svg" width={36} height={36} alt="" />
                <h5 className="mt-[10px] text-[15px] font-semibold">1 WETH </h5>
                <p className="mt-1 text-[12px] font-normal">Notional Trading Vol.</p>
              </div>
              <div className="text-[32px]">=</div>
              <div className="min-h-[130px] min-w-[120px] flex-1">
                <BoxGradientBluePink borderWidth={1}>
                  <div className="flex min-h-[130px] min-w-[120px] flex-col items-center justify-center p-[8px]">
                    <Image src="/images/components/airdrop/tribe.svg" width={36} height={36} alt="" />
                    <h5 className="mt-[10px] text-[15px] font-semibold">10 Pts </h5>
                    <p className="mt-1 text-[12px] font-normal">Tribe3 Points.</p>
                  </div>
                </BoxGradientBluePink>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-mediumEmphasis">
                <ul className="ml-4 list-disc text-[14px] font-normal">
                  <li>Earn X points for every 1 WETH notional trading volume.</li>
                  <li>
                    Notional Trading Volume will be counted for every action of open position, add position, partially close and fully close
                    position.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-lightBlue px-5 py-9">
          {/* b. Net Convergence Trading Volume Points */}
          <h4 className="mb-6 text-[15px] font-semibold">b. Net Convergence Trading Volume Points</h4>
          <div className="flex flex-col space-y-[24px]">
            <div className="flex items-center space-x-[8px] text-center">
              <div
                className="flex min-h-[130px] min-w-[120px] flex-1 flex-col items-center
                        justify-center rounded-[12px] border-[1px] border-warn px-2 py-3">
                <Image src="/images/components/airdrop/ethereum.svg" width={36} height={36} alt="" />
                <h5 className="mt-[10px] text-[15px] font-semibold">1 WETH </h5>
                <p className="mt-1 text-[12px] font-normal">
                  Net Notional <br /> Converg. Trading Vol.
                </p>
              </div>
              <div className="text-[32px]">=</div>
              <div className="min-h-[130px] min-w-[120px] flex-1">
                <BoxGradientBluePink borderWidth={1}>
                  <div
                    className="flex min-h-[130px] min-w-[120px] flex-col items-center
                          justify-center p-[8px]">
                    <Image src="/images/components/airdrop/tribe.svg" width={36} height={36} alt="" />
                    <h5 className="mt-[10px] text-[15px] font-semibold">100 Pts </h5>
                    <p className="mt-1 text-[12px] font-normal">Tribe3 Points.</p>
                  </div>
                </BoxGradientBluePink>
              </div>
            </div>

            <div className="flex-1">
              <div className="text-[15px] font-semibold text-mediumEmphasis">
                <ul className="ml-4 list-disc text-[14px] font-normal">
                  <li>Earn 100 points for every +1 WETH Net Notional Convergence Trading Volume.</li>
                  <li>
                    Trades that close the price gap between vAMM price and oracle price will be counted as converging trades, while trades
                    that increase the price gap will be identified as diverging trades.
                  </li>
                  <li>If the trade over-closes the price gap, the volume that is over-closed will be counted as a diverging trade.</li>
                  <li>Users will receive 0 points if they have a negative net converging trade volume.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* c. Referral Points */}
        <div className="mb-9 px-5">
          <div className="flex flex-col">
            <h4 className="mb-6 text-[15px] font-semibold">c. Referral Points</h4>

            <div className="mb-6 flex items-center space-x-[8px] text-center">
              <div className="flex flex-1 flex-col">
                <BoxGradientBluePink borderWidth={1}>
                  <div
                    className="flex min-h-[130px] min-w-[120px] flex-1 flex-col
                          items-center justify-center">
                    <Image src="/images/components/airdrop/tribe.svg" width={36} height={36} alt="" />
                    <h5 className="mt-[10px] text-[15px] font-semibold">X Pts * 3%</h5>
                    <p className="mt-1 text-[12px] font-normal">
                      Eligible Referees’ <br /> Trading Points.
                    </p>
                  </div>
                </BoxGradientBluePink>
                <div className="my-[-10px] text-[32px] font-medium">+</div>
                <BoxGradientBluePink borderWidth={1}>
                  <div
                    className="flex min-h-[130px] min-w-[120px] flex-1 flex-col
                          items-center justify-center">
                    <Image src="/images/components/airdrop/tribe.svg" width={36} height={36} alt="" />
                    <h5 className="mt-[10px] text-[15px] font-semibold">Y Pts * 2% </h5>
                    <p className="mt-1 text-[12px] font-normal">
                      Your Own <br /> Trading Points.{' '}
                    </p>
                  </div>
                </BoxGradientBluePink>
              </div>
              <div className="text-[32px]">=</div>
              <div className="flex-1">
                <BoxGradientBluePink borderWidth={1}>
                  <div
                    className="flex min-h-[130px] min-w-[120px] flex-1 flex-col
                        items-center justify-center">
                    <Image src="/images/components/airdrop/tribe.svg" width={36} height={36} alt="" />
                    <h5 className="mt-[10px] text-[15px] font-semibold">Referral Pts</h5>
                    <p className="mt-1 text-[12px] font-normal">Tribe3 Points.</p>
                  </div>
                </BoxGradientBluePink>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-mediumEmphasis">
                <ul className="ml-4 list-disc text-[14px] font-normal">
                  <li>
                    Earn 3% of your referees’ trading volume points when you refer Tribe3 to others. (Only referees with at least 5 WETH
                    trading volume will be counted as eligible referees.)
                  </li>
                  <li>Earn 2% more of your own trading volume points when you enter others’ referral code.</li>
                  <li>Users must enter referral code before their first trade on Mainnet.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* d. Others */}
        <div className="mb-9 bg-lightBlue px-5 py-9">
          <div className="flex flex-col">
            <h4 className="mb-6 text-[15px] font-semibold">d. Others</h4>
            <div className="mb-6 flex min-w-[240px] items-center justify-center text-center">
              <BoxGradientBluePink borderWidth={1}>
                <div
                  className="flex min-h-[130px] min-w-[120px] flex-1 flex-col items-center
                        justify-center">
                  <Image src="/images/components/airdrop/tribe.svg" width={36} height={36} alt="" />
                  <h5 className="mt-[10px] text-[15px] font-semibold">? Pts </h5>
                  <p className="mt-1 text-[12px] font-normal">Tribe3 Points.</p>
                </div>
              </BoxGradientBluePink>
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-mediumEmphasis">
                <ul className="ml-4 list-disc text-[14px] font-normal">
                  <li>
                    It includes, but not limited to, your social media engagement with Tribe3, campaign participation, contribution to
                    Tribe3 Beta & Testnet.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-9 px-5">
          <h3 className="mb-6 text-[16px] font-semibold">Multiplier</h3>
          <p className="mb-4 text-[14px] font-normal">
            At the end of each season, a point multiplier will be applied based on the user&lsquo;s rank:
          </p>
          {/* table */}
          <table className="w-[100%] max-w-[373px] table-fixed border-[1px] border-[#71AAFF38] text-center">
            <thead>
              <tr>
                <th className="bg-secondaryBlue p-[11px]">
                  <h5>Rank</h5>
                </th>
                <th className="p-[11px]">
                  <h5>Multiplier</h5>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-[1px] border-[#71AAFF38]">
                <td className="bg-secondaryBlue p-[11px]">
                  <p className="text-[15px] font-semibold">1</p>
                </td>
                <td className="p-[11px]">
                  <p className="body1e text-marketGreen">3X</p>
                </td>
              </tr>
              <tr className="border-[1px] border-[#71AAFF38]">
                <td className="bg-secondaryBlue p-[11px]">
                  <p className="text-[15px] font-semibold">2</p>
                </td>
                <td className="p-[11px]">
                  <p className="body1e text-marketGreen">2.5X</p>
                </td>
              </tr>
              <tr className="border-[1px] border-[#71AAFF38]">
                <td className="bg-secondaryBlue p-[11px]">
                  <p className="body1e">3</p>
                </td>
                <td className="p-[11px]">
                  <p className="body1e text-marketGreen">2.3X</p>
                </td>
              </tr>
              <tr className="border-[1px] border-[#71AAFF38]">
                <td className="bg-secondaryBlue p-[11px]">
                  <p className="body1e">4-10</p>
                </td>
                <td className="p-[11px]">
                  <p className="body1e text-marketGreen">2X</p>
                </td>
              </tr>
              <tr className="border-[1px] border-[#71AAFF38]">
                <td className="bg-secondaryBlue p-[11px]">
                  <p className="body1e">11-50</p>
                </td>
                <td className="p-[11px]">
                  <p className="body1e text-marketGreen">1.8X</p>
                </td>
              </tr>
              <tr className="border-[1px] border-[#71AAFF38]">
                <td className="bg-secondaryBlue p-[11px]">
                  <p className="body1e">51-100</p>
                </td>
                <td className="p-[11px]">
                  <p className="body1e text-marketGreen">1.5X</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-12 px-5">
          <h3 className="mb-6 text-[16px] font-semibold">Note</h3>
          <p className="text-[14px] font-normal">
            Tribe3 reserves the right to modify or update the rules and regulations above at any time without prior notice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RulesMobile;
