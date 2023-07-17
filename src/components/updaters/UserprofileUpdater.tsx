import { useStore as useNanostore } from '@nanostores/react';
import { useEffect } from 'react';
import { apiConnection } from '@/utils/apiConnection';
import { useAccount } from 'wagmi';
import { $isUserprofileLoading, $userprofileAddress } from '@/stores/userprofile';

function CompetitionDataUpdater() {
  const trigger = useNanostore($userprofileAddress);
  const { address } = useAccount();

  useEffect(() => {
    async function fetchData() {
      $isUserprofileLoading.set(true);
      const leaderboardPromises = [
        apiConnection.getAbsPnlLeaderboard(address),
        apiConnection.getRealizedPnlPercentageLeaderboard(address),
        apiConnection.getNetConvergenceLeaderboard(address),
        apiConnection.getTopLosersLeaderboard(address)
      ];

      await Promise.allSettled(leaderboardPromises);

      $isUserprofileLoading.set(false);
    }

    fetchData();
  }, [trigger]);

  return null;
}

export default CompetitionDataUpdater;
