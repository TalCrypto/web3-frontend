/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
/* eslint-disable array-callback-return */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { eventParams } from '@/utils/eventLog';
import { apiConnection } from '@/utils/apiConnection';
import { useStore as useNanostore } from '@nanostores/react';
import {
  $psBalance,
  $psBalanceOriginData,
  $psHistogramChartData,
  $psHistoryRecordsByMonth,
  $psLineChartData,
  $psSelectedTimeIndex,
  $psUserInfo,
  $psUserPosition
} from '@/stores/portfolio';
import PositionInfo from '@/components/portfolio/desktop/PositionInfo';
import PortfolioEmpty from '@/components/portfolio/mobile/PortfiolioEmpty';
import AccountChartMobile from '@/components/portfolio/mobile/AccountChartMobile';
import TrendContentMobile from '@/components/portfolio/mobile/TrendContentMobile';
import PositionInfoMobile from '@/components/portfolio/mobile/PositionInfoMobile';
import AccountChart from '@/components/portfolio/desktop/AccountChart';
import TrendContent from '@/components/portfolio/desktop/TrendContent';
import PageLoading from '@/components/common/PageLoading';
import { formatDateTime } from '@/utils/date';
import { $userIsConnected, $userIsWrongNetwork, $userPositionInfos } from '@/stores/user';
import UserDataUpdater from '@/components/updaters/UserDataUpdater';
import { AMM } from '@/const/collectionList';
import { getSupportedAMMs } from '@/const/addresses';

export default function Portfolio() {
  const isConnected = useNanostore($userIsConnected);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const userPositionInfos = useNanostore($userPositionInfos);
  const ammList = getSupportedAMMs();

  useEffect(() => {
    const temp = ammList
      .filter((amm: AMM) => (userPositionInfos && userPositionInfos[amm] ? userPositionInfos[amm].size > 0 : false))
      .map((amm: AMM) => userPositionInfos[amm]);
    $psUserPosition.set(temp);
  }, [userPositionInfos]);

  return (
    <>
      <PageHeader
        title="Portfolio"
        ogTitle="Start to trade, hedge, leverage with a real-time charts."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />

      <main>
        <div className="relative hidden md:block" id="divPortfolioWindow">
          <div className="block 2xl:flex">
            <AccountChart />
            <TrendContent />
          </div>
          <PositionInfo />

          {/* {isLoading ? <PageLoading /> : null} */}
        </div>

        <div className="block bg-lightBlue md:hidden" id="divPortfolioMobile">
          {!isConnected || isWrongNetwork ? (
            <PortfolioEmpty />
          ) : (
            <>
              <AccountChartMobile />
              <TrendContentMobile />
              <PositionInfoMobile />
            </>
          )}
        </div>

        <UserDataUpdater />
      </main>
    </>
  );
}
