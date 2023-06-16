import { getAMMAddress } from '@/const/addresses';
import { $chartData, $currentAmm, $dailyVolume, $isChartDataInitializing, $selectedTimeIndex } from '@/stores/trading';
import { formatBigIntString } from '@/utils/bigInt';
import {
  getDailySpotPriceGraphData,
  getMonthlySpotPriceGraphData,
  getThreeMonthlySpotPriceGraphData,
  getWeeklySpotPriceGraphData
} from '@/utils/trading';
import { useStore as useNanostore } from '@nanostores/react';
import { useEffect } from 'react';
import { useNetwork } from 'wagmi';

const ChartDataUpdater = () => {
  const { chain } = useNetwork();
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
          dailyVolume = formatBigIntString(chartData.volume.toString());
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
            avgPrice: formatBigIntString(avgPrice.toString()),
            open: formatBigIntString(open.toString()),
            close: formatBigIntString(close.toString()),
            start,
            end
          })),
          priceChangeValue: formatBigIntString(chartData.priceChangeValue.toString()),
          priceChangeRatio: formatBigIntString(chartData.priceChangeRatio.toString()),
          high: formatBigIntString(chartData.high.toString()),
          low: formatBigIntString(chartData.low.toString()),
          volume: formatBigIntString(chartData.volume.toString())
        });
        if (!dailyVolume) {
          const data = await getDailySpotPriceGraphData(ammAddr);
          dailyVolume = formatBigIntString(data.volume.toString());
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
