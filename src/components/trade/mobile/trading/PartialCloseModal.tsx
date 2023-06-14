import React from 'react';
import Image from 'next/image';

export default function PartialCloseModal(props: any) {
  const { isShow, setIsShow, onClickSubmit } = props;
  if (!isShow) {
    return null;
  }

  const dismissModal = () => {
    setIsShow(false);
  };

  return (
    <div
      className={`fixed inset-0 z-10 flex h-screen items-center
        justify-center overflow-auto bg-black bg-opacity-40 px-6`}
      onClick={dismissModal}>
      <div
        className={`relative mx-auto overflow-hidden
          rounded-[12px] bg-secondaryBlue`}>
        {/* <div className="col headerrow"> */}
        <div className="mr-4 pb-1 pt-[10px] text-end">
          <div className="items-initial flex content-center justify-end">
            <Image
              src="/images/components/common/modal/close.svg"
              alt=""
              className="cursor-pointer"
              width={16}
              height={16}
              onClick={e => {
                e.stopPropagation();
                dismissModal();
              }}
            />
          </div>
          {/* <div className="col titlerow">
            Adjust Collateral Function
          </div> */}
        </div>
        <div className="relative p-6 text-center leading-[20px]">
          <div className="text-[12px] text-highEmphasis">
            Partially closing a position would <br />
            NOT release any collateral. <br />
            Please do so by adjusting collateral, <br />
            which doesn’t cost any transaction fee.
          </div>
          <div className="mt-7">
            <button
              className="mb-3 w-full cursor-pointer rounded-[4px] bg-primaryBlue px-[10px]
                py-[6px] text-[12px] text-highEmphasis "
              onClick={e => {
                e.stopPropagation();
                onClickSubmit();
              }}>
              Continue Close
            </button>

            <button
              className="w-full cursor-pointer rounded-[4px] bg-primaryBlue px-[10px]
                py-[6px] text-[12px] text-highEmphasis"
              onClick={e => {
                e.preventDefault();
                dismissModal();
              }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
