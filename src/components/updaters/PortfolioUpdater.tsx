import { apiConnection } from '@/utils/apiConnection';
import { useEffect } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userAddress } from '@/stores/user';
import { $accumulatedDailyPnl, $psHistogramChartData, $psLineChartData, $psLiqSwitchRatio, $psSelectedTimeIndex } from '@/stores/portfolio';
import { formatBigInt } from '@/utils/bigInt';
import { usePublicClient } from 'wagmi';
import { getCHContract } from '@/const/contracts';
import { chAbi } from '@/const/abi';

const PortfolioUpdater = () => {
  const address = useNanostore($userAddress);
  const selectedTimeIndex = useNanostore($psSelectedTimeIndex);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (address) {
      apiConnection.getWalletChartContent(address, selectedTimeIndex).then((data: any) => {
        const accumulatedPnlData: any = [];
        const dailyPnlData: any = [];
        let accumulatedDailyPnl = 0;

        data.forEach((item: any) => {
          const { time, accumulatedPnl, dailyPnl } = item;
          accumulatedPnlData.push({
            time,
            value: Number(formatBigInt(accumulatedPnl).toFixed(4))
          });
          dailyPnlData.push({
            time,
            value: Number(formatBigInt(dailyPnl).toFixed(4)),
            color: formatBigInt(dailyPnl) === 0.0 ? 'rgba(125, 125, 125, 0.3)' : formatBigInt(dailyPnl) > 0 ? '#78f363' : '#ff5656'
          });
          accumulatedDailyPnl += formatBigInt(dailyPnl);
        });

        $psLineChartData.set(accumulatedPnlData);
        $psHistogramChartData.set(dailyPnlData);
        $accumulatedDailyPnl.set(Number(accumulatedDailyPnl.toFixed(4)));
      });
    }
  }, [selectedTimeIndex, address]);

  useEffect(() => {
    async function getLiqSwitchRatio() {
      const ch = getCHContract();
      const liqSwitchRatioBn = await publicClient.readContract({
        address: ch.address,
        abi: chAbi,
        functionName: 'LIQ_SWITCH_RATIO'
      });
      $psLiqSwitchRatio.set(formatBigInt(liqSwitchRatioBn));
    }
    if (publicClient) {
      getLiqSwitchRatio();
    }
  }, [publicClient]);

  return null;
};

export default PortfolioUpdater;
