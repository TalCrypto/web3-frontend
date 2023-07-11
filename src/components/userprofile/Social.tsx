import OutlineButton from '@/components/common/OutlineButton';
import PrimaryButton from '@/components/common/PrimaryButton';
import Image from 'next/image';
import React, { PropsWithChildren } from 'react';

const Social: React.FC<PropsWithChildren> = () => {
  const tableData = [
    {
      date: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      date: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      date: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      date: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      date: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      date: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      date: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    }
  ];

  return (
    <div className="space-y-[36px]">
      {/* Following table card */}
      <div
        className={`rounded-[6px] border border-[rgba(113,170,255,0.25)] 
        bg-gradient-to-b from-[#37387280] to-[#0C0D1F80] pt-[36px] text-b2 text-mediumEmphasis`}>
        <div className="mb-[36px] flex space-x-2 px-[36px]">
          <div className="w-[3px] rounded bg-[#2574FB]" />
          <p className="text-b1e text-highEmphasis">Following (10)</p>
        </div>

        <div className="scrollable block max-h-[300px] w-full overflow-auto px-[36px]">
          <table className="w-full items-center text-mediumEmphasis">
            <thead className="">
              <tr className="text-left text-b2">
                <th className="pb-4 font-normal">User ID</th>
                <th className="pb-4 font-normal">Portfolio</th>
                <th className="pb-4 font-normal">Leaderboard Rank</th>
                <th className="pb-4 font-normal">No. of Followers</th>
                <th className="pb-4 font-normal"> </th>
              </tr>
            </thead>
            <tbody className=" text-b1">
              {tableData.map(d => (
                <tr>
                  <td className="py-[10px]">
                    <p>{d.date}</p>
                  </td>
                  <td className="py-[10px] text-highEmphasis">
                    <div className="flex space-x-[-4px]">
                      <Image src="/images/collections/small/azuki.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/bayc.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/doodle.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/cryptopunks.svg" alt="" width={24} height={24} />
                    </div>
                  </td>

                  <td className="py-[10px] text-highEmphasis">
                    <div className="flex space-x-2">
                      <Image src="/images/components/userprofile/leaderboard_rank.svg" alt="" width={20} height={20} />
                      <p>{d.rank}</p>
                    </div>
                  </td>
                  <td className="py-[10px] text-highEmphasis">{d.followers}</td>
                  <td className="py-[10px] text-highEmphasis">
                    <OutlineButton className="w-fit">
                      <p className="font-normal">Unfollow</p>
                    </OutlineButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Follower table card */}
      <div
        className={`rounded-[6px] border border-[rgba(113,170,255,0.25)] 
        bg-gradient-to-b from-[#37387280] to-[#0C0D1F80] pt-[36px] text-b2 text-mediumEmphasis`}>
        <div className="mb-[36px] flex space-x-2 px-[36px]">
          <div className="w-[3px] rounded bg-[#2574FB]" />
          <p className="text-b1e text-highEmphasis">Follower (10)</p>
        </div>

        <div className="scrollable block max-h-[300px] w-full overflow-auto px-[36px]">
          <table className="w-full items-center text-mediumEmphasis">
            <thead>
              <tr className="text-left text-b2">
                <th className="pb-4 font-normal">User ID</th>
                <th className="pb-4 font-normal">Portfolio</th>
                <th className="pb-4 font-normal">Leaderboard Rank</th>
                <th className="pb-4 font-normal">No. of Followers</th>
                <th className="pb-4 font-normal"> </th>
              </tr>
            </thead>
            <tbody className=" text-b1">
              {tableData.map(d => (
                <tr>
                  <td className="py-[10px]">
                    <p>{d.date}</p>
                  </td>
                  <td className="py-[10px] text-highEmphasis">
                    <div className="flex space-x-[-4px]">
                      <Image src="/images/collections/small/azuki.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/bayc.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/doodle.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/cryptopunks.svg" alt="" width={24} height={24} />
                    </div>
                  </td>

                  <td className="py-[10px] text-highEmphasis">
                    <div className="flex space-x-2">
                      <Image src="/images/components/userprofile/leaderboard_rank.svg" alt="" width={20} height={20} />
                      <p>{d.rank}</p>
                    </div>
                  </td>
                  <td className="py-[10px] text-highEmphasis">{d.followers}</td>
                  <td className="py-[10px] text-highEmphasis">
                    <PrimaryButton className="w-fit px-[12px] py-[8px]">
                      <p className="text-[14px] font-normal">Follow</p>
                    </PrimaryButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Social;
