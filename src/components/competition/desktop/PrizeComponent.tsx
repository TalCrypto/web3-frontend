/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
import React from 'react';
import Image from 'next/image';
import CustomTable from '@/components/competition/desktop/CustomTable';
import { $activeDropdown, $isCompetitionLeaderboardLoading, $mainLeaderboard, $mlCurrentUser } from '@/stores/competition';
import { localeConversion } from '@/utils/localeConversion';
import { formatBigInt } from '@/utils/bigInt';
import { useStore as useNanostore } from '@nanostores/react';
import CustomValue from '@/components/competition/common/CustomValue';

const openRules = () => window.open('https://mirror.xyz/tribe3.eth/Zjg7s1ORT06DtFJXOBDgTbW2O8v4y6bKaCUhKSsxDcI', '_blank');

const PrizeComponent = () => {
  const mainLeaderboard = useNanostore($mainLeaderboard);
  const mlCurrentUser = useNanostore($mlCurrentUser);
  const isCompetitionLeaderboardLoading = useNanostore($isCompetitionLeaderboardLoading);
  const activeDropdown = useNanostore($activeDropdown);

  return (
    <div className={`${activeDropdown === 0 ? '' : 'hidden md:block'} h-auto w-full bg-black bg-opacity-30 px-0`}>
      <div
        className="bg-[rgba(0, 0, 0, 0.3)] flex  h-auto w-full flex-col-reverse flex-wrap
              items-center justify-center bg-[url('/images/components/competition/backgrounds/first-section.svg')] bg-contain bg-no-repeat px-0 md:mb-9 md:rounded-md md:border md:border-white
              md:border-opacity-20 min-[984px]:h-[456px] min-[984px]:flex-row">
        {/* <div
                className="bg-[url('/static/containerbackgrounds/competition/reward.png')] bg-cover bg-[center_top] bg-no-repeat
                h-full w-[477px] rounded-r-md"
              > */}
        <div className=" h-full w-full flex-grow min-[984px]:w-auto  min-[984px]:rounded-l-md">
          <CustomTable
            data={mainLeaderboard}
            userData={mlCurrentUser}
            selectedField="pnl"
            tableClassName="py-9"
            titleClassName="flex justify-between mb-[18px] px-9"
            tHeadClassName="flex text-b2 text-mediumEmphasis px-9"
            tBodyClassName="mt-6 px-9 overflow-y-scroll h-[320px] scroll-style"
            icon={<Image alt="gainers" src="/images/components/competition/icons/gainers-colorful.svg" width={24} height={24} />}
            title={<h3 className="pl-[7px] text-h3">Top Gainer</h3>}
            isLoading={isCompetitionLeaderboardLoading}
            thirdRowTitle="Realized P/L"
            thirdRowTips="Realized P/L is the sum of funding payment and P/L from price change of a position.
          P/L from price change refers to the gain & loss from full close, partial close and liquidation of a position."
            thirdRowValueGenerator={(value: string) =>
              CustomValue({
                ethIcon: true,
                value: `${Number(localeConversion(formatBigInt(value), 2)) > 0 ? '+' : ''}${
                  Math.abs(Number(localeConversion(formatBigInt(value), 2))) === 0.0 ? '0.00' : localeConversion(formatBigInt(value), 2)
                }`
              })
            }
          />
        </div>
        <div className="bg-linear-gradient  h-full w-full py-12 min-[984px]:w-[477px] min-[984px]:rounded-r-md min-[984px]:py-0">
          <div className="mt-0 min-[984px]:mt-[38px]">
            <div className="flex items-center justify-center">
              <Image alt="animated gift" src="/images/components/competition/icons/animated-gift.gif" width={22} height={22} />
              <h5 className="text-glow-yellow pl-[7px] text-h5">Top3 Reward</h5>
            </div>
            {/* <div className="text-center">
                      <span className="text-b2 items-center">NFTs: Degods, Potatoz, Beanz</span>
                    </div> */}
          </div>
          <div className="mt-6 flex content-center items-center justify-center gap-[25.61px]">
            <div>
              <Image
                src="/images/components/competition/reward/reward-potatoz.svg"
                alt="Reward Potatoz"
                objectFit="cover"
                quality={100}
                width={72.31}
                height={94}
              />
              {/* <p className="text-b3e text-[#FFC24B] mt-2 text-center">1st Prize</p> */}
            </div>
            <div>
              <Image
                src="/images/components/competition/reward/reward-beanz.svg"
                alt="Reward Beanz"
                objectFit="cover"
                quality={100}
                width={72.31}
                height={94}
              />
            </div>
            <div>
              <Image
                src="/images/components/competition/reward/reward-milady.svg"
                alt="Reward Milady"
                objectFit="cover"
                quality={100}
                width={72.31}
                height={94}
              />
            </div>
            <div>
              <Image
                src="/images/components/competition/reward/reward-onchainmonkey.svg"
                alt="Reward Onchainmonkey"
                objectFit="cover"
                quality={100}
                width={72.31}
                height={94}
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center min-[984px]:ml-[calc(100%_-_425px)] min-[984px]:justify-start">
            <ul className="ml-6 list-outside list-disc">
              <li className="mb-2 text-[#FFC24B]">
                <div>
                  <span className="text-b3e">1st Prize: </span>
                  <span className="text-b3 text-highEmphasis">1 Potatoz + 1 Beanz + 20,000 Tribe3 Pts</span>
                </div>
              </li>
              <li className="mb-2 text-[#FFC24B]">
                <div>
                  <span className="text-b3e">2nd Prize: </span>
                  <span className="text-b3 text-highEmphasis">1 Milady + 15,000 Tribe3 Pts</span>
                </div>
              </li>
              <li className="mb-2 text-[#FFC24B]">
                <div>
                  <span className="text-b3e">3rd Prize: </span>
                  <span className="text-b3 text-highEmphasis">1 OnChainMonkey + 10,000 Tribe3 Pts</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="mt-[53px]">
            <div className="mb-[8px] flex items-center justify-center">
              <Image alt="animated gift" src="/images/components/competition/icons/animated-gift.gif" width={22} height={22} />
              <h5 className="text-glow-yellow pl-[7px] text-h5">Huge Prize Pool for Top 4-50 Winners!</h5>
            </div>
            {/* <div className="text-center">
                      <span className="text-b2 items-center">Total 3500 USDT & 15800 Tribe3 Pts</span>
                    </div> */}
          </div>
          <div className="mt-6 flex items-center justify-center">
            <div>
              <span className="text-b3">Check out the </span>
              <span className="cursor-pointer text-b3e underline" onClick={openRules}>
                {' '}
                Rules
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeComponent;
