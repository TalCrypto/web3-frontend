/* eslint-disable max-len */
import React, { FC, useEffect, useState } from 'react';
import { $userIsConnected, $userInfo } from '@/stores/user';
import { useStore } from '@nanostores/react';
import Image from 'next/image';
import { atom } from 'nanostores';
import MyPerformanceMobile from '@/components/competition/revamp/mobile/MyPerformanceMobile';
import { $activeTab } from '@/stores/competition';
import { $userPoint, defaultUserPoint } from '@/stores/airdrop';
import { showOutlineToast } from '@/components/common/Toast';
import ShareModal from '@/components/airdrop/desktop/ShareModal';
import { useAccount } from 'wagmi';
import {
  $triggerKey,
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
import { PriceWithIcon } from '@/components/common/PriceWithIcon';

const $isShowReferralModal = atom(false);

const itemShowReward = (item: any) =>
  item?.pointPrize === 0 && item?.usdtPrize === 0
    ? '-'
    : item?.pointPrize === 0 && item?.usdtPrize > 0
    ? `${item?.usdtPrize}USDT`
    : item?.usdtPrize === 0 && item?.pointPrize > 0
    ? `${item?.pointPrize} Pts.`
    : `${item?.usdtPrize}USDT + ${item?.pointPrize} Pts.`;

const PerformanceTag = (props: any) => {
  const { title, type, volList = null, rank = '', val = '', reward = '', pointPrize = 0, usdtPrize = 0, isSide = false } = props;

  const [defaultVolRecord, setDefaultVolRecord] = useState(!volList ? 0 : volList.length - 1);
  const numberVal = Number(val);
  // const displayNumber = numberVal === 0 ? '0.00' : numberVal.toFixed(2);
  // console.log({ type, displayNumber });

  const showReward =
    pointPrize === 0 && usdtPrize === 0
      ? '-'
      : pointPrize === 0 && usdtPrize > 0
      ? `${usdtPrize}USDT`
      : usdtPrize === 0 && pointPrize > 0
      ? `${pointPrize} Pts.`
      : `${usdtPrize}USDT + ${pointPrize} Pts.`;

  let contentTitle = '';
  switch (type) {
    case 0:
      contentTitle = 'Trading Vol.';
      break;

    case 1:
      contentTitle = 'Realized P/L';
      break;

    case 2:
      contentTitle = 'Total Fund. Payment';
      break;

    case 3:
      contentTitle = 'Team Trad. Vol';
      break;

    default:
      break;
  }

  const selectedVol = volList ? volList[defaultVolRecord] : null;

  return (
    <div className="relative mr-[24px]">
      <div
        className="relative h-[362px] w-[242px] overflow-hidden
                rounded-[12px] border-[0.5px] border-[#FFD39240] bg-[#0C0D20CC]
                bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[rgba(72,50,24,0.7)] to-50%">
        <div
          className="h-full w-full bg-[url('/images/components/userprofile/profilecardbg.png')] 
    bg-cover bg-[center_bottom_-3rem] bg-no-repeat px-[36px] py-[24px]">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-start text-[16px] font-[600]">
              {/* <Image src="/images/components/competition/revamp/performance-icon.svg" width={16} height={16} alt="" className="mr-[4px]" /> */}
              {title}
            </div>
            {type === 0 ? <div className="mt-[4px] text-[12px] font-[400]">{`(Week ${selectedVol.week})`}</div> : null}
            <div className={`${type === 0 ? 'mt-[16px]' : 'mt-[36px]'} text-[12px] font-[400] text-[#FFD392]`}>Leaderboard Rank</div>
            <div className="mt-[6px] text-[20px] font-[600]">{!rank ? '0' : rank}</div>
            <div className="mt-[18px] text-[12px] font-[400] text-[#FFD392]">{contentTitle}</div>
            <div
              className={`mt-[6px] flex items-center text-[16px] font-[600] ${
                isSide ? (numberVal > 0 ? 'text-marketGreen' : numberVal < 0 ? 'text-marketRed' : '') : ''
              }`}>
              <Image src="/images/common/symbols/eth-tribe3.svg" className="mr-[6px]" width={16} height={16} alt="" />
              {isSide ? (numberVal > 0 ? '+' : '') : ''}
              {numberVal.toFixed(2)}
            </div>
            <div className="mt-[18px] text-[12px] font-[400] text-[#FFD392]">Reward</div>
            <div className="mt-[6px] text-[14px] font-[400]">{showReward}</div>
            <div
              className="mt-[28px] flex min-w-[173px] cursor-pointer flex-row items-center justify-center
          rounded-[4px] border-[0.5px] border-[#FFD39240] py-[8px] pl-[8px] text-[12px] font-[400] text-[#FFD392] hover:bg-[#FFD39233]"
              onClick={() => {
                $activeTab.set(type);
              }}>
              View Leaderboard
              <Image src="/images/components/userprofile/arrow_right.svg" alt="" width={16} height={16} />
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
      {volList ? (
        <div className="absolute bottom-[-16px] flex w-full items-center justify-center">
          {volList.map((_item: any, index: any) => (
            <div
              className={`h-[8px] w-[8px] cursor-pointer rounded-[50%] hover:bg-[#D9D9D9] ${
                index === defaultVolRecord ? 'bg-[#D9D9D9]' : 'bg-[#D9D9D980]'
              } ${index + 1 < volList.length ? 'mr-[8px]' : ''}`}
              onClick={() => setDefaultVolRecord(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const Divider = () => <div className="h-[1px] w-full bg-[#2E4371]" />;

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

const volList = [
  { week: 1, rank: 250, vol: 0.5, reward: 5 },
  { week: 2, rank: 10, vol: 100.5, reward: 500 }
];

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

const ReferreeModal = (props: any) => {
  const { myRefererTeamList } = props;
  const isShowReferralModal = useStore($isShowReferralModal);
  const userInfo = useStore($userInfo);

  const closeModal = () => $isShowReferralModal.set(false);

  if (!isShowReferralModal) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-20 h-full
       w-full bg-black/[.2] backdrop-blur-[4px]"
      onClick={closeModal}>
      <div
        className="relative mx-auto mt-[160px] max-w-[940px]
          rounded-[12px] bg-darkBlue text-[14px]
          font-normal leading-[17px] text-mediumEmphasis"
        onClick={e => {
          e.stopPropagation();
        }}>
        <div className="h-[528px] grow rounded-[6px] border-[1px] border-[#2E4371] bg-[#0C0D20] text-[#fff]">
          <div className="mr-[16px] mt-[16px] flex justify-end">
            <Image
              src="/images/components/common/modal/close.svg"
              alt=""
              className="button cursor-pointer"
              width={16}
              height={16}
              onClick={closeModal}
            />
          </div>
          <div className="flex items-center justify-between px-[36px] pt-[8px]">
            <div className="text-[16px] font-[600]">Contribution Details</div>
            <div className="text-[12px] font-[400]">
              Total Referees : <span className="text-[14px] font-[600]">{myRefererTeamList.length}</span>{' '}
              {/* <span className="text-[15px]">/ {referrers.length}</span> */}
            </div>
          </div>
          {myRefererTeamList.length > 0 ? (
            <div className="mt-[36px]">
              <div className="px-[36px]">
                <Cell
                  items={['User ID', 'Trading Vol.', 'Contribution', 'Reward']}
                  classNames={['col-span-3 text-[12px]', 'col-span-3 text-[12px]', 'col-span-3 text-[12px]', 'col-span-3 text-[12px]']}
                />
              </div>
              <div className="mt-[24px] max-h-[360px] overflow-y-scroll">
                {myRefererTeamList.map((item: any) => {
                  const isCurrentUser =
                    item.userAddress.toLowerCase() === userInfo?.userAddress.toLowerCase() || item.username === userInfo?.username;
                  const vol = formatBigInt(item.tradedVolume).toFixed(2);
                  const reward = itemShowReward(item);
                  const displayUsername =
                    item.username === ''
                      ? `${item.userAddress.substring(0, 7)}...${item.userAddress.slice(-3)}`
                      : item.username.length > 10
                      ? `${item.username.substring(0, 10)}...`
                      : item.username;

                  return (
                    <div className="grid grid-cols-12 items-center px-[36px] py-[16px] text-[14px] odd:bg-[#202249]">
                      <div className={`relative col-span-3 flex items-center ${!isCurrentUser ? 'pr-[40px]' : 'pr-[70px]'}`}>
                        <div className="absolute left-[-10px] top-0 h-full w-[3px] rounded-[30px] bg-primaryBlue" />
                        <div className="truncate">{displayUsername}</div>
                        {isCurrentUser ? <div className="rounded-[2px] bg-[#E06732] px-[4px] py-0 text-[8px] font-[800] ">YOU</div> : null}
                      </div>
                      {/* <div className="relative col-span-2">
                        {item.isEligible ? (
                          <Image
                            src="/images/components/competition/revamp/my-performance/eligible.svg"
                            width={16}
                            height={16}
                            alt=""
                            className="absolute left-[-20px] top-[0px]"
                          />
                        ) : null}
                        {item.isEligible ? 'Eligible' : 'Not Eligible'}
                      </div> */}
                      <div className="col-span-3 flex items-center">
                        <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                        {vol}
                      </div>
                      <div className="col-span-3 font-[600] text-[#FFC24B]">{`${!item.isEligible ? '-' : `${item.contribution}%`}`}</div>
                      <div className="col-span-3">
                        <div className="flex w-fit items-center rounded-[12px] bg-[#2E4371] px-[12px] py-[4px]">
                          <Image
                            src="/images/components/competition/revamp/my-performance/reward.svg"
                            width={16}
                            height={16}
                            alt=""
                            className="mr-[10px]"
                          />
                          {reward}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* <div className="mt-[16px] px-[36px] text-[12px] text-mediumEmphasis">
                Referees with at least <span className="font-[600] text-[#fff]">1 WETH</span> trading volume will be counted as eligible
                referees.
              </div> */}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[15px] font-[400] text-mediumEmphasis">
              List is empty, start sharing your referral link now!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MyReferralTeam = (props: any) => {
  const { copyTextFunc, referralCode, displayUsername, setIsShowShareModal, referralTeamList, referralUserItem } = props;

  const teamRank = referralUserItem?.rank;
  const teamPoint = referralUserItem?.teamPointPrize;
  const teamUsdt = referralUserItem?.teamUsdtPrize;
  const personalPoint = referralUserItem?.pointPrize;
  const personalUsdt = referralUserItem?.usdtPrize;
  const teamVol = referralUserItem?.totalVolume;

  const copyUserUrl = () => {
    copyTextFunc(`https://app.tribe3.xyz/airdrop/refer?ref=${referralCode || ''}`);
    showOutlineToast({ title: 'Referral link copied to clipboard!' });
  };

  const showTeamReward =
    teamPoint === 0 && teamUsdt === 0
      ? '-'
      : teamPoint === 0 && teamUsdt > 0
      ? `${teamUsdt}USDT`
      : teamUsdt === 0 && teamPoint > 0
      ? `${teamPoint} Pts.`
      : `${teamUsdt}USDT + ${teamPoint} Pts.`;

  const showPersonalReward =
    personalPoint === 0 && personalUsdt === 0
      ? '-'
      : personalPoint === 0 && personalUsdt > 0
      ? `${personalUsdt}USDT`
      : personalUsdt === 0 && personalPoint > 0
      ? `${personalPoint} Pts.`
      : `${personalUsdt}USDT + ${personalPoint} Pts.`;

  return (
    <div>
      <div className="mt-[78px]">
        <div className="mt-[16px] flex items-center justify-center text-[18pt] font-[700] ">
          <Image src="/images/components/competition/revamp/my-performance/crown.svg" alt="" width={24} height={24} className="mr-[6px]" />
          My Referral Team
        </div>
      </div>
      <div className="mt-[36px] w-full">
        <div className="flex items-center">
          <div className="mr-[36px] h-[528px] min-w-[388px] rounded-[6px] border-[1px] border-[#2E4371] bg-[#1B1C30]">
            <div
              className="flex items-center rounded-t-[12px] bg-[#3A1A18] 
            bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#8C6E4B] to-50% p-[36px]">
              <Image src="/images/components/competition/revamp/my-performance/referrer-master.svg" width={43} height={57} alt="" />
              <div className="ml-[12px] flex flex-col justify-between">
                <div className="text-[12px] font-[400]">Team Lead</div>
                <div className="mt-[8px] flex items-center">
                  <div className="mr-[8px] bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-[20px] font-[600] text-transparent">
                    {displayUsername}
                  </div>
                  <div className="rounded-[2px] bg-[#E06732] px-[4px] py-[2px] text-[8px] font-[800] ">YOU</div>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex items-stretch justify-between px-[36px] py-[24px]">
              <div className="flex flex-col items-center justify-between">
                <div className="text-[12px] font-[400] text-[#FFD392]">Team Rank</div>
                <div className="text-[15px] font-[600]">{teamRank}</div>
              </div>
              <div className="flex flex-col items-center justify-between">
                <div className="text-[12px] font-[400] text-[#FFD392]">Team Reward</div>
                <div className="text-[15px] font-[600]">{showTeamReward}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-center text-[12px] font-[400] text-[#FFD392]">Team Trad. Vol</div>
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
                    onClick={copyUserUrl}>
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
          <div className="h-[528px] grow rounded-[6px] border-[1px] border-[#2E4371] bg-[#0C0D20] py-[36px]">
            <div className="flex items-center justify-between px-[36px]">
              <div className="text-[16px] font-[600]">My Team Member</div>
              <div className="text-[12px] font-[400]">
                No. of Member : <span className="font-[600]">{referralTeamList.length}</span>{' '}
                {/* <span className="text-[15px]">/ {referrers.length}</span> */}
              </div>
            </div>
            {referralTeamList.length > 0 ? (
              <div className="mt-[36px]">
                <div className="px-[36px]">
                  <Cell
                    items={['User ID', 'Trading Vol.', 'Contribution', 'Reward']}
                    classNames={['col-span-3 text-[12px]', 'col-span-3 text-[12px]', 'col-span-3 text-[12px]', 'col-span-3 text-[12px]']}
                  />
                </div>
                <div className="mt-[24px] max-h-[360px] overflow-y-scroll">
                  {referralTeamList.map((item: any) => {
                    const username =
                      item.username === ''
                        ? `${item.userAddress.substring(0, 7)}...${item.userAddress.slice(-3)}`
                        : item.username.length > 10
                        ? `${item.username.substring(0, 10)}...`
                        : item.username;

                    return (
                      <div className="grid grid-cols-12 items-center px-[36px] py-[16px] text-[14px] odd:bg-[#202249]">
                        <div className="relative col-span-3 items-center">
                          <div className="absolute left-[-10px] top-0 h-full w-[3px] rounded-[30px] bg-primaryBlue" />
                          <div className="truncate pr-[40px]">{username}</div>
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
                        <div className="col-span-3 flex items-center">
                          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                          {formatBigInt(item.tradedVolume).toFixed(2)}
                        </div>
                        <div className="col-span-3 font-[600] text-[#FFC24B]">{`${
                          Number(item.distribution) === 0 ? '-' : `${Number(item.distribution).toFixed(1)}%`
                        }`}</div>
                        <div className="col-span-3">
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
                      </div>
                    );
                  })}
                </div>
                {/* <div className="mt-[16px] px-[36px] text-[12px] text-mediumEmphasis">
                        Referees with at least <span className="font-[600] text-[#fff]">1 WETH</span> trading volume will be counted as
                        eligible referees.
                      </div> */}
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[15px] font-[400] text-mediumEmphasis">
                List is empty, start sharing your referral link now!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReferrerTeamJoined = (props: any) => {
  const { myRefererUserItem, myRefererTeamList } = props;

  const userInfo = useStore($userInfo);

  const displayUsername =
    myRefererUserItem.username === ''
      ? `${myRefererUserItem.userAddress.substring(0, 7)}...${myRefererUserItem.userAddress.slice(-3)}`
      : myRefererUserItem.username.length > 10
      ? `${myRefererUserItem.username.substring(0, 10)}...`
      : myRefererUserItem.username;

  const rank = myRefererUserItem?.rank;
  const volume = myRefererUserItem?.totalVolume;
  const teamPoint = myRefererUserItem?.teamPointPrize;
  const teamUsdt = myRefererUserItem?.teamUsdtPrize;
  const personalPoint = myRefererUserItem?.pointPrize;
  const personalUsdt = myRefererUserItem?.usdtPrize;

  const showTeamReward =
    teamPoint === 0 && teamUsdt === 0
      ? '-'
      : teamPoint === 0 && teamUsdt > 0
      ? `${teamUsdt}USDT`
      : teamUsdt === 0 && teamPoint > 0
      ? `${teamPoint} Pts.`
      : `${teamUsdt}USDT + ${teamPoint} Pts.`;

  const showPersonalReward =
    personalPoint === 0 && personalUsdt === 0
      ? '-'
      : personalPoint === 0 && personalUsdt > 0
      ? `${personalUsdt}USDT`
      : personalUsdt === 0 && personalPoint > 0
      ? `${personalPoint} Pts.`
      : `${personalUsdt}USDT + ${personalPoint} Pts.`;

  const showContribution = myRefererTeamList.filter((item: any) => item.userAddress === userInfo?.userAddress)[0]?.distribution || 0;

  return (
    <div>
      <div className="mt-[78px]">
        <div className="mt-[16px] flex items-center justify-center text-[18pt] font-[700] ">Referral Team I Joined</div>
      </div>
      <div className="mt-[36px] flex items-center justify-center">
        <div className="w-[765px] rounded-[6px] border-[1px] border-[#2E4371] bg-[#1B1C30]">
          <div className="flex flex-col">
            <div className="grid grid-cols-12 rounded-t-[6px] bg-[#0C0D20]">
              <div
                className="col-span-5 flex items-center border-b-[1px] border-r-[1px]
              border-[#2E4371] px-[60px] py-[36px]">
                <Image src="/images/components/competition/revamp/my-performance/referrer-master.svg" width={43} height={57} alt="" />
                <div className="ml-[12px] flex flex-col justify-between">
                  <div className="text-[12px] font-[400]">My Referrer</div>
                  <div className="mt-[8px] truncate bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-[20px] font-[600] text-transparent">
                    {displayUsername}
                  </div>
                </div>
              </div>
              <div
                className="col-span-7 border-b-[1px] border-[#2E4371] px-[52px]
              py-[36px]">
                <div className="flex justify-between">
                  <div className="flex flex-col items-center justify-between text-center">
                    <div className="text-[12px] font-[400] text-[#FFD392]">Team Rank</div>
                    <div className="mt-[6px] text-[16px] font-[600]">{rank}</div>
                  </div>
                  <div className="flex flex-col items-center justify-between text-center">
                    <div className="text-[12px] font-[400] text-[#FFD392]">
                      Referee’s Total <br /> Trad. Vol
                    </div>
                    <div className="mt-[6px] flex items-center justify-center text-[16px] font-[600]">
                      <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                      {formatBigInt(volume).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-between text-center">
                    <div className="text-[12px] font-[400] text-[#FFD392]">Team Reward</div>
                    <div className="mt-[6px] text-[15px] font-[600]">{showTeamReward}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pb-[16px] pt-[36px]">
              <div className="relative flex items-center justify-between px-[176px]">
                <div className="flex flex-col items-center justify-between text-center">
                  <div className="text-[12px] font-[400] text-[#FFD392]">My Contribution</div>
                  <div className="mt-[6px] text-[24px] font-[700] text-[#FFC24B]">{`${showContribution.toFixed(2)}%`}</div>
                </div>
                <div className="flex flex-col items-center justify-between text-center">
                  <div className="text-[12px] font-[400] text-[#FFD392]">My Reward</div>
                  <div className="mt-[6px] text-[24px] font-[700]">{showPersonalReward}</div>
                </div>
              </div>
              <div className="mx-[24px] mt-[32px] flex justify-end">
                {/* <div className="text-[12px]">
                  Trade at least <span className="font-[600] text-[#fff]">1 WETH</span> trading volume to be eligible referee.{' '}
                  <span className="text-[#FFC24B]">(0.99 / 1.00)</span>
                </div> */}
                <div
                  className="flex cursor-pointer items-center text-[14px] font-[600] text-primaryBlue"
                  onClick={() => $isShowReferralModal.set(true)}>
                  <Image
                    src="/images/components/competition/revamp/my-performance/details.svg"
                    width={16}
                    height={16}
                    alt=""
                    className="mr-[4px]"
                  />
                  Contribution Details
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyPerformance = () => {
  const { address } = useAccount();

  const isConnected = useStore($userIsConnected);
  const userInfo = useStore($userInfo);
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

  const [isShowShareModal, setIsShowShareModal] = useState(false);

  const copyTextFunc = (text: any) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    }
  };

  const copyCode = (targetElement: any, text = '', isUrlOnly = true) => {
    copyTextFunc(`${isUrlOnly ? 'https://app.tribe3.xyz/airdrop/refer?ref=' : ''}${text || referralCode}`);
  };

  const shareToCopyText = () => `📢 Use my referral link to enjoy extra Tribe3 points!
  🎉 Long & short Blue-chips NFTs with leverage at any amount on ${referralCode?.toUpperCase()}`;

  const shareToTwitter = () => {
    // logHelper('reward_my_referral_code_share_twitter_pressed', walletProvider.holderAddress, { page: 'Reward' });
    setIsShowShareModal(false);
    const encodeItem = `🎉 Long & short Blue-chips NFTs with leverage at any amount on
      https://app.tribe3.xyz/airdrop/refer?ref=${referralCode?.toUpperCase()}
      \n📢 Use my referral link to enjoy extra Tribe3 points!
      \n@Tribe3Official`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(encodeItem)}`);
  };

  useEffect(() => {
    $triggerKey.set(!$triggerKey.get());
  }, [address]);

  return (
    <>
      <MyPerformanceMobile />
      <div className="hidden md:block">
        {!isConnected ? (
          <div className="mt-[72px] flex items-center justify-center text-[16px] text-mediumEmphasis">
            Please connect to your wallet to get started
          </div>
        ) : (
          <div>
            <div className="mt-[16px] flex items-center justify-center text-[18pt] font-[700] ">General Performance</div>
            <div className="mt-[36px] flex flex-row items-center justify-center">
              <PerformanceTag
                title="Top Vol"
                type={0}
                volList={volList}
                rank={topVolumeUserItem?.rank}
                val={topVolumeUserItem?.weeklyTradedVolume}
                pointPrize={topVolumeUserItem?.pointPrize}
                usdtPrize={topVolumeUserItem?.usdtPrize}
              />
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
                title="FP"
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
              copyTextFunc={copyTextFunc}
              referralCode={referralCode}
              displayUsername={displayUsername}
              setIsShowShareModal={setIsShowShareModal}
              referralTeamList={referralTeamList}
              referralUserItem={referralUserItem}
            />

            {myRefererUserItem ? (
              <>
                <ReferrerTeamJoined myRefererUserItem={myRefererUserItem} myRefererTeamList={myRefererTeamList} />
                <ReferreeModal myRefererTeamList={myRefererTeamList} />
              </>
            ) : null}

            {isShowShareModal ? (
              <ShareModal
                setIsShow={setIsShowShareModal}
                referralCode={referralCode}
                copyCode={copyCode}
                shareToTwitter={shareToTwitter}
                shareToCopyText={shareToCopyText}
              />
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default MyPerformance;
