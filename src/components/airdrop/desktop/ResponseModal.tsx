/* eslint-disable max-len */
import React from 'react';
import Image from 'next/image';
import { $asReferResponse, $targetReferralCode } from '@/stores/airdrop';
import { useStore as useNanostore } from '@nanostores/react';
import { ReferredResponse } from '@/const/airdrop';

function ResponseModal() {
  const referResponse = useNanostore($asReferResponse);
  const targetReferralCode = useNanostore($targetReferralCode);

  const dismissModal = () => {
    $asReferResponse.set(0);
  };

  let title = '';
  let description = '';

  if (referResponse === ReferredResponse.Congrats) {
    title = 'Congrats!';
    description = 'You can get 2% of your own trading volume bonus points!';
  } else if (referResponse === ReferredResponse.IsInvalidCode) {
    title = 'Invalid Referral Code';
    description = 'Please use a valid referral code.';
  } else if (referResponse === ReferredResponse.IsTradedOnce) {
    title = 'You have Traded Once';
    description = 'Referral code can only be entered before trading.';
  } else if (referResponse === ReferredResponse.IsHadEnterCode) {
    title = 'You Already have a Referrer';
    description = 'You are currently getting 2% of your own trading volume bonus points.';
  } else if (referResponse === ReferredResponse.IsError) {
    title = 'Fail to apply the referral code';
    description = `Oops, an error occurred, please try again with this referral link: https://app.tribe3.xyz/airdrop/refer?ref=${targetReferralCode}`;
  }

  return (
    <div
      className="fixed inset-0 z-10 flex h-screen
        items-center justify-center overflow-auto bg-black bg-opacity-40"
      onClick={dismissModal}>
      <div
        className="relative w-full max-w-[500px] rounded-[12px]
      bg-lightBlue text-[15px] font-normal text-highEmphasis"
        onClick={e => e.stopPropagation()}>
        <div className="absolute right-[16px] top-[16px] z-[2]">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            className="button cursor-pointer"
            width={16}
            height={16}
            onClick={dismissModal}
          />
        </div>
        <div className="relative px-[64px] py-9">
          <div>
            <div className="mb-6 text-center text-[15px] font-semibold">{title}</div>
            <div className="h-[124px] text-center text-[14px] font-normal">{description}</div>
          </div>

          <div className="flex justify-center">
            <button
              className="gradient-button relative flex h-[32px] w-[160px]
                cursor-pointer items-center justify-center rounded-full border-[1px]
              border-[#3576f7] px-4 text-[14px] font-normal text-highEmphasis"
              onClick={dismissModal}>
              Close
            </button>
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
    </div>
  );
}

export default ResponseModal;
