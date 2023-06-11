/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { withRouter } from 'next/router';
import collectionList from '@/const/collectionList';
import { getTradingOverview, getTraderPositionInfo, getTraderPositionHistory } from '@/utils/trading';
import { walletProvider } from '@/utils/walletProvider';
import { calculateNumber } from '@/utils/calculateNumbers';
import { setIsWethCollected } from '@/stores/UserState';
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
import {
  wsCurrentToken,
  wsHistoryGroupByMonth,
  wsIsLogin,
  wsIsShowTradingMobile,
  wsIsWrongNetwork,
  wsMaxReduceValue,
  wsUserPosition,
  wsWethBalance
} from '@/stores/WalletState';
import { formatDateTime } from '@/utils/date';
import { apiConnection } from '@/utils/apiConnection';
import TradingMobile from '@/components/trade/mobile/trading/TradingMobile';
import { ThreeDots } from 'react-loader-spinner';

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
  const [isLoading, setIsLoading] = useState(false);
  const maxReduceValue = useNanostore(wsMaxReduceValue);
  // const [maxReduceValue, setMaxReduceValue] = useState('');
  // const [historyRecords, setHistoryRecords] = useState([]);
  const userPosition: any = useNanostore(wsUserPosition);

  const isShowTradingMobile = useNanostore(wsIsShowTradingMobile);

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
      wsUserPosition.set(traderPositionInfo);
      const maxReduce = await walletProvider.getMaxReduceCollateralValue(currentAmm, walletProvider.holderAddress);
      wsMaxReduceValue.set(Number(calculateNumber(maxReduce, 4)));
      // const latestHistoryRecords = await getTraderPositionHistory(currentAmm, walletProvider.holderAddress);
      // setHistoryRecords(latestHistoryRecords === null ? [] : latestHistoryRecords);
      const isCollected = await walletProvider.checkIsWethCollected();
      setIsWethCollected(isCollected);
      const newBalance = await walletProvider.getWethBalance(walletProvider.holderAddress);
      wsWethBalance.set(Number(newBalance));

      // get price gap from smartcontract
      await walletProvider.getLiquidationRatio();
    } catch (error) {
      // console.log('error from fetchPositions => ', error);
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchInformation();
  }, [currentToken, isLoginState]); // from tokenRef.current

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
    // if ((walletProvider.holderAddress && !eventPageView) || localStorage.getItem('isLoggedin') !== 'true') {
    //   apiConnection.postUserEvent('page_trade_view', {
    //     page: 'Trade'
    //   });
    //   setEventPageView(true);

    //   collectionsLoading.getCollectionsLoading();
    // }
    fetchPositions();
  }, [walletProvider.holderAddress]);

  useEffect(() => {
    if (isLoginState && walletProvider.holderAddress && currentCollection) {
      fetchUserTradingHistory();
      // walletProvider.getFluctuationLimitRatio(currentCollection.amm);
      // walletProvider.getInitialMarginRatio(currentCollection.amm);
    }
  }, [walletProvider.holderAddress, isLoginState, currentCollection]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentToken, userPosition]);

  return (
    <>
      <PageHeader
        title="Trade"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />
      <main>
        <div className="trading-window hidden md:block" id="divTradeWindow">
          <div className="px-0">
            <div className="hidden md:block 2xl:flex">
              <div className="flex">
                <SidebarCollection isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />

                <TradingWindow refreshPositions={fetchPositions} tradingData={tradingData} />
              </div>

              <div className="block 2xl:ml-[49px] 2xl:flex-1">
                <ChartWindows tradingData={tradingData} />
                {isLoginState ? <PositionDetails tradingData={tradingData} /> : null}

                <InformationWindow tradingData={tradingData} />
              </div>
            </div>
          </div>
        </div>

        <div className="block bg-lightBlue md:hidden" id="divTradeMobile">
          <Switcher />

          <div className="mt-12">
            {isLoading ? (
              <div className="flex h-[56px] w-full items-center justify-center bg-darkBlue text-highEmphasis">
                <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
              </div>
            ) : null}

            <ChartMobile tradingData={tradingData} />

            {isLoginState ? <PositionMobile tradingData={tradingData} /> : null}

            <InformationMobile tradingData={tradingData} />

            {isShowTradingMobile ? <TradingMobile refreshPositions={fetchPositions} tradingData={tradingData} /> : null}
          </div>
        </div>
      </main>
    </>
  );
}

export default withRouter(TradePage);
