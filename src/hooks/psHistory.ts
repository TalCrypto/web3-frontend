import { getAMMByAddress } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { apiConnection } from '@/utils/apiConnection';
import { useEffect, useState } from 'react';
import { Address, getAddress } from 'viem';
import { useAccount, useNetwork } from 'wagmi';

export interface PositionHistoryRecord {
  amm: AMM;
  txHash: string;
  entryPrice: number;
  ammAddress: Address;
  timestamp: number;
  amount: number;
  collateralChange: number;
  margin: number;
  previousMargin: number;
  fundingPayment: number;
  type: string;
  exchangedPositionSize: number;
  positionSizeAfter: number;
  positionNotional: number;
  fee: number;
  realizedPnl: number;
  totalFundingPayment: number;
  notionalChange: number;
  liquidationPenalty: number;
  badDebt: number;
  openNotional: number;
  previousOpenNotional: number;
}

// notice don't use store for history
export const usePositionHistory = (): Array<PositionHistoryRecord> => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [history, setHistory] = useState<Array<PositionHistoryRecord>>([]);
  useEffect(() => {
    if (address && chain) {
      apiConnection.getUserTradingHistory(address).then(res => {
        const data = res.data.tradeHistory.map(
          (item: {
            txHash: string;
            entryPrice: string;
            ammAddress: string;
            timestamp: number;
            amount: string;
            collateralChange: string;
            margin: string;
            previousMargin: string;
            fundingPayment: string;
            type: string;
            exchangedPositionSize: string;
            positionSizeAfter: string;
            positionNotional: string;
            fee: string;
            realizedPnl: string;
            totalFundingPayment: string;
            notionalChange: string;
            liquidationPenalty: string;
            badDebt: string;
            openNotional: string;
            previousOpenNotional: string;
          }) => ({
            amm: getAMMByAddress(chain, getAddress(item.ammAddress)),
            txHash: String(item.txHash),
            entryPrice: Number(BigInt(item.entryPrice) / BigInt(1e18)),
            ammAddress: getAddress(item.ammAddress),
            timestamp: Number(item.timestamp),
            amount: Number(BigInt(item.amount) / BigInt(1e18)),
            collateralChange: Number(BigInt(item.collateralChange) / BigInt(1e18)),
            margin: Number(BigInt(item.margin) / BigInt(1e18)),
            previousMargin: Number(BigInt(item.previousMargin) / BigInt(1e18)),
            fundingPayment: Number(BigInt(item.fundingPayment) / BigInt(1e18)),
            type: String(item.type),
            exchangedPositionSize: Number(BigInt(item.exchangedPositionSize) / BigInt(1e18)),
            positionSizeAfter: Number(BigInt(item.positionSizeAfter) / BigInt(1e18)),
            positionNotional: Number(BigInt(item.positionNotional) / BigInt(1e18)),
            fee: Number(BigInt(item.fee) / BigInt(1e18)),
            realizedPnl: Number(BigInt(item.realizedPnl) / BigInt(1e18)),
            totalFundingPayment: Number(BigInt(item.totalFundingPayment) / BigInt(1e18)),
            notionalChange: Number(BigInt(item.notionalChange) / BigInt(1e18)),
            liquidationPenalty: Number(BigInt(item.liquidationPenalty) / BigInt(1e18)),
            badDebt: Number(BigInt(item.badDebt) / BigInt(1e18)),
            openNotional: Number(BigInt(item.openNotional) / BigInt(1e18)),
            previousOpenNotional: Number(BigInt(item.previousOpenNotional) / BigInt(1e18))
          })
        );
        setHistory(data);
      });
    }
  }, [address, chain]);
  return history;
};

export const usePsHistoryByMonth = (): { [key: string]: Array<PositionHistoryRecord> } => {
  const history = usePositionHistory();
  const [psHistoryByMonth, setPsHisotryMyMonth] = useState<{ [key: string]: Array<PositionHistoryRecord> }>({});
  useEffect(() => {
    const historyGroupByMonth = history
      .sort((a, b) => b.timestamp - a.timestamp)
      .reduce((group: { [key: string]: Array<PositionHistoryRecord> }, record: PositionHistoryRecord) => {
        const date = new Date(record.timestamp * 1000);
        const month = `${`0${date.getMonth()}`.substring(-2)}/${date.getFullYear()}`;
        const res = group;
        res[month] = res[month] ?? [];
        res[month].push(record);
        return res;
      }, {});
    setPsHisotryMyMonth(historyGroupByMonth);
  }, [history]);
  return psHistoryByMonth;
};
