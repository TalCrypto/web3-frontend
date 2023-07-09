/* eslint-disable operator-linebreak */
import React from 'react';
import Image from 'next/image';

export default function ReferUserModal(props: any) {
  const { setIsShow, setReferralOnboardingStatus, referedUser } = props;

  const closeModal = () => {
    setIsShow(false);
    setReferralOnboardingStatus(2);
  };

  const usernameShow =
    referedUser?.username === ''
      ? `${referedUser?.userAddress.substring(0, 7)}...${referedUser?.userAddress.slice(-3)}`
      : referedUser?.username;

  return (
    <div className="refer-modalbg" onClick={closeModal}>
      <div className="refer-modal" onClick={e => e.stopPropagation()}>
        <div className="flex flex-row items-end justify-end">
          <Image src="/images/mobile/common/close.svg" alt="" className="cursor-pointer" width={16} height={16} onClick={closeModal} />
        </div>
        <div className="flex-column flex pb-[24px] ">
          <div className="flex flex-row items-center">
            <Image src="/images/components/refer-user/refer-user.svg" alt="" className="mr-[8px] h-[18px] w-[18px]" />
            <span className="text-gradient-vertical text-[16px] font-semibold">{usernameShow}</span>
          </div>
          <div className="mt-2">
            has referred you to enjoy <span className="font-semibold text-[#FFC24BDE]">extra 2%</span> Tribe3 (trading volume) points when
            trading on Tribe3! 🍻
          </div>
          <div className="mt-6 flex flex-row items-center justify-start rounded-[4px] bg-[#0C0D2080] px-[24px] py-[12px] ">
            <div className="mr-[24px]">
              <Image src="/images/components/refer-user/refer-candle.svg" alt="" className="h-[23px] w-[28px]" />
            </div>
            <div className="flex-column flex-start flex items-start">
              <div className="text-[14px] font-semibold">Trade</div>
              <div className="text-[12px]">
                Long & Short nfts with leverage in 3 clicks, <br /> simple and fast!
              </div>
            </div>
          </div>
          <div className="mt-[12px] flex flex-row items-center justify-start rounded-[4px] bg-[#0C0D2080] px-[24px] py-[12px] ">
            <div className="mr-[24px]">
              <Image src="/images/components/refer-user/refer-share.svg" alt="" className="h-[28px] w-[28px]" />
            </div>
            <div className="flex-column flex-start flex items-start">
              <div className="text-[14px] font-semibold">Social</div>
              <div className="text-[12px]">Form your own Tribe3 fam here and be a leader!</div>
            </div>
          </div>
          <div className="mt-[12px] flex flex-row items-center justify-start rounded-[4px] bg-[#0C0D2080] px-[24px] py-[12px] ">
            <div className="mr-[24px]">
              <Image src="/images/components/refer-user/refer-reward.svg" alt="" className="h-[28px] w-[28px]" />
            </div>
            <div className="flex-column flex-start flex items-start">
              <div className="text-[14px] font-semibold">Rewards</div>
              <div className="text-[12px]">Earn Tribe3 token!</div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center">
            <div className="navbar-button mt-6 " onClick={closeModal}>
              Trade Now
            </div>
          </div>
        </div>
        <Image src="/images/components/common/modal/modal-logo.svg" width={170} height={165} alt="" className="tribelogos" />
      </div>
    </div>
  );
}
