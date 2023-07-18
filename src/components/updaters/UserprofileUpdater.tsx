/* eslint-disable no-unused-vars */
import { useStore as useNanostore } from '@nanostores/react';
import { useEffect } from 'react';
import { apiConnection } from '@/utils/apiConnection';
import { useAccount } from 'wagmi';
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
  $userPosition,
  $userprofileAddress
} from '@/stores/userprofile';
import { getAllTraderPositionHistory } from '@/utils/trading';

function UserprofileUpdater() {
  const trigger = useNanostore($userprofileAddress);
  const { address } = useAccount();

  useEffect(() => {
    async function fetchData() {
      // set store to default
      $isUserprofileLoading.set(true);
      // $userprofileAddress.set('');
      $userInfo.set(null);
      $userAirdropRank.set(null);
      $userCompetitionRank.set(null);
      $userPosition.set(null);
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

      $isUserprofileLoading.set(false);
    }

    if (trigger !== '') {
      fetchData();
    }
  }, [trigger]);

  return null;
}

export default UserprofileUpdater;
