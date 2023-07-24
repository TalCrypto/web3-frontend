/* eslint-disable operator-linebreak */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';
import { $asHasReferCode, $asReferredUser, $asShowResponseModal } from '@/stores/airdrop';
import { $isShowMobileModal } from '@/stores/modal';
import PrimaryButton from '@/components/common/PrimaryButton';

export default function ReferUserMobileModal() {
  const referredUser: any = useNanostore($asReferredUser);
  const [isExpand, setIsExpand] = useState(false);

  const closeModal = () => {
    $asHasReferCode.set(false);
    $asShowResponseModal.set(true);
  };

  const handleCloseModal = () => {
    setIsExpand(false);
    setTimeout(() => {
      $asHasReferCode.set(false);
      $asShowResponseModal.set(true);
      $isShowMobileModal.set(false);
    }, 500);
  };

  useEffect(() => {
    setIsExpand(true);
  }, []);

  const userNameShow =
    referredUser?.username === ''
      ? `${referredUser?.userAddress.substring(0, 7)}...${referredUser?.userAddress.slice(-3)}`
      : referredUser?.username;

  return (
    <div
      className={`t-0 fixed bottom-0 left-0 right-0 z-[12] w-full
        ${isExpand ? 'h-full' : 'h-0'}
       bg-black/[.3] backdrop-blur-[4px]`}
      onClick={handleCloseModal}>
      <div
        className={`transition-bottom absolute bottom-0 w-full pt-6
        ${isExpand ? 'bottom-0' : 'bottom-[-550px]'}
        bg-secondaryBlue duration-500
      `}>
        <div className="mx-6">
          <div className="flex flex-row items-center">
            <Image src="/images/components/airdrop/refer-user/refer-user.svg" alt="" className="mr-[8px] " width={18} height={18} />
            <span className="text-gradient-vertical text-[16px] font-semibold">{userNameShow}</span>
          </div>
          <div className="mt-2 text-[15px] font-normal">
            has referred you to enjoy <span className="font-semibold text-[#FFC24BDE]">extra 2%</span> Tribe3 (trading volume) points when
            trading on Tribe3! 🍻
          </div>
          <div className="mt-6 flex flex-row items-center justify-start rounded-[4px] bg-darkBlue/50 px-6 py-3">
            <div className="mr-[24px]">
              <Image src="/images/components/airdrop/refer-user/refer-candle.svg" alt="" width={28} height={28} />
            </div>
            <div>
              <div className="text-[14px] font-semibold">Trade</div>
              <div className="text-[12px]">
                Long & Short nfts with leverage in 3 clicks, <br /> simple and fast!
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-row items-center justify-start rounded-[4px] bg-darkBlue/50 px-6 py-3 ">
            <div className="mr-[24px]">
              <Image src="/images/components/airdrop/refer-user/refer-share.svg" alt="" width={28} height={28} />
            </div>
            <div>
              <div className="text-[14px] font-semibold">Social</div>
              <div className="text-[12px]">Form your own Tribe3 fam here and be a leader!</div>
            </div>
          </div>
          <div className="mt-3 flex flex-row items-center justify-start rounded-[4px] bg-darkBlue/50 px-6 py-3 ">
            <div className="mr-[24px]">
              <Image src="/images/components/airdrop/refer-user/refer-reward.svg" alt="" width={28} height={28} />
            </div>
            <div>
              <div className="text-[14px] font-semibold">Rewards</div>
              <div className="text-[12px]">Earn Tribe3 token!</div>
            </div>
          </div>
          <div className="my-6">
            <PrimaryButton className="px-[14px] py-[7px] !text-[14px] font-semibold" onClick={closeModal}>
              Trade Now !
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
