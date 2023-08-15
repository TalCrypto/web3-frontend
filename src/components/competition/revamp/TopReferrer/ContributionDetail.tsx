/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import { $isShowContributionModal } from '@/stores/competition';
import { $userInfo } from '@/stores/user';
import { useStore } from '@nanostores/react';
import Image from 'next/image';
import React from 'react';

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

const closeModal = () => $isShowContributionModal.set(false);

export const ContributionDetail = () => {
  const userInfo = useStore($userInfo);
  return (
    <>
      <div className="mb-6 px-5 text-h4 lg:hidden">Contribution Details</div>
      <div className="flex items-center justify-between px-5 lg:px-[36px] lg:pt-[8px]">
        <div className="hidden text-[16px] font-[600] md:block">Contribution Details</div>
        <div className="flex md:hidden">
          <Image src="/images/components/competition/revamp/my-performance/referrer-master.svg" width={24} height={24} alt="" />
          <div className="mt-[8px] bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-b1e text-transparent">
            Tribe3OG&lsquo;s Team
          </div>
        </div>
        <div className="text-[12px] font-[400]">
          Total Referees : <span className="text-[14px] font-[600]">{referrers.length}</span>{' '}
          {/* <span className="text-[15px]">/ {referrers.length}</span> */}
        </div>
      </div>
      {referrers.length > 0 ? (
        <div className="mt-[36px]">
          <div className="px-[36px]">
            <Cell
              items={['User ID', 'Status', 'Trading Volume', 'Contribution', 'Reward', 'Contribution / Trading Volume']}
              classNames={[
                'col-span-8 lg:col-span-3 text-[12px]',
                'col-span-2 text-[12px] hidden lg:block',
                'col-span-2 text-[12px] hidden lg:block',
                'col-span-2 text-[12px] hidden lg:block',
                'col-span-3 text-[12px] hidden lg:block',
                'col-span-4 text-[12px] text-right lg:hidden'
              ]}
            />
          </div>
          <div className="mt-[24px] overflow-y-scroll lg:max-h-[360px]">
            {referrers.map(item => {
              const isCurrentUser =
                item.username.toLowerCase() === userInfo?.userAddress.toLowerCase() || item.username === userInfo?.username;

              return (
                <div className={`grid grid-cols-12 items-center px-[36px] py-[16px] text-[14px] ${item.isEligible ? 'bg-[#202249]' : ''}`}>
                  <div className={`relative col-span-8 flex items-center lg:col-span-3 ${!isCurrentUser ? 'pr-[40px]' : 'pr-[70px]'}`}>
                    <div className="absolute left-[-10px] top-0 h-full w-[3px] rounded-[30px] bg-primaryBlue" />
                    <div className="truncate">{item.username}</div>
                    {isCurrentUser ? <div className="rounded-[2px] bg-[#E06732] px-[4px] py-0 text-[8px] font-[800] ">YOU</div> : null}
                  </div>
                  {/* desktop col */}
                  <div className="relative col-span-2 hidden lg:block">
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
                  <div className="col-span-2 hidden items-center lg:flex">
                    <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                    {item.vol.toFixed(2)}
                  </div>
                  <div className="col-span-2 hidden font-[600] text-[#FFC24B] lg:block">{`${
                    !item.isEligible ? '-' : `${item.contribution}%`
                  }`}</div>
                  <div className="col-span-3 hidden lg:block">
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
                  {/* mobile col */}
                  <div className="col-span-4 flex flex-col items-end lg:hidden">
                    <div className="font-[600] text-[#FFC24B]">{`${!item.isEligible ? '-' : `${item.contribution}%`}`}</div>
                    <div className="flex items-center">
                      <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                      {item.vol.toFixed(2)}
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
    </>
  );
};

export const ContributionModal = () => {
  const isShowContributionModal = useStore($isShowContributionModal);

  if (!isShowContributionModal) return null;

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
          <ContributionDetail />
        </div>
      </div>
    </div>
  );
};
