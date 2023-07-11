/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
/* eslint-disable array-callback-return */
// @ts-nocheck
import React from 'react';
import PageHeader from '@/components/layout/header/PageHeader';
import { useStore as useNanostore } from '@nanostores/react';
import PositionInfo from '@/components/portfolio/desktop/PositionInfo';
import PortfolioEmpty from '@/components/portfolio/mobile/PortfiolioEmpty';
import AccountChartMobile from '@/components/portfolio/mobile/AccountChartMobile';
import TrendContentMobile from '@/components/portfolio/mobile/TrendContentMobile';
import PositionInfoMobile from '@/components/portfolio/mobile/PositionInfoMobile';
import AccountChart from '@/components/portfolio/desktop/AccountChart';
import TrendContent from '@/components/portfolio/desktop/TrendContent';
import PageLoading from '@/components/common/PageLoading';
import { $userIsConnected, $userIsConnecting, $userIsWrongNetwork } from '@/stores/user';
import PortfolioUpdater from '@/components/updaters/PortfolioUpdater';

export default function Portfolio() {
  const isConnected = useNanostore($userIsConnected);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const isConnecting = useNanostore($userIsConnecting);

  return (
    <>
      <PageHeader
        title="Portfolio"
        ogTitle="Start longing or shorting NFT collections with leverage."
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
          {isConnecting ? <PageLoading /> : null}
        </div>
      </main>

      <PortfolioUpdater />
    </>
  );
}
