import React, { useState } from 'react';
import Image from 'next/image';
// import moment from 'moment';
// import collectionList from '@/const/collectionList';
// import { getMarketOverview } from '@/utils/trading';
import { useStore as useNanostore } from '@nanostores/react';

import CollectionListModal from '@/components/trade/mobile/collection/CollectionListModal';
// import { wsCurrentToken } from '@/stores/WalletState';
import { $isShowMobileModal, $isSwitcherFirstRender, $marketData } from '@/stores/common';

export default function Switcher() {
  // const currentToken = useNanostore(wsCurrentToken);
  // const currentCollection = collectionList.filter((item: any) => item.collection.toUpperCase() === currentToken.toUpperCase())[0];
  // const currentCollectionName = currentCollection.displayCollectionPair || 'DEGODS';
  // const currentCollectionLogo = currentCollection.logo;

  const [isShowModal, setIsShowModal] = useState(false);
  const marketData = useNanostore($marketData);
  const isFirstRender = useNanostore($isSwitcherFirstRender);

  const fetchMarketOverview = async () => {
    // const ammList = collectionList.map(({ amm }) => amm).filter(item => item !== '');
    // const contractList = collectionList.map(({ contract }) => contract).filter(item => item !== '');
    // const data: any = await getMarketOverview(ammList, contractList, '');
    // $marketData.set(data);
  };

  const onSwitcherClick = async () => {
    if (isShowModal) return;

    setIsShowModal(true);
    $isShowMobileModal.set(true);
    await fetchMarketOverview();
  };

  if (isFirstRender) {
    fetchMarketOverview();
    $isSwitcherFirstRender.set(false);
  }

  // fetchMarketOverview();

  return (
    <>
      <div className="fixed top-0 z-10 h-[48px] w-full bg-secondaryBlue" onClick={onSwitcherClick}>
        <div className="flex h-full px-5">
          <div className="flex items-center">
            {/* <Image className="" src={currentCollectionLogo} width={24} height={24} alt="" />
            <div className="ml-[6px] text-[15px] text-highEmphasis">{currentCollectionName}</div> */}
          </div>
          <div className="flex flex-1 justify-end text-right">
            <Image src="/images/mobile/common/switcher.svg" width={24} height={24} alt="" />
          </div>
        </div>
      </div>
      <CollectionListModal marketData={marketData} isShowModal={isShowModal} setIsShowModal={setIsShowModal} />
    </>
  );
}
