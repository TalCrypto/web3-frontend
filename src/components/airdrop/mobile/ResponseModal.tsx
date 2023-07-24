/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { $asReferResponse, $targetReferralCode } from '@/stores/airdrop';
import { useStore as useNanostore } from '@nanostores/react';
import { ReferredResponse } from '@/const/airdrop';
import PrimaryButton from '@/components/common/PrimaryButton';

function ResponseModal() {
  const referResponse = useNanostore($asReferResponse);
  const targetReferralCode = useNanostore($targetReferralCode);

  const [isExpand, setIsExpand] = useState(false);

  const dismissModal = () => {
    $asReferResponse.set(0);
  };

  useEffect(() => {
    if (referResponse !== 0) {
      setIsExpand(true);
    }
  }, [referResponse]);

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
      className={`t-0 fixed bottom-0 left-0 right-0 z-[12] w-full
        ${isExpand ? 'h-full' : 'h-0'}
       bg-black/[.3] backdrop-blur-[4px]`}
      onClick={dismissModal}>
      <div
        className={`transition-bottom absolute bottom-0 w-full pt-6
        ${isExpand ? 'bottom-0' : 'bottom-[-550px]'}
        bg-secondaryBlue duration-500
      `}>
        <div className="mx-6">
          <div>
            <div className="mb-6 text-[15px] font-semibold">{title}</div>
            <div className="text-[14px] font-normal">{description}</div>
          </div>

          <div className="my-8">
            <PrimaryButton className="px-[14px] py-[7px] !text-[14px] font-semibold" onClick={dismissModal}>
              Close
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResponseModal;
