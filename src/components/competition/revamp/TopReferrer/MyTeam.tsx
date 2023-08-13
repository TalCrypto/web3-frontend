/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import { $userInfo } from '@/stores/user';
import { useStore } from '@nanostores/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { formatBigInt } from '@/utils/bigInt';
import { useRouter } from 'next/router';
import { $isMobileScreen, $screenWidth } from '@/stores/window';

function Cell(props: any) {
  const { items, classNames } = props;
  return (
    <div
      className="relative mb-6 grid grid-cols-12 items-center
      text-[14px] text-mediumEmphasis">
      {items.map((item: any, index: any) => (
        <div className={`${classNames[index]}`} key={index}>
          {item}
        </div>
      ))}
    </div>
  );
}

const Divider = () => <div className="h-[1px] w-full bg-[#2E4371]" />;

const referees = [
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: true, vol: 30, contribution: 50, reward: 50 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: true, vol: 15, contribution: 25, reward: 25 },
  { username: 'Tribe3OG', isEligible: true, vol: 10, contribution: 15, reward: 15 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
  { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 }
];

// const referrers = [
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: true, vol: 30, contribution: 50, reward: 50 },
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: true, vol: 15, contribution: 25, reward: 25 },
//   { username: 'Tribe3OG', isEligible: true, vol: 10, contribution: 15, reward: 15 },
//   { username: '0x370b4f2ac5a767ABDe6Ff03b739914bc77b564fd', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 },
//   { username: 'EMMMMMMMMMAAAAAAA', isEligible: false, vol: 0.1, contribution: 0, reward: 0 }
// ];
//
// const volList = [
//   { week: 1, rank: 250, vol: 0.5, reward: 5 },
//   { week: 2, rank: 10, vol: 100.5, reward: 500 }
// ];

const itemShowReward = (item: any) =>
  item?.pointPrize === 0 && item?.usdtPrize === 0
    ? '-'
    : item?.pointPrize === 0 && item?.usdtPrize > 0
    ? `${item?.usdtPrize}USDT`
    : item?.usdtPrize === 0 && item?.pointPrize > 0
    ? `${item?.pointPrize} Pts`
    : `${item?.usdtPrize}USDT + ${item?.pointPrize} Pts`;

const MyTeam = (props: any) => {
  const router = useRouter();
  const userInfo = useStore($userInfo);

  const { copyTextFunc, referralCode, displayUsername, setIsShowShareModal, referralTeamList, referralUserItem } = props;
  const [displayCount, setDisplayCount] = useState(8);
  const isMobileScreen = useStore($isMobileScreen);

  const teamRank = referralUserItem?.rank || 0;
  const teamPoint = referralUserItem?.teamPointPrize || 0;
  const teamUsdt = referralUserItem?.teamUsdtPrize || 0;
  const personalPoint = referralUserItem?.pointPrize || 0;
  const personalUsdt = referralUserItem?.usdtPrize || 0;
  const teamVol = referralUserItem?.totalVolume || 0;

  const showTeamReward =
    teamPoint === 0 && teamUsdt === 0
      ? '-'
      : teamPoint === 0 && teamUsdt > 0
      ? `${teamUsdt}USDT`
      : teamUsdt === 0 && teamPoint > 0
      ? `${teamPoint} Pts`
      : `${teamUsdt}USDT + ${teamPoint} Pts`;

  const showPersonalReward =
    personalPoint === 0 && personalUsdt === 0
      ? '-'
      : personalPoint === 0 && personalUsdt > 0
      ? `${personalUsdt}USDT`
      : personalUsdt === 0 && personalPoint > 0
      ? `${personalPoint} Pts`
      : `${personalUsdt}USDT + ${personalPoint} Pts`;

  return (
    <div className="px-5 py-6 lg:p-0">
      <div className="lg:mt-[78px]">
        <div className="flex items-center text-[18pt] font-[700] lg:mt-[16px] lg:justify-center ">
          <Image src="/images/components/competition/revamp/my-performance/crown.svg" alt="" width={24} height={24} className="mr-[6px]" />
          My Referral Team
        </div>
      </div>
      <div className="mt-6 w-full lg:mt-[36px]">
        <div className="flex flex-col items-center lg:flex-row">
          <div
            className="w-full rounded-[6px] border-[1px] border-[#2E4371] bg-[#1B1C30] lg:mr-[36px] 
          lg:h-[528px] lg:w-[388px] lg:min-w-[388px]">
            <div
              className="flex items-center rounded-t-[12px] bg-[#3A1A18] 
            bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#8C6E4B] to-50% p-[36px]">
              <Image src="/images/components/competition/revamp/my-performance/referrer-master.svg" width={43} height={57} alt="" />
              <div className="ml-[12px] flex flex-col justify-between">
                <div className="text-[12px] font-[400]">Team Lead</div>
                <div className="mt-[8px] flex items-center">
                  <div
                    onClick={() => router.push(`/userprofile/${userInfo?.userAddress}`)}
                    className="mr-[8px] cursor-pointer bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text
                     text-[20px] font-[600] text-transparent">
                    {displayUsername}
                  </div>
                  <div className="rounded-[2px] bg-[#E06732] px-[4px] py-[2px] text-[8px] font-[800] ">YOU</div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex items-stretch justify-between px-[36px] py-[24px]">
              <div className="flex flex-col items-center justify-between space-y-[6px] text-center">
                <div className="text-[12px] font-[400] text-[#FFD392]">Team Rank</div>
                <div className="text-[15px] font-[600]">{teamRank}</div>
              </div>
              <div className="flex flex-col items-center justify-between space-y-[6px] text-center">
                <div className="text-[12px] font-[400] text-[#FFD392]">Team Reward</div>
                <div className="text-[15px] font-[600]">{showTeamReward}</div>
              </div>
              <div className="flex flex-col items-center space-y-[6px] text-center">
                <div className="text-center text-[12px] font-[400] text-[#FFD392]">Team Trading Volume</div>
                <div className="mt-[6px] flex items-center text-[15px] font-[600]">
                  <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                  {formatBigInt(teamVol).toFixed(2)}
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex items-center justify-center px-[36px] py-[24px]">
              <div className="text-center">
                <div className="text-[20px] font-[600] text-[#FFD392]">My Reward</div>
                <div className="mt-[6px] text-[12px] font-[400] text-[#FFD392]">(40% of Team Reward)</div>
                <div className="mt-[12px] text-[20px] font-[600]">{showPersonalReward}</div>
              </div>
            </div>
            <Divider />
            <div className="flex items-center justify-center px-[36px] py-[24px]">
              <div>
                <div className="text-center text-[15px] font-[600]">📢 Invitation to my team (Referral Link)</div>
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
                    onClick={copyTextFunc}>
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
          <div className="-mx-5 grow bg-[#0C0D20] py-[36px] lg:mx-0 lg:h-[528px] lg:rounded-[6px] lg:border-[1px] lg:border-[#2E4371]">
            <div className="flex items-center justify-between px-[36px]">
              <div className="text-[16px] font-[600]">My Team Member</div>
              <div className="text-[12px] font-[400]">
                No. of Member : <span className="font-[600]">{referralTeamList?.length}</span>{' '}
                {/* <span className="text-[15px]">/ {referrers.length}</span> */}
              </div>
            </div>
            {referralTeamList?.length > 0 ? (
              <div className="mt-6 lg:mt-[36px]">
                <div className="px-[36px]">
                  <Cell
                    items={['User ID', 'Trading Volume', 'Contribution', 'Reward', 'Contribution / Trading Volume']}
                    classNames={[
                      'col-span-8 lg:col-span-3 text-[12px]',
                      'col-span-3 text-[12px] hidden lg:block',
                      'col-span-3 text-[12px] hidden lg:block',
                      'col-span-3 text-[12px] hidden lg:block',
                      'col-span-4 text-[12px] text-right lg:hidden block'
                    ]}
                  />
                </div>
                <div className="scrollable mt-[24px] overflow-y-scroll lg:max-h-[360px]">
                  {referralTeamList
                    ?.slice(0, !isMobileScreen || displayCount >= referralTeamList.length ? referralTeamList.length : displayCount)
                    .map((item: any) => {
                      const username =
                        item.username === ''
                          ? `${item.userAddress.substring(0, 7)}...${item.userAddress.slice(-3)}`
                          : item.username.length > 10
                          ? `${item.username.substring(0, 10)}...`
                          : item.username;

                      return (
                        <div
                          key={item.userAddress}
                          className="grid grid-cols-12 items-center px-[36px] py-[16px] text-[14px] odd:bg-[#202249]">
                          <div className="relative col-span-8 items-center lg:col-span-3">
                            <div className="absolute left-[-10px] top-0 h-full w-[3px] rounded-[30px] bg-primaryBlue" />
                            <div
                              onClick={() => router.push(`/userprofile/${item.userAddress}`)}
                              className="cursor-pointer truncate pr-[40px]">
                              {username}
                            </div>
                          </div>
                          {/* <div className="relative col-span-2">
                            {item.isEligible ? (
                              <Image
                                src="/images/components/competition/revamp/my-performance/eligible.svg"
                                width={16}
                                height={16}
                                alt=""
                                className="absolute left-[-20px] top-[2px]"
                              />
                            ) : null}
                            {item.isEligible ? 'Eligible' : 'Not Eligible'}
                          </div> */}
                          <div className="col-span-3 hidden items-center md:flex">
                            <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                            {formatBigInt(item.tradedVolume).toFixed(2)}
                          </div>
                          <div className="col-span-3 hidden font-[600] text-[#FFC24B] md:block">{`${
                            Number(item.distribution) === 0 ? '-' : `${Number(item.distribution).toFixed(1)}%`
                          }`}</div>
                          <div className="col-span-3 hidden md:block">
                            <div
                              className={`flex w-fit items-center rounded-[12px] px-[12px] py-[4px] ${
                                item.isEligible ? 'bg-[#2E4371]' : ''
                              }`}>
                              <Image
                                src="/images/components/competition/revamp/my-performance/reward.svg"
                                width={16}
                                height={16}
                                alt=""
                                className="mr-[10px]"
                              />
                              {itemShowReward(item)}
                            </div>
                          </div>
                          <div className="col-span-4 flex flex-col items-end lg:hidden">
                            <div className="flex items-center">
                              <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                              {formatBigInt(item.tradedVolume).toFixed(2)}
                            </div>
                            <div className="font-[600] text-[#FFC24B]">
                              {`${Number(item.distribution) === 0 ? '-' : `${Number(item.distribution).toFixed(1)}%`}`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center py-4 text-[15px] font-[400] text-mediumEmphasis lg:py-0">
                <div className="px-[64px] pt-[10px] text-center md:p-0">List is empty, start sharing your referral link now!</div>
              </div>
            )}

            {isMobileScreen && referralTeamList && referralTeamList?.length > 0 ? (
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
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
