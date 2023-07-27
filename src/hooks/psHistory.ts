import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $userPositionHistory, PositionHistoryRecord } from '@/stores/user';
import { $currentAmm } from '@/stores/trading';

export const usePsHistoryByMonth = () => {
  const history = useNanostore($userPositionHistory);
  const currentAmm = useNanostore($currentAmm);
  const [psHistoryByMonth, setPsHistoryByMonth] = useState<{ [key: string]: Array<PositionHistoryRecord> }>({});
  const [psAmmHistoryByMonth, setPsAmmHistoryByMonth] = useState<{ [key: string]: Array<PositionHistoryRecord> }>({});

  useEffect(() => {
    const currentHistoryByMonth: any = {};

    const historyGroupByMonth = history
      .sort((a, b) => b.timestamp - a.timestamp)
      .reduce((group: { [key: string]: Array<PositionHistoryRecord> }, record: PositionHistoryRecord) => {
        const date = new Date(record.timestamp * 1000);
        const month = `${`0${date.getMonth() + 1}`.slice(-2)}/${date.getFullYear()}`;
        const res = group;
        res[month] = res[month] ?? [];
        res[month].push(record);

        if (currentAmm && record.amm && record.amm.toLowerCase() === currentAmm.toLowerCase()) {
          currentHistoryByMonth[month] = currentHistoryByMonth[month] ?? [];
          currentHistoryByMonth[month].push(record);
        }

        return res;
      }, {});
    setPsHistoryByMonth(historyGroupByMonth);
    setPsAmmHistoryByMonth(currentHistoryByMonth);
  }, [history, currentAmm]);
  return { psHistoryByMonth, psAmmHistoryByMonth };
};
