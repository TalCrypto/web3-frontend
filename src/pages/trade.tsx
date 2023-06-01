/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { withRouter } from 'next/router';
import collectionList from '@/const/collectionList';
import { getTradingOverview, getTraderPositionInfo, getTraderPositionHistory } from '@/utils/trading';
import { walletProvider } from '@/utils/walletProvider';
import { calculateNumber } from '@/utils/calculateNumbers';
import { setIsTethCollected } from '@/stores/UserState';
import TradingWindow from '@/components/trade/desktop/trading/TradingWindow';
import SidebarCollection from '@/components/trade/desktop/trading/SidebarCollection';
import InformationWindow from '@/components/trade/desktop/information/InformationWindow';
import ChartWindows from '@/components/trade/desktop/chart/ChartWindows';
import PositionDetails from '@/components/trade/desktop/position/PositionDetails';

import InformationMobile from '@/components/trade/mobile/information/InformationMobile';
import ChartMobile from '@/components/trade/mobile/chart/ChartMobile';
import PositionMobile from '@/components/trade/mobile/position/PositionMobile';
import Switcher from '@/components/trade/mobile/collection/Switcher';

interface TradePagePros {
  router: any;
}

const getCollectionInformation = (collectionName: any) => {
  const targetCollection = collectionList.filter(({ collection }) => collection.toUpperCase() === collectionName.toUpperCase());
  return targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
};

function TradePage(props: TradePagePros) {
  const { router } = props;
  const [currentToken, setCurrentToken] = useState(router.query?.collection || 'DEGODS');
  const [fullWalletAddress, setFullWalletAddress] = useState('');
  const [isLoginState, setIsLoginState] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(true);
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [tradingData, setTradingData] = useState({});
  const [userPosition, setUserPosition] = useState(null);
  const [maxReduceValue, setMaxReduceValue] = useState('');
  const [historyRecords, setHistoryRecords] = useState([]);
  const [wethBalance, setWethBalance] = useState(0);
  const [historyModalIsVisible, setHistoryModalIsVisible] = useState(false);
  const [fundingModalIsShow, setFundingModalIsShow] = useState(false);
  const [isApproveRequired, setIsApproveRequired] = useState(false);

  const fetchInformations = async () => {
    const { amm: currentAmm, contract: currentContract } = getCollectionInformation(currentToken); // from tokenRef.current
    setTradingData({});
    // set tradingData
    await getTradingOverview(currentAmm, currentContract).then(data => {
      setTradingData(data);
    });
  };

  const fetchPositions = async () => {
    if (!isLoginState || isWrongNetwork) {
      return;
    }
    // console.log('refresh fetchPositions');
    try {
      // refresh Tribe Detail Market Trades
      setTimeout(() => {
        // informationRef.current?.fetchInformations();
      }, 10000);
      // refresh sidebar position
      // sidebarCollectionRef.current?.fetchOverview();

      const { amm: currentAmm } = getCollectionInformation(currentToken); // from tokenRef.current
      const traderPositionInfo: any = await getTraderPositionInfo(currentAmm, walletProvider.holderAddress);
      setUserPosition(traderPositionInfo);
      const maxReduce = await walletProvider.getMaxReduceCollateralValue(currentAmm, walletProvider.holderAddress);
      const maxReduceValueTemp: any = calculateNumber(maxReduce, 4);
      setMaxReduceValue(maxReduceValueTemp);
      const latestHistoryRecords = await getTraderPositionHistory(currentAmm, walletProvider.holderAddress);
      setHistoryRecords(latestHistoryRecords === null ? [] : latestHistoryRecords);
      const isCollected = await walletProvider.checkIsTethCollected();
      setIsTethCollected(isCollected);
      const newBalance = await walletProvider.getWethBalance(walletProvider.holderAddress);
      setWethBalance(Number(newBalance));
      // navbarRef.current?.updateBalance();

      // get price gap from smartcontract
      await walletProvider.getLiquidationRatio();
    } catch (error) {
      // console.log('error from fetchPositions => ', error);
    }
  };

  let timeoutPositionChangeId: any; // Declare the timeout ID variable in a scope accessible to both functions

  // function stopTimeout() {
  //   clearTimeout(timeoutPositionChangeId);
  // }

  // function startTimeout() {
  //   const snapToken = currentToken;
  //   timeoutPositionChangeId = setTimeout(() => {
  //     // if (snapToken === currentTokenRef.current) {
  //       // fetchInformations();
  //       // graphRef.current?.fetchChartData();
  //     // }
  //   }, 10000);
  // }

  useEffect(() => {
    // currentTokenRef.current = currentToken;

    // const coll = getCollectionInformation(currentToken);
    // setCurrentCollection(coll);

    fetchPositions();
    fetchInformations();

    // return () => {
    //   stopTimeout(); // Stop the timeout
    // };
  }, [currentToken]); // from tokenRef.current

  return (
    <>
      <PageHeader
        title="Trade"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />
      <main>
        <div className="trading-window hidden md:block">
          <div className="px-0">
            <div className="hidden md:block 2xl:flex">
              <div className="flex">
                <SidebarCollection
                  currentToken={currentToken}
                  setCurrentToken={setCurrentToken}
                  fullWalletAddress={fullWalletAddress}
                  isLoginState={isLoginState}
                  isWrongNetwork={isWrongNetwork}
                  isShowPopup={isShowPopup}
                  setIsShowPopup={setIsShowPopup}
                />

                <TradingWindow
                  currentToken={currentToken}
                  isLoginState={isLoginState}
                  isWrongNetwork={isWrongNetwork}
                  fullWalletAddress={fullWalletAddress}
                  wethBalance={wethBalance}
                  // collectWallet={() => navbarRef.current?.connectWallet(() => {}, true)}
                  // getTestToken={navbarRef.current?.getTestToken}
                  refreshPositions={fetchPositions}
                  userPosition={userPosition}
                  tradingData={tradingData}
                  isApproveRequired={isApproveRequired}
                  setIsApproveRequired={setIsApproveRequired}
                  maxReduceValue={maxReduceValue}
                />
              </div>

              <div className="ml-[30px] block 2xl:flex-1">
                <ChartWindows
                  // ref={graphRef}
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

                <InformationWindow
                  // ref={informationRef}
                  tradingData={tradingData}
                  isLoginState={isLoginState}
                  fullWalletAddress={fullWalletAddress}
                  currentToken={currentToken}
                />
              </div>
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

        <div className="block bg-[#171833] md:hidden">
          <Switcher currentToken={currentToken} setCurrentToken={setCurrentToken} />

          <ChartMobile
            // ref={graphRef}
            tradingData={tradingData}
            fullWalletAddress={fullWalletAddress}
            currentToken={currentToken}
            isLoginState={isLoginState}
            isWrongNetwork={isWrongNetwork}
          />

          {/* {isLoginState ? ( */}
          <PositionMobile
            userPosition={userPosition}
            tradingData={tradingData}
            currentToken={currentToken}
            isLoginState={isLoginState}
            isWrongNetwork={isWrongNetwork}
            setHistoryModalIsVisible={setHistoryModalIsVisible}
            setFundingModalIsShow={setFundingModalIsShow}
            fullWalletAddress={fullWalletAddress}
          />
          {/* ) : null} */}

          <InformationMobile
            tradingData={tradingData}
            isLoginState={isLoginState}
            fullWalletAddress={fullWalletAddress}
            currentToken={currentToken}
          />
        </div>
      </main>
    </>
  );
}

export default withRouter(TradePage);
