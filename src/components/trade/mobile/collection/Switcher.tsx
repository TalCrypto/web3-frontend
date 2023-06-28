import React, { useState } from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';

import CollectionListModal from '@/components/trade/mobile/collection/CollectionListModal';
import { $isShowMobileModal } from '@/stores/modal';
import { getCollectionInformation } from '@/const/collectionList';
import { $currentAmm } from '@/stores/trading';

export default function Switcher() {
  const [isShowModal, setIsShowModal] = useState(false);
  const currentAmm = useNanostore($currentAmm);
  const collectionInfo = getCollectionInformation(currentAmm);

  const onSwitcherClick = async () => {
    if (isShowModal) return;

    setIsShowModal(true);
    $isShowMobileModal.set(true);
  };

  return (
    <>
      <div className="fixed top-0 z-10 h-[48px] w-full bg-secondaryBlue" onClick={onSwitcherClick}>
        <div className="flex h-full items-center px-5">
          <div className="flex items-center">
            <Image className="" src={collectionInfo.logo} width={24} height={24} alt="" />
            <div className="ml-[6px] text-[15px] text-highEmphasis">{collectionInfo.name}</div>
          </div>
          <div className="flex flex-1 justify-end text-right">
            <Image src="/images/mobile/common/switcher.svg" width={24} height={24} alt="" />
          </div>
        </div>
      </div>
      <CollectionListModal isShowModal={isShowModal} setIsShowModal={setIsShowModal} />
    </>
  );
}
