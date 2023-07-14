import { useStore as useNanostore } from '@nanostores/react';
import { useEffect } from 'react';
import { apiConnection } from '@/utils/apiConnection';
import { $asCompetitionLeaderboardUpdateTrigger, $isCompetitionLeaderboardLoading } from '@/stores/competition';
import { useAccount } from 'wagmi';

function CompetitionDataUpdater() {
  const trigger = useNanostore($asCompetitionLeaderboardUpdateTrigger);
  const { address } = useAccount();

  useEffect(() => {
    async function fetchData() {
      $isCompetitionLeaderboardLoading.set(true);
      const leaderboardPromises = [
        apiConnection.getAbsPnlLeaderboard(address),
        apiConnection.getRealizedPnlPercentageLeaderboard(address),
        apiConnection.getNetConvergenceLeaderboard(address),
        apiConnection.getTopLosersLeaderboard(address)
      ];

      await Promise.allSettled(leaderboardPromises);

      setTimeout(() => {
        $isCompetitionLeaderboardLoading.set(false);
      }, 500);
    }

    fetchData();
  }, [trigger]);

  return null;
}

export default CompetitionDataUpdater;
