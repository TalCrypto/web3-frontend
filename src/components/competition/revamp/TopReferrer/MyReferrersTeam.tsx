/* eslint-disable no-unused-vars */
import Image from 'next/image';
import React from 'react';
import { $isShowContributionModal } from '@/stores/competition';
import { ContributionModal } from './ContributionDetail';

const MyReferrersTeam = () => {
  const foo = 'bar';
  return (
    <div className="px-5 py-6 lg:p-0">
      <div className="lg:mt-[78px]">
        <div className="text-h4 lg:mt-[16px] lg:flex lg:items-center lg:justify-center lg:text-[18pt] lg:font-[700] ">
          Referral Team I Joined
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center lg:mt-[36px]">
        <div className="rounded-[6px] border-[1px] border-[#2E4371] bg-secondaryBlue lg:w-[765px]">
          <div className="flex flex-col">
            <div className="grid grid-cols-12 rounded-t-[6px] bg-[#0C0D20]">
              <div
                className="col-span-6 flex items-center border-b-[1px] border-[#2E4371] p-6
              lg:col-span-5 lg:border-r-[1px] lg:px-[60px] lg:py-[36px]">
                <Image src="/images/components/competition/revamp/my-performance/referrer-master.svg" width={43} height={57} alt="" />
                <div className="ml-[12px] flex flex-col justify-between">
                  <div className="text-[12px] font-[400]">My Team Lead</div>
                  <div
                    className="mt-[8px] bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-b1e text-transparent 
                  lg:text-[20px] lg:font-[600]">
                    Tribe3OG
                  </div>
                </div>
              </div>
              <div
                className="col-span-6 border-b-[1px] border-[#2E4371] p-6 lg:col-span-7 lg:px-[52px]
              lg:py-[36px]">
                <div className="flex justify-center lg:justify-between">
                  <div className="flex flex-col items-center justify-between text-center">
                    <div className="text-[12px] font-[400] text-[#FFD392]">Team Rank</div>
                    <div className="mt-[6px] text-[16px] font-[600]">2</div>
                  </div>
                  <div className="hidden flex-col items-center justify-between text-center lg:flex">
                    <div className="text-[12px] font-[400] text-[#FFD392]">Team Trad. Vol</div>
                    <div className="mt-[6px] flex items-center justify-center text-[16px] font-[600]">
                      <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                      255.00
                    </div>
                  </div>
                  <div className="hidden flex-col items-center justify-between text-center lg:flex">
                    <div className="text-[12px] font-[400] text-[#FFD392]">Team Reward</div>
                    <div className="mt-[6px] text-[15px] font-[600]">1000USDT</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 lg:pb-[16px] lg:pt-[36px]">
              <div className="relative flex items-center justify-between lg:px-[176px]">
                <div className="flex flex-col items-center justify-between text-center">
                  <div className="text-[12px] font-[400] text-[#FFD392]">My Contribution</div>
                  <div className="mt-[6px] text-h5 text-[#FFC24B] lg:text-h4">50%</div>
                </div>
                <div className="flex flex-col items-center justify-between text-center">
                  <div className="text-[12px] font-[400] text-[#FFD392]">My Reward</div>
                  <div className="mt-[6px] text-h5 lg:text-h4">250USDT</div>
                </div>
              </div>
              <div className="mx-[24px] mt-[32px] hidden justify-between lg:flex">
                <div className="text-[12px]">
                  {/*
                  Trade at least <span className="font-[600] text-[#fff]">1 WETH</span> trading volume to be eligible referee.{' '}
                  <span className="text-[#FFC24B]">(0.99 / 1.00)</span>
                  */}
                </div>
                <div
                  className="flex cursor-pointer items-center text-[14px] font-[600] text-primaryBlue"
                  onClick={() => $isShowContributionModal.set(true)}>
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
      <ContributionModal />
    </div>
  );
};

export default MyReferrersTeam;
