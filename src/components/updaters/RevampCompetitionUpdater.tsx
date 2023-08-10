import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { useAccount } from 'wagmi';
import { tradingCompetitionApi } from '@/utils/apiConnects/tradingCompetitionApi';
import {
  $isDataLoading,
  $triggerKey,
  $topFundingPaymentUserItem,
  $topFundingPaymentRankingList,
  $topGainerRankingList,
  $topGainerUserItem,
  $topReferrerRankingList,
  $topReferrerUserItem,
  $topVolumeRankingList,
  $topVolumeUserItem,
  $referralTeamList,
  $referralUserItem
} from '@/stores/revampCompetition';

function RevampCompetitionUpdater() {
  const { address } = useAccount();
  const triggerKey = useStore($triggerKey);

  async function fetchData() {
    $isDataLoading.set(true);

    const promises = [
      tradingCompetitionApi.getTopFp(address),
      tradingCompetitionApi.getTopGainer(address),
      tradingCompetitionApi.getTopReferrer(address),
      tradingCompetitionApi.getTopVolume(address, 1),
      tradingCompetitionApi.getReferrerTeamList(address)
    ];

    const [topFpRes, topGainerRes, topReferrerRes, topVolRes, referrerTeamRes] = await Promise.allSettled(promises);

    if (topFpRes.status === 'fulfilled') {
      const topFp = topFpRes.value;
      $topFundingPaymentRankingList.set(topFp?.leaderboard);
      if (address) {
        $topFundingPaymentUserItem.set(topFp?.user);
      } else {
        $topFundingPaymentUserItem.set(null);
      }
    }

    if (topGainerRes.status === 'fulfilled') {
      const topGainer = topGainerRes.value;
      $topGainerRankingList.set(topGainer?.leaderboard);
      if (address) {
        $topGainerUserItem.set(topGainer?.user);
      } else {
        $topGainerUserItem.set(null);
      }
    }

    if (topReferrerRes.status === 'fulfilled') {
      const topReferrer = topReferrerRes.value;
      $topReferrerRankingList.set(topReferrer?.leaderboard);
      if (address) {
        $topReferrerUserItem.set(topReferrer?.user);
      } else {
        $topReferrerUserItem.set(null);
      }
    }

    if (topVolRes.status === 'fulfilled') {
      const topVolume = topVolRes.value;
      $topVolumeRankingList.set(topVolume?.leaderboard);
      if (address) {
        $topVolumeUserItem.set(topVolume?.user);
      } else {
        $topVolumeUserItem.set(null);
      }
    }

    if (referrerTeamRes.status === 'fulfilled') {
      const referrerTeam = referrerTeamRes.value;
      console.log({ referrerTeam });
      $referralTeamList.set(referrerTeam?.referees);
      if (address) {
        $referralUserItem.set(referrerTeam?.user);
      } else {
        $referralUserItem.set(null);
      }
    }

    $isDataLoading.set(false);
  }

  useEffect(() => {
    fetchData();
  }, [triggerKey]);

  return null;
}

export default RevampCompetitionUpdater;
