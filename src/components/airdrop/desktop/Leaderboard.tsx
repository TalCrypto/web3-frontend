/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
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
import ScrollTopButton from '@/components/common/ScrollToTopButton';
import { localeConversion } from '@/utils/localeConversion';
import Tooltip from '@/components/common/Tooltip';

function Leaderboard() {
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

  // testing
  const isLockedConverg = false;
  const isLockedReferral = false;
  const isLockedOg = false;

  // width handler for season 2
  const usernameWidth = currentSeason === 0 ? 'w-[17%] max-w-[162px]' : 'w-[13%] max-w-[132px]';
  const cellWidth = currentSeason === 0 ? 'w-[16%]' : 'w-[12%]';

  return (
    <div className="relative">
      <div id="lb-sticky-header" className="sticky top-[60px] z-10">
        <div className="flex justify-between py-[24px]">
          <h3 className="text-[24px] font-bold">Season {currentSeason === 0 ? '2' : '1'} Points Leaderboard</h3>
          <div className="flex justify-start text-[16px] font-semibold">
            <div className={`item mr-[24px] cursor-pointer ${currentSeason === 0 ? 'active' : ''}`} onClick={() => $asCurrentSeason.set(0)}>
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
            className={`flex items-center ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => {
              if (isLoading || currentSeason !== 0) return;
              $asLeaderboardUpdateTrigger.set(!$asLeaderboardUpdateTrigger.get());
            }}>
            {currentSeason === 0 ? (
              <Image
                className={`${isLoading ? 'animate-spin' : ''}`}
                src="/images/components/airdrop/refresh.svg"
                width={32}
                height={32}
                alt=""
              />
            ) : (
              <div className="h-[32px] w-[1px]" />
            )}
            <p>{isLoading ? 'Updating...' : 'Update Leaderboard'}</p>
          </div>
        </div>
        <div className="w-full text-[14px] text-xs font-semibold xl:px-[50px]">
          <div className="mb-[12px] flex text-mediumEmphasis">
            <div className="w-[10%] px-[10px] py-[18px]">
              <p>Rank</p>
            </div>
            <div className={`p-[18px] ${usernameWidth}`}>
              <p>User</p>
            </div>
            <div className={`${cellWidth} p-[18px]`}>
              <p>Trading Pts</p>
            </div>
            {currentSeason !== 0 ? (
              <div className={`w-[12%] p-[18px] ${isLockedConverg ? '' : ''}`}>
                <p>{isLockedConverg ? '???' : 'Converg. Pts'}</p>
              </div>
            ) : null}
            <div className={`${cellWidth} p-[18px] ${isLockedReferral ? '' : ''}`}>
              <p>{isLockedReferral ? '???' : 'Referral Pts'}</p>
            </div>
            <div className={`w-[12%] p-[18px] ${isLockedOg ? '' : ''}`}>
              <p>{isLockedOg ? '???' : 'Others'}</p>
            </div>
            <div className="w-[17%] p-[18px]">
              <p>{currentSeason === 0 ? 'Season 2' : 'Season 1'} Points</p>
              <p className="text-b2">(Before Multiplier)</p>
            </div>
            <div className="w-[10%] p-[18px]">
              <p>Multiplier</p>
            </div>
            <div className="w-[16%] p-[18px]">
              <p>{currentSeason === 0 ? 'Season 2' : 'Season 1'} Points</p>
              <p className="text-b2">(After Multiplier)</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* table */}
        <div className="mb-9 w-full">
          <div className="space-y-[12px] px-[1px]">
            {!isLoading ? (
              <>
                {/* current user data */}
                {isConnected ? (
                  <div className="relative cursor-pointer text-[15px]" onClick={() => router.push(`/userprofile/${userWalletAddress}`)}>
                    <div
                      className={`table-border-grad flex h-[54px] items-center font-medium xl:px-[50px] ${
                        userIsBan ? 'disqualified' : 'active'
                      }`}>
                      <div className="flex w-[10%] px-[10px] py-[18px]">
                        <UserMedal rank={userData.rank} isYou isBan={userIsBan} isUnranked={userIsUnranked} />
                      </div>
                      <div className={`p-[18px] ${usernameWidth}`}>
                        <p
                          className={`overflow-hidden text-ellipsis text-[15px] font-semibold ${
                            userIsBan ? 'text-marketRed line-through' : ''
                          }`}>
                          {userData?.username ? trimString(userData.username, 10) : walletAddressToShow(userData.userAddress)}
                        </p>
                      </div>
                      <div className={`${cellWidth} relative p-[18px]`}>
                        {userIsUnranked ? (
                          <div className="absolute left-0 top-[21px]">
                            <Tooltip
                              direction="top"
                              content={
                                <>
                                  Trade 5 WETH notional to
                                  <br /> unlock your reward
                                </>
                              }>
                              <Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />
                            </Tooltip>
                          </div>
                        ) : null}
                        <p className={`text-[15px] font-normal ${userIsBan ? 'text-marketRed line-through' : ''}`}>
                          {localeConversion(userData.tradeVolPoints, 1, 1)}
                        </p>
                      </div>
                      {currentSeason !== 0 ? (
                        <div className={`w-[12%] p-[18px] ${isLockedConverg ? 'col-locked' : ''} relative`}>
                          {userIsUnranked ? (
                            <div className="absolute left-0 top-[21px]">
                              <Tooltip
                                direction="top"
                                content={
                                  <>
                                    Trade 5 WETH notional to
                                    <br /> unlock your reward
                                  </>
                                }>
                                <Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />
                              </Tooltip>
                            </div>
                          ) : null}
                          <p
                            className={`${userIsBan && !isLockedConverg ? 'text-marketRed line-through' : ''} ${
                              isLockedConverg ? '' : ''
                            }`}>
                            {isLockedConverg ? '-' : localeConversion(userData.convergePoints, 1, 1)}
                          </p>
                        </div>
                      ) : null}
                      <div className={`${cellWidth} p-[18px] ${isLockedReferral ? 'col-locked' : ''} relative`}>
                        {userIsUnranked ? (
                          <div className="absolute left-0 top-[21px]">
                            <Tooltip
                              direction="top"
                              content={
                                <>
                                  Trade 5 WETH notional to
                                  <br /> unlock your reward
                                </>
                              }>
                              <Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />
                            </Tooltip>
                          </div>
                        ) : null}
                        <p
                          className={`${userIsBan && !isLockedReferral ? 'text-marketRed line-through' : ''} ${
                            isLockedReferral ? '' : ''
                          }`}>
                          {isLockedReferral ? '-' : localeConversion(userData.referralPoints, 1, 1)}
                        </p>
                      </div>
                      <div className={`w-[12%] p-[18px] ${isLockedOg ? 'col-locked' : ''} relative`}>
                        {userIsUnranked ? (
                          <div className="absolute left-0 top-[21px]">
                            <Tooltip
                              direction="top"
                              content={
                                <>
                                  Trade 5 WETH notional to
                                  <br /> unlock your reward
                                </>
                              }>
                              <Image src="/images/components/airdrop/lock.svg" width={16} height={16} alt="" />
                            </Tooltip>
                          </div>
                        ) : null}
                        <p
                          className={`text-[15px] font-normal ${userIsBan && !isLockedOg ? 'text-marketRed line-through' : ''} ${
                            isLockedOg ? '' : ''
                          }`}>
                          {isLockedOg ? '-' : localeConversion(userData.og, 1, 1)}
                        </p>
                      </div>
                      <div className="w-[17%] p-[18px]">
                        <p className="text-highEmphasis} text-[15px] font-semibold">
                          {userIsBan || userIsUnranked ? '-' : `${localeConversion(userData.originalTotal, 1, 1)}`}
                        </p>
                      </div>
                      <div className="w-[10%] p-[18px]">
                        <p
                          className={`text-[15px] font-semibold  ${
                            userIsBan || userIsUnranked ? 'text-highEmphasis' : 'text-marketGreen'
                          }`}>
                          {userIsBan || userIsUnranked ? '-' : `${localeConversion(userData.multiplier, 1, 1)}x`}
                        </p>
                      </div>
                      <div className="w-[16%] p-[18px]">
                        <p className={`text-[15px] font-semibold  ${userIsBan || userIsUnranked ? 'text-highEmphasis' : 'text-warn'}`}>
                          {userIsBan || userIsUnranked ? '-' : `${localeConversion(userData.total, 1, 1)}`}
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

                    const isYou = isConnected && userAddress === userData.userAddress;
                    return (
                      <div
                        key={`rank-${userAddress}`}
                        className="relative cursor-pointer"
                        onClick={() => router.push(`/userprofile/${userAddress}`)}>
                        <div className="table-border-grad flex h-[54px] items-center xl:px-[50px]">
                          <div className="flex w-[10%] px-[10px] py-[18px]">
                            <UserMedal rank={rank} isBan={isBan} isUnranked={rank < 1} isYou={isYou} />
                          </div>
                          <div className={`p-[18px] ${usernameWidth}`}>
                            <p
                              className={`overflow-hidden text-ellipsis text-[15px] font-normal ${
                                isBan ? 'text-marketRed line-through' : ''
                              } ${isYou ? 'font-medium' : ''}`}>
                              {username ? trimString(username, 10) : walletAddressToShow(userAddress)}
                            </p>
                          </div>
                          <div className={`${cellWidth} p-[18px]`}>
                            <p className={`text-[15px] font-normal ${isBan ? 'text-marketRed line-through' : ''}`}>
                              {localeConversion(tradeVolPoints, 1, 1)}
                            </p>
                          </div>
                          {currentSeason !== 0 ? (
                            <div className={`w-[12%] p-[18px] ${isLockedConverg ? 'col-locked' : ''} ${isLockedConverg ? '' : ''}`}>
                              <p className={`text-[15px] font-normal ${isBan && !isLockedConverg ? 'text-marketRed line-through' : ''}`}>
                                {isLockedConverg ? '-' : localeConversion(convergePoints, 1, 1)}
                              </p>
                            </div>
                          ) : null}
                          <div className={`${cellWidth} p-[18px] ${isLockedReferral ? 'col-locked' : ''} ${isLockedReferral ? '' : ''}`}>
                            <p className={`text-[15px] font-normal ${isBan && !isLockedReferral ? 'text-marketRed line-through' : ''}`}>
                              {isLockedReferral ? '-' : localeConversion(referralPoints, 1, 1)}
                            </p>
                          </div>
                          <div className={`w-[12%] p-[18px] ${isLockedOg ? 'col-locked' : ''} ${isLockedOg ? '' : ''}`}>
                            <p className={`text-[15px] font-normal ${isBan && !isLockedOg ? 'text-marketRed line-through' : ''}`}>
                              {isLockedOg ? '-' : localeConversion(og, 1, 1) || 0.0}
                            </p>
                          </div>
                          <div className="w-[17%] p-[18px]">
                            <p className="text-[15px] font-semibold text-highEmphasis">
                              {isBan ? '-' : `${localeConversion(originalTotal, 1, 1)}`}
                            </p>
                          </div>
                          <div className="w-[10%] p-[18px]">
                            <p className={`text-[15px] font-semibold  ${isBan ? 'text-highEmphasis' : 'text-marketGreen'}`}>
                              {isBan ? '-' : `${localeConversion(multiplier, 1, 1)}x`}
                            </p>
                          </div>
                          <div className="w-[16%] p-[18px]">
                            <p className={`text-[15px] font-semibold  ${isBan ? 'text-highEmphasis' : 'text-warn'}`}>
                              {isBan ? '-' : `${localeConversion(total, 1, 1)}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </>
            ) : (
              <>
                <div className="table-border-grad active flex h-[54px] w-full items-center font-medium xl:px-[50px]">
                  <div className="flex w-[10%] justify-center p-[18px]">-</div>
                  <div className={`${usernameWidth} p-[18px]`}>
                    <p>-</p>
                  </div>
                  <div className={`${cellWidth} p-[18px]`}>
                    <p>-</p>
                  </div>
                  {currentSeason !== 0 ? (
                    <div className="w-[12%] p-[18px]">
                      <p>-</p>
                    </div>
                  ) : null}
                  <div className={`${cellWidth} p-[18px]`}>
                    <p>-</p>
                  </div>
                  <div className="w-[12%] p-[18px]">
                    <p className="text-[15px] font-semibold">-</p>
                  </div>
                  <div className="w-[17%] p-[18px]">
                    <p className="text-[15px] font-semibold">-</p>
                  </div>

                  <div className="w-[10%] p-[18px]">
                    <p className="text-[15px] font-semibold text-marketGreen">-</p>
                  </div>
                  <div className="w-[16%] p-[18px]">
                    <p className="text-[15px] font-semibold text-warn">-</p>
                  </div>
                </div>
                {dummyLoadingData.map((_item, i) => (
                  <div key={`loading-${i}`} className="relative">
                    <div className="table-border-grad flex h-[54px] w-full items-center xl:px-[50px]">
                      <div className="flex w-[10%] justify-center p-[18px]">-</div>
                      <div className={`${usernameWidth} p-[18px]`}>
                        <p>-</p>
                      </div>
                      <div className={`${cellWidth} p-[18px]`}>
                        <p>-</p>
                      </div>
                      {currentSeason !== 0 ? (
                        <div className="w-[12%] p-[18px]">
                          <p>-</p>
                        </div>
                      ) : null}
                      <div className={`${cellWidth} p-[18px]`}>
                        <p>-</p>
                      </div>
                      <div className="w-[12%] p-[18px]">
                        <p className="text-[15px] font-semibold">-</p>
                      </div>
                      <div className="w-[17%] p-[18px]">
                        <p className="text-[15px] font-semibold">-</p>
                      </div>

                      <div className="w-[10%] p-[18px]">
                        <p className="text-[15px] font-semibold text-marketGreen">-</p>
                      </div>
                      <div className="w-[16%] p-[18px]">
                        <p className="text-[15px] font-semibold text-warn">-</p>
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
