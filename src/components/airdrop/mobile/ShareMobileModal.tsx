/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { $isShowMobileModal } from '@/stores/modal';
import PrimaryButton from '@/components/common/PrimaryButton';

export default function ShareMobileModal(props: any) {
  const { setIsShow, referralCode, copyCode } = props;
  const [isExpand, setIsExpand] = useState(false);

  const copyText = `🎉 Long & short Blue-chips NFTs with leverage at any amount
    on https://app.tribe3.xyz/airdrop/refer?ref=${referralCode?.toUpperCase()}
  📢 Use my referral link to enjoy extra Tribe3 points!`;

  const handleCloseModal = () => {
    setTimeout(() => {
      setIsShow(false);
      $isShowMobileModal.set(false);
    }, 500);
  };

  useEffect(() => {
    setIsExpand(true);
  }, []);

  return (
    <div
      className={`t-0 fixed bottom-0 left-0 right-0 z-[12] w-full
        ${isExpand ? 'h-full' : 'h-0'}
       bg-black/[.3] backdrop-blur-[4px]`}
      onClick={handleCloseModal}>
      <div
        className={`transition-bottom absolute bottom-0 w-full
        ${isExpand ? 'bottom-0' : 'bottom-[-550px]'}
        bg-secondaryBlue px-6
        py-6 duration-500
      `}>
        <div className="content flex flex-row">
          <div className="z-10 rounded-[16px] bg-gradient-to-r from-gradientBlue to-gradientPink p-[1px]">
            <div className="flex rounded-[15px] bg-lightBlue px-[20px] py-[36px] outline-dashed outline-2 outline-lightBlue">
              <div className="flex-1">
                <h5 className="mb-[24px]">
                  🎉 Long & short Blue-chips NFTs with leverage at any amount on{' '}
                  <span className="text-[#2574FB]">{`https://app.tribe3.xyz/airdrop/refer?ref=${referralCode}`}</span>
                </h5>
                <p className="body2">📢 Use my referral link to enjoy extra Tribe3 points!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full">
          <PrimaryButton
            className="px-[14px] py-[7px] !text-[14px] font-semibold"
            onClick={(e: any) => copyCode(e.target, copyText, false)}>
            Copy To Clipboard
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
