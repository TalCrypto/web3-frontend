/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore as useNanostore } from '@nanostores/react';
import {
  $asCurrentSeason,
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
import ScrollTopButton from '@/components/common/ScrollToTopButton';

function Leaderboard() {
  const router = useRouter();
  const userPointData = useNanostore($userPoint);
  const season2Data = useNanostore($asSeason2LeaderboardData);
  const season1Data = useNanostore($asSeason1LeaderboardData);
  const userPoint = userPointData || defaultUserPoint;

  const userPrevPointData = useNanostore($userPrevPoint);
  const userPrevPoint = userPrevPointData || defaultUserPoint;
  const userWalletAddress = useNanostore($userAddress);

  // const isLoading = useNanostore(isLeaderboardLoading);
  const isLoading = false;
  const isConnected = useNanostore($userIsConnected);

  const [refreshCooldown, setRefreshCooldown] = useState(0); // in second
  const currentSeason = useNanostore($asCurrentSeason);
  const leaderboardData = currentSeason === 0 ? season2Data : season1Data;

  useEffect(() => {
    const scrollHandler = () => {
      const header = document.querySelector('#lb-sticky-header');
      if (header === null) return;

      const headerYPos = header.getBoundingClientRect().top - 60;
      if (headerYPos <= 1) {
        header.classList.add('bg-black');
      } else {
        header.classList.remove('bg-black');
      }
    };
    document.addEventListener('scroll', scrollHandler);
    return () => {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  const walletAddressToShow = (addr: any) => `${addr.substring(0, 7)}...${addr.slice(-3)}`;

  const getSelectedUserPoint = (): any => {
    let selectedUserPoint = {};
    if (currentSeason === 1) {
      selectedUserPoint = {
        // originalTotal: userPrevPoint.originalTotal || 0,
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
        rank: userPrevPoint.rank || 0
        // tradeVolTotal: userPrevPoint.tradeVolTotal || '0',
        // eligible: userPrevPoint.eligible || false
      };
    } else {
      selectedUserPoint = {
        // originalTotal: userPoint.originalTotal || 0,
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
        rank: userPoint.rank || 0
        // tradeVolTotal: userPoint.tradeVolTotal || '0',
        // eligible: userPoint.eligible || false
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

  // testing
  const isLockedConverg = false;
  const isLockedReferral = false;
  const isLockedOg = false;

  // width handler for season 2
  const usernameWidth = currentSeason === 0 ? 'lg:w-[17%] max-w-[162px]' : 'lg:w-[13%]  max-w-[132px]';
  const cellWidth = currentSeason === 0 ? 'lg:w-[16%]' : 'lg:w-[12%]';

  return (
    <div className="">
      <div id="lb-sticky-header" className="sticky top-[60px] z-[1]">
        <div className="container">
          <div className="flex justify-between py-[24px]">
            <h3 className="">Season {currentSeason === 0 ? '2' : '1'} Points Leaderboard</h3>
            <div className="season-leaderboard flex justify-start text-[16px] font-semibold ">
              <div
                className={`item mr-[24px] cursor-pointer ${currentSeason === 0 ? 'active' : ''}`}
                onClick={() => $asCurrentSeason.set(0)}>
                Season 2 Leaderboard
                {currentSeason === 0 ? <div className="mt-2 h-[2px] w-full rounded-[2px] bg-seasonGreen" /> : null}
              </div>
              <div className={`item cursor-pointer ${currentSeason === 1 ? 'active' : ''}`} onClick={() => $asCurrentSeason.set(1)}>
                Season 1 Leaderboard
                {currentSeason === 1 ? <div className="mt-2 h-[2px] w-full rounded-[2px] bg-seasonGreen" /> : null}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div
              className={`flex items-center ${refreshCooldown ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => {
                if (refreshCooldown || currentSeason !== 0) return;
                // apiConnection.getLeaderboard(currentSeason);
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
              <p>{refreshCooldown > 0 ? 'Updating...' : 'Update Leaderboard'}</p>
            </div>
          </div>
          <div className="w-full text-xs lg:px-[50px] lg:text-[14px] lg:font-semibold">
            <div className="mb-[12px] flex text-mediumEmphasis">
              <div className="w-[20%] px-[21.8px] py-[18px] lg:w-[10%] ">
                <p className="">Rank</p>
              </div>
              <div className={`w-[38%] p-[18px] ${usernameWidth}`}>
                <p className="">User</p>
              </div>
              <div className={`${cellWidth} hidden p-[18px] lg:block`}>
                <p className="">Trading Pts</p>
              </div>
              {currentSeason !== 0 ? (
                <div className={`hidden p-[18px] lg:block lg:w-[12%] ${isLockedConverg ? '' : ''}`}>
                  <p className="">{isLockedConverg ? '???' : 'Converg. Pts'}</p>
                </div>
              ) : null}
              <div className={`${cellWidth} hidden p-[18px] lg:block ${isLockedReferral ? '' : ''}`}>
                <p className="">{isLockedReferral ? '???' : 'Referral Pts'}</p>
              </div>
              <div className={`hidden p-[18px] lg:block lg:w-[12%] ${isLockedOg ? '' : ''}`}>
                <p className="">{isLockedOg ? '???' : 'Others'}</p>
              </div>
              <div className="hidden p-[18px] lg:block lg:w-[17%]">
                <p className="">{currentSeason === 0 ? 'Season 2' : 'Season 1'} Points</p>
                <p className="text-b2">(Before Multiplier)</p>
              </div>
              <div className="hidden p-[18px] lg:block lg:w-[10%]">
                <p className="">Multiplier</p>
              </div>
              <div className="hidden p-[18px] lg:block lg:w-[16%]">
                <p className="">{currentSeason === 0 ? 'Season 2' : 'Season 1'} Points</p>
                <p className="text-b2">(After Multiplier)</p>
              </div>
              <div className="block w-[41%] p-[18px] lg:hidden lg:w-[16%]">
                <p className="">Seasonal Pts. (Multiplier)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* table */}
        <div className="body2 lg:body1 w-full">
          <div className="space-y-[12px]">
            {!isLoading ? (
              <>
                {/* current user data */}
                {isConnected ? (
                  <div className="relative cursor-pointer" onClick={() => router.push(`/userprofile/${userWalletAddress}`)}>
                    <div
                      className={`table-border-grad flex h-[54px] items-center font-medium lg:px-[50px] ${
                        userIsBan ? 'disqualified' : 'active'
                      }`}>
                      <div className="flex w-[20%] p-[18px] lg:w-[10%]">
                        <UserMedal rank={userData.rank} isYou isBan={userIsBan} isUnranked={userIsUnranked} />
                      </div>
                      <div className={`w-[38%] p-[18px] ${usernameWidth}`}>
                        <p className={`overflow-hidden text-ellipsis ${userIsBan ? 'text-marketRed line-through' : ''}`}>
                          {userData?.username ? trimString(userData.username, 10) : walletAddressToShow(userData.userAddress)}
                        </p>
                      </div>
                      <div className={`${cellWidth} relative hidden p-[18px] lg:block`}>
                        {userIsUnranked ? (
                          <div className="absolute left-0">
                            {/* <TitleTips
                              placement="top"
                              tipsText="Trade 5 WETH notional to unlock your reward"
                              titleText={<Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />}
                            /> */}
                            <Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />
                          </div>
                        ) : null}
                        <p className={`${userIsBan ? 'text-marketRed line-through' : ''}`}>{userData.tradeVolPoints.toFixed(2)}</p>
                      </div>
                      {currentSeason !== 0 ? (
                        <div className={`hidden p-[18px] lg:block lg:w-[12%] ${isLockedConverg ? 'col-locked' : ''} relative`}>
                          {userIsUnranked ? (
                            <div className="absolute left-0">
                              {/* <TitleTips
                                placement="top"
                                tipsText="Trade 5 WETH notional to unlock your reward"
                                titleText={<Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />}
                              /> */}
                              <Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />
                            </div>
                          ) : null}
                          <p
                            className={`${userIsBan && !isLockedConverg ? 'text-marketRed line-through' : ''} ${
                              isLockedConverg ? '' : ''
                            }`}>
                            {isLockedConverg ? '-' : userData.convergePoints.toFixed(2)}
                          </p>
                        </div>
                      ) : null}
                      <div className={`${cellWidth} hidden p-[18px] lg:block ${isLockedReferral ? 'col-locked' : ''} relative`}>
                        {userIsUnranked ? (
                          <div className="absolute left-0">
                            {/* <TitleTips
                              placement="top"
                              tipsText="Trade 5 WETH notional to unlock your reward"
                              titleText={<Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />}
                            /> */}
                            <Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />
                          </div>
                        ) : null}
                        <p
                          className={`${userIsBan && !isLockedReferral ? 'text-marketRed line-through' : ''} ${
                            isLockedReferral ? '' : ''
                          }`}>
                          {isLockedReferral ? '-' : userData.referralPoints.toFixed(2)}
                        </p>
                      </div>
                      <div className={`hidden p-[18px] lg:block lg:w-[12%] ${isLockedOg ? 'col-locked' : ''} relative`}>
                        {userIsUnranked ? (
                          <div className="absolute left-0">
                            {/* <TitleTips
                              placement="top"
                              tipsText="Trade 5 WETH notional to unlock your reward"
                              titleText={<Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />}
                            /> */}
                            <Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />
                          </div>
                        ) : null}
                        <p className={`${userIsBan && !isLockedOg ? 'text-marketRed line-through' : ''} ${isLockedOg ? '' : ''}`}>
                          {isLockedOg ? '-' : userData.og.toFixed(2)}
                        </p>
                      </div>
                      <div className="hidden p-[18px] lg:block lg:w-[17%]">
                        <p className="text-highEmphasis} text-sm lg:text-[15px] lg:font-semibold">
                          {userIsBan || userIsUnranked ? '-' : `${userData.originalTotal.toFixed(2)}`}
                        </p>
                      </div>
                      <div className="hidden p-[18px] lg:block lg:w-[10%]">
                        <p
                          className={`text-sm lg:text-[15px] lg:font-semibold  ${
                            userIsBan || userIsUnranked ? 'text-highEmphasis' : 'text-marketGreen'
                          }`}>
                          {userIsBan || userIsUnranked ? '-' : `${userData.multiplier.toFixed(2)}x`}
                        </p>
                      </div>
                      <div className="hidden p-[18px] lg:block lg:w-[16%]">
                        <p
                          className={`text-sm lg:text-[15px] lg:font-semibold  ${
                            userIsBan || userIsUnranked ? 'text-highEmphasis' : 'text-warn'
                          }`}>
                          {userIsBan || userIsUnranked ? '-' : `${userData.total.toFixed(2)}`}
                        </p>
                      </div>
                      <div className="block w-[41%] p-[18px] lg:hidden lg:w-[16%]">
                        <p className="text-sm ">
                          {userIsBan || userIsUnranked ? (
                            '-'
                          ) : (
                            <>
                              {userData.total.toFixed(2)} <span className="text-marketGreen">({userData.multiplier.toFixed(1)}X)</span>
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
                    const {
                      total,
                      multiplier,
                      username,
                      userAddress,
                      isBan,
                      tradeVolPoints,
                      referralPoints,
                      convergePoints,
                      rank,
                      og,
                      originalTotal
                    } = item;

                    const isYou = userAddress === userData.userAddress;
                    return (
                      <div
                        key={`rank-${userAddress}`}
                        className="relative cursor-pointer"
                        onClick={() => router.push(`/userprofile/${userAddress}`)}>
                        <div className="table-border-grad flex h-[54px] items-center lg:px-[50px]">
                          <div className="flex w-[20%] p-[18px] lg:w-[10%]">
                            <UserMedal rank={rank} isBan={isBan} isUnranked={rank < 1} isYou={isYou} />
                          </div>
                          <div className={`w-[38%] p-[18px] ${usernameWidth}`}>
                            <p
                              className={`overflow-hidden text-ellipsis ${isBan ? 'text-marketRed line-through' : ''} ${
                                isYou ? 'font-medium' : ''
                              }`}>
                              {username ? trimString(username, 10) : walletAddressToShow(userAddress)}
                            </p>
                          </div>
                          <div className={`${cellWidth} hidden p-[18px] lg:block`}>
                            <p className={`${isBan ? 'text-marketRed line-through' : ''}`}>{tradeVolPoints.toFixed(2)}</p>
                          </div>
                          {currentSeason !== 0 ? (
                            <div
                              className={`hidden p-[18px] lg:block lg:w-[12%] ${isLockedConverg ? 'col-locked' : ''} ${
                                isLockedConverg ? '' : ''
                              }`}>
                              <p className={`${isBan && !isLockedConverg ? 'text-marketRed line-through' : ''}`}>
                                {isLockedConverg ? '-' : convergePoints.toFixed(2)}
                              </p>
                            </div>
                          ) : null}
                          <div
                            className={`${cellWidth} hidden p-[18px] lg:block lg:w-[12%] ${isLockedReferral ? 'col-locked' : ''} ${
                              isLockedReferral ? '' : ''
                            }`}>
                            <p className={`${isBan && !isLockedReferral ? 'text-marketRed line-through' : ''}`}>
                              {isLockedReferral ? '-' : referralPoints.toFixed(2)}
                            </p>
                          </div>
                          <div className={`hidden p-[18px] lg:block lg:w-[12%] ${isLockedOg ? 'col-locked' : ''} ${isLockedOg ? '' : ''}`}>
                            <p className={`${isBan && !isLockedOg ? 'text-marketRed line-through' : ''}`}>
                              {isLockedOg ? '-' : og.toFixed(2) || 0.0}
                            </p>
                          </div>
                          <div className="hidden p-[18px] lg:block lg:w-[17%]">
                            <p className="text-sm text-highEmphasis lg:text-[15px] lg:font-semibold">
                              {isBan ? '-' : `${originalTotal.toFixed(2)}`}
                            </p>
                          </div>
                          <div className="hidden p-[18px] lg:block lg:w-[10%]">
                            <p className={`text-sm lg:text-[15px] lg:font-semibold  ${isBan ? 'text-highEmphasis' : 'text-marketGreen'}`}>
                              {isBan ? '-' : `${multiplier.toFixed(1)}x`}
                            </p>
                          </div>
                          <div className="hidden p-[18px] lg:block lg:w-[16%]">
                            <p className={`text-sm lg:text-[15px] lg:font-semibold  ${isBan ? 'text-highEmphasis' : 'text-warn'}`}>
                              {isBan ? '-' : `${total.toFixed(2)}`}
                            </p>
                          </div>
                          <div className="block w-[41%] p-[18px] lg:hidden lg:w-[16%]">
                            <p className="text-sm lg:text-[15px] lg:font-semibold ">
                              {total} <span className="text-marketGreen">({multiplier.toFixed(1)}X)</span>
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
                  <div className="table-border-grad active flex h-[54px] items-center font-medium lg:px-[86px]">
                    <div className="flex w-[20%] justify-center p-[18px] lg:w-[10%]">-</div>
                    <div className="w-[38%] p-[18px] lg:w-[18%]">
                      <p className="">-</p>
                    </div>
                    <div className="hidden p-[18px] lg:block lg:w-[14%]">
                      <p className="">-</p>
                    </div>
                    {currentSeason !== 0 ? (
                      <div className="hidden p-[18px] lg:block lg:w-[14%]">
                        <p className="">-</p>
                      </div>
                    ) : null}
                    <div className="hidden p-[18px] lg:block lg:w-[14%]">
                      <p className="">-</p>
                    </div>
                    <div className="hidden p-[18px] lg:block lg:w-[12%]">
                      <p className="text-sm text-marketGreen lg:text-[15px] lg:font-semibold ">-</p>
                    </div>
                    <div className="hidden p-[18px] lg:block lg:w-[16%]">
                      <p className="text-sm text-warn lg:text-[15px] lg:font-semibold ">-</p>
                    </div>
                    <div className="block w-[41%] p-[18px] lg:hidden lg:w-[16%]">
                      <p className="text-sm ">
                        - <span className="text-marketGreen">(-)</span>
                      </p>
                    </div>
                  </div>
                </div>
                {dummyLoadingData.map((_item, i) => (
                  <div key={`loading-${i}`} className="relative">
                    <div className="table-border-grad flex h-[54px] items-center lg:px-[86px]">
                      <div className="flex w-[20%] justify-center p-[18px] lg:w-[10%]">-</div>
                      <div className="w-[38%] p-[18px] lg:w-[18%]">
                        <p className="">-</p>
                      </div>
                      <div className="hidden p-[18px] lg:block lg:w-[14%]">
                        <p className="">-</p>
                      </div>
                      {currentSeason !== 0 ? (
                        <div className="hidden p-[18px] lg:block lg:w-[14%]">
                          <p className="">-</p>
                        </div>
                      ) : null}
                      <div className="hidden p-[18px] lg:block lg:w-[14%]">
                        <p className="">-</p>
                      </div>
                      <div className="hidden p-[18px] lg:block lg:w-[12%]">
                        <p className="text-sm text-marketGreen lg:text-[15px] lg:font-semibold ">-</p>
                      </div>
                      <div className="hidden p-[18px] lg:block lg:w-[16%]">
                        <p className="text-sm text-warn lg:text-[15px] lg:font-semibold ">-</p>
                      </div>
                      <div className="block w-[41%] p-[18px] lg:hidden lg:w-[16%]">
                        <p className="text-sm lg:text-[15px] lg:font-semibold ">
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
      </div>
      <ScrollTopButton />
    </div>
  );
}

export default Leaderboard;
