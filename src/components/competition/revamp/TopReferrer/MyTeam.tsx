/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import { showOutlineToast } from '@/components/common/Toast';
import { $userPoint, defaultUserPoint } from '@/stores/airdrop';
import { $userInfo } from '@/stores/user';
import { useStore } from '@nanostores/react';
import Image from 'next/image';
import React, { useState } from 'react';

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

const MyTeam = () => {
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
                <div className="text-[15px] font-[600]">
                  200USDT
                  <br /> + 1,500Pts
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-center text-[12px] font-[400] text-[#FFD392]">Team Trad. Vol</div>
                <div className="flex justify-end space-x-1 lg:justify-center">
                  <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
                  <p className="text-[15px] font-[600]">99.99</p>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex items-center justify-center px-[36px] py-[24px]">
              <div className="text-center">
                <div className="text-[20px] font-[600] text-[#FFD392]">My Reward</div>
                <div className="mt-[6px] text-[12px] font-[400] text-[#FFD392]">(50% of Team Reward)</div>
                <div className="mt-[12px] text-[20px] font-[600]">100USDT + 750Pts</div>
              </div>
            </div>
            <Divider />
            <div className="flex items-center justify-center px-[22px] py-6 lg:px-[36px] lg:py-[24px]">
              <div>
                <div className="text-center text-[15px] font-[600]">📢 Invitation to my team (Referral Link)</div>
                <div className="mt-[24px] flex items-center justify-between">
                  <button
                    className="mr-[12px] flex items-center justify-center 
                  rounded-[4px] bg-[#2574FB] px-4 py-[10px] text-[15px] font-[600] lg:px-[21px]"
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
                  bg-[#2574FB] px-4 py-[10px] text-[15px] font-[600] lg:px-[21px]"
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
          <div className="-mx-5 grow bg-[#0C0D20] py-[36px] lg:mx-0 lg:h-[528px] lg:rounded-[6px] lg:border-[1px] lg:border-[#2E4371]">
            <div className="flex items-center justify-between px-[36px]">
              <div className="text-[16px] font-[600]">My Team Member</div>
              <div className="text-b3">
                No. of Member:
                <span className="text-b3e"> {referees.length}</span>
              </div>
            </div>
            {referees.length > 0 ? (
              <div className="mt-6 lg:mt-[36px]">
                <div className="px-[36px]">
                  <Cell
                    items={['User ID', 'Trading Vol.', 'Contribution', 'Reward', 'Contribution / Trading Vol.']}
                    classNames={[
                      'col-span-8 lg:col-span-4 text-[12px]',
                      'col-span-2 text-[12px] hidden lg:block',
                      'col-span-3 text-[12px] hidden lg:block',
                      'col-span-3 text-[12px] hidden lg:block',
                      'col-span-4 text-[12px] text-right lg:hidden block'
                    ]}
                  />
                </div>
                <div className="scrollable mt-[24px] overflow-y-scroll lg:max-h-[320px]">
                  {referees.map(item => (
                    <div
                      className={`grid grid-cols-12 items-center px-[36px] py-[16px] text-[14px] ${item.isEligible ? 'bg-[#202249]' : ''}`}>
                      <div className="relative col-span-8 items-center lg:col-span-4">
                        <div className="absolute left-[-10px] top-0 h-full w-[3px] rounded-[30px] bg-primaryBlue" />
                        <div className="truncate pr-[40px]">{item.username}</div>
                      </div>
                      <div className="col-span-2 hidden items-center md:flex">
                        <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                        {item.vol.toFixed(2)}
                      </div>
                      <div className="col-span-3 hidden font-[600] text-[#FFC24B] md:block">{`${
                        !item.isEligible ? '-' : `${item.contribution}%`
                      }`}</div>
                      <div className="col-span-3 hidden md:block">
                        <div
                          className={`flex w-fit items-center rounded-[12px] px-[12px] py-[4px] ${item.isEligible ? 'bg-[#2E4371]' : ''}`}>
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

                      <div className="col-span-4 flex flex-col items-end lg:hidden">
                        <div className="flex items-center">
                          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                          {item.vol.toFixed(2)}
                        </div>
                        <div className="font-[600] text-[#FFC24B]">{`${!item.isEligible ? '-' : `${item.contribution}%`}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
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

export default MyTeam;
