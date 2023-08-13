/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import React from 'react';
import Image from 'next/image';
import { useStore } from '@nanostores/react';
import { $userInfo } from '@/stores/user';
import { useRouter } from 'next/router';

const MyReferrersTeamMobile = (props: any) => {
  const router = useRouter();
  const { myRefererTeamList, myRefererUserItem } = props;

  const userInfo = useStore($userInfo);

  const displayUsername =
    myRefererUserItem?.username === ''
      ? `${myRefererUserItem?.userAddress.substring(0, 7)}...${myRefererUserItem?.userAddress.slice(-3)}`
      : myRefererUserItem?.username.length > 10
      ? `${myRefererUserItem?.username.substring(0, 10)}...`
      : myRefererUserItem?.username;

  const rank = myRefererUserItem?.rank || '-';
  const volume = myRefererUserItem?.totalVolume || 0;
  const teamPoint = myRefererUserItem?.teamPointPrize || 0;
  const teamUsdt = myRefererUserItem?.teamUsdtPrize || 0;
  const personalPoint = myRefererUserItem?.pointPrize || 0;
  const personalUsdt = myRefererUserItem?.usdtPrize || 0;

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
                <Image src="/images/components/competition/revamp/my-performance/referrer-master.svg" width={36} height={36} alt="" />
                <div className="ml-[12px] flex flex-col justify-between">
                  <div className="text-[12px] font-[400]">My Team Lead</div>
                  <div
                    onClick={() => router.push(`/userprofile/${myRefererUserItem?.userAddress}`)}
                    className="mt-[8px] bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-b1e text-transparent 
                lg:text-[20px] lg:font-[600]">
                    {displayUsername}
                  </div>
                </div>
              </div>
              <div
                className="col-span-6 border-b-[1px] border-[#2E4371] p-6 lg:col-span-7 lg:px-[52px]
            lg:py-[36px]">
                <div className="flex justify-center lg:justify-between">
                  <div className="flex flex-col items-center justify-between text-center">
                    <div className="text-[12px] font-[400] text-[#FFD392]">Team Rank</div>
                    <div className="mt-[6px] text-[16px] font-[600]">{rank}</div>
                  </div>
                  <div className="hidden flex-col items-center justify-between text-center lg:flex">
                    <div className="text-[12px] font-[400] text-[#FFD392]">Team Trad. Vol</div>
                    <div className="mt-[6px] flex items-center justify-center text-[16px] font-[600]">
                      <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                      {volume}
                    </div>
                  </div>
                  <div className="hidden flex-col items-center justify-between text-center lg:flex">
                    <div className="text-[12px] font-[400] text-[#FFD392]">Team Reward</div>
                    <div className="mt-[6px] text-[15px] font-[600]">{showTeamReward}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 lg:pb-[16px] lg:pt-[36px]">
              <div className="relative flex items-center justify-between lg:px-[176px]">
                <div className="flex flex-col items-center justify-between text-center">
                  <div className="text-[12px] font-[400] text-[#FFD392]">My Contribution</div>
                  <div className="mt-[6px] text-h5 text-[#FFC24B] lg:text-h4">{`${showContribution.toFixed(1)}%`}</div>
                </div>
                <div className="flex flex-col items-center justify-between text-center">
                  <div className="text-[12px] font-[400] text-[#FFD392]">My Reward</div>
                  <div className="mt-[6px] text-h5 lg:text-h4">{showPersonalReward}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReferrersTeamMobile;
