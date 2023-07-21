import { useStore as useNanostore } from '@nanostores/react';
import { useEffect } from 'react';
import { apiConnection } from '@/utils/apiConnection';
import {
  $asCompetitionLeaderboardUpdateTrigger,
  $firstLeaderboard,
  $flCurrentUser,
  $isCompetitionLeaderboardLoading,
  $mainLeaderboard,
  $mlCurrentUser,
  $secondLeaderboard,
  $slCurrentUser,
  $thirdLeaderboard,
  $tlCurrentUser
} from '@/stores/competition';
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

      const [absPnlLboardRes, realizedPnlPctLboardRes, netConvergenceLboardRes, losersLboardRes] = await Promise.allSettled(
        leaderboardPromises
      );

      if (absPnlLboardRes.status === 'fulfilled') {
        const absPnlLboardData = absPnlLboardRes.value;
        console.log({ absPnlLboardRes });
        $mainLeaderboard.set(absPnlLboardData?.leaderboard);
        if (address) {
          $mlCurrentUser.set(absPnlLboardData?.user);
        } else {
          $mlCurrentUser.set(null);
        }
      }

      if (realizedPnlPctLboardRes.status === 'fulfilled') {
        const realizedPnlPctLboardData = realizedPnlPctLboardRes.value;
        $firstLeaderboard.set(realizedPnlPctLboardData?.leaderboard);
        if (address) {
          $flCurrentUser.set(realizedPnlPctLboardData?.user);
        } else {
          $flCurrentUser.set(null);
        }
      }

      if (netConvergenceLboardRes.status === 'fulfilled') {
        const netConvergenceLboardData = netConvergenceLboardRes.value;
        $secondLeaderboard.set(netConvergenceLboardData?.leaderboard);
        if (address) {
          $slCurrentUser.set(netConvergenceLboardData?.user);
        } else {
          $slCurrentUser.set(null);
        }
      }

      if (losersLboardRes.status === 'fulfilled') {
        const losersLboardData = losersLboardRes.value;
        $thirdLeaderboard.set(losersLboardData?.leaderboard);
        if (address) {
          $tlCurrentUser.set(losersLboardData?.user);
        } else {
          $tlCurrentUser.set(null);
        }
      }

      setTimeout(() => {
        $isCompetitionLeaderboardLoading.set(false);
      }, 500);
    }

    fetchData();
  }, [trigger]);

  return null;
}

export default CompetitionDataUpdater;
