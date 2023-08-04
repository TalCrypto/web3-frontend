import React, { useState } from 'react';
import Image from 'next/image';
import MobileTooltip from '@/components/common/mobile/Tooltip';

const ContributionDetailsModal = (props: any) => {
  const { isShow, setIsShow, referrers } = props;
  const [displayCount, setDisplayCount] = useState(8);

  const handleBackClick = () => setIsShow(false);

  return (
    <div
      className={`fixed inset-0 z-10 h-full w-full
        ${isShow ? 'left-[0]' : 'left-[100%]'}
        transition-left z-[12] overflow-auto
        bg-black bg-opacity-40 duration-500
      `}>
      <div
        className="relative top-0 mx-auto h-full w-full overflow-hidden
          border-[1px] border-[#71aaff38] bg-[#0C0D20]"
        onClick={e => {
          e.stopPropagation();
        }}>
        <div className="">
          <div className="px-[20px] pt-[36px] ">
            <div className="flex text-[20px] font-[600]">Contribution Details</div>
            <div className="mt-[24px] flex items-center justify-between">
              <div className="flex items-center text-[14px] font-[400]">
                <div className="mr-[6px]">Eligible / Total Referees</div>
                <MobileTooltip
                  direction="top"
                  title="Eligible referee"
                  content={
                    <div className="text-center">Referees with at least 1 WETH trading volume will be counted as eligible referees.</div>
                  }>
                  <Image
                    src="/images/components/trade/history/more_info.svg"
                    alt="more info"
                    width={12}
                    height={12}
                    className="mr-[6px] cursor-pointer md:hidden"
                  />
                </MobileTooltip>
              </div>
              <div>
                <span className="text-[20px] font-[600] text-[#FFC24B]">
                  {referrers.filter((item: { isEligible: any }) => item.isEligible).length}
                </span>{' '}
                <span className="text-[15px]">/ {referrers.length}</span>
              </div>
            </div>
            <div className="mt-[24px] text-[14px] font-[400] text-mediumEmphasis">
              <div className="flex items-center justify-between">
                <div>
                  User ID /
                  <br />
                  Status
                </div>
                <div>
                  Contribution /
                  <br />
                  Trading Vol.
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[16px] overflow-y-scroll">
            {referrers
              .slice(0, displayCount > referrers.length ? referrers.length : displayCount)
              .map((item: { username: string; isEligible: any; reward: any; vol: number }) => {
                const showUsername = item.username.length > 10 ? `${item.username.substring(0, 10)}...` : item.username;
                return (
                  <div className={`h-full px-[20px] py-[16px] text-[14px] ${item.isEligible ? 'bg-[#202249]' : ''}`}>
                    <div className="flex h-[48px] items-center justify-between">
                      <div className="flex h-full items-center">
                        <div className="mr-[6px] h-full w-[3px] rounded-[30px] bg-[#2574FB]" />
                        <div className="flex flex-col justify-between">
                          <div className="font-[600]">{showUsername}</div>
                          <div className="mt-[6px] flex items-center">
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
                          </div>
                        </div>
                      </div>
                      <div className="flex h-full items-end text-end">
                        <div className="flex flex-col justify-end">
                          <div className="font-[600] text-[#FFC24B]">{item.isEligible ? `${item.reward}%` : '-'}</div>
                          <div className="mt-[6px] flex items-center justify-end">
                            <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" className="mr-[4px]" />
                            {item.vol.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div
          className="absolute bottom-0 flex h-[50px] w-full items-center justify-center
        bg-secondaryBlue px-[22px] py-4 text-[15px] text-white
      ">
          <Image
            src="/images/mobile/common/angle-right.svg"
            className="absolute left-[22px] cursor-pointer"
            width={14}
            height={14}
            alt=""
            onClick={handleBackClick}
          />
          <div className="flex">Contribution Details</div>
        </div>
      </div>
    </div>
  );
};

export default ContributionDetailsModal;
