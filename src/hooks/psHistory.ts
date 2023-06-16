import { getAMMByAddress } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { apiConnection } from '@/utils/apiConnection';
import { formatBigInt } from '@/utils/bigInt';
import { useEffect, useState } from 'react';
import { Address, getAddress } from 'viem';
import { useStore as useNanostore } from '@nanostores/react';
import { $userAddress, $currentChain } from '@/stores/user';

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
  const address = useNanostore($userAddress);
  const chain = useNanostore($currentChain);
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
            entryPrice: formatBigInt(item.entryPrice),
            ammAddress: getAddress(item.ammAddress),
            timestamp: Number(item.timestamp),
            amount: formatBigInt(item.amount),
            collateralChange: formatBigInt(item.collateralChange),
            margin: formatBigInt(item.margin),
            previousMargin: formatBigInt(item.previousMargin),
            fundingPayment: formatBigInt(item.fundingPayment),
            type: String(item.type),
            exchangedPositionSize: formatBigInt(item.exchangedPositionSize),
            positionSizeAfter: formatBigInt(item.positionSizeAfter),
            positionNotional: formatBigInt(item.positionNotional),
            fee: formatBigInt(item.fee),
            realizedPnl: formatBigInt(item.realizedPnl),
            totalFundingPayment: formatBigInt(item.totalFundingPayment),
            notionalChange: formatBigInt(item.notionalChange),
            liquidationPenalty: formatBigInt(item.liquidationPenalty),
            badDebt: formatBigInt(item.badDebt),
            openNotional: formatBigInt(item.openNotional),
            previousOpenNotional: formatBigInt(item.previousOpenNotional)
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
