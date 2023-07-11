/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore as useNanostore } from '@nanostores/react';
import {
  $asCurrentSeason,
  $asIsLeaderboardLoading,
  $asLeaderboardUpdateTrigger,
  $asSeason1LeaderboardData,
  $asSeason2LeaderboardData,
  $userPoint,
  $userPrevPoint,
  defaultUserPoint
} from '@/stores/airdrop';
import { $userAddress, $userIsConnected } from '@/stores/user';
import Image from 'next/image';
import UserMedal from '@/components/airdrop/desktop/UserMedal';
import { trimString } from '@/utils/string';

function LeaderboardMobile() {
  const router = useRouter();
  const userPointData = useNanostore($userPoint);
  const season2Data = useNanostore($asSeason2LeaderboardData);
  const season1Data = useNanostore($asSeason1LeaderboardData);
  const userPoint = userPointData || defaultUserPoint;

  const userPrevPointData = useNanostore($userPrevPoint);
  const userPrevPoint = userPrevPointData || defaultUserPoint;
  const userWalletAddress = useNanostore($userAddress);

  const isLoading = useNanostore($asIsLeaderboardLoading);
  const isConnected = useNanostore($userIsConnected);

  const [refreshCooldown, setRefreshCooldown] = useState(0); // in second
  const currentSeason = useNanostore($asCurrentSeason);
  const leaderboardData = currentSeason === 0 ? season2Data : season1Data;

  const walletAddressToShow = (addr: any) => `${addr.substring(0, 7)}...${addr.slice(-3)}`;

  const getSelectedUserPoint = (): any => {
    let selectedUserPoint = {};
    if (currentSeason === 1) {
      selectedUserPoint = {
        originalTotal: userPrevPoint.originalTotal || 0,
        total: userPrevPoint.total || 0,
        multiplier: userPrevPoint.multiplier || 1,
        username: userPrevPoint.username || '',
        userAddress: userPrevPoint.userAddress || '',
        isBan: userPrevPoint.isBan || false,
        tradeVol: userPrevPoint.tradeVol?.vol || '0',
        referralCode: userPrevPoint.referralCode || '',
        tradeVolPoints: userPrevPoint.tradeVol?.points || 0,
        referralPoints: (userPrevPoint.referral?.referralSelfRewardPoints || 0) + (userPrevPoint.referral?.referringRewardPoints || 0) || 0,
        convergePoints: userPrevPoint.converge?.points || 0,
        og: userPrevPoint.og || 0,
        rank: userPrevPoint.rank || 0,
        tradeVolTotal: userPrevPoint.tradeVolTotal || 0,
        eligible: userPrevPoint.eligible || false
      };
    } else {
      selectedUserPoint = {
        originalTotal: userPoint.originalTotal || 0,
        total: userPoint.total || 0,
        multiplier: userPoint.multiplier || 1,
        username: userPoint.username || '',
        userAddress: userPoint.userAddress || '',
        isBan: userPoint.isBan || false,
        tradeVol: userPoint.tradeVol?.vol || '0',
        referralCode: userPoint.referralCode || '',
        tradeVolPoints: userPoint.tradeVol?.points || 0,
        referralPoints: (userPoint.referral?.referralSelfRewardPoints || 0) + (userPoint.referral?.referringRewardPoints || 0) || 0,
        convergePoints: userPoint.converge?.points || 0,
        og: userPoint.og || 0,
        rank: userPoint.rank || 0,
        tradeVolTotal: userPoint.tradeVolTotal || 0,
        eligible: userPoint.eligible || false
      };
    }

    return selectedUserPoint;
  };

  const userData = getSelectedUserPoint();

  const userIsBan = userData.isBan;
  const userIsUnranked = !userData?.eligible;

  // for show loading, define array size n if necessary
  const dummyLoadingData = [...Array(10)];

  // cooldown timer
  function updateRefreshCooldown() {
    if (refreshCooldown <= 0) {
      //
    } else {
      setRefreshCooldown(refreshCooldown - 1);
    }
  }

  // loop each 1s
  useEffect(() => {
    const interval = setInterval(updateRefreshCooldown, 1000);
    return () => clearInterval(interval);
  });

  // width handler for season 2
  const usernameWidth = currentSeason === 0 ? 'max-w-[162px]' : 'max-w-[132px]';

  return (
    <div className="mt-[-36px]">
      <div className="sticky top-[48px] z-10 bg-darkBlue pt-9">
        <div className="mx-5">
          <div className="flex justify-center">
            <div className="flex justify-start text-[12px] font-semibold">
              <div
                className={`item mr-6 cursor-pointer 
                ${currentSeason === 1 ? 'active text-seasonGreen' : ''}`}
                onClick={() => $asCurrentSeason.set(1)}>
                Season 1 Leaderboard
                {currentSeason === 1 ? <div className="mt-2 h-[2px] w-full rounded-[2px] bg-seasonGreen" /> : null}
              </div>
              <div
                className={`item cursor-pointer 
                ${currentSeason === 0 ? 'active text-seasonGreen' : ''}`}
                onClick={() => $asCurrentSeason.set(0)}>
                Season 2 Leaderboard
                {currentSeason === 0 ? <div className="mt-2 h-[2px] w-full rounded-[2px] bg-seasonGreen" /> : null}
              </div>
            </div>
          </div>

          <div className="mb-6 mt-10 flex items-center justify-between">
            <h3 className="text-[20px] font-semibold">Season {currentSeason === 0 ? '2' : '1'} Pts Leaderboard</h3>

            <div
              className={`flex items-center ${refreshCooldown ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => {
                if (refreshCooldown || currentSeason !== 0) return;
                $asLeaderboardUpdateTrigger.set(!$asLeaderboardUpdateTrigger);
                // apiConnection.getUserPoint();
                setRefreshCooldown(5);
              }}>
              {currentSeason === 0 ? (
                <Image
                  className={`${refreshCooldown > 0 ? 'animate-spin' : ''}`}
                  src="/images/components/airdrop/refresh.svg"
                  width={32}
                  height={32}
                  alt=""
                />
              ) : (
                <div className="h-[32px] w-[1px] " />
              )}
            </div>
          </div>

          <div className="w-full text-xs">
            <div className="flex pb-4 text-mediumEmphasis">
              <div className="w-[56px]">
                <p>Rank</p>
              </div>
              <div className={`w-[132px] text-[14px] font-normal ${usernameWidth}`}>
                <p>User</p>
              </div>
              <div className="flex-1 text-right">
                <p>Season {currentSeason === 0 ? '2' : '1'} Pts. (Multiplier)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="w-full">
        {!isLoading ? (
          <>
            {/* current user data */}
            {isConnected ? (
              <div
                className="relative border-t-[1px] border-[#2E4371] bg-[#2d68ff40] px-5"
                onClick={() => router.push(`/userprofile/${userWalletAddress}`)}>
                <div
                  className={`flex items-center py-[10px] font-medium
                  ${userIsBan ? 'disqualified' : 'active'}`}>
                  <div className="w-[56px]">
                    <UserMedal rank={userData.rank} isMobile isYou isBan={userIsBan} isUnranked={userIsUnranked} />
                  </div>
                  <div className={`w-[132px] text-[14px] font-normal ${usernameWidth}`}>
                    <p className={`overflow-hidden text-ellipsis font-semibold ${userIsBan ? 'text-marketRed line-through' : ''}`}>
                      {userData?.username ? trimString(userData.username, 10) : walletAddressToShow(userData.userAddress)}
                    </p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-[14px] font-normal">
                      {userIsBan || userIsUnranked ? (
                        '-'
                      ) : (
                        <>
                          {userData.total} <span className="text-marketGreen">({userData.multiplier}X)</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            {/* other users data */}
            {leaderboardData &&
              leaderboardData.map((item: any) => {
                const { total, multiplier, username, userAddress, isBan, rank } = item;

                const isYou = userAddress === userData.userAddress;
                return (
                  <div
                    key={`rank-${userAddress}`}
                    className="border-t-[1px] border-[#2E4371] px-5"
                    onClick={() => router.push(`/userprofile/${userAddress}`)}>
                    <div className="my-[10px] flex items-center">
                      <div className="w-[56px]">
                        <UserMedal rank={rank} isBan={isBan} isMobile isUnranked={rank < 1} isYou={isYou} />
                      </div>
                      <div className={`w-[132px] text-[14px] font-normal ${usernameWidth}`}>
                        <p
                          className={`overflow-hidden text-ellipsis ${isBan ? 'text-marketRed line-through' : ''} ${
                            isYou ? 'font-medium' : ''
                          }`}>
                          {username ? trimString(username, 10) : walletAddressToShow(userAddress)}
                        </p>
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-[14px] font-normal">
                          {total} <span className="text-marketGreen">({multiplier}X)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </>
        ) : (
          <>
            <div className="relative">
              <div className="active flex items-center font-medium">
                <div className="w-[56px]">-</div>
                <div className={`w-[132px] text-[14px] font-normal ${usernameWidth}`}>
                  <p>-</p>
                </div>
                <div className="block w-[41%]">
                  <p className="text-[14px] font-normal">
                    - <span className="text-marketGreen">(-)</span>
                  </p>
                </div>
              </div>
            </div>
            {dummyLoadingData.map((_item, i) => (
              <div key={`loading-${i}`} className="relative">
                <div className="flex items-center">
                  <div className="flex w-[20%] justify-center">-</div>
                  <div className={`w-[132px] text-[14px] font-normal ${usernameWidth}`}>
                    <p>-</p>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-[14px] font-normal">
                      - <span className="text-marketGreen">(-)</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default LeaderboardMobile;
