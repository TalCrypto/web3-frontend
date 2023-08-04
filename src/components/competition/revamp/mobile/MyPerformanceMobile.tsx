import React, { FC } from 'react';
import Image from 'next/image';
import { $userInfo } from '@/stores/user';
import { useStore } from '@nanostores/react';

const referees = [
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: true, vol: 30, contribution: 50, reward: 50 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: true, vol: 15, contribution: 25, reward: 25 },
  { username: 'Tribe3OG', isEligible: true, vol: 10, contribution: 15, reward: 15 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 }
];

const referrers = [
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: true, vol: 30, contribution: 50, reward: 50 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: true, vol: 15, contribution: 25, reward: 25 },
  { username: 'Tribe3OG', isEligible: true, vol: 10, contribution: 15, reward: 15 },
  { username: '0x370b4f2ac5a767ABDe6Ff03b739914bc77b564fd', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 }
];

interface PerformanceTagProps {
  title: string;
  type: number;
  leaderboardRank: number;
}

const PerformanceTag: FC<PerformanceTagProps> = ({ title, type, leaderboardRank = 3 }) => {
  const contentTitle = '';

  return (
    <div
      className="relative mt-[24px] overflow-hidden
                rounded-[6px] border-[0.5px] border-[#FFD39240] bg-[#0C0D20CC]
                bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[rgba(72,50,24,0.7)] to-50% ">
      <div
        className="h-full w-full  bg-[url('/images/components/userprofile/profilecardbg.png')] 
    bg-cover bg-[center_bottom_-3rem] bg-no-repeat px-[24px] py-[18px]">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-[16px] font-[600] ">
              <Image src="/images/components/competition/revamp/performance-icon.svg" width={16} height={16} alt="" className="mr-[4px]" />
              {title}
            </div>
            <div className="text-[12px] font-[600] text-[#FFD392]">Leaderboard &gt;</div>
          </div>
          <div className="mt-[24px]">
            <div className="mx-[72px] flex justify-between">
              <div className="flex flex-col text-center">
                <div className="text-[12px] font-[400] text-[#FFD392]">Rank</div>
                <div className="mt-[16px] text-[14px] font-[600]">999</div>
              </div>
              <div className="flex flex-col text-center">
                <div className="text-[12px] font-[400] text-[#FFD392]">Rank</div>
                <div className="mt-[16px] flex items-center text-[14px] font-[600]">
                  <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                  999
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyPerformanceMobile = () => {
  const userInfo = useStore($userInfo);
  const displayUsername =
    userInfo?.username === '' ? `${userInfo.userAddress.substring(0, 7)}...${userInfo.userAddress.slice(-3)}` : userInfo?.username;
  return (
    <div className="block bg-[#0C0D20] md:hidden">
      <div className="px-[20px] pt-[36px] ">
        <div className="text-[20px] font-[600] ">General Performance</div>
        <PerformanceTag title="Top Vol." type={0} leaderboardRank={3} />
        <PerformanceTag title="Top Gainer" type={1} leaderboardRank={5} />
        <PerformanceTag title="Top FP" type={2} leaderboardRank={99} />
        <PerformanceTag title="Top Referrer" type={3} leaderboardRank={100} />
      </div>
      <div className="px-[20px] pt-[48px]">
        <div className="flex items-center text-[20px] font-[600] ">
          <Image src="/images/components/competition/revamp/my-performance/crown.svg" alt="" width={24} height={24} className="mr-[6px]" />
          Referral - My Team
        </div>
        <div className="mt-[24px] rounded-[6px] border-[1px] border-[#2E4371] bg-[#1B1C30]">
          <div
            className="flex items-center rounded-t-[12px] border-b-[1px] border-[#2E4371] bg-[#3A1A18]
            bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#8C6E4B] to-50% p-[36px]">
            <Image src="/images/components/competition/revamp/my-performance/referrer-master.svg" width={43} height={57} alt="" />
            <div className="ml-[12px] flex flex-col justify-between">
              <div className="text-[12px] font-[400]">Team Head (Referrer)</div>
              <div className="mt-[8px] flex items-center">
                <div className="mr-[8px] bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-[20px] font-[600] text-transparent">
                  {displayUsername}
                </div>
                <div className="rounded-[2px] bg-[#E06732] px-[4px] py-[2px] text-[8px] font-[800] ">YOU</div>
              </div>
            </div>
          </div>
          <div className="flex items-stretch justify-between border-b-[1px] border-[#2E4371] px-[36px] py-[24px]">
            <div className="flex flex-col items-center justify-between">
              <div className="text-[12px] font-[400] text-[#FFD392]">Team Rank</div>
              <div className="text-[15px] font-[600]">12</div>
            </div>
            <div className="flex flex-col items-center justify-between">
              <div className="text-[12px] font-[400] text-[#FFD392]">Team Reward</div>
              <div className="text-[15px] font-[600]">400USDT</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-center text-[12px] font-[400] text-[#FFD392]">
                Referee’s Total <br /> Trad. Vol
              </div>
              <div className="mt-[6px] text-[15px] font-[600]">55.00</div>
            </div>
          </div>
          <div className="flex items-center justify-center border-b-[1px] border-[#2E4371] px-[36px] py-[24px]">
            <div className="text-center">
              <div className="text-[20px] font-[600] text-[#FFD392]">My Reward</div>
              <div className="mt-[6px] text-[12px] font-[400] text-[#FFD392]">(50% of Team Reward)</div>
              <div className="mt-[12px] text-[20px] font-[600]">100USDT</div>
            </div>
          </div>
          <div className="flex items-center justify-center px-[22px] py-[24px]">
            <div>
              <div className="text-center text-[15px] font-[600]">📢 Share My Referral Link</div>
              <div className="mt-[24px] flex items-center justify-between">
                <button
                  className="mr-[12px] flex items-center justify-center 
                  rounded-[4px] bg-[#2574FB] px-[21px] py-[10px] text-[15px] font-[600]">
                  <Image
                    src="/images/components/competition/revamp/my-performance/share.svg"
                    width={16}
                    height={16}
                    alt=""
                    className="mr-[8px]"
                  />
                  Share Link
                </button>
                <button
                  className="mr-[12px] flex items-center justify-center rounded-[4px] 
                  bg-[#2574FB] px-[21px] py-[10px] text-[15px] font-[600]">
                  <Image
                    src="/images/components/competition/revamp/my-performance/copy.svg"
                    width={16}
                    height={16}
                    alt=""
                    className="mr-[8px]"
                  />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPerformanceMobile;
