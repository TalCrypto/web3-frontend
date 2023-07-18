import { useStore as useNanostore } from '@nanostores/react';
import React, { useEffect, useState } from 'react';
import { apiConnection } from '@/utils/apiConnection';
import { Chain, useAccount, useContractRead, useNetwork } from 'wagmi';
import {
  $isUserprofileLoading,
  $searchQuery,
  $searchResult,
  $showSearchWindow,
  $userAirdropRank,
  $userCompetitionRank,
  $userFollowers,
  $userFollowings,
  $userHistory,
  $userInfo,
  $userProfilePositionInfos,
  $userprofileAddress
} from '@/stores/userprofile';
import { getAllTraderPositionHistory } from '@/utils/trading';
import { getCHViewerContract } from '@/const/contracts';
import { chViewerAbi } from '@/const/abi';
import { Address, zeroAddress } from 'viem';
import { AMM } from '@/const/collectionList';
import { formatBigInt } from '@/utils/bigInt';
import { getAMMAddress, getAddressConfig, getSupportedAMMs } from '@/const/addresses';

const PositionInfoUpdater: React.FC<{
  chain: Chain | undefined;
  amm: AMM;
  ammAddress: Address;
  trader: Address | undefined;
  isWrongNetwork: boolean;
}> = ({ chain, amm, ammAddress, trader, isWrongNetwork }) => {
  const chViewer = getCHViewerContract(chain);
  const { data } = useContractRead({
    ...chViewer,
    abi: chViewerAbi,
    functionName: 'getTraderPositionInfoWithoutPriceImpact',
    args: [ammAddress, trader ?? zeroAddress],
    watch: false,
    enabled: Boolean(ammAddress && trader)
  });

  console.log({ data });

  const size = data ? formatBigInt(data.positionSize) : 0;
  const margin = data ? formatBigInt(data.margin) : 0;
  const openNotional = data ? formatBigInt(data.openNotional) : 0;
  const currentNotional = data ? formatBigInt(data.positionNotional) : 0;
  const unrealizedPnl = data ? formatBigInt(data.unrealizedPnl) : 0;
  const marginRatio = data ? formatBigInt(data.marginRatio) : 0;
  const entryPrice = data ? formatBigInt(data.avgEntryPrice) : 0;
  const openLeverage = data ? formatBigInt(data.openLeverage) : 0;
  const liquidationPrice = data ? formatBigInt(data.liquidationPrice) : 0;
  const vammPrice = data ? formatBigInt(data.spotPrice) : 0;
  const leverage = data ? formatBigInt(data.leverage) : 0;
  const fundingPayment = data ? formatBigInt(data.fundingPayment) : 0;
  const isLiquidatable = data ? data.isLiquidatable : false;

  useEffect(() => {
    $userProfilePositionInfos.setKey(amm, undefined);
    if (trader && !isWrongNetwork) {
      $userProfilePositionInfos.setKey(amm, {
        amm,
        ammAddress,
        size,
        margin,
        openNotional,
        currentNotional,
        unrealizedPnl,
        marginRatio,
        entryPrice,
        openLeverage,
        liquidationPrice,
        vammPrice,
        leverage,
        fundingPayment,
        isLiquidatable
      });
    }
  }, [
    amm,
    chain,
    ammAddress,
    trader,
    size,
    margin,
    openNotional,
    currentNotional,
    unrealizedPnl,
    marginRatio,
    entryPrice,
    openLeverage,
    liquidationPrice,
    vammPrice,
    leverage,
    fundingPayment,
    isLiquidatable,
    isWrongNetwork
  ]);

  return null;
};

function UserprofileUpdater() {
  const trigger = useNanostore($userprofileAddress);
  const { address, isConnected, isConnecting } = useAccount();
  const { chain } = useNetwork();
  const [amms, setAmms] = useState<Array<AMM>>();

  // useEffect(() => {
  //   if (chain) {
  //     setAmms(getSupportedAMMs(chain));
  //   }
  // }, [chain]);

  useEffect(() => {
    if (chain && isConnected) {
      setAmms(getSupportedAMMs(chain));
    }
  }, [chain, isConnected]);

  useEffect(() => {
    async function fetchData() {
      // set store to default
      $isUserprofileLoading.set(true);
      $userprofileAddress.set(null);
      $userInfo.set(null);
      $userAirdropRank.set(null);
      $userCompetitionRank.set(null);
      // $userProfilePositionInfos.setKey(amm, undefined);
      $userHistory.set([]);
      $userFollowings.set([]);
      $userFollowers.set([]);
      $searchQuery.set('');
      $showSearchWindow.set(false);
      $searchResult.set([]);

      const userprofilePromises = [
        apiConnection.getTargetUserInfo(trigger, trigger),
        apiConnection.getUserPointLite(trigger),
        apiConnection.getAbsPnlLeaderboard(trigger),
        getAllTraderPositionHistory(trigger, 500, 0),
        apiConnection.getUserFollowings(trigger, trigger),
        apiConnection.getUserFollowers(trigger, trigger)
      ];

      const [userProfileRes, userAirdropRankRes, userCompetitionRankRes, userPositionHistoryRes, userFollowingsRes, userFollowersRes] =
        await Promise.allSettled(userprofilePromises);

      if (userProfileRes.status === 'fulfilled') {
        $userInfo.set(userProfileRes.value.data);
      }
      if (userAirdropRankRes.status === 'fulfilled') {
        $userAirdropRank.set(userAirdropRankRes.value);
      }
      if (userCompetitionRankRes.status === 'fulfilled') {
        $userCompetitionRank.set(userCompetitionRankRes.value?.user);
      }
      if (userPositionHistoryRes.status === 'fulfilled') {
        $userHistory.set(userPositionHistoryRes.value);
      }
      if (userFollowingsRes.status === 'fulfilled') {
        $userFollowings.set(userFollowingsRes.value.data);
      }
      if (userFollowersRes.status === 'fulfilled') {
        $userFollowers.set(userFollowersRes.value.data);
      }

      console.log({ $userInfo: $userInfo.get() });
      console.log({ $userAirdropRank: $userAirdropRank.get() });
      console.log({ $userCompetitionRank: $userCompetitionRank.get() });
      console.log({ $userHistory: $userHistory.get() });
      console.log({ $userFollowings: $userFollowings.get() });
      console.log({ $userFollowers: $userFollowers.get() });
      console.log({ $userProfilePositionInfos: $userProfilePositionInfos.get() });

      $isUserprofileLoading.set(false);
    }

    if (trigger) {
      fetchData();
    }
  }, [trigger]);

  if (!amms) return null;

  return (
    <>
      {amms.map(amm => {
        const ammAddr = getAMMAddress(chain, amm);
        if (ammAddr) {
          return (
            <PositionInfoUpdater
              key={amm}
              chain={chain}
              amm={amm}
              ammAddress={ammAddr}
              trader={trigger}
              isWrongNetwork={Boolean(chain?.unsupported)}
            />
          );
        }
        return null;
      })}
    </>
  );
}

export default UserprofileUpdater;
