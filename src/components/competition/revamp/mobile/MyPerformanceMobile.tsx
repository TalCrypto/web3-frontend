/* eslint-disable max-len */
import React, { FC, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { $userInfo, $userIsConnected } from '@/stores/user';
import { useStore } from '@nanostores/react';
import MobileTooltip from '@/components/common/mobile/Tooltip';
import ContributionDetailsModal from '@/components/competition/revamp/mobile/ContributionDetailsModal';
import { $activeTab } from '@/stores/competition';
import ShareMobileModal from '@/components/airdrop/mobile/ShareMobileModal';
import { $userPoint, defaultUserPoint } from '@/stores/airdrop';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/pagination';
import { Pagination } from 'swiper/modules';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';

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

interface PerformanceTagProps {
  title: string;
  type: number;
  leaderboardRank: number;
}

const PerformanceTag = (props: any) => {
  const { title, type, leaderboardRank = 3, volList = null, defaultVolRecord } = props;
  const contentTitle = '';

  return (
    <div className="pb-[24px]">
      <div
        className="relative overflow-visible rounded-[6px]
                border-[0.5px] border-[#FFD39240] bg-[#0C0D20CC] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]
                from-[rgba(72,50,24,0.7)] to-50% ">
        <div
          className="h-full w-full  bg-[url('/images/components/userprofile/profilecardbg.png')] 
    bg-cover bg-[center_bottom_-3rem] bg-no-repeat px-[24px] py-[18px]">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-[16px] font-[600] ">
                {/* <Image src="/images/components/competition/revamp/performance-icon.svg" width={16} height={16} alt="" className="mr-[4px]" /> */}
                {title}
              </div>
              <div
                className="text-[12px] font-[600] text-[#FFD392]"
                onClick={() => {
                  $activeTab.set(type);
                }}>
                Leaderboard &gt;
              </div>
            </div>
            <div className="mt-[24px]">
              <div className="mx-[72px] flex justify-between">
                <div className="flex flex-col text-center">
                  <div className="text-[12px] font-[400] text-[#FFD392]">Rank</div>
                  <div className="mt-[16px] text-[14px] font-[600]">{leaderboardRank}</div>
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
        {volList && defaultVolRecord < volList.length - 1 ? (
          <div
            className="absolute left-0 top-0 flex min-w-[100px] translate-x-[-25%] translate-y-[50%] 
          -rotate-45 items-center justify-center border 
        border-y-white/50 bg-gradient-to-r from-[#BB3930] via-[#CE716B] to-[#C2342B] py-1 
        text-[8px] font-semibold leading-[9.75px] text-[#FFF6D7]">
            <p>ENDED</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const volList = [
  { week: 1, rank: 250, vol: 0.5, reward: 5 },
  { week: 2, rank: 10, vol: 100.5, reward: 500 }
];

const MyPerformanceMobile = () => {
  const userInfo = useStore($userInfo);
  const isConnected = useStore($userIsConnected);
  const userPointData = useStore($userPoint);

  const displayUsername =
    userInfo?.username === '' ? `${userInfo.userAddress.substring(0, 7)}...${userInfo.userAddress.slice(-3)}` : userInfo?.username;
  const userPoint = userPointData || defaultUserPoint;
  const { referralCode } = userPoint;

  const [displayCount, setDisplayCount] = useState(8);
  const [isShowContributionModal, setIsShowContributionModal] = useState(false);
  const [isShowShareModal, setIsShowShareModal] = useState(false);
  const [defaultVolRecord, setDefaultVolRecord] = useState(!volList ? 0 : volList.length - 1);

  const copyTextFunc = (text: any) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    }
  };

  const copyCode = (targetElement: any, text = '', isUrlOnly = true) => {
    copyTextFunc(`${isUrlOnly ? 'https://app.tribe3.xyz/airdrop/refer?ref=' : ''}${text || referralCode}`);
  };

  function showSnackBar() {
    const snackbar = document.getElementById('snackbar');
    if (snackbar) {
      snackbar.className = 'snackbar show';
      copyTextFunc(`https://app.tribe3.xyz/airdrop/refer?ref=${referralCode || ''}`);
      setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '');
      }, 3000);
    }
  }

  return !isConnected ? (
    <div className="mt-[72px] flex items-center justify-center text-[16px] text-mediumEmphasis">
      Please connect to your wallet to get started
    </div>
  ) : (
    <div className="block bg-[#0C0D20] md:hidden">
      <div className="px-[20px] pt-[36px] ">
        <div className="text-[20px] font-[600] ">General Performance</div>
        <div className="relative pt-[24px]">
          <Swiper
            spaceBetween={30}
            modules={[Pagination]}
            initialSlide={volList.length - 1}
            pagination={{
              dynamicBullets: false,
              clickable: true
            }}
            className="mySwiper">
            {volList.map(item => (
              <SwiperSlide>
                <PerformanceTag
                  title="Top Vol"
                  type={0}
                  leaderboardRank={item.rank}
                  volList={volList}
                  defaultVolRecord={defaultVolRecord}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute bottom-[-16px] flex w-full items-center justify-center">
            <div className="swiper-pagination-bullets">
              <div className="h-[8px] w-[8px] cursor-pointer rounded-[50%] hover:bg-[#D9D9D9]" />
            </div>
          </div>
        </div>
        <PerformanceTag title="Top Gainer" type={1} leaderboardRank={5} />
        <PerformanceTag title="Top FP" type={2} leaderboardRank={99} />
        <PerformanceTag title="Top Referrer" type={3} leaderboardRank={100} />
      </div>
      <div className="px-[20px] pt-[48px]">
        <div className="flex items-center text-[20px] font-[600] ">
          <Image src="/images/components/competition/revamp/my-performance/crown.svg" alt="" width={24} height={24} className="mr-[6px]" />
          My Team
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
              <div className="mt-[6px] text-[12px] font-[400] text-[#FFD392]">(40% of Team Reward)</div>
              <div className="mt-[12px] text-[20px] font-[600]">100USDT</div>
            </div>
          </div>
          <div className="flex items-center justify-center px-[22px] py-[24px]">
            <div>
              <div className="text-center text-[15px] font-[600]">📢 Share My Referral Link</div>
              <div className="mt-[24px] flex items-center justify-between">
                <button
                  className="mr-[12px] flex items-center justify-center 
                  rounded-[4px] bg-[#2574FB] px-[21px] py-[10px] text-[15px] font-[600]"
                  onClick={() => setIsShowShareModal(true)}>
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
                  bg-[#2574FB] px-[21px] py-[10px] text-[15px] font-[600]"
                  onClick={showSnackBar}>
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
      <div className="px-[20px] pt-[36px] ">
        <div className="flex items-center justify-between text-[20px] font-[600]">
          My Referees
          <div className="flex items-center text-[14px] font-[400]">
            <div className="mr-[6px]">
              Total Referees : <span className="font-[600]">{referees.length}</span>
            </div>
          </div>
        </div>
        <div className="mt-[24px] text-[14px] font-[400] text-mediumEmphasis">
          <div className="flex items-center justify-between">
            <div>
              User ID /
              <br />
              Status
            </div>
            <div>
              Contribution /
              <br />
              Trading Vol.
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[16px]">
        {referees.slice(0, displayCount > referees.length ? referees.length : displayCount).map(item => {
          const showUsername = item.username.length > 10 ? `${item.username.substring(0, 10)}...` : item.username;
          return (
            <div
              className={`h-full px-[20px] py-[16px] text-[14px] 
            odd:bg-[#202249]`}>
              <div className="flex h-[48px] items-center justify-between">
                <div className="flex h-full items-center">
                  <div className="mr-[6px] h-full w-[3px] rounded-[30px] bg-[#2574FB]" />
                  <div className="flex flex-col justify-between">
                    <div className="font-[600]">{showUsername}</div>
                    {/* <div className="mt-[6px] flex items-center">
                      {item.isEligible ? (
                        <Image
                          src="/images/components/competition/revamp/my-performance/eligible.svg"
                          width={16}
                          height={16}
                          alt=""
                          className="mr-[4px]"
                        />
                      ) : null}
                      {item.isEligible ? 'Eligible' : 'Not Eligible'}
                    </div> */}
                  </div>
                </div>
                <div className="flex h-full items-end text-end">
                  <div className="flex flex-col justify-end">
                    <div className="font-[600] text-[#FFC24B]">{item.isEligible ? `${item.reward}%` : '-'}</div>
                    <div className="mt-[6px] flex items-center justify-end">
                      <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                      {item.vol.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {referees && referees.length > 0 ? (
        displayCount >= referees.length ? null : (
          <div className="bg-darkBlue py-[35px] text-center">
            <span
              className="text-center text-[14px] font-semibold text-primaryBlue"
              onClick={() => {
                setDisplayCount(displayCount + 8);
              }}>
              Show More
            </span>
          </div>
        )
      ) : null}

      <div className="px-[20px] pt-[13px]">
        <div className="text-[20px] font-[600]">Referral Team I Joined</div>
        <div className="mt-[24px] rounded-[6px] border-[1px] border-[#2E4371] bg-[#1B1C30]">
          <div className="flex items-center justify-between border-b-[1px] border-b-[#2E4371] p-[24px]">
            <div className="flex items-center">
              <Image src="/images/components/competition/revamp/my-performance/referrer-master.svg" width={43} height={57} alt="" />
              <div className="ml-[12px] flex flex-col justify-between">
                <div className="text-[12px] font-[400]">My Referrer</div>
                <div className="mt-[8px] bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-[20px] font-[600] text-transparent">
                  Tribe3OG
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between">
              <div className="text-[12px] font-[400] text-[#FFD392]">Team Rank</div>
              <div className="text-[15px] font-[600]">12</div>
            </div>
          </div>
          <div className="relative flex items-center justify-between bg-[#202249] px-[48px] py-[24px]">
            <div className="flex flex-col items-center justify-between text-center">
              <div className="text-[12px] font-[400] text-[#FFD392]">My Contribution</div>
              <div className="mt-[6px] text-[16px] font-[600] text-[#FFC24B]">50%</div>
            </div>
            <div className="flex flex-col items-center justify-between text-center">
              <div className="text-[12px] font-[400] text-[#FFD392]">My Reward</div>
              <div className="mt-[6px] text-[16px] font-[600]">250USDT</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-darkBlue py-[35px] text-center">
        <span
          className="flex items-center justify-center text-center text-[14px] font-semibold text-primaryBlue"
          onClick={() => {
            // setDisplayCount(displayCount + 8);
            setIsShowContributionModal(true);
          }}>
          <Image
            src="/images/components/competition/revamp/my-performance/details.svg"
            width={16}
            height={16}
            alt=""
            className="mr-[4px]"
          />
          Contribution Details
        </span>

        <ContributionDetailsModal isShow={isShowContributionModal} setIsShow={setIsShowContributionModal} referrers={referrers} />
        {isShowShareModal ? <ShareMobileModal setIsShow={setIsShowShareModal} referralCode={referralCode} copyCode={copyCode} /> : null}
        <div className="snackbar" id="snackbar">
          Referral link copied to clipboard!
        </div>
      </div>
    </div>
  );
};

export default MyPerformanceMobile;
