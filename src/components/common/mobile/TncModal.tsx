import PrimaryButton from '@/components/common/PrimaryButton';
import React, { useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $isShowMobileTncModal } from '@/stores/modal';
import { useConnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';

const MobileTncModal = () => {
  const isShowMobileTncModal = useNanostore($isShowMobileTncModal);

  const { connect, connectors } = useConnect();
  const { open } = useWeb3Modal();

  const onClickConnect = () => {
    let isInjected = false;

    for (let i = 0; i < connectors.length; i += 1) {
      const connector = connectors[i];
      if (connector?.name.toLowerCase().includes('metamask')) {
        connect({ connector });
        isInjected = true;
        break;
      }
    }

    if (!isInjected) {
      open();
    }
  };

  const dismissModal = (isAccept = false) => {
    $isShowMobileTncModal.set(false);
    if (isAccept) {
      localStorage.setItem('isTncApproved', 'true');
      onClickConnect();
    }
  };

  return isShowMobileTncModal ? (
    <div
      className={`fixed top-0 z-20 flex
            h-screen items-center justify-center overflow-auto bg-black bg-opacity-40 px-6`}
      onClick={() => dismissModal()}>
      <div
        className={`mx-auto w-full overflow-hidden
              rounded-[6px] bg-secondaryBlue p-6`}>
        <div className="mb-6 text-center leading-[20px]">
          <div className="text-[12px] text-highEmphasis">
            <div className="text-[15px] font-semibold">Terms & Conditions</div>
            <div className="mt-3 text-[12px] font-normal">
              I&#39;ve read and accept the{' '}
              <span className="underline" onClick={() => window.open('/terms', '_blank')}>
                Terms & Conditions
              </span>{' '}
              of Tribe3
            </div>
          </div>
        </div>

        <PrimaryButton className="py-2 text-[12px] font-semibold text-highEmphasis" onClick={() => dismissModal(true)}>
          Accept
        </PrimaryButton>
      </div>
    </div>
  ) : null;
};

export default MobileTncModal;
