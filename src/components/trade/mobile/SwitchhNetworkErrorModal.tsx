import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $showSwitchNetworkErrorModal } from '@/stores/modal';

function SwitchNetworkErrorModal() {
  const showSwitchNetworkErrorModal = useNanostore($showSwitchNetworkErrorModal);
  if (!showSwitchNetworkErrorModal) {
    return null;
  }

  const dismissModal = () => {
    $showSwitchNetworkErrorModal.set(false);
  };

  return (
    <div
      className={`fixed inset-0 z-20 flex h-screen items-center justify-center
        overflow-auto bg-black bg-opacity-40 px-6 md:hidden`}
      onClick={dismissModal}>
      <div
        className={`mx-auto w-full overflow-hidden
              rounded-[6px] bg-secondaryBlue p-6`}>
        <div className="mb-6 text-center">
          <div className="text-[15px] text-highEmphasis">
            Metamask is currently having issues <br />
            with the switch network function <br />
            in the Chrome extension, please <br />
            proceed manually for now.
          </div>
        </div>
        <div className="mt-7 flex justify-center">
          <button
            className="gradient-button relative z-10 mb-3 min-w-[160px]
              flex-1 cursor-pointer rounded-full border-[1px] border-[#3576f7]
              px-4 py-[3px] text-[14px] text-highEmphasis"
            onClick={dismissModal}>
            Continue Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SwitchNetworkErrorModal;
