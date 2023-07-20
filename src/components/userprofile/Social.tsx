/* eslint-disable no-unused-vars */
import OutlineButton from '@/components/common/OutlineButton';
import PrimaryButton from '@/components/common/PrimaryButton';
import Tooltip from '@/components/common/Tooltip';
import { TypeWithIconByAmm } from '@/components/common/TypeWithIcon';
import { getAMMByAddress } from '@/const/addresses';
import { getCollectionInformation } from '@/const/collectionList';
import { firebaseAuth } from '@/const/firebaseConfig';
import { $currentChain, $userIsConnected } from '@/stores/user';
import { $userFollowers, $userFollowings, $userInfo, $userprofileAddress } from '@/stores/userprofile';
import { apiConnection } from '@/utils/apiConnection';
import { trimAddress } from '@/utils/string';
import { useStore } from '@nanostores/react';
import { getAuth } from 'firebase/auth';
import Image from 'next/image';
import React, { PropsWithChildren, useEffect, useState } from 'react';

const TableContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <div
    className={`from-[#37387280] to-[#0C0D1F80] text-b2 
        text-mediumEmphasis md:rounded-[6px] md:border md:border-[rgba(113,170,255,0.25)] md:bg-gradient-to-b md:pt-[36px]`}>
    {children}
  </div>
);

const TypeIconWithTooltip = ({ amm }: { amm: any }) => {
  const chain = useStore($currentChain);
  const ammValue = getAMMByAddress(amm, chain);

  const targetAmm = getCollectionInformation(amm);
  const targetCollection = targetAmm ?? getCollectionInformation(ammValue);
  return (
    <Tooltip direction="top" content={targetCollection.collectionName}>
      <TypeWithIconByAmm amm={amm} imageWidth={24} imageHeight={24} />
    </Tooltip>
  );
};

export const FollowButton = ({
  isFollowing,
  visible,
  targetAddress
}: {
  isFollowing: boolean;
  visible: boolean;
  targetAddress?: string;
}) => {
  const currentUserAddress = useStore($userprofileAddress);
  const [localIsFollowing, setLocalIsFollowing] = useState(false);

  useEffect(() => {
    setLocalIsFollowing(isFollowing);
  }, [isFollowing]);

  const follow = async () => {
    const auth = getAuth();
    const currentUser = auth?.currentUser;
    console.log('currentUser', currentUser);
    if (currentUser) {
      const newToken = await currentUser.getIdToken(true);
      console.log('newToken', newToken);
      try {
        const res = await apiConnection.followUser(targetAddress, newToken, currentUserAddress);
        console.log('follow', res);
        if (res.code === 0) {
          // todo:  update button
          setLocalIsFollowing(true);
        }
      } catch (error) {
        console.log('err', error);
      }
    }
  };

  if (!visible) {
    return null;
  }
  return (
    <div>
      {localIsFollowing ? (
        <OutlineButton className="w-fit">
          <p className="font-normal">Unfollow</p>
        </OutlineButton>
      ) : (
        <PrimaryButton className="w-fit px-[12px] py-[8px]" onClick={follow}>
          <p className="text-[14px] font-normal">Follow</p>
        </PrimaryButton>
      )}
    </div>
  );
};
FollowButton.defaultProps = {
  targetAddress: undefined
};

const Social: React.FC<PropsWithChildren> = () => {
  const isConnected = useStore($userIsConnected);
  const userInfo = useStore($userInfo);
  const userFollowings = useStore($userFollowings);
  const userFollowers = useStore($userFollowers);

  return (
    <div className="space-y-[36px]">
      {/* Following table card */}
      <TableContainer>
        <div className="mb-[16px] md:mb-[36px] md:flex md:space-x-2 md:px-[36px]">
          <div className="hidden w-[3px] rounded bg-[#2574FB] md:block" />
          <p className="text-h4 text-highEmphasis md:text-b1e">Following ({userInfo?.following})</p>
        </div>

        <div className="md:px-[36px]">
          <div className="w-full items-center text-mediumEmphasis">
            <div className="hidden w-full md:block">
              <div className="flex text-left text-b2">
                <div className="flex-1 pb-4 font-normal">User ID</div>
                <div className="flex-1 pb-4 font-normal">Portfolio</div>
                <div className="flex-1 pb-4 font-normal">Leaderboard Rank</div>
                <div className="flex-1 pb-4 font-normal">No. of Followers</div>
                <div className="flex-1 pb-4 font-normal"> </div>
              </div>
            </div>
            <div className="scrollable max-h-[300.664px] min-h-[300.664px] overflow-auto text-b1">
              {userFollowings.map(d => (
                <div className="flex">
                  {/* desktop cols */}
                  <div className="hidden flex-1 py-[10px] md:table-cell">
                    <p>{d.username || d.followerAddress ? trimAddress(d.followerAddress!) : ''}</p>
                  </div>
                  <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">
                    <div className="flex space-x-[-12px]">
                      {d.amm.map(amm => (
                        <TypeIconWithTooltip amm={amm} />
                      ))}
                    </div>
                  </div>

                  <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">
                    <div className="flex space-x-2">
                      <Image src="/images/components/userprofile/leaderboard_rank.svg" alt="" width={20} height={20} />
                      <p>{d.ranking}</p>
                    </div>
                  </div>
                  <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">{d.followers}</div>
                  {/* mobile cols */}
                  <div className="flex-1 md:hidden">
                    <div className="flex space-x-2 py-[12px]">
                      <div className="w-[3px] rounded bg-[#2574FB]" />
                      <div className="flex flex-col space-y-2">
                        <p>{d.username || d.followerAddress ? trimAddress(d.followerAddress!) : ''}</p>

                        <div className="flex space-x-[-12px]">
                          {d.amm.map(amm => (
                            <TypeWithIconByAmm amm={amm} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 py-[10px] text-highEmphasis">
                    <div className="flex justify-end">
                      <FollowButton isFollowing={d.isFollowing} visible={isConnected} targetAddress={d.followerAddress || ''} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TableContainer>
      {/* Follower table card */}
      <TableContainer>
        <div className="mb-[16px] md:mb-[36px] md:flex md:space-x-2 md:px-[36px]">
          <div className="hidden w-[3px] rounded bg-[#2574FB] md:block" />
          <p className="text-h4 text-highEmphasis md:text-b1e">Follower ({userInfo?.followers})</p>
        </div>

        <div className="md:px-[36px]">
          <div className="w-full items-center text-mediumEmphasis">
            <div className="hidden w-full md:block">
              <div className="flex text-left text-b2">
                <div className="flex-1 pb-4 font-normal">User ID</div>
                <div className="flex-1 pb-4 font-normal">Portfolio</div>
                <div className="flex-1 pb-4 font-normal">Leaderboard Rank</div>
                <div className="flex-1 pb-4 font-normal">No. of Followers</div>
                <div className="flex-1 pb-4 font-normal"> </div>
              </div>
            </div>
            <div className="scrollable max-h-[300.664px] min-h-[300.664px] overflow-auto text-b1">
              {userFollowers.map(d => (
                <div className="flex">
                  {/* desktop cols */}
                  <div className="hidden flex-1 py-[10px] md:table-cell">
                    <p>{d.username || trimAddress(d.userAddress)}</p>
                  </div>
                  <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">
                    <div className="flex space-x-[-12px]">
                      {d.amm.map(amm => (
                        <TypeIconWithTooltip amm={amm} />
                      ))}
                    </div>
                  </div>

                  <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">
                    <div className="flex space-x-2">
                      <Image src="/images/components/userprofile/leaderboard_rank.svg" alt="" width={20} height={20} />
                      <p>{d.ranking}</p>
                    </div>
                  </div>
                  <div className="hidden flex-1 py-[10px] text-highEmphasis md:table-cell">{d.followers}</div>
                  {/* mobile cols */}
                  <div className="flex-1 md:hidden">
                    <div className="flex space-x-2 py-[12px]">
                      <div className="w-[3px] rounded bg-[#2574FB]" />
                      <div className="flex flex-col space-y-2">
                        <p>{d.username || trimAddress(d.userAddress)}</p>
                        <div className="flex space-x-[-12px]">
                          {d.amm.map(amm => (
                            <TypeWithIconByAmm amm={amm} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 py-[10px] text-highEmphasis">
                    <div className="flex justify-end">
                      <FollowButton isFollowing={d.isFollowing} visible={isConnected} targetAddress={d.userAddress || ''} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TableContainer>
    </div>
  );
};

export default Social;
