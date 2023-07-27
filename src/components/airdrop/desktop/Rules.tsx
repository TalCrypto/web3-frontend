import React from 'react';
import { useRouter } from 'next/router';
import { BoxGradient, BoxGradientBluePink } from '@/components/common/Box';
import Image from 'next/image';
import ScrollTopButton from '@/components/common/ScrollToTopButton';

function Rules() {
  const router = useRouter();

  return (
    <div className="container mb-10">
      <div className="flex flex-col space-y-[48px] text-highEmphasis">
        {/* Tribe3 Airdrop Season 2  - Rules */}
        <div>
          <h3 className="mb-[24px] text-[24px] font-bold">Tribe3 Airdrop Season 2 - Rules</h3>
          <BoxGradient>
            <div className="flex-1 px-[36px] py-[24px]">
              <h5 className="mb-[24px]">The wait is over! 🎉</h5>
              <p className="text-[15px] font-normal">
                Tribe3 mainnet is live and users will be entitled to Tribe3 token airdrop by trading on Tribe3. <br />
                First season will start from <span className="font-semibold">🗓️ 12 Apr - 12 May 2023.</span> The more Tribe3 points, more
                Tribe3 token you will get.
              </p>
            </div>
          </BoxGradient>
        </div>
        {/* How to get Tribe3 Points ⬇️ */}
        <div className="relative space-y-[37px]">
          <h3 className="mb-[24px] text-[24px] font-bold">How to get Tribe3 Points ⬇️</h3>
          <BoxGradient>
            <div className="flex min-h-[112px] space-x-[12px] p-[24px] md:space-x-[54px] md:px-[36px] md:py-[26px]">
              <div className="flex w-[100px] flex-col items-center md:min-w-[278px]">
                <div className="mb-[24px]">
                  <Image src="/images/components/airdrop/approved.svg" width={48} height={48} alt="" />
                </div>
                <h5 className="text-center text-[16px] font-semibold text-highEmphasis">Eligibility</h5>
              </div>
              <div className="hidden w-[1px] bg-[#2E4371] md:block" />
              <div className="flex flex-1 items-center">
                <p className="text-[15px] font-normal md:text-b1">
                  Users must have a minimum trading volume of <span className="text-b2e md:text-b1e">5 WETH notional</span> to unlock all
                  the points!
                </p>
              </div>
            </div>
          </BoxGradient>

          <div className="absolute left-0 top-[170px] z-10 h-[113px] w-[30px] md:left-[30px] md:top-[145px]">
            <Image src="/images/components/airdrop/arrow-curved.svg" width={30} height={113} alt="" />
          </div>

          <div className="bg-darkBlue">
            <BoxGradient>
              <div className="flex min-h-[112px] space-x-[12px] p-[24px] md:space-x-[54px] md:px-[36px] md:py-[26px]">
                <div className="flex w-[100px] flex-col items-center md:min-w-[278px]">
                  <div className="mb-[24px]">
                    <Image src="/images/components/airdrop/holding-box.svg" width={48} height={48} alt="" />
                  </div>
                  <h5 className="text-center text-[16px] font-semibold text-highEmphasis">4 Ways to Get Pts</h5>
                </div>
                <div className="hidden w-[1px] bg-[#2E4371] md:block" />
                <div className="flex flex-1 items-center">
                  <p className="text-[15px] font-normal leading-[24px]">
                    There are 4 points components in season 2: <br />
                    <span className="font-semibold">
                      a. Trading Volume<span className="font-normal">&nbsp;+&nbsp;</span>
                      b. Net Convergence Trading Volume<span className="font-normal">&nbsp;+&nbsp;</span>
                      c. Referral<span className="font-normal">&nbsp;+&nbsp;</span>
                      d. Others.
                    </span>
                  </p>
                </div>
              </div>
            </BoxGradient>
            <div className="rounded-b-[6px] border-[#2E4371] py-[24px] md:border-[1px] md:py-[36px]">
              {/* a. Trading Volume Points */}
              <div className="flex flex-col items-center space-y-[24px] p-[8px] md:space-x-[60px] md:space-y-0 md:p-[36px] lg:flex-row">
                <div className="flex items-center space-x-[8px] text-center md:space-x-[21px]">
                  <div
                    className="flex min-h-[150px] min-w-[170px] flex-1 flex-col items-center
                    justify-center rounded-[12px] border-[2px] border-warn p-[8px]">
                    <Image src="/images/components/airdrop/ethereum.svg" width={36} height={36} alt="" />
                    <h5 className="mt-[10px] text-[16px] font-semibold">1 WETH </h5>
                    <p className="mt-[4px] text-[12px] font-normal">Notional Trading Vol.</p>
                  </div>
                  <div className="text-[32px]">=</div>
                  <div className="min-h-[150px] min-w-[170px] flex-1">
                    <BoxGradientBluePink>
                      <div
                        className="flex min-h-[150px] min-w-[170px] flex-col items-center
                        justify-center p-[8px] md:flex-1">
                        <Image src="/images/components/airdrop/tribe.svg" width={36} height={36} alt="" />
                        <h5 className="mt-[10px] text-[16px] font-semibold">10 Pts </h5>
                        <p className="mt-[4px] text-[12px] font-normal">Tribe3 Points.</p>
                      </div>
                    </BoxGradientBluePink>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="mb-[24px] text-[20px] font-semibold text-highEmphasis">a. Trading Volume Points</h4>
                  <div className="text-[15px] font-normal text-mediumEmphasis">
                    <ul className="ml-4 list-disc">
                      <li>Earn X points for every 1 WETH notional trading volume.</li>
                      <li>
                        Notional Trading Volume will be counted for every action of open position, add position, partially close and fully
                        close position.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* b. Net Convergence Trading Volume Points */}
              <div className="flex flex-col space-y-[24px] bg-lightBlue p-[8px] md:space-x-[60px] md:space-y-0 md:p-[36px] lg:flex-row">
                <div className="flex items-center space-x-[8px] text-center md:space-x-[21px]">
                  <div
                    className="flex min-h-[150px] min-w-[170px] flex-1 flex-col items-center
                      justify-center rounded-[12px] border-[2px] border-warn p-[8px]">
                    <Image src="/images/components/airdrop/ethereum.svg" width={36} height={36} alt="" />
                    <h5 className="mt-[10px] text-[16px] font-semibold">1 WETH </h5>
                    <p className="mt-[4px] text-[12px] font-normal">
                      Notional Converg.
                      <br /> Trading Vol.
                    </p>
                  </div>
                  <div className="text-[32px]">=</div>
                  <div className="min-h-[150px] min-w-[170px] flex-1">
                    <BoxGradientBluePink>
                      <div
                        className="flex min-h-[150px] min-w-[170px] flex-col items-center
                        justify-center p-[8px] md:flex-1">
                        <Image src="/images/components/airdrop/tribe.svg" width={36} height={36} alt="" />
                        <h5 className="mt-[10px] text-[16px] font-semibold">100 Pts </h5>
                        <p className="mt-[4px] text-[12px] font-normal">Tribe3 Points.</p>
                      </div>
                    </BoxGradientBluePink>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="mb-[24px] text-[20px] font-semibold text-highEmphasis">b. Net Convergence Trading Volume Points</h4>
                  <div className="text-[15px] font-normal text-mediumEmphasis">
                    <ul className="ml-4 list-disc">
                      <li>Earn 100 points for every +1 WETH Net Notional Convergence Trading Volume.</li>
                      <li>
                        Trades that close the price gap between vAMM price and oracle price will be counted as converging trades, while
                        trades that increase the price gap will be identified as diverging trades.
                      </li>
                      <li>If the trade over-closes the price gap, the volume that is over-closed will be counted as a diverging trade.</li>
                      <li>Users will receive 0 points if they have a negative net converging trade volume.</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* c. Referral Points */}
              <div
                className="flex flex-col items-center p-[8px]
                pt-6 md:space-x-[60px] md:space-y-0 md:p-[36px] lg:flex-row">
                <div className="flex items-center space-x-[8px] text-center md:space-x-[21px]">
                  <div className="flex flex-col">
                    <BoxGradientBluePink>
                      <div
                        className="flex min-h-[120px] min-w-[170px] flex-1 flex-col
                        items-center justify-center p-[8px]">
                        <Image src="/images/components/airdrop/tribe.svg" width={32} height={32} alt="" />
                        <h5 className="mt-[10px] text-[16px] font-semibold">X Pts * 3%</h5>
                        <p className="mt-[4px] text-[12px] font-normal">
                          Eligible Referees &lsquo; <br /> Trading Points.
                        </p>
                      </div>
                    </BoxGradientBluePink>
                    <div className="text-[32px]">+</div>
                    <BoxGradientBluePink>
                      <div
                        className="flex min-h-[120px] min-w-[170px] flex-1 flex-col
                        items-center justify-center p-[8px]">
                        <Image src="/images/components/airdrop/tribe.svg" width={32} height={32} alt="" />
                        <h5 className="mt-[10px] text-[16px] font-semibold">Y Pts * 2% </h5>
                        <p className="mt-[4px] text-[12px] font-normal">
                          Your Own <br /> Trading Points.{' '}
                        </p>
                      </div>
                    </BoxGradientBluePink>
                  </div>
                  <div className="text-[32px]">=</div>
                  <BoxGradientBluePink>
                    <div
                      className="flex min-h-[150px] min-w-[170px] flex-1 flex-col
                      items-center justify-center p-[8px]">
                      <Image src="/images/components/airdrop/tribe.svg" width={36} height={36} alt="" />
                      <h5 className="mt-[10px] text-[16px] font-semibold">? Pts </h5>
                      <p className="mt-[4px] text-[12px] font-normal">Tribe3 Points.</p>
                    </div>
                  </BoxGradientBluePink>
                </div>
                <div className="flex-1">
                  <h4 className="mb-[24px] text-[20px] font-semibold text-highEmphasis">c. Referral Points</h4>
                  <div className="text-[15px] font-normal text-mediumEmphasis">
                    <ul className="ml-4 list-disc">
                      <li>
                        Earn 3% of your referees’ trading volume points when you refer Tribe3 to others.
                        <br />- Only referees with at least 5 WETH trading volume will be counted as eligible referees.
                      </li>
                      <li>Earn 2% more of your own trading volume points when you enter others’ referral code.</li>
                      <li>Users must enter referral code before their first trade on Mainnet.</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* d. Others */}
              <div
                className="flex flex-col items-center space-y-[24px] bg-lightBlue
                p-[8px] md:space-x-[60px] md:space-y-0 md:p-[36px] lg:flex-row">
                <div
                  className="flex min-w-[240px] items-center justify-center
                  space-x-[8px] text-center md:min-w-[400px] md:space-x-[21px]">
                  <BoxGradientBluePink>
                    <div
                      className="flex min-h-[150px] min-w-[170px] flex-1 flex-col items-center
                      justify-center p-[8px]">
                      <Image src="/images/components/airdrop/tribe.svg" width={36} height={36} alt="" />
                      <h5 className="mt-[10px] text-[16px] font-semibold">? Pts </h5>
                      <p className="mt-[4px] text-[12px] font-normal">Tribe3 Points.</p>
                    </div>
                  </BoxGradientBluePink>
                </div>
                <div className="flex-1">
                  <h4 className="mb-[24px] text-[20px] font-semibold text-highEmphasis">d. Others</h4>
                  <div className="text-[15px] font-normal text-mediumEmphasis">
                    <ul className="ml-4 list-disc">
                      <li>
                        It includes, but not limited to, your social media engagement with Tribe3, campaign participation, contribution to
                        Tribe3 Beta & Testnet.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-[24px] text-[20px] font-semibold text-highEmphasis">Multiplier</h3>
          <BoxGradient>
            <div className="px-[36px] py-[26px]">
              <p className="mb-[16px] text-[15px] font-normal text-highEmphasis">
                At the end of each season, a point multiplier will be applied based on the user&lsquo;s rank:
              </p>
              <p
                className="mb-[25px] cursor-pointer text-[14px] font-normal text-primaryBlue"
                onClick={() => router.push('/airdrop/leaderboard', undefined, { shallow: true })}>
                View Leaderboard &gt;
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
                      <p className="text-[16px] font-semibold">1</p>
                    </td>
                    <td className="p-[11px]">
                      <p className="body1e text-marketGreen">3X</p>
                    </td>
                  </tr>
                  <tr className="border-[1px] border-[#71AAFF38]">
                    <td className="bg-secondaryBlue p-[11px]">
                      <p className="text-[16px] font-semibold">2</p>
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
          </BoxGradient>
        </div>
        <div>
          <h3 className="mb-[24px] text-[20px] font-semibold text-highEmphasis">Note</h3>
          <p className="text-[15px] font-normal text-highEmphasis">
            Tribe3 reserves the right to modify or update the rules and regulations above at any time without prior notice. Partnership
            multipliers can be applied to exclusive marketing partners.
          </p>
        </div>
      </div>
      <ScrollTopButton />
    </div>
  );
}

export default Rules;
