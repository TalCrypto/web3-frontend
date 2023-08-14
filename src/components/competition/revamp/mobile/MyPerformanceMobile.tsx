/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { FC, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { $userInfo, $userIsConnected } from '@/stores/user';
import { useStore } from '@nanostores/react';
import ContributionDetailsModal from '@/components/competition/revamp/mobile/ContributionDetailsModal';
import { $activeTab } from '@/stores/competition';
import ShareMobileModal from '@/components/airdrop/mobile/ShareMobileModal';
import { $userPoint, defaultUserPoint } from '@/stores/airdrop';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/pagination';
import { Pagination } from 'swiper/modules';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import { useAccount } from 'wagmi';
import {
  $topFundingPaymentUserItem,
  $topGainerUserItem,
  $topReferrerUserItem,
  $topVolumeUserItem,
  $referralUserItem,
  $referralTeamList,
  $myRefererUserItem,
  $myRefererTeamList
} from '@/stores/revampCompetition';
import { formatBigInt } from '@/utils/bigInt';
import { useRouter } from 'next/router';

const itemUsername = (item: any) =>
  item.username === ''
    ? `${item.userAddress.substring(0, 7)}...${item.userAddress.slice(-3)}`
    : item.username.length > 10
    ? `${item.username.substring(0, 10)}...`
    : item.username;

const itemReward = (item: any) =>
  item?.pointPrize === 0 && item?.usdtPrize === 0
    ? '0 Pts'
    : item?.pointPrize === 0 && item?.usdtPrize > 0
    ? `${item?.usdtPrize}USDT`
    : item?.usdtPrize === 0 && item?.pointPrize > 0
    ? `${item?.pointPrize} Pts`
    : `${item?.usdtPrize}USDT + ${item?.pointPrize} Pts`;

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
  const { title, type, volList = null, rank = '', val = '', reward = '', pointPrize = 0, usdtPrize = 0, isSide = false } = props;
  let contentTitle = '';

  const numberRank = Number(rank) || 0;

  switch (type) {
    case 0:
      contentTitle = 'Trad. Vol.';
      break;

    case 1:
      contentTitle = 'Realized P/L';
      break;

    case 2:
      contentTitle = 'Total Fund. Payment';
      break;

    case 3:
      contentTitle = 'Team Trading Volume';
      break;

    default:
      break;
  }

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
              <div className="mx-[48px] flex justify-between">
                <div className="flex flex-col text-center">
                  <div className="text-[12px] font-[400] text-[#FFD392]">Rank</div>
                  <div className="mt-[16px] text-[14px] font-[600]">{numberRank === 0 ? 'Unranked' : rank}</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-[12px] font-[400] text-[#FFD392]">{contentTitle}</div>
                  <div
                    className={`mt-[16px] flex items-center text-[14px] font-[600] ${
                      isSide ? (Number(val) > 0 ? 'text-marketGreen' : Number(val) < 0 ? 'text-marketRed' : '') : ''
                    }`}>
                    <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                    {numberRank === 0 ? (
                      '-'
                    ) : (
                      <div>
                        {isSide ? (Number(val) > 0 ? '+' : '') : ''}
                        {Number(val).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {volList && defaultVolRecord < volList.length - 1 ? (
          <div
            className="absolute left-0 top-0 flex min-w-[100px] translate-x-[-25%] translate-y-[50%] 
          -rotate-45 items-center justify-center border 
        border-y-white/50 bg-gradient-to-r from-[#BB3930] via-[#CE716B] to-[#C2342B] py-1 
        text-[8px] font-semibold leading-[9.75px] text-[#FFF6D7]">
            <p>ENDED</p>
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

const volList = [
  { week: 1, rank: 250, vol: 0.5, reward: 5 },
  { week: 2, rank: 10, vol: 100.5, reward: 500 }
];

const MyReferralTeam = (props: any) => {
  const router = useRouter();
  const userInfo = useStore($userInfo);
  const { displayUsername, setIsShowShareModal, showSnackBar, referralUserItem } = props;

  const teamRank = referralUserItem?.rank;
  const teamPoint = referralUserItem?.teamPointPrize;
  const teamUsdt = referralUserItem?.teamUsdtPrize;
  const personalPoint = referralUserItem?.pointPrize;
  const personalUsdt = referralUserItem?.usdtPrize;
  const teamVol = referralUserItem?.totalVolume;

  const showTeamReward =
    teamPoint === 0 && teamUsdt === 0
      ? '0 Pts'
      : teamPoint === 0 && teamUsdt > 0
      ? `${teamUsdt}USDT`
      : teamUsdt === 0 && teamPoint > 0
      ? `${teamPoint} Pts`
      : `${teamUsdt}USDT + ${teamPoint} Pts`;

  const showPersonalReward =
    personalPoint === 0 && personalUsdt === 0
      ? '0 Pts'
      : personalPoint === 0 && personalUsdt > 0
      ? `${personalUsdt}USDT`
      : personalUsdt === 0 && personalPoint > 0
      ? `${personalPoint} Pts`
      : `${personalUsdt}USDT + ${personalPoint} Pts`;

  return (
    <div>
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
              <div className="text-[12px] font-[400]">Team Lead</div>
              <div className="mt-[8px] flex items-center">
                <div
                  onClick={() => router.push(`/userprofile/${userInfo?.userAddress}`)}
                  className="mr-[8px] bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-[20px] font-[600] text-transparent">
                  {displayUsername}
                </div>
                <div className="rounded-[2px] bg-[#E06732] px-[4px] py-[2px] text-[8px] font-[800] ">YOU</div>
              </div>
            </div>
          </div>
          <div className="flex items-stretch justify-between border-b-[1px] border-[#2E4371] px-[36px] py-[24px]">
            <div className="flex flex-col items-center justify-between">
              <div className="text-[12px] font-[400] text-[#FFD392]">Team Rank</div>
              <div className="text-[15px] font-[600]">{teamRank}</div>
            </div>
            <div className="flex flex-col items-center justify-between">
              <div className="text-[12px] font-[400] text-[#FFD392]">Team Reward</div>
              <div className="text-[15px] font-[600]">{showTeamReward}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-center text-[12px] font-[400] text-[#FFD392]">Team Trading Volume</div>
              <div className="mt-[6px] flex items-center text-[15px] font-[600]">
                <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                {formatBigInt(teamVol).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center border-b-[1px] border-[#2E4371] px-[36px] py-[24px]">
            <div className="text-center">
              <div className="text-[20px] font-[600] text-[#FFD392]">My Reward</div>
              <div className="mt-[6px] text-[12px] font-[400] text-[#FFD392]">(40% of Team Reward)</div>
              <div className="mt-[12px] text-[20px] font-[600]">{showPersonalReward}</div>
            </div>
          </div>
          <div className="flex items-center justify-center px-[22px] py-[24px]">
            <div>
              <div className="text-center text-[15px] font-[600]">📢 Invitation to my team (Referral Link)</div>
              <div className="mt-[24px] flex items-center justify-between">
                <button
                  className="mr-[12px] flex items-center justify-center 
                  rounded-[4px] bg-primaryBlue px-[21px] py-[10px] text-[15px] font-[600] hover:bg-primaryBlueHover"
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
                  bg-primaryBlue px-[21px] py-[10px] text-[15px] font-[600] hover:bg-primaryBlueHover"
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
    </div>
  );
};

const MyRefereesList = (props: any) => {
  const router = useRouter();
  const { referralTeamList } = props;

  const isListEmpty = referralTeamList?.length === 0;
  const [displayCount, setDisplayCount] = useState(8);

  return (
    <div>
      <div className="px-[20px] pt-[36px] ">
        <div className="flex items-center justify-between text-[20px] font-[600]">
          My Referees
          <div className="flex items-center text-[14px] font-[400]">
            <div className="mr-[6px]">
              Total Referees : <span className="font-[600]">{referralTeamList?.length}</span>
            </div>
          </div>
        </div>
      </div>
      {isListEmpty ? (
        <div className="flex items-center justify-center p-[64px] text-center text-[15px] text-mediumEmphasis">
          List is empty, start sharing your referral link now!
        </div>
      ) : (
        <div>
          <div className="mt-[24px] px-[20px] text-[14px] font-[400] text-mediumEmphasis">
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
          <div className="mt-[16px]">
            {referralTeamList
              ?.slice(0, displayCount > referralTeamList?.length ? referralTeamList?.length : displayCount)
              .map((item: any) => {
                const showUsername = itemUsername(item);
                return (
                  <div
                    key={item.userAddress}
                    className={`h-full px-[20px] py-[16px] text-[14px] 
            odd:bg-[#202249]`}>
                    <div className="flex h-[48px] items-center justify-between">
                      <div className="flex h-full items-center">
                        <div className="mr-[6px] h-full w-[3px] rounded-[30px] bg-[#2574FB]" />
                        <div className="flex flex-col justify-between">
                          <div onClick={() => router.push(`/userprofile/${item.userAddress}`)} className="overflow-auto font-[600]">
                            {showUsername}
                          </div>
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
                          <div className="font-[600] text-[#FFC24B]">{`${
                            Number(item.distribution) === 0 ? '-' : `${Number(item.distribution).toFixed(1)}%`
                          }`}</div>
                          <div className="mt-[6px] flex items-center justify-end">
                            <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                            {formatBigInt(item.tradedVolume).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {referralTeamList && referralTeamList?.length > 0 ? (
        displayCount >= referralTeamList?.length ? null : (
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
    </div>
  );
};

const ReferralTeamJoined = (props: any) => {
  const router = useRouter();
  const { setIsShowContributionModal, myRefererUserItem, myRefererTeamList } = props;

  const userInfo = useStore($userInfo);

  const displayUsername =
    myRefererUserItem.username === ''
      ? `${myRefererUserItem.userAddress.substring(0, 7)}...${myRefererUserItem.userAddress.slice(-3)}`
      : myRefererUserItem.username.length > 10
      ? `${myRefererUserItem.username.substring(0, 10)}...`
      : myRefererUserItem.username;

  const rank = myRefererUserItem?.rank;
  const personalPoint = myRefererUserItem?.pointPrize;
  const personalUsdt = myRefererUserItem?.usdtPrize;

  const showPersonalReward =
    personalPoint === 0 && personalUsdt === 0
      ? '0 Pts'
      : personalPoint === 0 && personalUsdt > 0
      ? `${personalUsdt}USDT`
      : personalUsdt === 0 && personalPoint > 0
      ? `${personalPoint} Pts`
      : `${personalUsdt}USDT + ${personalPoint} Pts`;

  const showContribution = myRefererTeamList?.filter((item: any) => item.userAddress === userInfo?.userAddress)[0]?.distribution || 0;

  return (
    <div>
      <div className="px-[20px] pt-[13px]">
        <div className="text-[20px] font-[600]">Referral Team I Joined</div>
        <div className="mt-[24px] rounded-[6px] border-[1px] border-[#2E4371] bg-[#1B1C30]">
          <div className="flex items-center justify-between border-b-[1px] border-b-[#2E4371] p-[24px]">
            <div className="flex items-center">
              <Image src="/images/components/competition/revamp/my-performance/referrer-master.svg" width={43} height={57} alt="" />
              <div className="ml-[12px] flex flex-col justify-between">
                <div className="text-[12px] font-[400]">My Team Lead </div>
                <div
                  onClick={() => router.push(`/userprofile/${myRefererUserItem?.userAddress}`)}
                  className="mt-[8px] bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-[20px] font-[600] text-transparent">
                  {displayUsername}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between">
              <div className="text-[12px] font-[400] text-[#FFD392]">Team Rank</div>
              <div className="text-[15px] font-[600]">{rank}</div>
            </div>
          </div>
          <div className="relative flex items-center justify-between bg-[#202249] px-[48px] py-[24px]">
            <div className="flex flex-col items-center justify-between text-center">
              <div className="text-[12px] font-[400] text-[#FFD392]">My Contribution</div>
              <div className="mt-[6px] text-[16px] font-[600] text-[#FFC24B]">{`${showContribution.toFixed(2)}%`}</div>
            </div>
            <div className="flex flex-col items-center justify-between text-center">
              <div className="text-[12px] font-[400] text-[#FFD392]">My Reward</div>
              <div className="mt-[6px] text-[16px] font-[600]">{showPersonalReward}</div>
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
      </div>
    </div>
  );
};

const MyPerformanceMobile = () => {
  const { address } = useAccount();

  const userInfo = useStore($userInfo);
  const isConnected = useStore($userIsConnected);
  const userPointData = useStore($userPoint);
  const topFundingPaymentUserItem = useStore($topFundingPaymentUserItem);
  const topVolumeUserItem = useStore($topVolumeUserItem);
  const topGainerUserItem = useStore($topGainerUserItem);
  const topReferrerUserItem = useStore($topReferrerUserItem);
  const referralTeamList = useStore($referralTeamList);
  const referralUserItem = useStore($referralUserItem);
  const myRefererUserItem = useStore($myRefererUserItem);
  const myRefererTeamList = useStore($myRefererTeamList);

  const displayUsername =
    userInfo?.username === '' ? `${userInfo.userAddress.substring(0, 7)}...${userInfo.userAddress.slice(-3)}` : userInfo?.username;
  const userPoint = userPointData || defaultUserPoint;
  const { referralCode } = userPoint;

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
    <div className="my-[64px] flex items-center justify-center text-[16px] text-mediumEmphasis">
      <div className="w-[250px] text-center md:w-full">Please connect to your wallet to get started</div>
    </div>
  ) : (
    <div className="block bg-[#0C0D20] md:hidden">
      <div className="px-[20px] pt-[36px] ">
        <div className="text-[20px] font-[600]">General Performance</div>
        {/* <div className="relative pt-[24px]">
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
                  title="Top Volume"
                  type={0}
                  volList={volList}
                  rank={topVolumeUserItem?.rank}
                  val={topVolumeUserItem?.weeklyTradedVolume}
                  pointPrize={topVolumeUserItem?.pointPrize}
                  usdtPrize={topVolumeUserItem?.usdtPrize}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute bottom-[-16px] flex w-full items-center justify-center">
            <div className="swiper-pagination-bullets">
              <div className="h-[8px] w-[8px] cursor-pointer rounded-[50%] hover:bg-[#D9D9D9]" />
            </div>
          </div>
        </div> */}
        <div className=" pt-[24px]" />
        <PerformanceTag
          title="Top Gainer"
          type={1}
          rank={topGainerUserItem?.rank}
          val={formatBigInt(topGainerUserItem?.pnl || '0')}
          pointPrize={topGainerUserItem?.pointPrize}
          usdtPrize={topGainerUserItem?.usdtPrize}
          isSide
        />
        <PerformanceTag
          title="Top FP Receiver"
          type={2}
          rank={topFundingPaymentUserItem?.rank}
          val={formatBigInt(topFundingPaymentUserItem?.fundingPayment || '0')}
          pointPrize={topFundingPaymentUserItem?.pointPrize}
          usdtPrize={topFundingPaymentUserItem?.usdtPrize}
          isSide
        />
        <PerformanceTag
          title="Top Referrer"
          type={3}
          rank={topReferrerUserItem?.rank}
          val={formatBigInt(topReferrerUserItem?.totalVolume || '0')}
          pointPrize={topReferrerUserItem?.pointPrize}
          usdtPrize={topReferrerUserItem?.usdtPrize}
          isSide
        />
      </div>
      <MyReferralTeam
        displayUsername={displayUsername}
        setIsShowShareModal={setIsShowShareModal}
        showSnackBar={showSnackBar}
        referralUserItem={referralUserItem}
      />
      <MyRefereesList referralTeamList={referralTeamList} />

      {myRefererUserItem ? (
        <ReferralTeamJoined
          setIsShowContributionModal={setIsShowContributionModal}
          myRefererTeamList={myRefererTeamList}
          myRefererUserItem={myRefererUserItem}
        />
      ) : null}

      <ContributionDetailsModal
        isShow={isShowContributionModal}
        setIsShow={setIsShowContributionModal}
        myRefererTeamList={myRefererTeamList}
        myRefererUserItem={myRefererUserItem}
      />
      {isShowShareModal ? <ShareMobileModal setIsShow={setIsShowShareModal} referralCode={referralCode} copyCode={copyCode} /> : null}
      <div className="snackbar" id="snackbar">
        Referral link copied to clipboard!
      </div>
    </div>
  );
};

export default MyPerformanceMobile;
