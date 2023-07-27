import { useStore as useNanostore } from '@nanostores/react';
import {
  $asLeaderboardUpdateTrigger,
  $asIsLeaderboardLoading,
  $asSeason2LeaderboardData,
  $asSeason1LeaderboardData
} from '@/stores/airdrop';
import { useEffect } from 'react';
import { apiConnection } from '@/utils/apiConnection';

function LeaderboardDataUpdater() {
  const trigger = useNanostore($asLeaderboardUpdateTrigger);

  useEffect(() => {
    async function fetchData() {
      $asIsLeaderboardLoading.set(true);
      const season2Data: any = await apiConnection.getLeaderboard(0);
      const season1Data: any = await apiConnection.getLeaderboard(1);

      $asSeason2LeaderboardData.set(season2Data);
      $asSeason1LeaderboardData.set(season1Data);
      $asIsLeaderboardLoading.set(false);
    }

    fetchData();
  }, [trigger]);

  return null;
}

export default LeaderboardDataUpdater;
