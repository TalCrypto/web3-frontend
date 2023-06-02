/* eslint-disable max-len */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';

import TabsInfo from '@/components/trade/mobile/information/TabsInfo';

function InformationMobile(props: any) {
  const { tradingData, tokenRef, currentToken } = props;
  const [detailHeaderIndex /* ,setDetailHeaderIndex */] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const onClickTab = (event: any, index: number) => {
    const tabsContainer = event.currentTarget.parentNode;
    const lastTab = event.currentTarget;

    tabsContainer.scrollTo({
      left: lastTab.offsetLeft - tabsContainer.offsetWidth + lastTab.offsetWidth,
      behavior: 'smooth'
    });

    setActiveTab(index);
  };

  const Tabs = ['Market Trade', 'Spot Transactions', 'Funding Payment'].map((item, index) => (
    <div
      className={`tab cursor-pointer px-[16px] py-[6px]
        ${activeTab === index ? 'selected' : ''}`}
      key={item}
      onClick={(event: any) => onClickTab(event, index)}>
      <span className="text-[14px] font-medium text-highEmphasis">{item}</span>
    </div>
  ));

  return (
    <div
      className="mb-[24px] mr-auto mt-[20px] cursor-default overflow-hidden
      whitespace-nowrap rounded-[6px] border-0 border-t-[1px] border-t-[#71AAFF]/[.12] p-0 pb-10">
      <div
        className="info-tab no-scrollable mb-6 flex items-center overflow-x-scroll
          border-b-[2px] border-b-[#71AAFF]/[.12]">
        {Tabs}
      </div>
      <div className="display-content h-full">
        <div className={`${detailHeaderIndex === 0 ? 'block' : 'hidden'} h-full`}>
          <TabsInfo tradingData={tradingData} tokenRef={tokenRef} currentToken={currentToken} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}

export default InformationMobile;
