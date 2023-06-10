/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useImperativeHandle, forwardRef, CSSProperties } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import collectionList from '@/const/collectionList';
import { walletProvider } from '@/utils/walletProvider';
import { apiConnection } from '@/utils/apiConnection';
import CollectionModal from '@/components/trade/desktop/trading/CollectionModal';
import { useStore as useNanostore } from '@nanostores/react';
import { wsCurrentToken, wsIsLogin, wsIsWrongNetwork, wsWalletAddress } from '@/stores/WalletState';
import Tooltip from '@/components/common/Tooltip';

const getCollectionInformation = (collectionName: any) => {
  const targetCollection = collectionList.filter(({ collection }) => collection.toUpperCase() === collectionName.toUpperCase());
  return targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
};

function SidebarCollection(props: any, ref: any) {
  const { setIsShowPopup } = props;
  const [isColModalVisible, setIsColModalVisible] = useState(false);
  const [userPositions, setUserPositions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [overviewData, setOverviewData] = useState([]);
  const isLoginState = useNanostore(wsIsLogin);
  const isWrongNetwork = useNanostore(wsIsWrongNetwork);
  const fullWalletAddress = useNanostore(wsWalletAddress);
  const currentToken = useNanostore(wsCurrentToken);

  const router = useRouter();

  async function fetchOverview(showLoading = false) {
    if (!isLoginState || isWrongNetwork || fullWalletAddress === '') {
      setUserPositions([]);
      setOverviewData([]);
      return;
    }

    if (showLoading) setIsLoading(true);

    try {
      const userCollectionsInfo = await walletProvider.getUserCollectionsInfo(walletProvider.holderAddress);
      if (showLoading) setIsLoading(false);
      // console.log('fetchMarketOverview', data);
      setOverviewData(userCollectionsInfo);
    } catch (error) {
      if (showLoading) setIsLoading(false);
    }
  }

  useImperativeHandle(ref, () => ({ fetchOverview }));

  useEffect(() => {
    fetchOverview(true);
  }, [isLoginState, isWrongNetwork, fullWalletAddress]);

  // sync active item index in div
  useEffect(() => {
    const targetIndex = collectionList.findIndex(i => i.collection === currentToken);
    setActiveIndex(targetIndex);
  }, [currentToken]);

  const selectedCollection = getCollectionInformation(currentToken);

  const analyticsLogSelections = (newcollections: any) => {
    // console.log(newcollections);
    // logEvent(firebaseAnalytics:, 'switchCollection_collection_pressed', {
    //   wallet: fullWalletAddress.substring(2),
    //   current_collection: currentToken,
    //   new_collection: newcollections
    // });
    apiConnection.postUserEvent('switchCollection_collection_pressed', {
      page: 'Trade',
      current_collection: currentToken,
      new_collection: newcollections
    });
  };

  const selectCollection = (token: any) => {
    analyticsLogSelections(token);
    setIsShowPopup(false);
    // console.log('selectCollection', token);
    walletProvider.setCurrentToken(token);
    // tokenRefCurrent.current = token;
    wsCurrentToken.set(token);

    router.push(`/trade/${token.toLowerCase()}`, undefined, { shallow: true });
  };

  const isHasPos = (amm: any) => overviewData.find((i: any) => i?.amm === amm) || false;
  const yPos = activeIndex * 68 + (activeIndex > 1 ? 64 : 60);

  return (
    <>
      <div
        className={`side-collection side-collection sidebar-wrapper absolute ml-[-44px] mt-4
        flex w-[44px] flex-col rounded-l-[12px] border-b-0
        border-[#71AAFF]/[.2] bg-secondaryBlue px-1 py-3`}
        style={{ '--highlight-y-pos': `${yPos}px` } as CSSProperties}>
        <div
          className="transition-width absolute right-0 top-[6px] h-[48px] w-[48px]
          translate-y-[var(--highlight-y-pos)] transform
          rounded-l-[12px] bg-[#2574fb] transition duration-300 ease-in-out"
        />
        <div
          className={`item ${isLoading ? 'loading' : ''}
            relative flex cursor-pointer items-center justify-center rounded-full
             hover:border-[hsla(0,0%,100%,.2)]`}
          onClick={() => setIsColModalVisible(true)}>
          <Image
            src="/images/collections/more.svg"
            width={32}
            height={32}
            alt=""
            className="rounded-full border-[4px] border-transparent hover:border-[4px] hover:border-[hsla(0,0%,100%,.2)]"
          />
          {isLoading ? (
            <div
              className="loading-indicator absolute left-[4px] top-[3px] flex h-7
                  w-7 items-center justify-center rounded-full text-[10px]">
              <div
                className="spinner-border inline-block h-4 w-4
                    animate-spin rounded-full border-2 border-solid
                  border-white border-r-transparent"
              />
            </div>
          ) : null}
        </div>
        {collectionList.map(item => (
          <div
            key={`sidecol-${item.collection}`}
            className={`${selectedCollection.collection.toLocaleLowerCase() === item.collection.toLocaleLowerCase() ? 'active' : ''} ${
              isLoading ? 'loading' : ''
            }
            relative mt-8 flex cursor-pointer items-center`}
            onClick={() => selectCollection(item.collection)}>
            <Tooltip direction="right" content={item.displayCollectionPair}>
              {item.isNew ? (
                <Image className="absolute right-0 top-[-4px] z-[2]" src="/images/collections/new.svg" alt="" width={26} height={12} />
              ) : null}
              <Image
                src={item.sidebarLogo}
                width={36}
                height={36}
                alt=""
                className="z-[1] rounded-full border-[4px] border-transparent hover:border-[4px] hover:border-[hsla(0,0%,100%,.2)]"
              />
              {isHasPos(item.amm) ? (
                <Image
                  className="absolute bottom-[3px] right-0 z-10"
                  src="/images/mobile/pages/trade/shopping-bag-green.svg"
                  width={14}
                  height={14}
                  alt=""
                />
              ) : null}
            </Tooltip>

            {isLoading ? (
              <div
                className="loading-indicator absolute left-[4px] top-[4px] flex h-7
                  w-7 items-center justify-center rounded-full text-[10px]">
                <div
                  className="spinner-border inline-block h-4 w-4
                    animate-spin rounded-full border-2 border-solid
                  border-white border-r-transparent"
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <CollectionModal visible={isColModalVisible} setVisible={setIsColModalVisible} selectCollection={selectCollection} />
    </>
  );
}
export default forwardRef(SidebarCollection);
