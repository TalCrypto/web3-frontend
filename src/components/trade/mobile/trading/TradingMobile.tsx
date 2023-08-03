import React, { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';

import Image from 'next/image';
import { $isShowMobileModal } from '@/stores/modal';
import { $currentAmm, $isShowTradingMobile } from '@/stores/trading';
import { usePositionInfo } from '@/hooks/collection';

import MainTradeComponent from '@/components/trade/mobile/trading/MainTradeComponent';
import AdjustCollateral from '@/components/trade/mobile/trading/AdjustCollateral';
import CloseCollateral from '@/components/trade/mobile/trading/CloseCollateral';
import { getCollectionInformation } from '@/const/collectionList';
import TransactionStatusMobile from '@/components/trade/mobile/trading/TransactionStatusMobile';

function TradingMobile() {
  const [tradeWindowIndex, setTradeWindowIndex] = useState(0);
  const currentAmm = useNanostore($currentAmm);
  const currentCollection = getCollectionInformation(currentAmm);
  const userPosition = usePositionInfo(currentAmm);
  const isShowTradingMobile = useNanostore($isShowTradingMobile);

  useEffect(() => setTradeWindowIndex(0), [currentAmm]);

  const displayComponent = [
    <MainTradeComponent />,
    userPosition?.size !== 0 ? <CloseCollateral /> : null,
    userPosition?.size !== 0 ? <AdjustCollateral /> : null
  ][tradeWindowIndex];

  const tabs = ['Add', 'Close', 'Adjust Collateral'];

  const onTabClick = (index: any) => {
    setTradeWindowIndex(index);
  };

  const handleBackClick = () => {
    $isShowTradingMobile.set(false);
    $isShowMobileModal.set(false);
  };

  return (
    <div
      className={`fixed top-0 z-[12] h-full w-full bg-lightBlue 2xl:w-[400px]
      ${isShowTradingMobile ? 'left-[0]' : 'left-[100%]'}
      transition-left duration-500
    `}>
      {userPosition?.size !== 0 ? (
        <div
          className="border-b-none flex h-[50px] justify-between
            rounded-t-[12px] border-[1px] border-[#71aaff]/[.2]
            p-0 font-normal">
          {tabs.map((item, index) => (
            <div
              className={`trade-tab flex w-full cursor-pointer items-center
                justify-center text-[14px] font-semibold text-primaryBlue
                ${tradeWindowIndex === index ? 'selected' : ''}`}
              onClick={() => {
                onTabClick(index);
              }}
              key={`trade_tab_${item}`}>
              {item}
              <div className="bottom-line" />
            </div>
          ))}
        </div>
      ) : null}
      <div
        id="tradingMobileScroll"
        className={`flex ${userPosition && userPosition.size !== 0 ? 'h-[calc(100%-100px)]' : 'h-[calc(100%-50px)]'}
          overflow-y-scroll rounded-b-[6px] border-[1px] border-b-0 border-[#71aaff]/[.2]
          bg-lightBlue p-[22px] text-white`}>
        <div className="w-full pb-6">{displayComponent}</div>
      </div>

      <div
        className="absolute bottom-0 flex h-[50px] w-full items-center justify-center
        bg-secondaryBlue px-[22px] py-4 text-[15px] text-white
      ">
        <Image
          src="/images/mobile/common/angle-right.svg"
          className="absolute left-[22px] cursor-pointer"
          width={14}
          height={14}
          alt=""
          onClick={handleBackClick}
        />
        <div className="flex">Trade {currentCollection.name}</div>
      </div>

      <TransactionStatusMobile />
    </div>
  );
}

export default TradingMobile;
