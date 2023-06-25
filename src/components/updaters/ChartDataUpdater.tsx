import { getAMMAddress } from '@/const/addresses';
import { $currentAmm, $dailyVolume, $graphData, $isChartDataInitializing, $selectedTimeIndex } from '@/stores/trading';
import { $currentChain } from '@/stores/user';
import { formatBigInt } from '@/utils/bigInt';
import {
  getDailySpotPriceGraphData,
  getMonthlySpotPriceGraphData,
  getThreeMonthlySpotPriceGraphData,
  getWeeklySpotPriceGraphData
} from '@/utils/trading';
import { useStore as useNanostore } from '@nanostores/react';
import { Time } from 'lightweight-charts';
import { useEffect } from 'react';

const ChartDataUpdater = () => {
  const chain = useNanostore($currentChain);
  const currentAmm = useNanostore($currentAmm);
  const selectedTimeIndex = useNanostore($selectedTimeIndex);

  useEffect(() => {
    async function updateChart() {
      let chartData;
      let dailyVolume: number = 0;
      if (currentAmm) {
        const ammAddr = getAMMAddress(chain, currentAmm);
        if (!ammAddr) return;
        if (selectedTimeIndex === 0) {
          chartData = await getDailySpotPriceGraphData(ammAddr);
          dailyVolume = formatBigInt(chartData.reduce((vol, item) => vol + item.volume, 0n));
        } else if (selectedTimeIndex === 1) {
          chartData = await getWeeklySpotPriceGraphData(ammAddr);
          const dailyData = await getDailySpotPriceGraphData(ammAddr);
          dailyVolume = formatBigInt(dailyData.reduce((vol, item) => vol + item.volume, 0n));
        } else if (selectedTimeIndex === 2) {
          chartData = await getMonthlySpotPriceGraphData(ammAddr);
          const dailyData = await getDailySpotPriceGraphData(ammAddr);
          dailyVolume = formatBigInt(dailyData.reduce((vol, item) => vol + item.volume, 0n));
        } else {
          chartData = await getThreeMonthlySpotPriceGraphData(ammAddr);
          const dailyData = await getDailySpotPriceGraphData(ammAddr);
          dailyVolume = formatBigInt(dailyData.reduce((vol, item) => vol + item.volume, 0n));
        }
        $graphData.set(
          chartData.map(
            (record: { start: number; end: number; high: bigint; low: bigint; open: bigint; close: bigint; volume: bigint }) => ({
              time: record.start as Time,
              high: formatBigInt(record.high),
              low: formatBigInt(record.low),
              open: formatBigInt(record.open),
              close: formatBigInt(record.close),
              volume: formatBigInt(record.volume)
            })
          )
        );
        $dailyVolume.set(dailyVolume);
      }
    }
    $isChartDataInitializing.set(true);
    $graphData.set([]);
    $dailyVolume.set(undefined);
    updateChart().then(() => {
      $isChartDataInitializing.set(false);
    });
  }, [selectedTimeIndex, currentAmm, chain]);

  return null;
};

export default ChartDataUpdater;
