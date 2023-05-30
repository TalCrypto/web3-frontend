/* eslint-disable max-len */
/* eslint-disable react/jsx-key */
import React, { forwardRef, /* useImperativeHandle, */ useRef, useState } from 'react';

import TabsInfo from '@/components/trade/mobile/information/TabsInfo';

function InformationMobile(props: any) {
  const { tradingData, fullWalletAddress, tokenRef, currentToken } = props;
  const [detailHeaderIndex /* ,setDetailHeaderIndex */] = useState(0);
  const detailRef = useRef();
  const [activeTab, setActiveTab] = useState(0);

  const onClickTab = (event: any, index: number) => {
    const tabsContainer = event.currentTarget.parentNode;
    const lastTab = event.currentTarget;

    if (index === 0 || index === 2) {
      tabsContainer.scrollTo({
        left: lastTab.offsetLeft - tabsContainer.offsetWidth + lastTab.offsetWidth,
        behavior: 'smooth'
      });
    }

    setActiveTab(index);
  };

  const Tabs = ['Market Trade', 'Spot Transactions', 'Funding Payment'].map((item, index) => (
    <div
      className={`tab cursor-pointer px-[16px] py-[6px]
        ${activeTab === index ? 'selected' : ''}`}
      key={item}
      onClick={(event: any) => onClickTab(event, index)}>
      <span className="text-[14px] font-medium text-white/[.87]">{item}</span>
    </div>
  ));

  // useImperativeHandle(ref, () => ({
  //   fetchInformations: () => {
  //     detailRef.current?.updateInfomations();
  //     chatRef.current?.getFirebaseChat();
  //   }
  // }));

  return (
    <div
      className="mb-[24px] mr-auto mt-[20px] max-h-[1000px] cursor-default overflow-hidden
      whitespace-nowrap rounded-[6px] border-0 border-t-[1px] border-t-[#71AAFF]/[.12] p-0 pb-10">
      <div
        className="info-tab no-scrollable mb-6 flex items-center overflow-x-scroll
          border-b-[2px] border-b-[#71AAFF]/[.12]">
        {Tabs}
      </div>
      <div className="display-content h-full">
        <div className={`${detailHeaderIndex === 0 ? 'block' : 'hidden'} h-full`}>
          <TabsInfo
            ref={detailRef}
            tradingData={tradingData}
            fullWalletAddress={fullWalletAddress}
            tokenRef={tokenRef}
            currentToken={currentToken}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
}
export default forwardRef(InformationMobile);
