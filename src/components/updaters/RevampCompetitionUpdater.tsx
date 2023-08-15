import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { useAccount } from 'wagmi';
import { tradingCompetitionApi } from '@/utils/apiConnects/tradingCompetitionApi';
import {
  $isDataLoading,
  $topFundingPaymentUserItem,
  $topFundingPaymentRankingList,
  $topGainerRankingList,
  $topGainerUserItem,
  $topReferrerRankingList,
  $topReferrerUserItem,
  $topVolumeRankingList,
  $topVolumeUserItem,
  $referralTeamList,
  $referralUserItem,
  $myRefererTeamList,
  $myRefererUserItem,
  $userVolumeList
} from '@/stores/revampCompetition';

const getWeekInfo = (inputTimestamp: number) => {
  const COMPETITION_START_TIME = 1686042000;
  const constantTimestamp = COMPETITION_START_TIME;
  const weekDuration = 7 * 24 * 60 * 60; // 7 days in seconds
  const weekOffset = Math.floor((inputTimestamp - constantTimestamp) / weekDuration);

  const weekStartTimestamp = constantTimestamp + weekOffset * weekDuration;
  const weekEndTimestamp = weekStartTimestamp + weekDuration - 1;

  const weekNumber = weekOffset;

  return {
    weekNumber,
    weekStart: weekStartTimestamp,
    weekEnd: weekEndTimestamp
  };
};

function RevampCompetitionUpdater() {
  const { address } = useAccount();

  const currentTime = Date.now() / 1000;
  const currentWeek = getWeekInfo(currentTime);

  async function fetchData() {
    $isDataLoading.set(true);

    const promises = [
      tradingCompetitionApi.getTopFp(address),
      tradingCompetitionApi.getTopGainer(address),
      tradingCompetitionApi.getTopReferrer(address),
      tradingCompetitionApi.getTopVolume(address, 1),
      tradingCompetitionApi.getReferrerTeamList(address),
      tradingCompetitionApi.getMyRefereeTeamList(address)
    ];

    const [topFpRes, topGainerRes, topReferrerRes, topVolRes, referrerTeamRes, myRefererRes] = await Promise.allSettled(promises);

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
      $referralTeamList.set(referrerTeam?.referees);
      if (address) {
        $referralUserItem.set(referrerTeam?.user);
      } else {
        $referralUserItem.set(null);
      }
    }

    if (myRefererRes.status === 'fulfilled') {
      const myReferer = myRefererRes.value;
      $myRefererTeamList.set(myReferer?.referees);
      if (address) {
        $myRefererUserItem.set(myReferer?.user);
      } else {
        $myRefererUserItem.set(null);
      }
    }

    $isDataLoading.set(false);
  }

  useEffect(() => {
    fetchData();
  }, [address]);

  return null;
}

export default RevampCompetitionUpdater;
