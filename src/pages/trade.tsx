/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { withRouter } from 'next/router';
import SidebarCollection from '@/components/trade/desktop/SidebarCollection';
import TradingWindow from '@/components/trade/desktop/TradingWindow';

interface TradePagePros {
  router: any;
}

function TradePage(props: TradePagePros) {
  const { router } = props;
  const [currentToken, setCurrentToken] = useState(router.query?.collection || 'BAYC');
  const [fullWalletAddress, setFullWalletAddress] = useState('');
  const [isLoginState, setIsLoginState] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(true);
  const [isShowPopup, setIsShowPopup] = useState(false);

  return (
    <>
      <PageHeader
        title="Trade"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />
      <main>
        <div className="trading-window">
          <div className="rowcontent container px-0">
            <div className="row-center">
              <SidebarCollection
                currentToken={currentToken}
                setCurrentToken={setCurrentToken}
                fullWalletAddress={fullWalletAddress}
                isLoginState={isLoginState}
                isWrongNetwork={isWrongNetwork}
                isShowPopup={isShowPopup}
                setIsShowPopup={setIsShowPopup}
              />

              {/* <TradingWindow
                currentToken={currentToken}
                isLoginState={isLoginState}
                isWrongNetwork={isWrongNetwork}
                fullWalletAddress={fullWalletAddress}
                // wethBalance={wethBalance}
                // collectWallet={() => navbarRef.current?.connectWallet(() => {}, true)}
                // getTestToken={navbarRef.current?.getTestToken}
                // refreshPositions={fetchPositions}
                // userPosition={userPosition}
                // tradingData={tradingData}
                // isApproveRequired={isApproveRequired}
                // setIsApproveRequired={setIsApproveRequired}
                // maxReduceValue={maxReduceValue}
              /> */}

              {/* <div className="ml-[49px] flex-1">
                <ChartWindows
                  ref={graphRef}
                  tradingData={tradingData}
                  fullWalletAddress={fullWalletAddress}
                  currentToken={currentToken}
                  isLoginState={isLoginState}
                  isWrongNetwork={isWrongNetwork}
                />
                {isLoginState ? (
                  <PositionDetails
                    userPosition={userPosition}
                    tradingData={tradingData}
                    currentToken={currentToken}
                    isLoginState={isLoginState}
                    isWrongNetwork={isWrongNetwork}
                    setHistoryModalIsVisible={setHistoryModalIsVisible}
                    setFundingModalIsShow={setFundingModalIsShow}
                    fullWalletAddress={fullWalletAddress}
                  />
                ) : null}
                <InformationsWindows
                  ref={informationRef}
                  tradingData={tradingData}
                  isLoginState={isLoginState}
                  fullWalletAddress={fullWalletAddress}
                  currentToken={currentToken}
                />
              </div> */}
            </div>
          </div>
          {/* <FundingPaymentModal
            visible={fundingModalIsShow}
            setVisible={setFundingModalIsShow}
            tradingData={tradingData}
            currentCollection={currentCollection}
          />
          <HistoryModal
            visible={historyModalIsVisible}
            onChange={visible => setHistoryModalIsVisible(visible)}
            historyRecordsByMonth={historyRecordsByMonth}
            fullWalletAddress={fullWalletAddress}
          /> */}
        </div>
      </main>
    </>
  );
}

export default withRouter(TradePage);
