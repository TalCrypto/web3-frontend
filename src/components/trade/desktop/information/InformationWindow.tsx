/* eslint-disable @next/next/no-img-element */
/* eslint-disable max-len */
/* eslint-disable react/jsx-key */
import React, { forwardRef, /* useImperativeHandle, */ useRef, useState } from 'react';
// import { logEvent } from 'firebase/analytics';

import ComingSoonWindow from '@/components/trade/desktop/information/CommingSoonWindow';
import TribeDetailComponents from '@/components/trade/desktop/information/TribeDetailComponents';
import ChatComponent from '@/components/trade/desktop/information/ChatComponent';

// import { firebaseAnalytics } from '@/const/firebaseConfig';
// import { apiConnection } from '@/utils/apiConnection';

function InformationsWindows(props: any) {
  const { tradingData, isLoginState, fullWalletAddress, tokenRef, currentToken } = props;
  const [detailHeaderIndex /* ,setDetailHeaderIndex */] = useState(0);
  const detailRef = useRef();
  const chatRef = useRef();
  const [activeTab, setActiveTab] = useState(0);

  // function getTabAnalytics(index) {
  //   setDetailHeaderIndex(index);
  //   const eventName = ['tribedetail_select_pressed', 'social_select_pressed', 'mytrades_reward_pressed'][index];

  //   if (firebaseAnalytics) {
  //     logEvent(firebaseAnalytics, eventName, {
  //       wallet: fullWalletAddress.substring(2),
  //       collection: currentToken // from tokenRef.current
  //     });
  //   }

  //   apiConnection.postUserEvent(eventName, {
  //     page: 'Trade',
  //     collection: currentToken // from tokenRef.current
  //   });
  // }

  // const tabsImages = [
  //   <img src="/static/tribe_detail_icon.svg" className="icon" alt="" />,
  //   <img src="/static/social_icon.svg" className="icon" alt="" />,
  //   <img src="/static/reward_icon.svg" className="icon" alt="" />,
  //   <img src="/static/twitter_icon.svg" className="icon" alt="" />
  // ];

  // const Tabs = ['Tribe Details', 'Social', 'Rewards'].map((item, index) => (
  //   <div
  //     className={`tab-folder flex items-center justify-center font-16-600 text-highEmphasis ${detailHeaderIndex === index ? 'selected' : ''}`}
  //     key={item}
  //     onClick={() => getTabAnalytics(index)}
  //   >
  //     {tabsImages[index]}
  //     {item}
  //   </div>
  // ));

  const tabsImages = [
    <img src="/static/tribe_detail_icon.svg" className="icon" alt="" />,
    <img src="/static/icon/spot-transaction.svg" className="icon" alt="" />,
    <img src="/static/icon/dashboard/fundingPayment.svg" className="mr-[6px] h-[16px] w-[16px]" alt="" />
  ];

  const Tabs = ['Market Trades', 'Spot Transactions', 'Funding Payment History'].map((item, index) => (
    <div
      className={`tab-folder font-16-600 flex items-center justify-center text-highEmphasis ${activeTab === index ? 'selected' : ''}`}
      key={item}
      onClick={() => setActiveTab(index)}>
      {tabsImages[index]}
      {item}
    </div>
  ));

  // useImperativeHandle(ref, () => ({
  //   fetchInformations: () => {
  //     detailRef.current?.updateInfomations();
  //     chatRef.current?.getFirebaseChat();
  //   }
  // }));

  return (
    <div className="dataWindow information-window mb-[24px]">
      <div className="information-nav">{Tabs}</div>
      <div className="display-content">
        <div style={{ display: detailHeaderIndex === 0 ? 'block' : 'none' }}>
          <TribeDetailComponents
            ref={detailRef}
            tradingData={tradingData}
            fullWalletAddress={fullWalletAddress}
            tokenRef={tokenRef}
            currentToken={currentToken}
            activeTab={activeTab}
          />
        </div>
        <div style={{ display: detailHeaderIndex === 1 ? 'block' : 'none' }}>
          <ChatComponent
            ref={chatRef}
            fullWalletAddress={fullWalletAddress}
            isLoginState={isLoginState}
            tokenRef={tokenRef}
            currentToken={currentToken}
          />
        </div>
        <div style={{ display: detailHeaderIndex === 2 ? 'block' : 'none' }}>
          <ComingSoonWindow />
        </div>
      </div>
    </div>
  );
}
export default forwardRef(InformationsWindows);
