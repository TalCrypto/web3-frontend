/* eslint-disable no-unused-vars */
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import PageHeader from '@/components/layout/header/PageHeader';
import Image from 'next/image';
import OutlineButton from '@/components/common/OutlineButton';
import ProfileBadge from '@/components/userprofile/ProfileBadge';
import TabItems from '@/components/userprofile/TabItems';
import { $activeTab, $userFollowers, $userFollowings, $userInfo, $userprofileAddress } from '@/stores/userprofile';
import { useStore } from '@nanostores/react';
import Portfolio from '@/components/userprofile/Portfolio';
import Activities from '@/components/userprofile/Activities';
import Social from '@/components/userprofile/Social';
import Analysis from '@/components/userprofile/Analysis';
import Link from 'next/link';
import { showOutlineToast } from '@/components/common/Toast';
import UserprofileUpdater from '@/components/updaters/UserprofileUpdater';

function trimAddress(str: string) {
  if (str.length > 10) {
    return `${str.substring(0, 7)}...${str.slice(-3)}`;
  }
  return str;
}

type ProfileHeaderCardProps = PropsWithChildren & {
  isEnded?: boolean;
};

const ProfileHeaderCard: FC<ProfileHeaderCardProps> = ({ children, isEnded = false }) => (
  <div
    className="relative basis-1/2 overflow-hidden rounded-[12px] bg-[#0C0D20CC] 
                bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] 
              from-[rgba(72,50,24,0.7)] to-50%">
    {isEnded ? (
      <div
        className="absolute left-0 top-0 min-w-[300px] translate-x-[-42%] translate-y-[40%] -rotate-45 
          border border-y-white/50 bg-gradient-to-r from-[#BB3930] 
        via-[#CE716B] to-[#C2342B] py-1 text-center text-[8px] font-semibold text-[#FFF6D7]">
        ENDED
      </div>
    ) : null}
    <div
      className="flex h-full flex-col items-center  rounded-[12px] border-[0.5px] border-[#FFD392]  
                  bg-[url('/images/components/userprofile/profilecardbg.png')] bg-cover bg-[center_bottom_-3rem] bg-no-repeat 
                  px-[8px] py-6 md:px-8">
      {children}
    </div>
  </div>
);

ProfileHeaderCard.defaultProps = {
  isEnded: false
};

const AddressPage: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;
  const activeTab = useStore($activeTab);
  const userInfo = useStore($userInfo);
  const userFollowings = useStore($userFollowings);
  const userFollowers = useStore($userFollowers);
  const userprofileAddress = useStore($userprofileAddress);

  const [showSearchResult, setShowSearchResult] = useState(false);

  const addressTrimmed = address ? trimAddress(address as string) : '';

  useEffect(() => {
    $userprofileAddress.set(address);
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
                  <div className="relative">
                    <div className="flex min-w-[280px] space-x-2 rounded-full border border-[#FFFFFF26] bg-white/10 px-4 py-2">
                      <Image src="/images/components/userprofile/search.svg" alt="" width={20} height={20} />
                      <input
                        type="text"
                        className="flex-1 bg-transparent py-[2px] text-b3 outline-none"
                        placeholder="Search user ID / wallet address"
                        onFocus={() => setShowSearchResult(true)}
                        onBlur={() => setShowSearchResult(false)}
                      />
                    </div>
                    <div className={`absolute ${showSearchResult ? 'visible' : 'invisible'} mt-2 w-full rounded-lg bg-secondaryBlue py-2`}>
                      {/* search result */}
                      <div className="flex space-x-2 p-2 hover:bg-darkBlue/50">
                        <div className="w-[3px] rounded bg-[#2574FB]" />
                        <div className="flex flex-col space-y-2">
                          <p>lorem ipsum</p>
                          <p className="text-xs">NO TITLE</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 p-2 hover:bg-darkBlue/50">
                        <div className="w-[3px] rounded bg-[#2574FB]" />
                        <div className="flex flex-col space-y-2">
                          <p>lorem ipsum</p>
                          <p className="text-xs">NO TITLE</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <OutlineButton onClick={() => router.push('/userprofile/edit')}>
                      <p className="font-normal">Edit</p>
                    </OutlineButton>
                    <OutlineButton
                      onClick={() => {
                        if (typeof address === 'string') {
                          navigator.clipboard.writeText(address);
                          showOutlineToast({ title: 'Profile link copied to clipboard!' });
                        }
                      }}>
                      <Image src="/images/components/userprofile/share.svg" alt="" width={20} height={20} />
                    </OutlineButton>
                  </div>
                </div>

                {/* username / wallet address */}
                <div className="mb-4 md:flex md:justify-between">
                  <div className="md:flex md:space-x-4">
                    <div className="mb-4 md:mb-0">
                      <p className="bg-gradient-to-b from-[#FFC977]  to-white bg-clip-text text-h2 text-transparent">
                        {userInfo?.username || 'Unnamed'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
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
                        Following <span className="text-b1e text-highEmphasis">{userFollowings.length}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-b1 text-mediumEmphasis">
                        Followers <span className="text-b1e text-highEmphasis">{userFollowers.length}</span>
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
                <ProfileHeaderCard isEnded>
                  <p className="z-[1] mb-[36px] flex-1 text-center text-b1e text-[#FFD392]">Trading Competition</p>
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
        <UserprofileUpdater />
      </main>
    </>
  );
};

export default AddressPage;
