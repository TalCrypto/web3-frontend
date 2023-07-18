/* eslint-disable operator-linebreak */
import React from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';
import { $asHasReferCode, $asReferredUser, $asShowResponseModal } from '@/stores/airdrop';

export default function ReferUserModal() {
  const referredUser: any = useNanostore($asReferredUser);

  const closeModal = () => {
    $asHasReferCode.set(false);
    $asShowResponseModal.set(true);
  };

  const userNameShow =
    referredUser?.username === ''
      ? `${referredUser?.userAddress.substring(0, 7)}...${referredUser?.userAddress.slice(-3)}`
      : referredUser?.username;

  return (
    <div
      className="fixed inset-0 z-10 flex h-screen
      items-center justify-center overflow-auto bg-black bg-opacity-40"
      onClick={closeModal}>
      <div
        className="relative w-full max-w-[500px] rounded-[12px]
        bg-lightBlue px-6 py-6 text-[15px] font-normal text-highEmphasis"
        onClick={e => e.stopPropagation()}>
        <div className="absolute right-[16px] top-[16px]">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            className="button cursor-pointer"
            width={16}
            height={16}
            onClick={closeModal}
          />
        </div>
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
          <div className="mt-6 flex flex-row items-center justify-center">
            <div
              className="gradient-button relative flex h-[32px] w-[160px]
              cursor-pointer items-center justify-center rounded-full border-[1px]
              border-[#3576f7] px-4 text-[14px] font-normal text-highEmphasis"
              onClick={closeModal}>
              Trade Now !
            </div>
          </div>
        </div>

        <Image
          className="absolute bottom-0 right-0 mr-3 "
          src="/images/components/common/modal/modal-logo.svg"
          width={170}
          height={165}
          alt=""
        />
      </div>
    </div>
  );
}
