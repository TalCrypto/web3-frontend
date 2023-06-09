/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { apiConnection } from '@/utils/apiConnection';
import CollectionModal from '@/components/trade/desktop/trading/CollectionModal';
import { useStore as useNanostore } from '@nanostores/react';
import { AMM, getCollectionInformation } from '@/const/collectionList';
import { $currentAMM } from '@/stores/trading';
import { $userPositionInfos } from '@/stores/user';
import { useAccount } from 'wagmi';
import { usePositionInfosIsLoading } from '@/hooks/collection';

function SidebarCollection() {
  const router = useRouter();
  const { address } = useAccount();
  const currentAmm = useNanostore($currentAMM);
  const positionInfos = useNanostore($userPositionInfos);
  const [isColModalVisible, setIsColModalVisible] = useState(false);
  const isLoading = usePositionInfosIsLoading();

  const analyticsLogSelections = (newcollections: AMM) => {
    // console.log(newcollections);
    // logEvent(firebaseAnalytics:, 'switchCollection_collection_pressed', {
    //   wallet: fullWalletAddress.substring(2),
    //   current_collection: currentToken,
    //   new_collection: newcollections
    // });
    if (!address) return;
    apiConnection.postUserEvent(
      'switchCollection_collection_pressed',
      {
        page: 'Trade',
        current_collection: currentAmm,
        new_collection: newcollections
      },
      address
    );
  };

  const selectCollection = (amm: AMM) => {
    analyticsLogSelections(amm);

    router.push(`/trade/${amm}`, undefined, { shallow: true });
  };

  // eslint-disable-next-line max-len
  const isHasPos = (amm: AMM): boolean => {
    const size = positionInfos[amm]?.size;
    if (size) {
      return size !== 0;
    }
    return false;
  };

  return (
    <>
      <div
        className="side-collection absolute  mt-[9px] flex w-[44px]
        flex-col rounded-l-[12px] border-b-0 border-[#71AAFF]/[.2] bg-secondaryBlue
        px-[6px] py-3">
        <div
          className={`item ${isLoading ? 'loading' : ''}
            relative flex h-8 w-8 cursor-pointer items-center rounded-full 
             hover:border-[hsla(0,0%,100%,.2)]`}
          onClick={() => setIsColModalVisible(true)}>
          <Image
            src="/images/collections/more.svg"
            width="32"
            height="32"
            alt=""
            className="border-[4px] border-transparent hover:border-[4px]"
          />
          {/* {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner-border spinner-border-sm text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : null} */}
        </div>
        {Object.keys(AMM)
          .map(ammKey => getCollectionInformation(AMM[ammKey as keyof typeof AMM]))
          .map(item => (
            <div
              key={`sidecol-${item.collection}`}
              className={`${item.amm === currentAmm ? 'active' : ''} ${isLoading ? 'loading' : ''}
            relative mt-8 flex h-8 w-8 cursor-pointer items-center`}
              onClick={() => selectCollection(item.amm)}>
              {item.amm === currentAmm ? (
                <div className="absolute right-[-6px] top-[-12px] h-[48px] w-[48px] rounded-l-[12px] bg-primaryBlue" />
              ) : null}
              {item.isNew ? (
                <Image
                  className="absolute right-[-12px] top-[-4px] z-[2]"
                  src="/images/collections/new.svg"
                  alt=""
                  width={26}
                  height={12}
                />
              ) : null}
              {/* <OverlayTrigger placement="right" overlay={<Tooltip>{item.displayCollectionPair}</Tooltip>}>
              <Image src={item.sidebarLogo} width="24" height="24" alt="" />
            </OverlayTrigger> */}
              <Image
                src={item.sidebarLogo}
                width="32"
                height="32"
                alt=""
                className="z-[1] rounded-full border-[4px] border-transparent hover:border-[4px] hover:border-[hsla(0,0%,100%,.2)]"
              />
              {isHasPos(item.amm) ? (
                <Image
                  className="absolute bottom-[3px] right-[-2px] z-10"
                  src="/images/mobile/pages/trade/shopping-bag-green.svg"
                  width="14"
                  height="14"
                  alt=""
                />
              ) : null}
              {/* {isLoading ? (
              <div className="loading-indicator">
                <div className="spinner-border spinner-border-sm text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : null} */}
            </div>
          ))}
      </div>
      <CollectionModal visible={isColModalVisible} setVisible={setIsColModalVisible} selectCollection={selectCollection} />
    </>
  );
}
export default SidebarCollection;
