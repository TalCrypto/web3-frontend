import { getAddressConfig } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { apiConnection } from '@/utils/apiConnection';
import { formatBigInt } from '@/utils/bigInt';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export interface FundingPaymentRecord {
  timestamp: number;
  fundingPaymentPnl: number;
}

export const useFundingPaymentHistory = (amm: AMM) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [fpRecords, setFpRecords] = useState<Array<FundingPaymentRecord>>();
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    if (address && chain && !chain.unsupported) {
      const { config: addressConfig } = getAddressConfig(chain);
      const ammAddress = addressConfig.amms[amm];
      if (ammAddress) {
        apiConnection.getUserFundingPaymentHistoryWithAmm(address, ammAddress).then(res => {
          setTotal(formatBigInt(res.data.total));
          setFpRecords(
            res.data.fundingPaymentPnlHistory.map((item: { timestamp: number; fundingPaymentPnl: string }) => ({
              timestamp: Number(item.timestamp),
              fundingPaymentPnl: formatBigInt(item.fundingPaymentPnl)
            }))
          );
        });
      }
    }
  }, [address, chain, amm]);
  return { total, fpRecords };
};
