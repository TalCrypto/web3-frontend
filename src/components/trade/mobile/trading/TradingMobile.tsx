import React, { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';

import tradePanelModal from '@/stores/tradePanelModal';

import TradeComponent from '@/components/trade/mobile/trading/tradeComponent';
import AdjustCollateral from '@/components/trade/mobile/trading/AdjustCollateral';
import CloseCollateral from '@/components/trade/mobile/trading/CloseCollateral';
import TradePanelModal from '@/components/trade/mobile/trading/TradePanelModal';

import { connectWallet } from '@/utils/Wallet';
import { wsCurrentToken, wsIsShowTradingMobile, wsUserPosition } from '@/stores/WalletState';
import Image from 'next/image';
import collectionList from '@/const/collectionList';

function OverFluctuationError(props: any) {
  const { setShowOverFluctuationContent } = props;
  const closeWindow = () => {
    setShowOverFluctuationContent(false);
  };
  return (
    <div className="fails">
      <div className="contents-mod">
        <div className="col">
          Your transaction has failed due to high price fluctuation. <br />
          <br /> Please try again with smaller notional value
          <div className="confirm" onClick={closeWindow}>
            <div className="text">OK</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TradingMobile(props: any) {
  const { refreshPositions, tradingData } = props;
  const [tradeWindowIndex, setTradeWindowIndex] = useState(0);
  const isTradePanelModalShow = useNanostore(tradePanelModal.show);
  const tradePanelModalMsg = useNanostore(tradePanelModal.message);
  const tradePanelModalLink = useNanostore(tradePanelModal.link);
  const currentToken = useNanostore(wsCurrentToken);
  const userPosition: any = useNanostore(wsUserPosition);
  const currentCollection = collectionList.filter((item: any) => item.collection.toUpperCase() === currentToken.toUpperCase())[0];
  const currentCollectionName = currentCollection.collectionName || 'DEGODS';

  const traderConnectWallet = () => {
    connectWallet(() => {}, true);
  };
  useEffect(() => setTradeWindowIndex(0), [currentToken]);

  const tradeComponent = (
    <TradeComponent refreshPositions={refreshPositions} connectWallet={traderConnectWallet} tradingData={tradingData} />
  );

  const displayComponent = [
    tradeComponent,
    <CloseCollateral refreshPositions={refreshPositions} tradingData={tradingData} setTradeWindowIndex={setTradeWindowIndex} />,
    <AdjustCollateral refreshPositions={refreshPositions} tradingData={tradingData} />
  ][tradeWindowIndex];

  const tabs = ['Add', 'Close', 'Adjust Collateral'];

  const [showOverFluctuationContent, setShowOverFluctuationContent] = useState(false);

  const onTabClick = (index: any) => {
    setTradeWindowIndex(index);
  };

  const handleBackClick = () => {
    wsIsShowTradingMobile.set(false);
  };

  return (
    <div className="fixed left-0 top-0 z-[12] h-full w-full bg-lightBlue 2xl:w-[400px]">
      {showOverFluctuationContent ? <OverFluctuationError setShowOverFluctuationContent={setShowOverFluctuationContent} /> : null}
      {userPosition ? (
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
        className={`mb-[60px] flex ${userPosition ? 'h-[calc(100%-130px)]' : 'h-[calc(100%-60px)]'}
          overflow-y-scroll rounded-[6px] border-[1px] border-b-0 border-[#71aaff]/[.2]
          bg-lightBlue p-6 px-[22px] py-[22px] text-white`}>
        <div className={`w-full ${userPosition ? 'showmenu' : 'hidemenu'}`}>{userPosition ? displayComponent : tradeComponent}</div>
        <TradePanelModal
          isShow={isTradePanelModalShow}
          setIsShow={tradePanelModal.setIsShow}
          message={tradePanelModalMsg}
          link={tradePanelModalLink}
        />
      </div>

      <div
        className="fixed bottom-0 flex h-[50px] w-full items-center justify-center
        bg-secondaryBlue px-[22px] py-4 text-[15px] text-white
      ">
        <Image
          src="/images/mobile/common/angle-right.svg"
          className="fixed left-[22px] cursor-pointer"
          width={8}
          height={12}
          alt=""
          onClick={handleBackClick}
        />
        <div className="flex">Trade {currentCollectionName}</div>
      </div>
    </div>
  );
}

export default TradingMobile;
