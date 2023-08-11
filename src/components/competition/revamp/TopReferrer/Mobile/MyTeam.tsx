import React from 'react';
import Image from 'next/image';
import { formatBigInt } from '@/utils/bigInt';

const MyTeamMobile = (props: any) => {
  const { displayUsername, setIsShowShareModal, showSnackBar, referralUserItem } = props;

  const teamRank = referralUserItem?.rank;
  const teamPoint = referralUserItem?.teamPointPrize;
  const teamUsdt = referralUserItem?.teamUsdtPrize;
  const personalPoint = referralUserItem?.pointPrize;
  const personalUsdt = referralUserItem?.usdtPrize;
  const teamVol = referralUserItem?.totalVolume;

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
      <div className="px-[20px] pt-[24px]">
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
              <div className="text-[12px] font-[400]">Team Head</div>
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
          <div className="flex items-center justify-center border-b-[1px] border-[#2E4371] px-[36px] py-[24px]">
            <div className="text-center">
              <div className="text-[20px] font-[600] text-[#FFD392]">My Reward</div>
              <div className="mt-[6px] text-[12px] font-[400] text-[#FFD392]">(40% of Team Reward)</div>
              <div className="mt-[12px] text-[20px] font-[600]">{showPersonalReward}</div>
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
    </div>
  );
};

export default MyTeamMobile;
