/* eslint-disable max-len */
import React from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';
import { $isShowApproveModal } from '@/stores/modal';

export default function ApprovalModal() {
  const isShowApproveModal = useNanostore($isShowApproveModal);

  const closeModal = () => {
    $isShowApproveModal.set(false);
  };

  if (!isShowApproveModal) return null;

  return (
    <div
      className="fixed inset-0 z-10 flex h-screen
        items-center justify-center overflow-auto bg-black bg-opacity-40"
      onClick={closeModal}>
      <div
        className="relative w-full max-w-[830px] rounded-[12px] bg-lightBlue
          px-6 pt-4 text-[15px] font-normal text-highEmphasis"
        onClick={e => e.stopPropagation()}>
        <div className="mr-[16px] mt-[16px] flex flex-row justify-end ">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            className="button cursor-pointer"
            width={16}
            height={16}
            onClick={closeModal}
          />
        </div>
        <div className="mx-[24px] mt-[4px]  ">
          <div className="text-[16px] font-[600]">Approve - Spending Cap Issue</div>
          <div className="mt-[36px] ">
            The spending cap is the amount, on accumulated basis, that you are comfortable to spend on Tribe3 platform.
          </div>
          <div className="mt-[36px] ">
            &#39;Max&#39; matches the spending cap with your current wallet balance. It is however recommended to input a larger value (e.g.
            use default) so&nbsp;
            <span className="text-[#FFC24BDE]">you don&#39;t have to spend gas fee</span>&nbsp;to increase the spending cap that often.
          </div>
          <div className="mb-[66px] mt-[36px] flex flex-row justify-between">
            <div className="relative z-[2] h-[201px] ">
              <Image src="/images/components/trade/modals/approval/left.png" alt="" width={356} height={201} />
              <Image
                src="/images/components/trade/modals/approval/arrow-points.png"
                alt=""
                className="absolute right-[-48px] top-[30px] z-[5]"
                height={17}
                width={69}
              />
            </div>
            <div className="relative z-[1] h-[201px]">
              <Image src="/images/components/trade/modals/approval/right.png" alt="" className="" width={356} height={201} />
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
