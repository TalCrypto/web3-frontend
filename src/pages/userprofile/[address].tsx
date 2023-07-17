import React, { FC, PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import PageHeader from '@/components/layout/header/PageHeader';
import Image from 'next/image';
import OutlineButton from '@/components/common/OutlineButton';
import ProfileBadge from '@/components/userprofile/ProfileBadge';
import TabItems from '@/components/userprofile/TabItems';
import { $activeTab, $userprofileAddress } from '@/stores/userprofile';
import { useStore } from '@nanostores/react';
import Portfolio from '@/components/userprofile/Portfolio';
import Activities from '@/components/userprofile/Activities';
import Social from '@/components/userprofile/Social';
import Analysis from '@/components/userprofile/Analysis';
import Link from 'next/link';

function trimAddress(str: string) {
  if (str.length > 10) {
    return `${str.substring(0, 7)}...${str.slice(-3)}`;
  }
  return str;
}

const ProfileHeaderCard: FC<PropsWithChildren> = ({ children }) => (
  <div
    className="basis-1/2 rounded-[12px] bg-[#0C0D20CC] 
                bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] 
              from-[rgba(72,50,24,0.7)] to-50%">
    <div
      className="flex h-full flex-col items-center rounded-[12px] border-[0.5px] border-[#FFD392]  
                  bg-[url('/images/components/userprofile/profilecardbg.png')] bg-cover bg-[center_bottom_-3rem] bg-no-repeat 
                  px-[8px] py-6 md:px-8">
      {children}
    </div>
  </div>
);

const AddressPage: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;
  const activeTab = useStore($activeTab);
  const userprofileAddress = useStore($userprofileAddress);

  const addressTrimmed = address ? trimAddress(address as string) : '';

  useEffect(() => {
    userprofileAddress.set(address);
  }, [address]);

  return (
    <>
      <PageHeader
        title="Profile"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />

      <main className="flex min-h-[calc(100vh-80px)] flex-col">
        <div>
          <div className="content-container">
            <div className="px-[20px] py-[36px] lg:px-0 xl:flex xl:space-x-[48px] xl:p-0">
              <div className="flex-1">
                {/* desktop only search and edit share btn */}
                <div className="mb-[36px] hidden justify-between md:flex">
                  <div className="flex min-w-[280px] space-x-2 rounded-full border border-[#FFFFFF26] bg-white/10 px-4 py-2">
                    <Image src="/images/components/userprofile/search.svg" alt="" width={20} height={20} />
                    <input
                      type="text"
                      className="flex-1 bg-transparent py-[2px] text-b3 outline-none"
                      placeholder="Search user ID / wallet address"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <OutlineButton onClick={() => router.push('/userprofile/edit')}>
                      <p className="font-normal">Edit</p>
                    </OutlineButton>
                    <OutlineButton>
                      <Image src="/images/components/userprofile/share.svg" alt="" width={20} height={20} />
                    </OutlineButton>
                  </div>
                </div>

                {/* username / wallet address */}
                <div className="mb-4 md:flex md:justify-between">
                  <div className="md:flex md:space-x-4">
                    <div className="mb-4 md:mb-0">
                      <p className="bg-gradient-to-b from-[#FFC977]  to-white bg-clip-text text-h2 text-transparent">JEFFGPT9999999</p>
                    </div>
                    <div className="flex justify-between md:block">
                      <div className="flex items-center space-x-[6px]">
                        <p className="text-mediumEmphasis">{addressTrimmed}</p>
                        <Image src="/images/components/userprofile/copy.svg" alt="" width={20} height={20} />
                      </div>
                      <div className="flex space-x-4 md:hidden">
                        <OutlineButton onClick={() => router.push('/userprofile/edit')}>
                          <p className="font-normal">Edit</p>
                        </OutlineButton>
                        <OutlineButton>
                          <Image src="/images/components/userprofile/share.svg" alt="" width={20} height={20} />
                        </OutlineButton>
                      </div>
                    </div>
                  </div>

                  {/* desktop only followers */}
                  <div className="hidden space-x-[16px] md:flex">
                    <div>
                      <p className="text-b1 text-mediumEmphasis">
                        Followers <span className="text-b1e text-highEmphasis">10</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-b1 text-mediumEmphasis">
                        Followers <span className="text-b1e text-highEmphasis">10</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-[24px] space-y-[24px] md:mb-[36px] md:flex md:space-x-[36px] md:space-y-0">
                  {/* badge labels */}
                  <div className="overflow-auto">
                    <div className="flex space-x-[6px]">
                      <ProfileBadge color="sky">WHALE</ProfileBadge>
                      <ProfileBadge color="red">OG</ProfileBadge>
                      <ProfileBadge color="yellow">TOP GAINER</ProfileBadge>
                      <ProfileBadge color="green">PUNK LOVER</ProfileBadge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <p className="text-b1 text-mediumEmphasis">NFT Holding</p>
                    <div className="flex space-x-[-4px]">
                      <Image src="/images/collections/small/azuki.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/bayc.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/doodle.svg" alt="" width={24} height={24} />
                      <Image src="/images/collections/small/cryptopunks.svg" alt="" width={24} height={24} />
                    </div>
                  </div>
                </div>

                {/* mobile only followers */}
                <div className="mb-[24px] flex space-x-[16px] md:hidden">
                  <div>
                    <p className="text-b1 text-mediumEmphasis">
                      Followers <span className="text-b1e text-highEmphasis">10</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-b1 text-mediumEmphasis">
                      Followers <span className="text-b1e text-highEmphasis">10</span>
                    </p>
                  </div>
                </div>

                <div className="mb-[36px] md:flex md:space-x-[36px]">
                  <p className="mb-2 text-b1e text-highEmphasis">About</p>
                  <p className="text-b1 text-highEmphasis">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>
              <div className="flex space-x-[16px] lg:space-x-[24px]">
                {/* cards airdrop */}
                <ProfileHeaderCard>
                  <p className="mb-[36px] flex-1 text-center text-b1e text-[#FFD392]">Airdrop Season 2</p>
                  <p className="mb-[6px] text-b3 text-[#FFD392]">Season 2 Pts</p>
                  <div className="mb-[24px] flex items-center space-x-[6px]">
                    <span className="bg-gradient-to-b from-[#94C655] to-white bg-clip-text text-h5 text-transparent">9999.99</span>
                    <span className="text-b3">Pts</span>
                  </div>
                  <p className="mb-[6px] text-b3 text-[#FFD392]">Leaderboard Rank</p>
                  <p className="mb-[24px] text-h5">5</p>
                  <Link href="/" className="flex rounded border-[0.5px] border-[#FFD392] p-2 text-b3 text-[#FFD392]">
                    View Leaderboard
                    <Image src="/images/components/userprofile/arrow_right.svg" alt="" width={16} height={16} />
                  </Link>
                </ProfileHeaderCard>

                {/* trading competition */}
                <ProfileHeaderCard>
                  <p className="mb-[36px] flex-1 text-center text-b1e text-[#FFD392]">Trading Competition</p>
                  <p className="mb-[6px] text-b3 text-[#FFD392]">Realized P/L</p>
                  <div className="mb-6 flex items-center space-x-[6px]">
                    <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={16} height={16} />
                    <p className="text-h5 text-marketGreen">+2.22</p>
                  </div>
                  <p className="mb-[6px] text-b3 text-[#FFD392]">Top Gainer Rank</p>
                  <p className="mb-[24px] text-h5">5</p>
                  <Link href="/" className="flex rounded border-[0.5px] border-[#FFD392] p-2 text-b3 text-[#FFD392]">
                    View Leaderboard
                    <Image src="/images/components/userprofile/arrow_right.svg" alt="" width={16} height={16} />
                  </Link>
                </ProfileHeaderCard>
              </div>
            </div>

            <TabItems />
          </div>
        </div>

        <div className="flex-1 border-t border-t-[#71AAFF38] bg-[#00000080]">
          <div className="content-container mb-[48px] px-5 py-[48px] md:px-0">
            {activeTab === 0 ? <Portfolio /> : activeTab === 1 ? <Activities /> : activeTab === 2 ? <Social /> : <Analysis />}
          </div>
        </div>
      </main>
    </>
  );
};

export default AddressPage;
