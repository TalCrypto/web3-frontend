import OutlineButton from '@/components/common/OutlineButton';
import PrimaryButton from '@/components/common/PrimaryButton';
import Image from 'next/image';
import React, { PropsWithChildren } from 'react';

const TableContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <div
    className={`from-[#37387280] to-[#0C0D1F80] text-b2 
        text-mediumEmphasis md:rounded-[6px] md:border md:border-[rgba(113,170,255,0.25)] md:bg-gradient-to-b md:pt-[36px]`}>
    {children}
  </div>
);

const Social: React.FC<PropsWithChildren> = () => {
  const tableData = [
    {
      name: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      name: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      name: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      name: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      name: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      name: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    },
    {
      name: 'EMMMMMMMMY...',
      rank: 6,
      followers: 10
    }
  ];

  return (
    <div className="space-y-[36px]">
      {/* Following table card */}
      <TableContainer>
        <div className="mb-[16px] md:mb-[36px] md:flex md:space-x-2 md:px-[36px]">
          <div className="hidden w-[3px] rounded bg-[#2574FB] md:block" />
          <p className="text-h4 text-highEmphasis md:text-b1e">Following (10)</p>
        </div>

        <div className="scrollable block w-full overflow-auto md:max-h-[300px] md:px-[36px]">
          <table className="w-full items-center text-mediumEmphasis">
            <thead className="hidden md:table-header-group">
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
                  {/* desktop cols */}
                  <td className="hidden py-[10px] md:table-cell">
                    <p>{d.name}</p>
                  </td>
                  <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                    <div className="flex space-x-[-4px]">
                      <Image src="/images/collections/small/azuki.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/bayc.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/doodle.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/cryptopunks.svg" alt="" width={24} height={24} />
                    </div>
                  </td>

                  <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                    <div className="flex space-x-2">
                      <Image src="/images/components/userprofile/leaderboard_rank.svg" alt="" width={20} height={20} />
                      <p>{d.rank}</p>
                    </div>
                  </td>
                  <td className="hidden py-[10px] text-highEmphasis md:table-cell">{d.followers}</td>
                  {/* mobile cols */}
                  <td className="table-cell md:hidden">
                    <div className="flex space-x-2 py-[12px]">
                      <div className="w-[3px] rounded bg-[#2574FB]" />
                      <div className="flex flex-col space-y-2">
                        <p>{d.name}</p>
                        <div className="flex space-x-[-4px]">
                          <Image src="/images/collections/small/azuki.svg" alt="" width={24} height={24} />
                          <Image src="/images/collections/small/bayc.svg" alt="" width={24} height={24} />
                          <Image src="/images/collections/small/doodle.svg" alt="" width={24} height={24} />
                          <Image src="/images/collections/small/cryptopunks.svg" alt="" width={24} height={24} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-[10px] text-highEmphasis">
                    <div className="flex justify-end">
                      <OutlineButton className="w-fit">
                        <p className="font-normal">Unfollow</p>
                      </OutlineButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>
      {/* Follower table card */}
      <TableContainer>
        <div className="mb-[16px] md:mb-[36px] md:flex md:space-x-2 md:px-[36px]">
          <div className="hidden w-[3px] rounded bg-[#2574FB] md:block" />
          <p className="text-h4 text-highEmphasis md:text-b1e">Follower (10)</p>
        </div>

        <div className="scrollable block w-full overflow-auto md:max-h-[300px] md:px-[36px]">
          <table className="w-full items-center text-mediumEmphasis">
            <thead className="hidden md:table-header-group">
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
                  {/* desktop cols */}
                  <td className="hidden py-[10px] md:table-cell">
                    <p>{d.name}</p>
                  </td>
                  <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                    <div className="flex space-x-[-4px]">
                      <Image src="/images/collections/small/azuki.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/bayc.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/doodle.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/cryptopunks.svg" alt="" width={24} height={24} />
                    </div>
                  </td>

                  <td className="hidden py-[10px] text-highEmphasis md:table-cell">
                    <div className="flex space-x-2">
                      <Image src="/images/components/userprofile/leaderboard_rank.svg" alt="" width={20} height={20} />
                      <p>{d.rank}</p>
                    </div>
                  </td>
                  <td className="hidden py-[10px] text-highEmphasis md:table-cell">{d.followers}</td>
                  {/* mobile cols */}
                  <td className="table-cell md:hidden">
                    <div className="flex space-x-2 py-[12px]">
                      <div className="w-[3px] rounded bg-[#2574FB]" />
                      <div className="flex flex-col space-y-2">
                        <p>{d.name}</p>
                        <div className="flex space-x-[-4px]">
                          <Image src="/images/collections/small/azuki.svg" alt="" width={24} height={24} />
                          <Image src="/images/collections/small/bayc.svg" alt="" width={24} height={24} />
                          <Image src="/images/collections/small/doodle.svg" alt="" width={24} height={24} />
                          <Image src="/images/collections/small/cryptopunks.svg" alt="" width={24} height={24} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-[10px] text-highEmphasis">
                    <div className="flex justify-end">
                      <PrimaryButton className="w-fit px-[12px] py-[8px]">
                        <p className="text-[14px] font-normal">Follow</p>
                      </PrimaryButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableContainer>
    </div>
  );
};

export default Social;
