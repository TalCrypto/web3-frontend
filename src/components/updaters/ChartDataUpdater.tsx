import { getAMMAddress } from '@/const/addresses';
import { $chartData, $currentAmm, $dailyVolume, $isChartDataInitializing, $selectedTimeIndex } from '@/stores/trading';
import { $currentChain } from '@/stores/user';
import { formatBigInt } from '@/utils/bigInt';
import {
  getDailySpotPriceGraphData,
  getMonthlySpotPriceGraphData,
  getThreeMonthlySpotPriceGraphData,
  getWeeklySpotPriceGraphData
} from '@/utils/trading';
import { useStore as useNanostore } from '@nanostores/react';
import { useEffect } from 'react';

const ChartDataUpdater = () => {
  const chain = useNanostore($currentChain);
  const currentAmm = useNanostore($currentAmm);
  const selectedTimeIndex = useNanostore($selectedTimeIndex);

  useEffect(() => {
    async function updateChart() {
      let chartData: {
        graphData: Array<{ round: number; avgPrice: bigint; open: bigint; close: bigint; start: number; end: number }>;
        priceChangeValue: bigint;
        priceChangeRatio: bigint;
        high: bigint;
        low: bigint;
        volume: bigint;
      };
      let dailyVolume: number = 0;
      if (chain && currentAmm) {
        const ammAddr = getAMMAddress(chain, currentAmm);
        if (!ammAddr) return;
        if (selectedTimeIndex === 0) {
          chartData = await getDailySpotPriceGraphData(ammAddr);
          dailyVolume = formatBigInt(chartData.volume.toString());
        } else if (selectedTimeIndex === 1) {
          chartData = await getWeeklySpotPriceGraphData(ammAddr);
        } else if (selectedTimeIndex === 2) {
          chartData = await getMonthlySpotPriceGraphData(ammAddr);
        } else {
          chartData = await getThreeMonthlySpotPriceGraphData(ammAddr);
        }
        $chartData.set({
          data: chartData.graphData.map(({ round, avgPrice, open, close, start, end }) => ({
            round,
            avgPrice: formatBigInt(avgPrice.toString()),
            open: formatBigInt(open.toString()),
            close: formatBigInt(close.toString()),
            start,
            end
          })),
          priceChangeValue: formatBigInt(chartData.priceChangeValue.toString()),
          priceChangeRatio: formatBigInt(chartData.priceChangeRatio.toString()),
          high: formatBigInt(chartData.high.toString()),
          low: formatBigInt(chartData.low.toString()),
          volume: formatBigInt(chartData.volume.toString())
        });
        if (!dailyVolume) {
          const data = await getDailySpotPriceGraphData(ammAddr);
          dailyVolume = formatBigInt(data.volume.toString());
        }
        $dailyVolume.set(dailyVolume);
      }
    }
    $isChartDataInitializing.set(true);
    updateChart().then(() => {
      $isChartDataInitializing.set(false);
    });
    const timer = setInterval(updateChart, 5000);
    return () => {
      clearInterval(timer);
    };
  }, [selectedTimeIndex, currentAmm, chain]);

  return null;
};

export default ChartDataUpdater;
