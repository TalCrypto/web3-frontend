/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { withRouter } from 'next/router';
import TradingWindow from '@/components/trade/desktop/trading/TradingWindow';
import SidebarCollection from '@/components/trade/desktop/trading/SidebarCollection';
import InformationWindow from '@/components/trade/desktop/information/InformationWindow';
import ChartWindows from '@/components/trade/desktop/chart/ChartWindows';
import PositionDetails from '@/components/trade/desktop/position/PositionDetails';

import InformationMobile from '@/components/trade/mobile/information/InformationMobile';
import ChartMobile from '@/components/trade/mobile/chart/ChartMobile';
import PositionMobile from '@/components/trade/mobile/position/PositionMobile';
import Switcher from '@/components/trade/mobile/collection/Switcher';

import TradingMobile from '@/components/trade/mobile/trading/TradingMobile';
import { WithRouterProps } from 'next/dist/client/with-router';
import { $currentAmm } from '@/stores/trading';
import { AMM } from '@/const/collectionList';
import { useAccount } from 'wagmi';
import ChartDataUpdater from '@/components/updaters/ChartDataUpdater';
import CollectionConfigLoader from '@/components/updaters/CollectionConfigLoader';

// const getCollectionInformation = (collectionName: any) => {
//   const targetCollection = collectionList.filter(({ collection }) => collection.toUpperCase() === collectionName.toUpperCase());
//   return targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
// };

function TradePage(props: WithRouterProps) {
  const { router } = props;
  const { isConnected } = useAccount();
  // const maxReduceValue = useNanostore(wsMaxReduceValue);
  // const [maxReduceValue, setMaxReduceValue] = useState('');
  // const [historyRecords, setHistoryRecords] = useState([]);

  useEffect(() => {
    const collection = router?.query?.collection;
    if (collection) {
      $currentAmm.set(collection as AMM);
    }
  }, [router]);

  // const currentCollection = collectionList.filter((item: any) => item.collection.toUpperCase() === currentToken.toUpperCase())[0];

  // const fetchInformation = async () => {
  //   const { amm: currentAmm, contract: currentContract } = getCollectionInformation(currentToken); // from tokenRef.current
  //   setTradingData({});
  //   // set tradingData
  //   await getTradingOverview(currentAmm, currentContract).then(data => {
  //     setTradingData(data);
  //   });
  // };

  // const fetchPositions = async () => {
  //   if (!isConnected || isWrongNetwork) {
  //     return;
  //   }
  //   try {
  //     const { amm: currentAmm } = getCollectionInformation(currentToken); // from tokenRef.current
  //     const traderPositionInfo: any = await getTraderPositionInfo(currentAmm, walletProvider.holderAddress);
  //     wsUserPosition.set(traderPositionInfo);
  //     const maxReduce = await walletProvider.getMaxReduceCollateralValue(currentAmm, walletProvider.holderAddress);
  //     wsMaxReduceValue.set(Number(calculateNumber(maxReduce, 4)));
  //     // const latestHistoryRecords = await getTraderPositionHistory(currentAmm, walletProvider.holderAddress);
  //     // setHistoryRecords(latestHistoryRecords === null ? [] : latestHistoryRecords);
  //     const isCollected = await walletProvider.checkIsTethCollected();
  //     setIsTethCollected(isCollected);
  //     const newBalance = await walletProvider.getWethBalance(walletProvider.holderAddress);
  //     wsWethBalance.set(Number(newBalance));

  //     // get price gap from smartcontract
  //     await walletProvider.getLiquidationRatio();
  //   } catch (error) {
  //     // console.log('error from fetchPositions => ', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchPositions();
  //   fetchInformation();
  // }, [currentToken, isConnected]); // from tokenRef.current

  // useEffect(() => {
  //   if (Object.keys(router.query).length === 0) {
  //     return;
  //   }

  //   const passCollection = decodeURIComponent(router.query.collection)?.toUpperCase();
  //   wsCurrentToken.set(passCollection); // from tokenRef.current
  //   walletProvider.setCurrentToken(passCollection);
  // }, [router.query]);

  // const fetchUserTradingHistory = async () => {
  //   const latestHistoryRecords = await apiConnection.getUserTradingHistory();
  //   const { tradeHistory } = latestHistoryRecords.data;

  //   const historyGroupByMonth = tradeHistory
  //     .filter((i: any) => i.ammAddress.toLowerCase() === currentCollection.amm.toLowerCase())
  //     .sort((a: any, b: any) => b.timestamp - a.timestamp)
  //     .reduce((group: any, record: any) => {
  //       const month = formatDateTime(record.timestamp, 'MM/YYYY');
  //       const result = [];
  //       result[month] = group[month] ?? [];
  //       result[month].push(record);
  //       return result;
  //     }, {});

  //   wsHistoryGroupByMonth.set(historyGroupByMonth || []);
  // };

  // useEffect(() => {
  //   if (isConnected && walletProvider.holderAddress && currentCollection) {
  //     fetchUserTradingHistory();
  //     // walletProvider.getFluctuationLimitRatio(currentCollection.amm);
  //     // walletProvider.getInitialMarginRatio(currentCollection.amm);
  //   }
  // }, [walletProvider.holderAddress, isConnected, currentCollection, fetchUserTradingHistory]);

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
                <SidebarCollection />

                <TradingWindow />
              </div>

              <div className="block 2xl:ml-[49px] 2xl:flex-1">
                <ChartWindows />
                {isConnected ? <PositionDetails /> : null}

                <InformationWindow />
              </div>
            </div>
          </div>
        </div>

        <div className="block bg-lightBlue md:hidden" id="divTradeMobile">
          <Switcher />

          <div className="mt-12 bg-darkBlue">
            <ChartMobile />

            {isConnected ? <PositionMobile /> : null}

            <InformationMobile />

            <TradingMobile />
          </div>
        </div>
        <CollectionConfigLoader />
        <ChartDataUpdater />
      </main>
    </>
  );
}

export default withRouter(TradePage);
