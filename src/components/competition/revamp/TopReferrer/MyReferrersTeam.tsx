/* eslint-disable no-unused-vars */
import Image from 'next/image';
import React from 'react';
import { $isShowContributionModal } from '@/stores/competition';
import { $userInfo } from '@/stores/user';
import { useStore } from '@nanostores/react';
import { formatBigInt } from '@/utils/bigInt';
import { useRouter } from 'next/router';
import { ContributionModal } from './ContributionDetail';

const MyReferrersTeam = (props: any) => {
  const router = useRouter();
  const { myRefererUserItem, myRefererTeamList, setIsShowReferralModal } = props;

  const userInfo = useStore($userInfo);

  const displayUsername =
    myRefererUserItem?.username === ''
      ? `${myRefererUserItem?.userAddress.substring(0, 7)}...${myRefererUserItem?.userAddress.slice(-3)}`
      : myRefererUserItem?.username.length > 10
      ? `${myRefererUserItem?.username.substring(0, 10)}...`
      : myRefererUserItem?.username;

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

  const showContribution = myRefererTeamList?.filter((item: any) => item.userAddress === userInfo?.userAddress)[0]?.distribution || 0;

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
                  <div className="text-[12px] font-[400]">My Team Lead</div>
                  <div
                    onClick={() => router.push(`/userprofile/${myRefererUserItem?.userAddress}`)}
                    className="mt-[8px] cursor-pointer truncate bg-gradient-to-b from-[#FFC977] to-[#fff] 
                  bg-clip-text text-[20px] font-[600] text-transparent">
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
                    <div className="text-[12px] font-[400] text-[#FFD392]">Team Trad. Vol</div>
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
                  <div className="mt-[6px] text-[24px] font-[700] text-[#FFC24B]">{`${showContribution.toFixed(1)}%`}</div>
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
                  onClick={() => setIsShowReferralModal(true)}>
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

export default MyReferrersTeam;
