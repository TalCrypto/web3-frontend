/* eslint-disable operator-linebreak */
/* eslint-disable indent */
import { getAddressConfig } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { apiConnection } from '@/utils/apiConnection';
import { formatBigInt } from '@/utils/bigInt';
import { useEffect, useState } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentChain, $userAddress } from '@/stores/user';

export interface FundingPaymentRecord {
  timestamp: number;
  fundingPaymentPnl: number;
}

export const useFundingPaymentHistory = (amm: AMM) => {
  const address = useNanostore($userAddress);
  const chain = useNanostore($currentChain);
  const [fpRecords, setFpRecords] = useState<Array<FundingPaymentRecord>>();
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    if (address) {
      const { config: addressConfig } = getAddressConfig(chain);
      const ammAddress = addressConfig.amms[amm];
      if (ammAddress) {
        apiConnection.getUserFundingPaymentHistoryWithAmm(address, ammAddress).then(res => {
          setTotal(formatBigInt(res.data.total));
          setFpRecords(
            Array.isArray(res.data.fundingPaymentPnlHistory)
              ? res.data.fundingPaymentPnlHistory.map((item: { timestamp: number; fundingPaymentPnl: string }) => ({
                  timestamp: Number(item.timestamp),
                  fundingPaymentPnl: formatBigInt(item.fundingPaymentPnl)
                }))
              : []
          );
        });
      }
    }
  }, [address, chain, amm]);
  return { total, fpRecords };
};
