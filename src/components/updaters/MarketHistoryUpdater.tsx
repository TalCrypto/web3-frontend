/* eslint-disable operator-linebreak */
import { useEffect } from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm, $fundingRatesHistory, $futureMarketHistory, $spotMarketHistory, addGraphRecord } from '@/stores/trading';
import { getAMMAddress, getAMMByAddress } from '@/const/addresses';
import { getFundingPaymentHistory, getMarketHistory } from '@/utils/trading';
import { formatBigInt } from '@/utils/bigInt';
import { getAddress, zeroAddress } from 'viem';
import { getBaycFromMainnet } from '@/utils/opensea';
import { $currentChain, $userAddress } from '@/stores/user';
import { useContractEvent } from 'wagmi';
import { getAMMContract, getCHContract } from '@/const/contracts';
import { ammAbi, chAbi } from '@/const/abi';
import { apiConnection } from '@/utils/apiConnection';
import { getCollateralActionType, getTradingActionType } from '@/utils/actionType';
import { showToast } from '@/components/common/Toast';
import { getCollectionInformation } from '@/const/collectionList';

const MarketHistoryUpdater = () => {
  const currentAmm = useNanostore($currentAmm);
  const chain = useNanostore($currentChain);
  const address = useNanostore($userAddress);

  const ammContract = getAMMContract(chain, currentAmm);
  const chContract = getCHContract(chain);

  // funding payment event listener
  useContractEvent({
    ...ammContract,
    abi: ammAbi,
    eventName: 'FundingRateUpdated',
    listener(logs) {
      const newRecords = logs.map(log => ({
        amm: ammContract?.address ?? zeroAddress,
        timestamp: Math.round(new Date().getTime() / 1000), // log doesn't return timestamp
        underlyingPrice: formatBigInt(log.args.underlyingPrice ?? 0n),
        rateLong: formatBigInt(log.args.rateLong ?? 0n),
        rateShort: formatBigInt(log.args.rateShort ?? 0n),
        amountLong: formatBigInt(log.args.rateLong ?? 0n) * formatBigInt(log.args.underlyingPrice ?? 0n),
        amountShort: formatBigInt(log.args.rateShort ?? 0n) * formatBigInt(log.args.underlyingPrice ?? 0n)
      }));
      $fundingRatesHistory.set([...newRecords, ...$fundingRatesHistory.get()]);
    }
  });

  // future market position changed event listener
  // emit confirm toast
  useContractEvent({
    ...chContract,
    abi: chAbi,
    eventName: 'PositionChanged',
    listener(logs) {
      const filteredLogs = logs.filter(log => log.args.amm === ammContract?.address);
      if (filteredLogs.length > 0) {
        const traderAddresses = filteredLogs.map(log => log.args.trader);
        apiConnection.getUsernameFromAddress(traderAddresses).then(usernameList => {
          filteredLogs.forEach(log => {
            const newRecord = {
              ammAddress: ammContract?.address ?? zeroAddress,
              timestamp: Math.round(new Date().getTime() / 1000), // log doesn't return timestamp
              exchangedPositionSize: formatBigInt(log.args.exchangedPositionSize ?? 0n),
              positionNotional: formatBigInt(log.args.positionNotional ?? 0n),
              positionSizeAfter: formatBigInt(log.args.positionSizeAfter ?? 0n),
              liquidationPenalty: formatBigInt(log.args.liquidationPenalty ?? 0n),
              spotPrice: formatBigInt(log.args.spotPrice ?? 0n),
              userAddress: log.args.trader ?? zeroAddress,
              userId:
                !usernameList?.[log.args.trader ?? zeroAddress] || usernameList?.[log.args.trader ?? zeroAddress] === log.args.trader
                  ? ''
                  : usernameList?.[log.args.trader ?? zeroAddress],
              txHash: log.transactionHash ?? ''
            };
            $futureMarketHistory.set([newRecord, ...$futureMarketHistory.get()]);
            addGraphRecord(formatBigInt(log.args.spotPrice ?? 0n));
            if (log.args.trader === address) {
              const type = getTradingActionType({
                exchangedPositionSize: formatBigInt(log.args.exchangedPositionSize ?? 0n),
                positionSizeAfter: formatBigInt(log.args.positionSizeAfter ?? 0n),
                liquidationPenalty: formatBigInt(log.args.liquidationPenalty ?? 0n)
              });
              const amm = getAMMByAddress(log.args.amm, chain);
              const ammInfo = getCollectionInformation(amm);
              showToast(
                {
                  title: `${ammInfo?.shortName} - ${type} Position`,
                  message: 'Order Completed!',
                  linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${log.transactionHash ?? ''}`,
                  linkLabel: 'Check on Arbiscan'
                },
                {
                  autoClose: 5000,
                  hideProgressBar: true
                }
              );
            }
          });
        });
      }
    }
  });

  useContractEvent({
    ...chContract,
    abi: chAbi,
    eventName: 'MarginChanged',
    listener(logs) {
      logs
        .filter(log => log.args.sender === address)
        .forEach(log => {
          const margin = formatBigInt(log.args.amount ?? 0n);
          const type = getCollateralActionType(margin);
          const amm = getAMMByAddress(log.args.amm, chain);
          const ammInfo = getCollectionInformation(amm);
          showToast(
            {
              title: `${ammInfo?.shortName} - ${type}`,
              message: 'Order Completed!',
              linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${log.transactionHash ?? ''}`,
              linkLabel: 'Check on Arbiscan'
            },
            {
              autoClose: 5000,
              hideProgressBar: true
            }
          );
        });
    }
  });

  // load future market history for once
  useEffect(() => {
    function fetch() {
      const ammAddr = getAMMAddress(chain, currentAmm);
      if (ammAddr) {
        getMarketHistory(ammAddr).then(res => {
          $futureMarketHistory.set(
            res.map(
              (record: {
                ammAddress: string;
                timestamp: string;
                exchangedPositionSize: string;
                positionNotional: string;
                positionSizeAfter: string;
                liquidationPenalty: string;
                spotPrice: string;
                userAddress: string;
                userId: string;
                txHash: string;
              }) => ({
                ammAddress: record.ammAddress,
                timestamp: Number(record.timestamp),
                exchangedPositionSize: formatBigInt(record.exchangedPositionSize),
                positionNotional: formatBigInt(record.positionNotional),
                positionSizeAfter: formatBigInt(record.positionSizeAfter),
                liquidationPenalty: formatBigInt(record.liquidationPenalty),
                spotPrice: formatBigInt(record.spotPrice),
                userAddress: getAddress(record.userAddress),
                userId: record.userId,
                txHash: record.txHash
              })
            )
          );
        });
      }
    }

    fetch();
  }, [currentAmm, chain]);

  // load opensea spot market history every 10 seconds
  useEffect(() => {
    function fetch() {
      const ammAddr = getAMMAddress(chain, currentAmm);
      if (ammAddr) {
        getBaycFromMainnet(ammAddr)
          .then(res => {
            $spotMarketHistory.set(res);
          })
          .catch(() => $spotMarketHistory.set([]));
      }
    }

    fetch();

    const timer = setInterval(fetch, 60000);

    return () => {
      clearInterval(timer);
    };
  }, [currentAmm, chain]);

  // load funding payment history for month
  useEffect(() => {
    function fetch() {
      const ammAddr = getAMMAddress(chain, currentAmm);
      if (ammAddr) {
        getFundingPaymentHistory(ammAddr)
          .then(res => {
            $fundingRatesHistory.set(
              res.map((record: { amm: string; timestamp: string; rateLong: string; rateShort: string; underlyingPrice: string }) => ({
                amm: getAddress(record.amm),
                timestamp: Number(record.timestamp),
                underlyingPrice: formatBigInt(record.underlyingPrice),
                rateLong: formatBigInt(record.rateLong),
                rateShort: formatBigInt(record.rateShort),
                amountLong: formatBigInt(record.rateLong) * formatBigInt(record.underlyingPrice),
                amountShort: formatBigInt(record.rateShort) * formatBigInt(record.underlyingPrice)
              }))
            );
          })
          .catch(() => $fundingRatesHistory.set([]));
      }
    }
    fetch();
  }, [currentAmm, chain]);

  return null;
};

export default MarketHistoryUpdater;
