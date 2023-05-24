import React from 'react';
import Image from 'next/image';

export default function Modal(props) {
  const { isShow, setIsShow, onClickSubmit, title, description, buttonLabel, mobile } = props;
  if (!isShow) {
    return null;
  }

  const dismissModal = () => {
    setIsShow(false);
  };

  return (
    <div className={`generalmodalbg ${mobile ? 'mobile' : ''}`} onClick={dismissModal}>
      <div className={`generalmodal ${mobile ? 'mobile' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="headerrow">
          <div className="mr-[16px] flex justify-end pb-[4px] pt-[10px]">
            <div className="cursor-pointer">
              <Image
                alt=""
                src="/images/components/common/modal/close.svg"
                width={16}
                height={16}
                onClick={e => {
                  e.stopPropagation();
                  dismissModal();
                }}
              />
            </div>
          </div>
          <div className="titlerow">{title}</div>
        </div>
        <div className="contentrow">
          <div className="desctext">{description}</div>
          <div className="buttonrow mx-auto">
            <button
              type="button"
              className="button-submit"
              onClick={e => {
                e.stopPropagation();
                onClickSubmit();
              }}>
              {buttonLabel}
            </button>
          </div>
          <Image src="/images/components/common/modal/modal-logo.svg" width={170} height={165} alt="" className="tribelogos" />
        </div>
      </div>
    </div>
  );
}
