/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
/* eslint-disable array-callback-return */
// @ts-nocheck
import React, { useEffect } from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { apiConnection } from '@/utils/apiConnection';
import { useStore as useNanostore } from '@nanostores/react';
import { $psBalance, $psHistogramChartData, $psLineChartData, $psSelectedTimeIndex, $psUserPosition } from '@/stores/portfolio';
import PositionInfo from '@/components/portfolio/desktop/PositionInfo';
import PortfolioEmpty from '@/components/portfolio/mobile/PortfiolioEmpty';
import AccountChartMobile from '@/components/portfolio/mobile/AccountChartMobile';
import TrendContentMobile from '@/components/portfolio/mobile/TrendContentMobile';
import PositionInfoMobile from '@/components/portfolio/mobile/PositionInfoMobile';
import AccountChart from '@/components/portfolio/desktop/AccountChart';
import TrendContent from '@/components/portfolio/desktop/TrendContent';
import PageLoading from '@/components/common/PageLoading';
import {
  $userAddress,
  $userIsConnected,
  $userIsConnecting,
  $userIsWrongNetwork,
  $userPositionInfos,
  $userWethBalance
} from '@/stores/user';
import { AMM } from '@/const/collectionList';
import { getSupportedAMMs } from '@/const/addresses';
import { formatBigInt } from '@/utils/bigInt';

export default function Portfolio() {
  const isConnected = useNanostore($userIsConnected);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const isConnecting = useNanostore($userIsConnecting);
  const userPositionInfos = useNanostore($userPositionInfos);
  const ammList = getSupportedAMMs();
  const address = useNanostore($userAddress);
  const selectedTimeIndex = useNanostore($psSelectedTimeIndex);
  const psBalance = useNanostore($psBalance);
  const userPosition = useNanostore($psUserPosition);
  const wethBalance = useNanostore($userWethBalance);

  const userPortfolio = userPosition.reduce((pre: any, item: any) => (!item ? pre : pre + item.margin), 0);
  const newBalance = psBalance;
  newBalance.portfolio = userPortfolio.toFixed(4);
  newBalance.available = wethBalance.toFixed(4);
  $psBalance.set(newBalance);

  useEffect(() => {
    if (address) {
      apiConnection.getWalletChartContent(address, selectedTimeIndex).then((data: any) => {
        const accumulatedPnlData: any = [];
        const dailyPnlData: any = [];
        let accumulatedDailyPnlData = 0;

        data.map((item: any) => {
          const { time, accumulatedPnl, dailyPnl } = item;
          accumulatedPnlData.push({
            time,
            value: formatBigInt(accumulatedPnl)
          });
          dailyPnlData.push({
            time,
            value: formatBigInt(dailyPnl),
            color: formatBigInt(dailyPnl) === 0.0 ? 'rgba(125, 125, 125, 0.3)' : formatBigInt(dailyPnl) > 0 ? '#78f363' : '#ff5656'
          });
          accumulatedDailyPnlData += formatBigInt(dailyPnl);
        });

        $psLineChartData.set(accumulatedPnlData);
        $psHistogramChartData.set(dailyPnlData);
      });
    }
  }, [selectedTimeIndex, address]);

  useEffect(() => {
    const temp = ammList
      .filter((amm: AMM) => (userPositionInfos && userPositionInfos[amm] ? userPositionInfos[amm].size !== 0 : false))
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
        <div className="relative hidden md:block">
          <div className="block 2xl:flex">
            <AccountChart />
            <TrendContent />
          </div>
          <PositionInfo />

          {isConnecting ? <PageLoading /> : null}
        </div>

        <div className="mobile-view block bg-lightBlue md:hidden">
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
      </main>
    </>
  );
}
