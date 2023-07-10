import React, { useState } from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';

import { $isShowMobileModal } from '@/stores/modal';
import { $asActiveTab } from '@/stores/airdrop';
import { AirdropTabIndex, airdropTabsInfo } from '@/const/airdrop';
import AirdropTabListModal from '@/components/airdrop/mobile/TabListModal';

export default function TabSwitcher() {
  const [isShowTabSwitcher, setIsShowSwitcher] = useState(false);
  const activeTab: AirdropTabIndex = useNanostore($asActiveTab);
  const activeTabInfo = airdropTabsInfo[activeTab] ? airdropTabsInfo[activeTab] : airdropTabsInfo[0];

  const onSwitcherClick = async () => {
    if (isShowTabSwitcher) return;

    setIsShowSwitcher(true);
    $isShowMobileModal.set(true);
  };

  return (
    <>
      <div className="sticky top-0 z-10 w-full bg-secondaryBlue px-5 py-3" onClick={onSwitcherClick}>
        <div className="flex h-full items-center">
          <div className="flex items-center">
            <Image src={activeTabInfo.image} width={24} height={24} alt="" />
            <div className="ml-[6px] text-[15px] text-highEmphasis">{activeTabInfo.title}</div>
          </div>
          <div className="flex flex-1 justify-end text-right">
            <Image src="/images/components/airdrop/dropdown.svg" width={20} height={20} alt="" />
          </div>
        </div>
      </div>
      {isShowTabSwitcher && <AirdropTabListModal setIsShowSwitcher={setIsShowSwitcher} />}
    </>
  );
}
