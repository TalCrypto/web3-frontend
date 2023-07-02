import React, { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';

import AdjustCollateral from '@/components/trade/desktop/trading/AdjustCollateral';
import CloseCollateral from '@/components/trade/desktop/trading/CloseCollateral';
import { $currentAmm } from '@/stores/trading';
import { usePositionInfo } from '@/hooks/collection';
import MainTradeComponent from '@/components/trade/desktop/trading/MainTradeComponent';

function TradingWindow() {
  const [tradeWindowIndex, setTradeWindowIndex] = useState(0);
  const currentAmm = useNanostore($currentAmm);
  const userPosition = usePositionInfo(currentAmm);

  useEffect(() => setTradeWindowIndex(0), [currentAmm]);

  const mainTradeComponent = <MainTradeComponent />;

  const displayComponent = [mainTradeComponent, <CloseCollateral />, <AdjustCollateral />][tradeWindowIndex];

  const tabs = ['Add', 'Close', 'Adjust Collateral'];

  const onTabClick = (index: any) => {
    setTradeWindowIndex(index);
  };

  return (
    <div className="w-full 2xl:w-[400px]" style={{ height: 'fit-content' }}>
      {userPosition && userPosition.size !== 0 ? (
        <div
          className="border-b-none flex h-[50px] justify-between
            rounded-t-[6px] border-[1px] border-[#71aaff]/[.2]
            p-0 font-normal">
          {tabs.map((item, index) => (
            <div
              className={`trade-tab flex w-full cursor-pointer items-center justify-center
                text-[14px] font-semibold text-primaryBlue
                ${index === 0 ? 'rounded-tl-[6px] ' : ''}
                ${index === 2 ? 'rounded-tr-[6px] ' : ''}
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
        className={`flex w-full rounded-b-[6px] border-[1px]
          border-[#71aaff]/[.2] bg-lightBlue p-4 px-6 pb-9 text-white
          ${userPosition && userPosition.size !== 0 ? 'pt-6' : 'rounded-t-[6px] pt-9'}
        `}>
        <div className="w-full">{userPosition && userPosition.size !== 0 ? displayComponent : mainTradeComponent}</div>
      </div>
    </div>
  );
}

export default TradingWindow;
