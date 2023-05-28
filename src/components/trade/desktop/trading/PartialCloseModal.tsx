import React from 'react';
import Image from 'next/image';

export default function PartialCloseModal(props: any) {
  const { isShow, setIsShow, onClickSubmit, mobile } = props;
  if (!isShow) {
    return null;
  }

  const dismissModal = () => {
    setIsShow(false);
  };

  return (
    <div className={`partialclosemodalbg ${mobile ? 'mobile' : ''}`} onClick={dismissModal}>
      <div className={`partialclosemodal ${mobile ? 'mobile' : ''}`}>
        {/* <div className="col headerrow"> */}
        <div className="col">
          <div className="col closebuttonrow">
            <Image
              alt=""
              src="../../static/close-modal.svg"
              width={16}
              height={16}
              className="closebtn"
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
        <div className="contentrow">
          <div className="desctext">
            <p>
              Partially closing a position would NOT release any collateral. Please do so by adjusting collateral, which doesn’t cost any
              transaction fee.
            </p>
          </div>
          <div className="buttonrow mx-auto">
            <button
              className="button-submit"
              onClick={e => {
                e.stopPropagation();
                onClickSubmit();
              }}>
              Continue Close
            </button>
            <button
              className="button-submit"
              onClick={e => {
                e.preventDefault();
                dismissModal();
              }}>
              Cancel
            </button>
          </div>
          <Image src="../../static/modal-logo.svg" alt="" className="tribelogos" />
        </div>
      </div>
    </div>
  );
}
