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
    <div
      className="fixed inset-0 z-20 flex h-screen
        items-center justify-center overflow-auto bg-black bg-opacity-40"
      onClick={closeModal}>
      <div
        className="relative w-full max-w-[500px] rounded-[12px] bg-lightBlue
          px-6 pb-6 pt-4 text-[14px] font-normal text-highEmphasis"
        onClick={e => e.stopPropagation()}>
        <div className="mb-[12px] flex flex-row items-end justify-end">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            className="cursor-pointer"
            width={16}
            height={16}
            onClick={closeModal}
          />
        </div>
        <div className="content flex flex-row">
          <div className="z-10 hidden rounded-[16px] bg-gradient-to-r from-gradientBlue to-gradientPink p-[1px] md:block">
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
              <p className="mb-[20px] mt-[6px] text-[12px]">Share to Twitter</p>
            </div>
            <div className="flex cursor-pointer flex-col items-center" onClick={e => copyCode(e.target, copyText, false)}>
              <Image src="/images/components/airdrop/copy.svg" width={36} height={36} alt="" />
              <p className="mt-[6px] text-[12px]">Copy Text</p>
            </div>
          </div>
        </div>
        <Image
          src="/images/components/common/modal/modal-logo.svg"
          width={170}
          height={165}
          alt=""
          className="absolute bottom-0 right-0 mr-3 flex items-end"
        />
      </div>
    </div>
  );
}
