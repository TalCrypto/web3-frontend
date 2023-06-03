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

import { useStore as useNanostore } from '@nanostores/react';
import { wsCurrentToken, wsFullWalletAddress, wsHistoryGroupByMonth, wsIsLogin, wsIsWrongNetwork } from '@/stores/WalletState';
import { formatDateTime } from '@/utils/date';
import { apiConnection } from '@/utils/apiConnection';

interface TradePagePros {
  router: any;
}

const getCollectionInformation = (collectionName: any) => {
  const targetCollection = collectionList.filter(({ collection }) => collection.toUpperCase() === collectionName.toUpperCase());
  return targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
};

function TradePage(props: TradePagePros) {
  const { router } = props;
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [tradingData, setTradingData] = useState({});
  const [userPosition, setUserPosition] = useState(null);
  const [maxReduceValue, setMaxReduceValue] = useState('');
  const [historyRecords, setHistoryRecords] = useState([]);
  const [wethBalance, setWethBalance] = useState(0);
  const [historyModalIsVisible, setHistoryModalIsVisible] = useState(false);
  const [fundingModalIsShow, setFundingModalIsShow] = useState(false);

  const isLoginState = useNanostore(wsIsLogin);
  const isWrongNetwork = useNanostore(wsIsWrongNetwork);
  const currentToken = useNanostore(wsCurrentToken);

  const currentCollection = collectionList.filter((item: any) => item.collection.toUpperCase() === currentToken.toUpperCase())[0];

  const fetchInformation = async () => {
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
    try {
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

      // get price gap from smartcontract
      await walletProvider.getLiquidationRatio();
    } catch (error) {
      // console.log('error from fetchPositions => ', error);
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchInformation();
  }, [currentToken]); // from tokenRef.current

  useEffect(() => {
    if (Object.keys(router.query).length === 0) {
      return;
    }

    const passCollection = decodeURIComponent(router.query.collection)?.toUpperCase();
    wsCurrentToken.set(passCollection); // from tokenRef.current
    walletProvider.setCurrentToken(passCollection);
  }, [router.query]);

  const fetchUserTradingHistory = async () => {
    const latestHistoryRecords = await apiConnection.getUserTradingHistory();
    const { tradeHistory } = latestHistoryRecords.data;

    const historyGroupByMonth = tradeHistory
      .filter((i: any) => i.ammAddress.toLowerCase() === currentCollection.amm.toLowerCase())
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .reduce((group: any, record: any) => {
        const month = formatDateTime(record.timestamp, 'MM/YYYY');
        const result = [];
        result[month] = group[month] ?? [];
        result[month].push(record);
        return result;
      }, {});

    wsHistoryGroupByMonth.set(historyGroupByMonth || []);
  };

  useEffect(() => {
    if (isLoginState && walletProvider.holderAddress && currentCollection) {
      fetchUserTradingHistory();
      walletProvider.getFluctuationLimitRatio(currentCollection.amm);
      walletProvider.getInitialMarginRatio(currentCollection.amm);
    }
    console.log('here');
  }, [walletProvider.holderAddress, isLoginState, currentCollection, fetchUserTradingHistory]);

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
                <SidebarCollection isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />

                <TradingWindow
                  wethBalance={wethBalance}
                  refreshPositions={fetchPositions}
                  userPosition={userPosition}
                  tradingData={tradingData}
                  maxReduceValue={maxReduceValue}
                />
              </div>

              <div className="ml-[30px] block 2xl:flex-1">
                <ChartWindows tradingData={tradingData} />
                {/* {isLoginState ? ( */}
                <PositionDetails
                  userPosition={userPosition}
                  tradingData={tradingData}
                  setHistoryModalIsVisible={setHistoryModalIsVisible}
                  setFundingModalIsShow={setFundingModalIsShow}
                />
                {/* ) : null} */}

                <InformationWindow tradingData={tradingData} />
              </div>
            </div>
          </div>
        </div>

        <div className="block bg-lightBlue md:hidden">
          <Switcher />

          <ChartMobile tradingData={tradingData} />

          {/* {isLoginState ? ( */}
          <PositionMobile
            userPosition={userPosition}
            tradingData={tradingData}
            setHistoryModalIsVisible={setHistoryModalIsVisible}
            setFundingModalIsShow={setFundingModalIsShow}
          />
          {/* ) : null} */}

          <InformationMobile tradingData={tradingData} />
        </div>
      </main>
    </>
  );
}

export default withRouter(TradePage);
