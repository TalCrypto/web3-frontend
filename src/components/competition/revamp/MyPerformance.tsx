/* eslint-disable max-len */
import React, { FC, useState } from 'react';
import { $userIsConnected, $userInfo } from '@/stores/user';
import { useStore } from '@nanostores/react';
import Image from 'next/image';
import { atom } from 'nanostores';
import MyPerformanceMobile from '@/components/competition/revamp/mobile/MyPerformanceMobile';
import { $activeTab } from '@/stores/competition';
import { $userPoint, defaultUserPoint } from '@/stores/airdrop';
import { showOutlineToast } from '@/components/common/Toast';
import ShareModal from '@/components/airdrop/desktop/ShareModal';

const $isShowReferralModal = atom(false);

const PerformanceTag = (props: any) => {
  const { title, type, leaderboardRank = 3, volList = null } = props;

  const [defaultVolRecord, setDefaultVolRecord] = useState(!volList ? 0 : volList.length - 1);

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
    <div
      className="relative mr-[24px] h-[362px] w-[242px]
                rounded-[12px] border-[0.5px] border-[#FFD39240] bg-[#0C0D20CC]
                bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[rgba(72,50,24,0.7)] to-50% ">
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
          <div className="mt-[6px] text-[20px] font-[600]">{selectedVol ? selectedVol.rank : leaderboardRank}</div>
          <div className="mt-[18px] text-[12px] font-[400] text-[#FFD392]">{contentTitle}</div>
          <div className="mt-[6px] flex items-center text-[20px] font-[600]">
            <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
            {selectedVol ? selectedVol.vol : leaderboardRank}
          </div>
          <div className="mt-[18px] text-[12px] font-[400] text-[#FFD392]">Reward</div>
          <div className="mt-[6px] text-[14px] font-[400]">{selectedVol ? `${selectedVol.reward}USDT` : '200USDT'}</div>
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
      {volList ? (
        <div className="absolute bottom-[-24px] flex w-full items-center justify-center">
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

const ReferreeModal = () => {
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
              Total Referees : <span className="text-[14px] font-[600]">{referrers.length}</span>{' '}
              {/* <span className="text-[15px]">/ {referrers.length}</span> */}
            </div>
          </div>
          {referrers.length > 0 ? (
            <div className="mt-[36px]">
              <div className="px-[36px]">
                <Cell
                  items={['User ID', 'Status', 'Trading Vol.', 'Contribution', 'Reward']}
                  classNames={[
                    'col-span-3 text-[12px]',
                    'col-span-2 text-[12px]',
                    'col-span-2 text-[12px]',
                    'col-span-2 text-[12px]',
                    'col-span-3 text-[12px]'
                  ]}
                />
              </div>
              <div className="mt-[24px] max-h-[360px] overflow-y-scroll">
                {referrers.map(item => {
                  const isCurrentUser =
                    item.username.toLowerCase() === userInfo?.userAddress.toLowerCase() || item.username === userInfo?.username;

                  return (
                    <div
                      className={`grid grid-cols-12 items-center px-[36px] py-[16px] text-[14px] ${item.isEligible ? 'bg-[#202249]' : ''}`}>
                      <div className={`relative col-span-3 flex items-center ${!isCurrentUser ? 'pr-[40px]' : 'pr-[70px]'}`}>
                        <div className="absolute left-[-10px] top-0 h-full w-[3px] rounded-[30px] bg-primaryBlue" />
                        <div className="truncate">{item.username}</div>
                        {isCurrentUser ? <div className="rounded-[2px] bg-[#E06732] px-[4px] py-0 text-[8px] font-[800] ">YOU</div> : null}
                      </div>
                      <div className="relative col-span-2">
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
                      </div>
                      <div className="col-span-2 flex items-center">
                        <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                        {item.vol.toFixed(2)}
                      </div>
                      <div className="col-span-2 font-[600] text-[#FFC24B]">{`${!item.isEligible ? '-' : `${item.contribution}%`}`}</div>
                      <div className="col-span-3">
                        <div className="flex w-fit items-center rounded-[12px] bg-[#2E4371] px-[12px] py-[4px]">
                          <Image
                            src="/images/components/competition/revamp/my-performance/reward.svg"
                            width={16}
                            height={16}
                            alt=""
                            className="mr-[10px]"
                          />
                          {!item.isEligible ? '-' : `${item.reward}USDT`}
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

const MyPerformance = () => {
  const isConnected = useStore($userIsConnected);
  const userInfo = useStore($userInfo);
  const userPointData = useStore($userPoint);

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

  const copyUserUrl = () => {
    copyTextFunc(`https://app.tribe3.xyz/airdrop/refer?ref=${referralCode || ''}`);
    showOutlineToast({ title: 'Referral link copied to clipboard!' });
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
              <PerformanceTag title="Top Vol." type={0} leaderboardRank={3} volList={volList} />
              <PerformanceTag title="Top Gainer" type={1} leaderboardRank={5} />
              <PerformanceTag title="FP" type={2} leaderboardRank={99} />
              <PerformanceTag title="Top Referrer" type={3} leaderboardRank={100} />
            </div>
            <div className="mt-[78px]">
              <div className="mt-[16px] flex items-center justify-center text-[18pt] font-[700] ">
                <Image
                  src="/images/components/competition/revamp/my-performance/crown.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="mr-[6px]"
                />
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
                      <div className="text-[15px] font-[600]">12</div>
                    </div>
                    <div className="flex flex-col items-center justify-between">
                      <div className="text-[12px] font-[400] text-[#FFD392]">Team Reward</div>
                      <div className="text-[15px] font-[600]">400USDT</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-center text-[12px] font-[400] text-[#FFD392]">Team Trad. Vol</div>
                      <div className="mt-[6px] text-[15px] font-[600]">55.00</div>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex items-center justify-center px-[36px] py-[24px]">
                    <div className="text-center">
                      <div className="text-[20px] font-[600] text-[#FFD392]">My Reward</div>
                      <div className="mt-[6px] text-[12px] font-[400] text-[#FFD392]">(50% of Team Reward)</div>
                      <div className="mt-[12px] text-[20px] font-[600]">100USDT</div>
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
                      No. of Member : <span className="font-[600]">{referrers.length}</span>{' '}
                      {/* <span className="text-[15px]">/ {referrers.length}</span> */}
                    </div>
                  </div>
                  {referees.length > 0 ? (
                    <div className="mt-[36px]">
                      <div className="px-[36px]">
                        <Cell
                          items={['User ID', 'Trading Vol.', 'Contribution', 'Reward']}
                          classNames={[
                            'col-span-3 text-[12px]',
                            'col-span-3 text-[12px]',
                            'col-span-3 text-[12px]',
                            'col-span-3 text-[12px]'
                          ]}
                        />
                      </div>
                      <div className="mt-[24px] max-h-[360px] overflow-y-scroll">
                        {referees.map(item => (
                          <div className="grid grid-cols-12 items-center px-[36px] py-[16px] text-[14px] odd:bg-[#202249]">
                            <div className="relative col-span-3 items-center">
                              <div className="absolute left-[-10px] top-0 h-full w-[3px] rounded-[30px] bg-primaryBlue" />
                              <div className="truncate pr-[40px]">{item.username}</div>
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
                              {item.vol.toFixed(2)}
                            </div>
                            <div className="col-span-3 font-[600] text-[#FFC24B]">{`${
                              !item.isEligible ? '-' : `${item.contribution}%`
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
                                {!item.isEligible ? '-' : `${item.reward}USDT`}
                              </div>
                            </div>
                          </div>
                        ))}
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
                        <div className="mt-[8px] bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-[20px] font-[600] text-transparent">
                          Tribe3OG
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-span-7 border-b-[1px] border-[#2E4371] px-[52px]
              py-[36px]">
                      <div className="flex justify-between">
                        <div className="flex flex-col items-center justify-between text-center">
                          <div className="text-[12px] font-[400] text-[#FFD392]">Team Rank</div>
                          <div className="mt-[6px] text-[16px] font-[600]">2</div>
                        </div>
                        <div className="flex flex-col items-center justify-between text-center">
                          <div className="text-[12px] font-[400] text-[#FFD392]">
                            Referee’s Total <br /> Trad. Vol
                          </div>
                          <div className="mt-[6px] flex items-center justify-center text-[16px] font-[600]">
                            <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                            255.00
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-between text-center">
                          <div className="text-[12px] font-[400] text-[#FFD392]">Team Reward</div>
                          <div className="mt-[6px] text-[15px] font-[600]">1000USDT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pb-[16px] pt-[36px]">
                    <div className="relative flex items-center justify-between px-[176px]">
                      <div className="flex flex-col items-center justify-between text-center">
                        <div className="text-[12px] font-[400] text-[#FFD392]">My Contribution</div>
                        <div className="mt-[6px] text-[24px] font-[700] text-[#FFC24B]">50%</div>
                      </div>
                      <div className="flex flex-col items-center justify-between text-center">
                        <div className="text-[12px] font-[400] text-[#FFD392]">My Reward</div>
                        <div className="mt-[6px] text-[24px] font-[700]">250USDT</div>
                      </div>
                    </div>
                    <div className="mx-[24px] mt-[32px] flex justify-between">
                      <div className="text-[12px]">
                        Trade at least <span className="font-[600] text-[#fff]">1 WETH</span> trading volume to be eligible referee.{' '}
                        <span className="text-[#FFC24B]">(0.99 / 1.00)</span>
                      </div>
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

            <ReferreeModal />
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
