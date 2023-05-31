import React from 'react';
import Image from 'next/image';

import { wsIsShowErrorSwitchNetworkModal } from '@/stores/WalletState';

interface ErrorModalProps {
  isShow: boolean;
  image: string;
}

export default function ErrorModal(props: ErrorModalProps) {
  const { isShow, image } = props;
  if (!isShow) {
    return null;
  }

  return (
    <div className="error-modalbg" onClick={() => wsIsShowErrorSwitchNetworkModal.set(false)}>
      <div className="error-modal" onClick={e => e.stopPropagation()}>
        <div className="close-row">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            className="button"
            width={16}
            height={16}
            onClick={() => wsIsShowErrorSwitchNetworkModal.set(false)}
          />
        </div>
        <div className="content p-[40px]">
          <div className="flex justify-center pb-[56px]">
            <Image alt="" src={image} width={60} height={40} />
          </div>
          <div className="body1 flex justify-center text-center text-highEmphasis">
            Metamask is currently having issues with the switch network function in the Chrome extension, please proceed manually for now.
          </div>
          <div className="pt-[58px]">
            <button
              className="navbar-button"
              onClick={() => {
                wsIsShowErrorSwitchNetworkModal.set(false);
              }}>
              <div className="container flex flex-row-reverse" id="whitelist-register-btn">
                Close
              </div>
            </button>
          </div>
          <Image src="/images/components/common/modal/modal-logo.svg" width={170} height={165} alt="" className="tribelogos" />
        </div>
      </div>
    </div>
  );
}
