import { $userInfo } from '@/stores/user';
import { formatBigInt } from '@/utils/bigInt';
import { useStore } from '@nanostores/react';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

function Cell(props: any) {
  const { items, classNames } = props;
  return (
    <div
      className="relative mb-6 grid grid-cols-12 items-center
      text-[14px] text-mediumEmphasis">
      {items.map((item: any, index: any) => (
        <div className={`${classNames[index]}`} key={index}>
          {item}
        </div>
      ))}
    </div>
  );
}

const itemShowReward = (item: any) =>
  item?.pointPrize === 0 && item?.usdtPrize === 0
    ? '-'
    : item?.pointPrize === 0 && item?.usdtPrize > 0
    ? `${item?.usdtPrize}USDT`
    : item?.usdtPrize === 0 && item?.pointPrize > 0
    ? `${item?.pointPrize} Pts.`
    : `${item?.usdtPrize}USDT + ${item?.pointPrize} Pts.`;

const ReferreeModal = (props: any) => {
  const router = useRouter();
  const { myRefererTeamList, isShowReferralModal, setIsShowReferralModal } = props;
  const userInfo = useStore($userInfo);

  const closeModal = () => setIsShowReferralModal(false);

  if (!isShowReferralModal) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-20 h-full
       w-full bg-black/[.2] backdrop-blur-[4px]"
      onClick={closeModal}>
      <div
        className="relative mx-auto mt-[160px] max-w-[940px]
          rounded-[12px] bg-darkBlue text-[14px]
          font-normal leading-[17px] text-mediumEmphasis"
        onClick={e => {
          e.stopPropagation();
        }}>
        <div className="h-[528px] grow rounded-[6px] border-[1px] border-[#2E4371] bg-[#0C0D20] text-[#fff]">
          <div className="mr-[16px] mt-[16px] flex justify-end">
            <Image
              src="/images/components/common/modal/close.svg"
              alt=""
              className="button cursor-pointer"
              width={16}
              height={16}
              onClick={closeModal}
            />
          </div>
          <div className="flex items-center justify-between px-[36px] pt-[8px]">
            <div className="text-[16px] font-[600]">Contribution Details</div>
            <div className="text-[12px] font-[400]">
              Total Referees : <span className="text-[14px] font-[600]">{myRefererTeamList?.length}</span>{' '}
              {/* <span className="text-[15px]">/ {referrers.length}</span> */}
            </div>
          </div>
          {myRefererTeamList?.length > 0 ? (
            <div className="mt-[36px]">
              <div className="px-[36px]">
                <Cell
                  items={['User ID', 'Trading Volume', 'Contribution', 'Reward']}
                  classNames={['col-span-3 text-[12px]', 'col-span-3 text-[12px]', 'col-span-3 text-[12px]', 'col-span-3 text-[12px]']}
                />
              </div>
              <div className="mt-[24px] max-h-[360px] overflow-y-scroll">
                {myRefererTeamList?.map((item: any) => {
                  const isCurrentUser =
                    item.userAddress.toLowerCase() === userInfo?.userAddress.toLowerCase() || item.username === userInfo?.username;
                  const vol = formatBigInt(item.tradedVolume).toFixed(2);
                  const reward = itemShowReward(item);
                  const displayUsername =
                    item.username === ''
                      ? `${item.userAddress.substring(0, 7)}...${item.userAddress.slice(-3)}`
                      : item.username.length > 10
                      ? `${item.username.substring(0, 10)}...`
                      : item.username;

                  return (
                    <div key={item.userAddress} className="grid grid-cols-12 items-center px-[36px] py-[16px] text-[14px] odd:bg-[#202249]">
                      <div className={`relative col-span-3 flex items-center ${!isCurrentUser ? 'pr-[40px]' : 'pr-[70px]'}`}>
                        <div className="absolute left-[-10px] top-0 h-full w-[3px] rounded-[30px] bg-primaryBlue" />
                        <div onClick={() => router.push(`/userprofile/${item.userAddress}`)} className="cursor-pointer truncate">
                          {displayUsername}
                        </div>
                        {isCurrentUser ? <div className="rounded-[2px] bg-[#E06732] px-[4px] py-0 text-[8px] font-[800] ">YOU</div> : null}
                      </div>
                      {/* <div className="relative col-span-2">
                        {item.isEligible ? (
                          <Image
                            src="/images/components/competition/revamp/my-performance/eligible.svg"
                            width={16}
                            height={16}
                            alt=""
                            className="absolute left-[-20px] top-[0px]"
                          />
                        ) : null}
                        {item.isEligible ? 'Eligible' : 'Not Eligible'}
                      </div> */}
                      <div className="col-span-3 flex items-center">
                        <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                        {vol}
                      </div>
                      <div className="col-span-3 font-[600] text-[#FFC24B]">{`${!item.isEligible ? '-' : `${item.contribution}%`}`}</div>
                      <div className="col-span-3">
                        <div className="flex w-fit items-center rounded-[12px] bg-[#2E4371] px-[12px] py-[4px]">
                          <Image
                            src="/images/components/competition/revamp/my-performance/reward.svg"
                            width={16}
                            height={16}
                            alt=""
                            className="mr-[10px]"
                          />
                          {reward}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* <div className="mt-[16px] px-[36px] text-[12px] text-mediumEmphasis">
                Referees with at least <span className="font-[600] text-[#fff]">1 WETH</span> trading volume will be counted as eligible
                referees.
              </div> */}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[15px] font-[400] text-mediumEmphasis">
              List is empty, start sharing your referral link now!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferreeModal;
