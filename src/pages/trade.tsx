/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { withRouter } from 'next/router';
import TradingWindow from '@/components/trade/desktop/trading/TradingWindow';
import SidebarCollection from '@/components/trade/desktop/trading/SidebarCollection';
import InformationWindow from '@/components/trade/desktop/information/InformationWindow';
import ChartWindows from '@/components/trade/desktop/chart/ChartWindows';
import PositionDetails from '@/components/trade/desktop/position/PositionDetails';

import { WithRouterProps } from 'next/dist/client/with-router';
import { $currentAmm } from '@/stores/trading';
import { AMM, DEFAULT_AMM } from '@/const/collectionList';
import ChartDataUpdater from '@/components/updaters/ChartDataUpdater';
import CollectionConfigLoader from '@/components/updaters/CollectionConfigLoader';
import TradingDataUpdater from '@/components/updaters/TradingDataUpdater';
import MarketHistoryUpdater from '@/components/updaters/MarketHistoryUpdater';
import EventManager from '@/components/updaters/EventManager';
import Switcher from '@/components/trade/mobile/collection/Switcher';
import ChartMobile from '@/components/trade/mobile/chart/ChartMobile';
import InformationMobile from '@/components/trade/mobile/information/InformationMobile';
import PositionMobile from '@/components/trade/mobile/position/PositionMobile';
import TradingMobile from '@/components/trade/mobile/trading/TradingMobile';

function TradePage(props: WithRouterProps) {
  const { router } = props;

  useEffect(() => {
    const collection = router?.query?.collection;
    if (collection) {
      const amm = collection as AMM;
      if (Object.values(AMM).includes(amm)) {
        $currentAmm.set(amm);
      } else {
        router.push(`/trade/${DEFAULT_AMM}`);
      }
    } else {
      router.push(`/trade/${DEFAULT_AMM}`);
    }
    return () => {
      $currentAmm.set(undefined);
    };
  }, [router]);

  return (
    <>
      <PageHeader
        title="Trade"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />
      <main>
        <div className="hidden md:block">
          <div className="px-0">
            <div className="hidden md:block 2xl:flex">
              <div className="flex">
                <SidebarCollection />

                <TradingWindow />
              </div>

              <div className="block 2xl:ml-[49px] 2xl:flex-1">
                <ChartWindows />
                <PositionDetails />

                <InformationWindow />
              </div>
            </div>
          </div>
        </div>

        <div className="mobile-view block bg-lightBlue md:hidden">
          <Switcher />

          <div className="mt-12 bg-darkBlue">
            <ChartMobile />

            <PositionMobile />

            <InformationMobile />

            <TradingMobile />
          </div>
        </div>

        <CollectionConfigLoader />
        <TradingDataUpdater />
        <ChartDataUpdater />
        <MarketHistoryUpdater />
        <EventManager />
      </main>
    </>
  );
}

export default withRouter(TradePage);
