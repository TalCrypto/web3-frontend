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
    <div
      className="fixed bottom-0 left-0 top-0 z-10 flex h-[100vh]
      w-full items-center justify-center overflow-auto bg-black/[.4]
    "
      onClick={() => wsIsShowErrorSwitchNetworkModal.set(false)}>
      <div
        className="relative w-full max-w-[628px] rounded-[12px]
        border-[1px] border-lightBlue bg-lightBlue
        px-4 pt-4 text-[14px] text-highEmphasis"
        onClick={e => e.stopPropagation()}>
        <div className="items-cent flex cursor-pointer flex-row justify-end">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            className="button"
            width={16}
            height={16}
            onClick={() => wsIsShowErrorSwitchNetworkModal.set(false)}
          />
        </div>
        <div className="flex flex-col items-center justify-center p-[40px] pb-[56px]">
          <div className="flex justify-center pb-[56px]">
            <Image alt="" src={image} width={60} height={40} />
          </div>
          <div
            className="body1 flex justify-center text-center
            text-[15px] font-normal text-highEmphasis">
            Metamask is currently having issues with the switch network function in the Chrome extension, please proceed manually for now.
          </div>
          <div className="pt-[58px]">
            <button
              className="navbar-button"
              onClick={() => {
                wsIsShowErrorSwitchNetworkModal.set(false);
              }}>
              <div className="btn-connect-before absolute bottom-0 left-0 right-0 top-0 z-10 rounded-full p-[1px]" />
              <div className="flex cursor-pointer flex-row-reverse" id="whitelist-register-btn">
                Close
              </div>
            </button>
          </div>
          <Image
            className="flex-end absolute bottom-0 right-0 mr-3 flex"
            src="/images/components/common/modal/modal-logo.svg"
            width={170}
            height={165}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
