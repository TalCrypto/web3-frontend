/* eslint-disable max-len */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
// import { logEvent } from 'firebase/analytics';

import ComingSoonWindow from '@/components/trade/desktop/information/CommingSoonWindow';
import TribeDetailComponents from '@/components/trade/desktop/information/TribeDetailComponents';
import ChatComponent from '@/components/trade/desktop/information/ChatComponent';

import Image from 'next/image';

// import { firebaseAnalytics } from '@/const/firebaseConfig';
// import { apiConnection } from '@/utils/apiConnection';

function InformationWindow(props: any) {
  const { tradingData, fullWalletAddress, tokenRef, currentToken } = props;
  const [detailHeaderIndex /* ,setDetailHeaderIndex */] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const tabsImages = [
    <Image src="/images/components/trade/tab_market.svg" className="mr-[6px]" width={20} height={20} alt="" />,
    <Image src="/images/components/trade/tab_spot.svg" className="mr-[6px]" width={20} height={20} alt="" />,
    <Image src="/images/components/trade/tab_funding.svg" className="mr-[6px]" width={20} height={20} alt="" />
  ];

  const Tabs = ['Market Trades', 'Spot Transactions', 'Funding Payment History'].map((item, index) => (
    <div
      className={`tab flex w-[33%] cursor-pointer items-center
        justify-center text-center text-[16px] font-semibold
        ${activeTab === index ? 'selected' : ''}`}
      key={item}
      onClick={() => setActiveTab(index)}>
      {tabsImages[index]}
      <span className="hidden 2xl:block">{item}</span>
      <span className="block 2xl:hidden">{item.split(' ')[0]}</span>
    </div>
  ));

  return (
    <div
      className="mb-[24px] h-[530px] max-h-[1000px] cursor-default overflow-hidden
      rounded-[6px] border-[1px] border-[#2e4371] p-0 pb-10">
      <div
        className="info-tab mb-6 flex items-center
        border-b-[2px] border-b-[#2e3064] leading-[50px]
      ">
        {Tabs}
      </div>
      <div className="display-content h-full">
        <div className={`${detailHeaderIndex === 0 ? 'block' : 'hidden'} h-full`}>
          <TribeDetailComponents
            tradingData={tradingData}
            fullWalletAddress={fullWalletAddress}
            tokenRef={tokenRef}
            currentToken={currentToken}
            activeTab={activeTab}
          />
        </div>
        <div className={`${detailHeaderIndex === 1 ? 'block' : 'hidden'} h-full`}>
          <ChatComponent fullWalletAddress={fullWalletAddress} tokenRef={tokenRef} currentToken={currentToken} />
        </div>
        <div className={`${detailHeaderIndex === 2 ? 'block' : 'hidden'} h-full`}>
          <ComingSoonWindow />
        </div>
      </div>
    </div>
  );
}

export default InformationWindow;
