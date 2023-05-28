import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';

import tradePanelModal from '@/stores/tradePanelModal';

import TradeComponent from '@/components/trade/desktop/trading/tradeComponent';
import AdjustCollateral from '@/components/trade/desktop/trading/AdjustCollateral';
import CloseCollateral from '@/components/trade/desktop/trading/CloseCollateral';
import TradePanelModal from '@/components/trade/desktop/trading/TradePanelModal';

// function Tab(props: any) {
//   const { name, active, onClick: click } = props;
//   return (
//     <div className={`col navitem font-14-600 text-color-default ${active ? 'selected' : ''}`} onClick={click}>
//       {name}
//       <div className="bottom-line" />
//     </div>
//   );
// }

// function OverFluctuationError(props: any) {
//   const { setShowOverFluctuationContent } = props;
//   const closeWindow = () => {
//     setShowOverFluctuationContent(false);
//   };
//   return (
//     <div className="fails">
//       <div className="contents-mod">
//         <div className="col">
//           Your transaction has failed due to high price fluctuation. <br />
//           <br /> Please try again with smaller notional value
//           <div className="confirm" onClick={closeWindow}>
//             <div className="text">OK</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

function TradingWindow(props: any) {
  const {
    connectWallet,
    getTestToken,
    userPosition,
    isLoginState,
    refreshPositions,
    tradingData,
    isWrongNetwork,
    isApproveRequired,
    setIsApproveRequired,
    wethBalance,
    fullWalletAddress,
    currentToken,
    maxReduceValue
  } = props;
  const [tradeWindowIndex, setTradeWindowIndex] = useState(0);
  const isTradePanelModalShow = useStore(tradePanelModal.show);
  const tradePanelModalMsg = useStore(tradePanelModal.message);
  const tradePanelModalLink = useStore(tradePanelModal.link);

  // const logEventByName = name => {
  //   logEvent(firebaseAnalytics, name, {
  //     wallet: fullWalletAddress.substring(2),
  //     collection: currentToken
  //   });
  //   apiConnection.postUserEvent(name, {
  //     page,
  //     collection: currentToken
  //   });
  // };
  // const tabs = ['Add', 'Close', 'Adjust Collateral'].map((item, index) => (
  //   <Tab
  //     name={item}
  //     key={item}
  //     active={tradeWindowIndex === index}
  //     onClick={() => {
  //       setTradeWindowIndex(index);
  //       // logEventByName(analyticsKeys[index]);
  //     }}
  //   />
  // ));
  // const [showOverFluctuationContent, setShowOverFluctuationContent] = useState(false);

  const traderConnectWallet = () => {
    // logEventByName('connectWallet_pressed_tradings');
    connectWallet();
  };
  useEffect(() => setTradeWindowIndex(0), [currentToken]);

  const tradeComponent = (
    <TradeComponent
      isLoginState={isLoginState}
      refreshPositions={refreshPositions}
      connectWallet={traderConnectWallet}
      getTestToken={getTestToken}
      isWrongNetwork={isWrongNetwork}
      isApproveRequired={isApproveRequired}
      setIsApproveRequired={setIsApproveRequired}
      wethBalance={wethBalance}
      fullWalletAddress={fullWalletAddress}
      // tokenRef={tokenRef}
      currentToken={currentToken}
      userPosition={userPosition}
      tradingData={tradingData}
    />
  );

  const displayComponent = [
    tradeComponent,
    <CloseCollateral
      isWrongNetwork={isWrongNetwork}
      refreshPositions={refreshPositions}
      userPosition={userPosition}
      wethBalance={wethBalance}
      fullWalletAddress={fullWalletAddress}
      tradingData={tradingData}
      // tokenRef={tokenRef}
      currentToken={currentToken}
      isLoginState={isLoginState}
      // setShowOverFluctuationContent={setShowOverFluctuationContent}
      setTradeWindowIndex={setTradeWindowIndex}
      getTestToken={getTestToken}
    />,
    <AdjustCollateral
      isWrongNetwork={isWrongNetwork}
      refreshPositions={refreshPositions}
      userPosition={userPosition}
      wethBalance={wethBalance}
      fullWalletAddress={fullWalletAddress}
      tradingData={tradingData}
      // tokenRef={tokenRef}
      currentToken={currentToken}
      isLoginState={isLoginState}
      maxReduceValue={maxReduceValue}
      getTestToken={getTestToken}
    />
  ][tradeWindowIndex];

  return (
    <div
      className="mb-[60px] mr-[20px] flex w-[400px] rounded-[6px] border-[1px]
      border-[#71aaff]/[.2] bg-[#171833] p-6 px-[42px] py-[32px] text-white
    ">
      {/* {showOverFluctuationContent ? <OverFluctuationError setShowOverFluctuationContent={setShowOverFluctuationContent} /> : null} */}
      {/* {userPosition !== null ? <div className="col selecttyperow">{tabs}</div> : null} */}
      <div className={`w-full ${userPosition ? 'showmenu' : 'hidemenu'}`}>{userPosition !== null ? displayComponent : tradeComponent}</div>
      <TradePanelModal
        isShow={isTradePanelModalShow}
        setIsShow={tradePanelModal.setIsShow}
        message={tradePanelModalMsg}
        link={tradePanelModalLink}
      />
    </div>
  );
}

export default TradingWindow;
