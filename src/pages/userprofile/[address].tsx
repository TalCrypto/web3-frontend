/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import PageHeader from '@/components/layout/header/PageHeader';
import Image from 'next/image';
import OutlineButton from '@/components/common/OutlineButton';
import ProfileBadge from '@/components/userprofile/ProfileBadge';
import TabItems from '@/components/userprofile/TabItems';
import {
  $activeTab,
  $asTargetUserInfoUpdateTrigger,
  $userAirdropRank,
  $userCompetitionRank,
  $userFollowers,
  $userFollowings,
  $userInfo,
  $userprofileAddress,
  $userprofilePositionInfos,
  $isUserprofileLoading
} from '@/stores/userprofile';
import { useStore } from '@nanostores/react';
import Portfolio from '@/components/userprofile/Portfolio';
import Activities from '@/components/userprofile/Activities';
import Social from '@/components/userprofile/Social';
import Analysis from '@/components/userprofile/Analysis';
import Link from 'next/link';
import { showOutlineToast } from '@/components/common/Toast';
import UserprofileUpdater from '@/components/updaters/UserprofileUpdater';
import { copyToClp, trimAddress } from '@/utils/string';
import { $userAddress, $userIsConnected } from '@/stores/user';
import PrimaryButton from '@/components/common/PrimaryButton';
import { localeConversion } from '@/utils/localeConversion';
import { formatBigInt } from '@/utils/bigInt';
import { TypeWithIconByAmm } from '@/components/common/TypeWithIcon';
// eslint-disable-next-line import/no-extraneous-dependencies
import { debounce } from 'lodash';
import { SearchUserData, apiConnection } from '@/utils/apiConnection';
import { getAuth } from 'firebase/auth';
import { authConnections } from '@/utils/authConnections';
import { ThreeDots } from 'react-loader-spinner';

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
        className="absolute left-0 top-0 flex min-w-[100px] translate-x-[-25%] translate-y-[50%] 
          -rotate-45 items-center justify-center border 
        border-y-white/50 bg-gradient-to-r from-[#BB3930] via-[#CE716B] to-[#C2342B] py-1 
        text-[8px] font-semibold leading-[9.75px] text-[#FFF6D7]">
        <p>ENDED</p>
      </div>
    ) : null}
    <div
      className="flex h-full flex-col items-center  rounded-[12px] border-[0.5px] border-[#FFD39240]  
                  bg-[url('/images/components/userprofile/profilecardbg.png')] bg-cover bg-[center_bottom_-3rem] bg-no-repeat 
                  px-[8px] py-6 md:px-[18px]">
      {children}
    </div>
  </div>
);

ProfileHeaderCard.defaultProps = {
  isEnded: false
};

const LabelStringMatch = ({ label, match }: { label: string; match: string }) => {
  // split label to span with match
  const regex = new RegExp(`(${match})`, 'i');
  const items = label.split(regex);
  return (
    <p>
      {items?.map((i, idx) => (
        <span key={`lsm-${idx}`} className={`${i === match ? 'text-highEmphasis' : ''}`}>
          {i}
        </span>
      ))}
    </p>
  );
};

const AddressPage: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  const isConnected = useStore($userIsConnected);
  const currentUserAddress = useStore($userAddress);
  const activeTab = useStore($activeTab);
  const userInfo = useStore($userInfo);
  const userprofilePositionInfos: any = useStore($userprofilePositionInfos);
  const userFollowings = useStore($userFollowings);
  const userFollowers = useStore($userFollowers);
  const userprofileAddress = useStore($userprofileAddress);
  const userAirdropRank = useStore($userAirdropRank);
  const userCompetitionRank = useStore($userCompetitionRank);
  const isUserProfileLoading = useStore($isUserprofileLoading);

  const userprofilePositionInfosArrKey = Object.keys(userprofilePositionInfos);

  const userPnl = Number(localeConversion(formatBigInt(userCompetitionRank?.pnl || 0), 2));
  const addressTrimmed = address ? trimAddress(address as string) : '';

  // search function
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResult] = useState<SearchUserData[]>([]);

  useEffect(() => {
    if (searchQuery) {
      setShowSearchResult(true);
    } else {
      setShowSearchResult(false);
    }
  }, [searchQuery]);

  const search = async (val: string, holderAddress: string) => {
    setIsSearchLoading(true);
    if (!val || !holderAddress) {
      setIsSearchLoading(false);
      setSearchResult([]);
      return;
    }
    const res = await apiConnection.searchUser(val, holderAddress);
    if (res.data && res.data.length > 0) {
      setSearchResult(res.data);
    } else {
      setSearchResult([]);
    }
    setIsSearchLoading(false);
  };

  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const unfollow = async () => {
    setIsLoadingFollow(true);
    let auth = getAuth();
    let currentUser = auth?.currentUser;
    const userAddr = currentUserAddress?.toLowerCase();
    if (!currentUser || currentUser.uid !== userAddr) {
      await authConnections.switchCurrentUser(userAddr || '');
      auth = getAuth();
      currentUser = auth?.currentUser;
    }
    const newToken = await currentUser?.getIdToken(true);
    try {
      const res = await apiConnection.unfollowUser(userprofileAddress, newToken, userAddr);
      if (res.code === 0) {
        $asTargetUserInfoUpdateTrigger.set(!$asTargetUserInfoUpdateTrigger.get());
      }
      setIsLoadingFollow(false);
    } catch (error) {
      setIsLoadingFollow(false);
    }
  };

  const follow = async () => {
    setIsLoadingFollow(true);
    let auth = getAuth();
    let currentUser = auth?.currentUser;
    const userAddr = currentUserAddress?.toLowerCase();
    if (!currentUser || currentUser.uid !== userAddr) {
      await authConnections.switchCurrentUser(userAddr!);
      auth = getAuth();
      currentUser = auth?.currentUser;
    }
    const newToken = await currentUser?.getIdToken(true);
    try {
      const res = await apiConnection.followUser(userprofileAddress, newToken, userAddr!);
      if (res.code === 0) {
        $asTargetUserInfoUpdateTrigger.set(!$asTargetUserInfoUpdateTrigger.get());
      }
      setIsLoadingFollow(false);
    } catch (error) {
      setIsLoadingFollow(false);
    }
  };

  const debouncedSearch = useMemo(() => debounce(search, 500), []);

  useEffect(() => {
    if (typeof address === 'string') {
      $userprofileAddress.set(address);
      $activeTab.set(0);
    }
    return () => {
      $userprofileAddress.set('');
    };
  }, [address]);

  const isCurrentUserProfilePage = currentUserAddress?.toLowerCase() === userprofileAddress?.toLowerCase();

  const renderEditShareOrFollowButton = () => (
    <div>
      {isConnected && currentUserAddress ? (
        <div>
          {!isCurrentUserProfilePage ? (
            <div>
              {userInfo?.isFollowing ? (
                <OutlineButton className="min-w-[100px]" onClick={unfollow} isDisabled={isLoadingFollow || isUserProfileLoading}>
                  {isLoadingFollow || isUserProfileLoading ? (
                    <ThreeDots ariaLabel="loading-indicator" height={24} width={24} color="white" />
                  ) : (
                    <p className="font-normal">Unfollow</p>
                  )}
                </OutlineButton>
              ) : (
                <PrimaryButton
                  className="min-w-[100px] px-[12px] py-[8px]"
                  onClick={follow}
                  isDisabled={isLoadingFollow || isUserProfileLoading}>
                  {isLoadingFollow || isUserProfileLoading ? (
                    <ThreeDots ariaLabel="loading-indicator" height={24} width={24} color="white" />
                  ) : (
                    <p className="text-[14px] font-normal">Follow</p>
                  )}
                </PrimaryButton>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <OutlineButton onClick={() => router.push('/userprofile/edit')}>
                <p className="font-normal">Edit</p>
              </OutlineButton>
              <OutlineButton
                onClick={() => {
                  if (typeof address === 'string') {
                    const url = `${window.location.origin}/userprofile/${address}`;
                    copyToClp(url);
                    showOutlineToast({ title: 'Profile link copied to clipboard!' });
                  }
                }}>
                <Image src="/images/components/userprofile/share.svg" alt="" width={20} height={20} />
              </OutlineButton>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );

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
                    <div
                      className={`${
                        showSearchResult ? 'bg-gradient-to-r from-[#04AEFC] via-[#795AF4] to-[#F703D9]' : 'bg-white/30'
                      } rounded-full p-[1px]`}>
                      <div className="flex min-w-[280px] space-x-2 rounded-full bg-[#382c5e] px-4 py-2 shadow-xl">
                        <Image src="/images/components/userprofile/search.svg" alt="" width={20} height={20} />
                        <input
                          type="text"
                          className="flex-1 bg-transparent py-[2px] text-b3 outline-none"
                          placeholder="Search user ID / wallet address"
                          onClick={e => {
                            e.stopPropagation();
                            window.addEventListener('click', () => setShowSearchResult(false));
                          }}
                          // onBlur={() => setShowSearchResult(false)}
                          onChange={e => {
                            setSearchQuery(e.target.value);
                            setIsSearchLoading(true);
                            debouncedSearch(e.target.value, userprofileAddress);
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={`absolute z-[1] ${
                        showSearchResult ? 'visible' : 'invisible'
                      } scrollable mt-2 max-h-[300px] w-full overflow-auto rounded-lg bg-secondaryBlue`}>
                      {/* search result */}
                      {isSearchLoading ? (
                        <div className="flex min-h-[80px] items-center justify-center">
                          <ThreeDots ariaLabel="loading-indicator" height={24} width={24} color="white" />
                        </div>
                      ) : (
                        <div>
                          {searchResults.length > 0 &&
                            searchResults.map((d, i) => (
                              <div
                                key={`res-${i}`}
                                className="flex cursor-pointer space-x-2 px-4 py-[10px] hover:bg-white/10"
                                onClick={e => {
                                  e.stopPropagation();
                                  router.push(`/userprofile/${d.userAddress}`);
                                  setShowSearchResult(false);
                                }}>
                                <div className="w-[3px] rounded bg-[#2574FB]" />
                                <div className="flex flex-col space-y-2 text-b3 text-mediumEmphasis">
                                  {d.username ? (
                                    <LabelStringMatch label={d.username} match={searchQuery} />
                                  ) : (
                                    <LabelStringMatch label={trimAddress(d.userAddress)} match={searchQuery} />
                                  )}
                                  {/* <p className="">{d.username || trimAddress(d.userAddress)}</p> */}
                                </div>
                              </div>
                            ))}
                          {searchResults.length === 0 && (
                            <div className="flex min-h-[80px] items-center justify-center">
                              <p className="text-center text-b3 text-highEmphasis">No Match.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {renderEditShareOrFollowButton()}
                </div>

                {/* username / wallet address */}
                <div className="mb-4 md:flex md:justify-between">
                  <div className="md:flex md:space-x-4">
                    <div className="mb-4 md:mb-0">
                      <p
                        className="overflow-hidden text-clip bg-gradient-to-b from-[#FFC977] to-white bg-clip-text 
                        text-h2 leading-[1.12] text-transparent">
                        {userInfo?.username || 'Unnamed'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-[6px]">
                        <p className="text-mediumEmphasis">{addressTrimmed}</p>
                        <Image
                          src="/images/components/userprofile/copy.svg"
                          alt=""
                          className="cursor-pointer hover:brightness-[120%]"
                          width={20}
                          height={20}
                          onClick={() => {
                            if (typeof address === 'string') {
                              copyToClp(address);
                              showOutlineToast({ title: 'Address copied to clipboard!' });
                            }
                          }}
                        />
                      </div>
                      <div className="md:hidden">{renderEditShareOrFollowButton()}</div>
                    </div>
                  </div>

                  {/* desktop only followers */}
                  <div className="hidden space-x-[16px] md:flex md:items-center">
                    <div>
                      <p className="text-b1 text-mediumEmphasis">
                        Following <span className="text-b1e text-highEmphasis">{userInfo?.following || 0}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-b1 text-mediumEmphasis">
                        Followers <span className="text-b1e text-highEmphasis">{userInfo?.followers || 0}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-[24px] space-y-[24px] md:mb-[36px] md:flex md:space-x-[36px] md:space-y-0">
                  {/* badge labels */}

                  {/* <div className="overflow-auto">
                    <div className="flex space-x-[6px]">
                      <ProfileBadge color="sky">WHALE</ProfileBadge>
                      <ProfileBadge color="red">OG</ProfileBadge>
                      <ProfileBadge color="yellow">TOP GAINER</ProfileBadge>
                      <ProfileBadge color="green">PUNK LOVER</ProfileBadge>
                    </div>
                  </div>
                 

                  <div className="flex items-center space-x-2">
                    <p className="text-b1 text-mediumEmphasis">NFT Holding</p>
                    <div className="flex space-x-[-10px]">
                      {userprofilePositionInfosArrKey.length > 0 &&
                        userprofilePositionInfosArrKey?.map(amm =>
                          userprofilePositionInfos[amm].currentNotional > 0 ? (
                            <TypeWithIconByAmm imageWidth={24} imageHeight={24} amm={amm} />
                          ) : null
                        )}
                    </div>
                  </div> */}
                </div>

                {/* mobile only followers */}
                <div className="mb-[24px] flex space-x-[16px] md:hidden">
                  <div>
                    <p className="text-b1 text-mediumEmphasis">
                      Following <span className="text-b1e text-highEmphasis">{userFollowings?.length || 0}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-b1 text-mediumEmphasis">
                      Followers <span className="text-b1e text-highEmphasis">{userFollowers?.length || 0}</span>
                    </p>
                  </div>
                </div>

                <div className="mb-[36px] md:flex md:space-x-[16px]">
                  <p className="mb-2 text-b1e text-highEmphasis">About</p>
                  <p className="text-b1 text-highEmphasis">{userInfo?.about || '-'}</p>
                </div>
              </div>
              <div className="flex space-x-[16px] lg:min-w-[425px] lg:space-x-[24px]">
                {/* cards airdrop */}
                <ProfileHeaderCard>
                  <p className="mb-[36px] flex-1 text-center text-b1e text-[#FFD392]">Airdrop Season 2</p>
                  <p className="mb-[6px] text-b3 text-[#FFD392]">Season 2 Pts</p>
                  <div className="mb-[24px] flex items-center space-x-[6px]">
                    <span className="bg-gradient-to-b from-[#94C655] to-white bg-clip-text text-h5 font-bold text-transparent">
                      {userAirdropRank?.total ? localeConversion(userAirdropRank.total, 1, 1) : 0}
                    </span>
                    <span className="text-b3">Pts</span>
                  </div>
                  <p className="mb-[6px] text-b3 text-[#FFD392]">Leaderboard Rank</p>
                  <p className="mb-[24px] text-h5">{userAirdropRank?.rank}</p>
                  <Link
                    href="/airdrop/leaderboard"
                    className="flex rounded border-[0.5px] border-[#FFD392] p-2 text-b3 text-[#FFD392] hover:bg-[#FFD39233]">
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
                    <p
                      className={`text-h5 ${
                        Number(localeConversion(userPnl, 2)) > 0
                          ? 'text-marketGreen'
                          : Number(localeConversion(userPnl, 2)) < 0
                          ? 'text-marketRed'
                          : ''
                      }`}>
                      {Number(localeConversion(userPnl, 2)) > 0 ? '+' : ''}
                      {Number(localeConversion(userPnl, 2))}
                    </p>
                  </div>
                  <p className="mb-[6px] text-b3 text-[#FFD392]">Top Gainer Rank</p>
                  <p className="mb-[24px] text-h5">{userCompetitionRank?.rank}</p>
                  <Link
                    href="/competition"
                    className="flex rounded border-[0.5px] border-[#FFD392] p-2 text-b3 text-[#FFD392] hover:bg-[#FFD39233]">
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
