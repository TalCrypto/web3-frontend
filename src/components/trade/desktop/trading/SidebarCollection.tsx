/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import collectionList from '@/const/collectionList';
import { walletProvider } from '@/utils/walletProvider';
import { apiConnection } from '@/utils/apiConnection';
import CollectionModal from '@/components/trade/desktop/trading/CollectionModal';

const getCollectionInformation = (collectionName: any) => {
  const targetCollection = collectionList.filter(({ collection }) => collection.toUpperCase() === collectionName.toUpperCase());
  return targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
};

function SidebarCollection(props: any, ref: any) {
  const { currentToken, setCurrentToken, isLoginState, isWrongNetwork, fullWalletAddress, setIsShowPopup } = props;
  const [isColModalVisible, setIsColModalVisible] = useState(false);
  const [userPositions, setUserPositions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [overviewData, setOverviewData] = useState([]);

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

  // useEffect(() => {
  //   fetchOverview(true);
  // }, [isLoginState, isWrongNetwork, fullWalletAddress]);

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
    setCurrentToken(token);

    router.push(`/trade/${token}`, undefined, { shallow: true });
  };

  const isHasPos = (amm: any) => overviewData.find((i: any) => i?.amm === amm) || false;

  return (
    <>
      <div
        className="side-collection absolute ml-[-44px] mt-[9px] flex w-[44px] flex-col
        rounded-l-[12px] border-b-0 border-[#71AAFF]/[.2] bg-[#202249] px-[6px]
        py-3
      ">
        <div
          className={`item ${isLoading ? 'loading' : ''}
            relative flex h-8 w-8 cursor-pointer items-center rounded-full 
            border-[4px] border-transparent`}
          onClick={() => setIsColModalVisible(true)}>
          <Image src="/images/collections/more.svg" width="24" height="24" alt="" />
          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner-border spinner-border-sm text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : null}
        </div>
        {collectionList.map(item => (
          <div
            key={`sidecol-${item.collection}`}
            className={`${selectedCollection.collection === item.collection ? 'active' : ''} ${isLoading ? 'loading' : ''}
            relative mt-8 flex h-8 w-8 cursor-pointer items-center rounded-full
            border-[4px] border-transparent`}
            onClick={() => selectCollection(item.collection)}>
            {/* <OverlayTrigger placement="right" overlay={<Tooltip>{item.displayCollectionPair}</Tooltip>}>
              <Image src={item.sidebarLogo} width="24" height="24" alt="" />
            </OverlayTrigger> */}
            <Image src={item.sidebarLogo} width="24" height="24" alt="" />
            {isHasPos(item.amm) ? <Image className="shop-icon" src="/static/shoppingbag-green.svg" width="10" height="10" alt="" /> : null}
            {isLoading ? (
              <div className="loading-indicator">
                <div className="spinner-border spinner-border-sm text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <CollectionModal
        visible={isColModalVisible}
        setVisible={setIsColModalVisible}
        isLoginState={isLoginState}
        isWrongNetwork={isWrongNetwork}
        selectCollection={selectCollection}
      />
    </>
  );
}
export default forwardRef(SidebarCollection);
