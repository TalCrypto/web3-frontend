import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@nanostores/react';
import { $userInfo } from '@/stores/user';
import { formatBigInt } from '@/utils/bigInt';
import { useRouter } from 'next/router';

const ContributionDetailsMobile = (props: any) => {
  const router = useRouter();
  const { myRefererTeamList, myRefererUserItem } = props;
  const [displayCount, setDisplayCount] = useState(8);

  const displayUsername =
    myRefererUserItem?.username === ''
      ? `${myRefererUserItem?.userAddress.substring(0, 7)}...${myRefererUserItem?.userAddress.slice(-3)}`
      : myRefererUserItem?.username.length > 10
      ? `${myRefererUserItem?.username.substring(0, 10)}...`
      : myRefererUserItem?.username;

  const userInfo = useStore($userInfo);

  return (
    <>
      <div className="px-[20px] pt-[36px] ">
        <div className="flex text-[20px] font-[600]">Contribution Details</div>
        <div className="mt-[24px] flex items-center justify-between">
          <div className="flex items-center text-[14px] font-[400]">
            <Image
              src="/images/components/competition/revamp/my-performance/referrer-master.svg"
              alt="more info"
              width={24}
              height={24}
              className="mr-[6px] cursor-pointer md:hidden"
            />
            <div
              onClick={() => router.push(`/userprofile/${myRefererUserItem?.userAddress}`)}
              className="mr-[8px] bg-gradient-to-b from-[#FFC977] to-[#fff] bg-clip-text text-[20px] font-[600] text-transparent">
              {`${displayUsername}'s Team`}
            </div>
          </div>
          <div className="text-[14px] font-[400]">
            Total Referees: <span className="font-[600] ">{myRefererTeamList?.length}</span>
          </div>
        </div>
        <div className="sticky left-0 right-0 top-0 z-[2] mt-[24px] w-full text-[14px] font-[400] text-mediumEmphasis">
          <div className="flex items-center justify-between">
            <div className="text-start">
              User ID
              {/* <br />
    Status */}
            </div>
            <div className="text-end">
              Contribution /
              <br />
              Trading Vol.
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="pt-[16px]">
          {myRefererTeamList
            ?.slice(0, displayCount > myRefererTeamList.length ? myRefererTeamList.length : displayCount)
            .map((item: any) => {
              const showUsername =
                item.username === ''
                  ? `${item.userAddress.substring(0, 7)}...${item.userAddress.slice(-3)}`
                  : item.username.length > 10
                  ? `${item.username.substring(0, 10)}...`
                  : item.username;

              const isCurrentUser =
                item.userAddress.toLowerCase() === userInfo?.userAddress.toLowerCase() || item.username === userInfo?.username;
              const vol = formatBigInt(item.tradedVolume).toFixed(2);

              return (
                <div key={item.userAddress} className="px-[20px] py-[16px] text-[14px] odd:bg-[#202249]">
                  <div className="flex h-[48px] items-center justify-between">
                    <div className="flex h-full items-center">
                      <div className="mr-[6px] h-full w-[3px] rounded-[30px] bg-[#2574FB]" />
                      <div className="flex flex-col justify-between">
                        <div onClick={() => router.push(`/userprofile/${item.userAddress}`)} className="flex items-center font-[600]">
                          {showUsername}
                          {isCurrentUser ? (
                            <div className="ml-[6px] rounded-[2px] bg-[#E06732] px-[4px] py-0 text-[8px] font-[800] ">YOU</div>
                          ) : null}
                        </div>
                        {/* <div className="mt-[6px] flex items-center">
                    {item.isEligible ? (
                      <Image
                        src="/images/components/competition/revamp/my-performance/eligible.svg"
                        width={16}
                        height={16}
                        alt=""
                        className="mr-[4px]"
                      />
                    ) : null}
                    {item.isEligible ? 'Eligible' : 'Not Eligible'}
                  </div> */}
                      </div>
                    </div>
                    <div className="flex h-full items-end text-end">
                      <div className="flex flex-col justify-end">
                        <div className="font-[600] text-[#FFC24B]">{`${
                          Number(item.distribution) === 0 ? '-' : `${Number(item.distribution).toFixed(1)}%`
                        }`}</div>
                        <div className="mt-[6px] flex items-center justify-end">
                          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                          {vol}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {myRefererTeamList && myRefererTeamList?.length > 0 ? (
            displayCount >= myRefererTeamList?.length ? null : (
              <div className="bg-darkBlue py-[35px] text-center">
                <span
                  className="text-center text-[14px] font-semibold text-primaryBlue"
                  onClick={() => {
                    setDisplayCount(displayCount + 8);
                  }}>
                  Show More
                </span>
              </div>
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ContributionDetailsMobile;
