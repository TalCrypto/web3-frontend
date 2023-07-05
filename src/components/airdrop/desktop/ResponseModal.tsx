import React from 'react';
import Image from 'next/image';
import PrimaryButton from '@/components/common/PrimaryButton';

function ResponseModal(props: any) {
  const { isShow, setIsShow, title, description, buttonLabel } = props;
  if (!isShow) {
    return null;
  }

  const dismissModal = () => {
    setIsShow(false);
  };

  return (
    <div className="responsemodalbg" onClick={dismissModal}>
      <div className="responsemodal">
        <div className="col">
          <div className="col closebuttonrow">
            <Image
              alt=""
              src="/images/mobile/common/close.svg"
              width={16}
              height={16}
              className="closebtn"
              onClick={e => {
                e.stopPropagation();
                dismissModal();
              }}
            />
          </div>
        </div>
        <div className="contentrow">
          <div className="desctext">
            <p className="title">{title}</p>
            <p className="desc">{description}</p>
          </div>
          <PrimaryButton className="button-single" onClick={dismissModal}>
            {buttonLabel}
          </PrimaryButton>
          <Image src="/images/components/common/modal/modal-logo.svg" width={170} height={165} alt="" className="tribelogos" />
        </div>
      </div>
    </div>
  );
}

export default ResponseModal;
