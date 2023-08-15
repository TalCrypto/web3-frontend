import PrimaryButton from '@/components/common/PrimaryButton';
import React, { useState } from 'react';

const MobileTooltip = (props: any) => {
  const { title = '', content, children } = props;
  const [isShow, setIsShow] = useState(false);

  const dismissModal = () => {
    setIsShow(false);
  };

  return (
    <>
      {isShow ? (
        <div
          className={`fixed inset-0 z-20 flex h-screen items-center
            justify-center overflow-auto bg-black bg-opacity-40 px-6`}
          onClick={dismissModal}>
          <div
            className={`mx-auto w-full overflow-hidden
              rounded-[6px] bg-secondaryBlue p-6`}>
            {title !== '' ? (
              <div className="mb-4 text-center leading-[20px]">
                <div className="text-[15px] font-[600] text-highEmphasis">{title}</div>
              </div>
            ) : null}
            <div className="mb-6 text-center leading-[20px]">
              <div className="text-[12px] text-highEmphasis">{content}</div>
            </div>

            <PrimaryButton className="py-2 text-[12px] font-semibold text-highEmphasis" onClick={dismissModal}>
              Got it !
            </PrimaryButton>
          </div>
        </div>
      ) : null}

      <div
        onClick={() => {
          setIsShow(true);
        }}>
        {children}
      </div>
    </>
  );
};

export default MobileTooltip;
