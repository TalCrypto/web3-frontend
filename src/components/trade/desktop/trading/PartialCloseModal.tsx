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
      className={`fixed inset-0 z-10 flex h-screen
        items-center justify-center overflow-auto bg-black bg-opacity-40`}
      onClick={dismissModal}>
      <div
        className={`relative mx-auto w-[500px] overflow-hidden
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
        <div className="relative px-16 py-9 text-center text-[16px]">
          <div className="text-[15px]">
            <p>
              Partially closing a position would NOT release any collateral. Please do so by adjusting collateral, which doesn’t cost any
              transaction fee.
            </p>
          </div>
          <div className="mt-7">
            <button
              className="z-700 partial-button relative min-w-[160px] flex-1
                cursor-pointer rounded-full border-[1px] border-[#3576f7] px-4
                py-[3px] text-[14px] text-highEmphasis "
              onClick={e => {
                e.stopPropagation();
                onClickSubmit();
              }}>
              Continue Close
            </button>
            <button
              className="z-700 partial-button relative ml-3 min-w-[160px]
                flex-1 cursor-pointer rounded-full border-[1px] border-[#3576f7] px-4
                py-[3px] text-[14px] text-highEmphasis"
              onClick={e => {
                e.preventDefault();
                dismissModal();
              }}>
              Cancel
            </button>
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
    </div>
  );
}
