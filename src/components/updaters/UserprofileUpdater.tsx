/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
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
  $userHistories,
  $userInfo,
  $userprofilePositionInfos,
  $userprofileAddress
} from '@/stores/userprofile';
import { getAllTraderPositionHistory } from '@/utils/trading';
import { getCHViewerContract } from '@/const/contracts';
import { chViewerAbi } from '@/const/abi';
import { Address, zeroAddress } from 'viem';
import { AMM } from '@/const/collectionList';
import { formatBigInt } from '@/utils/bigInt';
import { getAMMAddress, getSupportedAMMs } from '@/const/addresses';
import { getTradingActionTypeFromSubgraph } from '@/utils/actionType';

const PositionInfoUpdater: React.FC<{
  chain: Chain | undefined;
  amm: AMM;
  ammAddress: Address;
  trader: Address | undefined;
}> = ({ chain, amm, ammAddress, trader }) => {
  const chViewer = getCHViewerContract(chain);
  const { data } = useContractRead({
    ...chViewer,
    abi: chViewerAbi,
    functionName: 'getTraderPositionInfoWithoutPriceImpact',
    args: [ammAddress, trader ?? zeroAddress],
    watch: false,
    enabled: Boolean(ammAddress && trader)
  });

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
    $userprofilePositionInfos.setKey(amm, undefined);
    if (trader) {
      $userprofilePositionInfos.setKey(amm, {
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
    isLiquidatable
  ]);

  return null;
};

function UserprofileUpdater() {
  const userprofileAddress: any = useNanostore($userprofileAddress);
  const { chain } = useNetwork();
  const [amms, setAmms] = useState<Array<AMM>>();
  const { address, isConnected, isConnecting } = useAccount();

  useEffect(() => {
    async function fetchData() {
      // set store to default
      $isUserprofileLoading.set(true);
      // $userprofileAddress.set(null);
      $userInfo.set(null);
      $userAirdropRank.set(null);
      $userCompetitionRank.set(null);
      // $userprofilePositionInfos.setKey(amm, undefined);
      $userHistories.set([]);
      $userFollowings.set([]);
      $userFollowers.set([]);
      $searchQuery.set('');
      $showSearchWindow.set(false);
      $searchResult.set([]);

      const userprofilePromises = [
        apiConnection.getTargetUserInfo(userprofileAddress, address || userprofileAddress),
        apiConnection.getUserPointLite(userprofileAddress),
        apiConnection.getAbsPnlLeaderboard(userprofileAddress),
        getAllTraderPositionHistory(userprofileAddress, 500, 0),
        // apiConnection.getUserTradingHistory(userprofileAddress),
        apiConnection.getUserFollowings(userprofileAddress, address || userprofileAddress),
        apiConnection.getUserFollowers(userprofileAddress, address || userprofileAddress)
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
        $userHistories.set(userPositionHistoryRes.value);
      }
      if (userFollowingsRes.status === 'fulfilled') {
        $userFollowings.set(userFollowingsRes.value.data);
      }
      if (userFollowersRes.status === 'fulfilled') {
        $userFollowers.set(userFollowersRes.value.data);
      }

      // console.log({ $userInfo: $userInfo.get() });
      // console.log({ $userAirdropRank: $userAirdropRank.get() });
      // console.log({ $userCompetitionRank: $userCompetitionRank.get() });
      // console.log({ $userHistories: $userHistories.get() });
      // console.log({ $userFollowings: $userFollowings.get() });
      // console.log({ $userFollowers: $userFollowers.get() });
      // console.log({ $userprofilePositionInfos: $userprofilePositionInfos.get() });

      // console.log($userHistories.get()[150]);
      // getTradingActionTypeFromSubgraph($userHistories.get()[150]);

      $isUserprofileLoading.set(false);
    }

    if (userprofileAddress !== '') {
      fetchData();
      setAmms(getSupportedAMMs(chain));
    }
  }, [userprofileAddress]);

  if (!amms || !userprofileAddress) return null;

  return (
    <>
      {amms.map(amm => {
        const ammAddr = getAMMAddress(chain, amm);
        if (ammAddr) {
          return <PositionInfoUpdater key={amm} chain={chain} amm={amm} ammAddress={ammAddr} trader={userprofileAddress} />;
        }
        return null;
      })}
    </>
  );
}

export default UserprofileUpdater;
