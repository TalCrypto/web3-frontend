/* eslint-disable max-len */
import React from 'react';
import Image from 'next/image';

export default function ShareModal(props: any) {
  const { setIsShow, referralCode, copyCode, shareToTwitter } = props;
  const closeModal = () => {
    setIsShow(false);
  };

  const copyText = `🎉 Long & short Blue-chips NFTs with leverage at any amount
    on https://app.tribe3.xyz/airdrop/refer?ref=${referralCode?.toUpperCase()}
  📢 Use my referral link to enjoy extra Tribe3 points!`;

  return (
    <div className="share-modalbg" onClick={closeModal}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <div className="mb-[12px] flex flex-row items-end justify-end">
          <Image src="/images/mobile/common/close.svg" alt="" className="cursor-pointer" width={16} height={16} onClick={closeModal} />
        </div>
        <div className="content flex flex-row">
          <div className="z-10 hidden rounded-[16px] bg-gradient-to-r from-[#04AEFC] to-[#F703D9] p-[1px] md:block">
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
          <div className="z-10 ml-[24px] flex min-w-[95px] flex-col items-center justify-center">
            <div className="flex cursor-pointer flex-col items-center" onClick={shareToTwitter}>
              <Image src="/images/components/airdrop/twitter_icon.svg" width={36} height={36} alt="" />
              <p className="body3 mb-[20px] mt-[6px]">Share to Twitter</p>
            </div>
            <div className="flex cursor-pointer flex-col items-center" onClick={e => copyCode(e.target, copyText, false)}>
              <Image src="/images/components/airdrop/copy.svg" width={36} height={36} alt="" />
              <p className="body3 mt-[6px]">Copy Text</p>
            </div>
          </div>
        </div>
        <Image src="/images/components/common/modal/modal-logo.svg" width={170} height={165} alt="" className="tribelogos" />
      </div>
    </div>
  );
}
