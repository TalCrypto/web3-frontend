import React, { useState } from 'react';
import Image from 'next/image';
// import moment from 'moment';
import collectionList from '@/const/collectionList';
import { getMarketOverview } from '@/utils/trading';
import { useStore as useNanostore } from '@nanostores/react';

import CollectionListModal from '@/components/trade/mobile/collection/CollectionListModal';
import { wsCurrentToken } from '@/stores/WalletState';

export default function Switcher() {
  const currentToken = useNanostore(wsCurrentToken);
  const currentCollection = collectionList.filter((item: any) => item.collection.toUpperCase() === currentToken.toUpperCase())[0];
  const currentCollectionName = currentCollection.displayCollectionPair || 'DEGODS';
  const currentCollectionLogo = currentCollection.logo;

  const [isShowModal, setIsShowModal] = useState(false);
  const [marketData, setMarketData] = useState([]);

  const fetchMarketOverview = async () => {
    const ammList = collectionList.map(({ amm }) => amm).filter(item => item !== '');
    const contractList = collectionList.map(({ contract }) => contract).filter(item => item !== '');
    const data: any = await getMarketOverview(ammList, contractList, '');
    setMarketData(data);
  };

  const onSwitcherClick = async () => {
    setIsShowModal(true);
    await fetchMarketOverview();
  };

  return (
    <>
      {/* <div className="fixed top-0 z-10 h-[48px] w-full bg-secondaryBlue"> */}
      <div className="fixed top-0 z-10 h-[48px] w-full bg-secondaryBlue">
        <div className="flex h-full px-5">
          <div className="flex items-center">
            <Image className="" src={currentCollectionLogo} width={24} height={24} alt="" />
            <div className="ml-[6px] text-[15px] text-highEmphasis">{currentCollectionName}</div>
          </div>
          <div className="flex flex-1 justify-end text-right">
            <Image
              className="cursor-pointer"
              src="/images/mobile/common/switcher.svg"
              onClick={onSwitcherClick}
              width={24}
              height={24}
              alt=""
            />
          </div>
        </div>
      </div>
      <CollectionListModal marketData={marketData} isShowModal={isShowModal} setIsShowModal={setIsShowModal} />
    </>
  );
}
