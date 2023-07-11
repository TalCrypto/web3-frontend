import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ThreeDots } from 'react-loader-spinner';
import { trimString } from '@/utils/string';
import TitleTips from '@/components/common/TitleTips';
import { formatBigInt } from '@/utils/bigInt';
import { useAccount } from 'wagmi';
import Tooltip from '@/components/common/Tooltip';
import UserMedal from '@/components/competition/common/UserMedal';

const CustomTable = (props: any) => {
  const {
    data,
    userData,
    selectedField,
    title,
    icon,
    reloadFunc,
    isLoading,
    thirdRowTitle,
    thirdRowTips,
    thirdRowValueGenerator,
    tableClassName,
    titleClassName,
    tHeadClassName,
    tBodyClassName,
    reward,
    tableType,
    bottomShadowPosition
  } = props;
  const router = useRouter();
  const { address, isConnected, isConnecting } = useAccount();

  const isLogin = isConnected;

  const tradeVolumeToShow = formatBigInt(userData?.tradeVol, 2);
  const userIsBan = userData?.isBan;
  const userIsUnranked = !userData?.eligible;

  const walletAddressToShow = (addr: string) => `${addr.substring(0, 7)}...${addr.slice(-3)}`;

  return (
    <div className={`relative ${tableClassName}`}>
      {/* title and update btn */}
      <div className={titleClassName}>
        <div className="mb-[8px] flex items-center justify-center">
          {icon}
          {title}
        </div>
        <div
          className="flex hidden cursor-pointer items-center"
          onClick={() => {
            reloadFunc();
          }}>
          <p className="text-b2">{isLoading ? 'Updating...' : 'Update'}</p>
          <Image
            alt="refresh icon"
            className={`${isLoading ? 'animate-spin' : ''}`}
            src="/static/icon/pointsystem/refresh.svg"
            width={30}
            height={30}
          />
        </div>
      </div>

      {/* reward component */}
      {reward || null}

      {/* table head */}
      <div className={tHeadClassName}>
        <div className="basis-[15%]">Rank</div>
        <div className="basis-[45%] pl-[17.33px]">User</div>
        <div className="flex basis-[40%] items-center">
          <Tooltip direction="top" content={<div className="w-[250px] text-center">{thirdRowTips}</div>}>
            <Image
              src="/images/components/trade/history/more_info.svg"
              alt="more info"
              width={12}
              height={12}
              className="mr-[6px] cursor-pointer"
            />
          </Tooltip>
          {thirdRowTitle}
        </div>
      </div>

      {/* table body */}
      <div className={tBodyClassName}>
        {/* is loading */}
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
          </div>
        ) : null}

        {/* current user data */}
        {isLogin && !isLoading && data.length > 0 && userData && Object.keys(userData).length !== 0 ? (
          <div
            className="relative cursor-pointer border-b border-[#2E4371] hover:bg-[rgba(32,34,73,0.5)]"
            onClick={() => router.push(`/userprofile/${address}`)}>
            <div className={`flex h-[45px] items-center ${userIsBan ? 'disqualified' : 'active'}`}>
              <div className="flex w-[15%]">
                <UserMedal rank={Number(userData?.rank)} isYou isBan={userIsBan} isUnranked={userIsUnranked} type={tableType} />
              </div>
              <div className="flex w-[45%] items-center">
                <Image
                  alt="user icon"
                  className="mb-[1px]"
                  src="/images/components/competition/icons/user-colorful.svg"
                  width={13.33}
                  height={16.67}
                />
                <span
                  className={`
                    colorful-text w-auto overflow-hidden text-ellipsis pl-1
                    text-b2 ${userIsBan ? 'text-marketRed line-through' : ''}
                  `}>
                  {userData?.username ? trimString(userData?.username, 10) : walletAddressToShow(userData?.userAddress)}
                </span>
              </div>
              <div className="relative w-[40%] pl-4">
                {userIsUnranked ? (
                  <div className="absolute left-0">
                    <TitleTips
                      placement="top"
                      tipsText={
                        <>
                          <span>Trade for 5 WETH</span>
                          <br />
                          <span>notional to get a rank!</span>
                          <br />
                          <span className="text-warning text-b3e">({tradeVolumeToShow}/5.00)</span>
                        </>
                      }
                      titleText={<Image alt="lock icon" src="/images/components/airdrop/lock.svg" width={16} height={16} />}
                    />
                  </div>
                ) : null}
                <div className={`${userIsBan ? 'text-marketRed line-through' : ''} ${userIsUnranked ? 'ml-1' : ''}`}>
                  {thirdRowValueGenerator(userData[selectedField])}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* other users data */}
        {!isLoading && data.length > 0
          ? data.map((item: any, index: number) => {
              const { rank, username, userAddress, isBan, tradeVol, ...user } = item;
              const isYou = userAddress === userData?.userAddress;
              const lastIndex = data.length - 1 === index;

              return (
                <div
                  key={`user-list-${selectedField}-${userAddress}-${index}`}
                  className={`relative cursor-pointer ${
                    lastIndex ? 'border-none' : 'border-b'
                  } border-[#2E4371] hover:bg-[rgba(32,34,73,0.5)]`}
                  onClick={() => router.push(`/userprofile/${userAddress}`)}>
                  <div className={`flex h-[45px] items-center ${isBan ? 'disqualified' : 'active'}`}>
                    <div className="flex w-[15%]">
                      <UserMedal rank={Number(rank)} isYou={isYou} isBan={isBan} type={tableType} />
                    </div>
                    <div className="flex w-[45%] items-center">
                      <span
                        className={`
                          w-auto overflow-hidden text-ellipsis pl-[17.33px] text-b2 
                          text-highEmphasis ${isBan ? 'text-marketRed line-through' : ''}
                        `}>
                        {!username ? walletAddressToShow(userAddress) : trimString(username, 10)}
                      </span>
                    </div>
                    <div className="relative w-[40%] pl-4">
                      <div className={`${isBan ? 'text-marketRed line-through' : ''} ${userIsUnranked ? 'ml-1' : ''}`}>
                        {thirdRowValueGenerator(user[selectedField])}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : null}

        {/* data is empty */}
        {!isLoading && data.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-b1 text-mediumEmphasis">Start trading to get rank now!</span>
          </div>
        ) : null}
      </div>

      {/* bottom gradient layer */}
      {bottomShadowPosition ? (
        <div
          className={`absolute bottom-${bottomShadowPosition} pointer-events-none h-10 w-full rounded-bl-md border-b border-transparent`}
          style={{
            background: 'linear-gradient(180deg,rgba(18, 18, 42, 0) 0%,rgba(3, 3, 9, 0.5) 100%)'
          }}
        />
      ) : null}
    </div>
  );
};

export default CustomTable;
