import { getAMMAddress } from '@/const/addresses';
import { collectionsInfos } from '@/const/collectionList';
import { $OracleGraphData, $currentAmm, $dailyVolume, $ohlcData, $selectedTimeIndex, addGraphRecord } from '@/stores/trading';
import { $currentChain } from '@/stores/user';
import { formatBigInt } from '@/utils/bigInt';
import {
  getDailyOraclePriceGraphData,
  getDailySpotPriceGraphData,
  getMonthlyOraclePriceGraphData,
  getMonthlySpotPriceGraphData,
  getThreeMonthlyOraclePriceGraphData,
  getThreeMonthlySpotPriceGraphData,
  getWeeklyOraclePriceGraphData,
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
    async function loadData() {
      let chartOracleData;
      let chartData;
      let dailyVolume: number = 0;
      if (currentAmm) {
        const ammAddr = getAMMAddress(chain, currentAmm);
        const ammOracleAddr = collectionsInfos[currentAmm].contract;

        if (!ammAddr) return;
        if (selectedTimeIndex === 0) {
          chartData = await getDailySpotPriceGraphData(ammAddr);
          chartOracleData = await getDailyOraclePriceGraphData(ammOracleAddr);
          dailyVolume = formatBigInt(chartData.reduce((vol: bigint, item: any) => vol + item.volume, 0n));
        } else if (selectedTimeIndex === 1) {
          chartData = await getWeeklySpotPriceGraphData(ammAddr);
          const dailyData = await getDailySpotPriceGraphData(ammAddr);
          chartOracleData = await getWeeklyOraclePriceGraphData(ammOracleAddr);
          dailyVolume = formatBigInt(dailyData.reduce((vol: bigint, item: any) => vol + item.volume, 0n));
        } else if (selectedTimeIndex === 2) {
          chartData = await getMonthlySpotPriceGraphData(ammAddr);
          const dailyData = await getDailySpotPriceGraphData(ammAddr);
          chartOracleData = await getMonthlyOraclePriceGraphData(ammOracleAddr);
          dailyVolume = formatBigInt(dailyData.reduce((vol: bigint, item: any) => vol + item.volume, 0n));
        } else {
          chartData = await getThreeMonthlySpotPriceGraphData(ammAddr);
          const dailyData = await getDailySpotPriceGraphData(ammAddr);
          chartOracleData = await getThreeMonthlyOraclePriceGraphData(ammOracleAddr);
          dailyVolume = formatBigInt(dailyData.reduce((vol: bigint, item: any) => vol + item.volume, 0n));
        }
        $ohlcData.set(
          chartData.map(
            (record: { start: number; end: number; high: bigint; low: bigint; open: bigint; close: bigint; volume: bigint }) => ({
              time: record.start as Time,
              high: formatBigInt(record.high),
              low: formatBigInt(record.low),
              open: formatBigInt(record.open),
              close: formatBigInt(record.close)
              // volume: formatBigInt(record.volume)
            })
          )
        );
        $dailyVolume.set(dailyVolume);
        // console.log({ chartOracleData });
        $OracleGraphData.set(
          chartOracleData.map(
            (record: { start: number; end: number; high: bigint; low: bigint; open: bigint; close: bigint; volume: bigint }) => ({
              time: record.start as Time,
              high: formatBigInt(record.high),
              low: formatBigInt(record.low),
              open: formatBigInt(record.open),
              close: formatBigInt(record.close)
              // volume: formatBigInt(record.volume)
            })
          )
        );
      }
    }
    $ohlcData.set([]);
    $dailyVolume.set(undefined);
    $OracleGraphData.set([]);
    loadData();
  }, [selectedTimeIndex, currentAmm, chain]);

  useEffect(() => {
    const timer = setInterval(addGraphRecord, 30000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return null;
};

export default ChartDataUpdater;
