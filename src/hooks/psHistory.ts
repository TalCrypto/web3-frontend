import { getAMMByAddress } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { apiConnection } from '@/utils/apiConnection';
import { formatBigIntString } from '@/utils/bigInt';
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
    if (address && chain && !chain.unsupported) {
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
            entryPrice: formatBigIntString(item.entryPrice),
            ammAddress: getAddress(item.ammAddress),
            timestamp: Number(item.timestamp),
            amount: formatBigIntString(item.amount),
            collateralChange: formatBigIntString(item.collateralChange),
            margin: formatBigIntString(item.margin),
            previousMargin: formatBigIntString(item.previousMargin),
            fundingPayment: formatBigIntString(item.fundingPayment),
            type: String(item.type),
            exchangedPositionSize: formatBigIntString(item.exchangedPositionSize),
            positionSizeAfter: formatBigIntString(item.positionSizeAfter),
            positionNotional: formatBigIntString(item.positionNotional),
            fee: formatBigIntString(item.fee),
            realizedPnl: formatBigIntString(item.realizedPnl),
            totalFundingPayment: formatBigIntString(item.totalFundingPayment),
            notionalChange: formatBigIntString(item.notionalChange),
            liquidationPenalty: formatBigIntString(item.liquidationPenalty),
            badDebt: formatBigIntString(item.badDebt),
            openNotional: formatBigIntString(item.openNotional),
            previousOpenNotional: formatBigIntString(item.previousOpenNotional)
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
