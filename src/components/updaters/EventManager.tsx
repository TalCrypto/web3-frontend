/* eslint-disable indent */
/* eslint-disable operator-linebreak */
import React, { useEffect } from 'react';
import { showToast } from '@/components/common/Toast';
import { getAMMAddress, getAMMByAddress } from '@/const/addresses';
import { getCollectionInformation } from '@/const/collectionList';
import { $pendingPositionChangedEvents, $pendingMarginChangedEvents } from '@/stores/events';
import { $currentAmm, $fundingRatesHistory, $futureMarketHistory, addGraphRecord } from '@/stores/trading';
import { $currentChain, $userAddress } from '@/stores/user';
import { getTradingActionType, getCollateralActionType } from '@/utils/actionType';
import { apiConnection } from '@/utils/apiConnection';
import { useStore as useNanostore } from '@nanostores/react';
import { useContractEvent } from 'wagmi';
import { Contract, getAMMContract, getCHContract } from '@/const/contracts';
import { ammAbi, chAbi } from '@/const/abi';
import { formatBigInt } from '@/utils/bigInt';
import { zeroAddress } from 'viem';
import { $isMobileView } from '@/stores/modal';
import { TradeActions } from '@/const';

const EventHandlers = () => {
  const pendingPositionChangedEvents = useNanostore($pendingPositionChangedEvents);
  const pendingMarginChangedEvents = useNanostore($pendingMarginChangedEvents);
  const traderAddress = useNanostore($userAddress);
  const chain = useNanostore($currentChain);
  const currentAmm = useNanostore($currentAmm);
  const ammAddress = getAMMAddress(chain, currentAmm);
  const isMobileView = useNanostore($isMobileView);

  useEffect(() => {
    if (pendingPositionChangedEvents.length > 0 && ammAddress) {
      $pendingPositionChangedEvents.set([]);
      pendingPositionChangedEvents.forEach(event => {
        if (event.trader === traderAddress) {
          const type = getTradingActionType({
            exchangedPositionSize: event.exchangedPositionSize,
            positionSizeAfter: event.positionSizeAfter,
            liquidationPenalty: event.liquidationPenalty
          });
          const amm = getAMMByAddress(event.amm, chain);
          const ammInfo = getCollectionInformation(amm);
          const isLiquidation = type === TradeActions.FULL_LIQ || type === TradeActions.PARTIAL_LIQ;
          const message =
            type === TradeActions.PARTIAL_LIQ
              ? 'Your position has been partially liquidated'
              : type === TradeActions.FULL_LIQ
              ? 'Your position has been partially liquidated'
              : 'Order Completed!';

          if (!isMobileView) {
            showToast(
              {
                title: `${ammInfo?.shortName} - ${type} ${
                  type === TradeActions.OPEN ? (event.positionSizeAfter > 0 ? 'LONG' : 'SHORT') : ''
                }`,
                message,
                linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${event.txHash ?? ''}`,
                linkLabel: 'Check on Arbiscan',
                isLiquidation
              },
              {
                autoClose: 5000,
                hideProgressBar: true
              }
            );
          }
        }
      });

      const filteredLogs = pendingPositionChangedEvents.filter(event => event.amm === ammAddress);
      if (filteredLogs.length > 0) {
        const traderAddresses = filteredLogs.map(event => event.trader);
        apiConnection.getUsernameFromAddress(traderAddresses).then(usernameList => {
          filteredLogs.forEach(event => {
            const targetUsername = usernameList?.[event.trader.toLowerCase()];
            const newRecord = {
              ammAddress,
              timestamp: Math.round(new Date().getTime() / 1000), // log doesn't return timestamp
              exchangedPositionSize: event.exchangedPositionSize,
              positionNotional: event.exchangedNotional,
              positionSizeAfter: event.positionSizeAfter,
              liquidationPenalty: event.liquidationPenalty,
              spotPrice: event.vammPrice,
              userAddress: event.trader,
              userId: !targetUsername || usernameList?.[event.trader] === event.trader ? '' : targetUsername,
              txHash: event.txHash,
              isNew: true
            };
            const oldHistory = $futureMarketHistory.get();
            const exists = oldHistory?.find(i => i.txHash === newRecord.txHash);
            if (exists) {
              console.log('existing record in history, will not added', exists);
            }
            if (oldHistory && !exists) {
              $futureMarketHistory.set([newRecord, ...oldHistory.map(history => ({ ...history, isNew: false }))]);
            }
            addGraphRecord(event.vammPrice);
          });
        });
      }
    }
  }, [pendingPositionChangedEvents, traderAddress, chain, ammAddress, isMobileView]);

  useEffect(() => {
    if (pendingMarginChangedEvents.length > 0) {
      $pendingMarginChangedEvents.set([]);
      pendingMarginChangedEvents
        .filter(event => event.trader === traderAddress)
        .forEach(event => {
          const margin = event.amount;
          const type = getCollateralActionType(margin);
          const amm = getAMMByAddress(event.amm, chain);
          const ammInfo = getCollectionInformation(amm);

          if (!isMobileView) {
            showToast(
              {
                title: `${ammInfo?.shortName} - ${type}`,
                message: 'Order Completed!',
                linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${event.txHash ?? ''}`,
                linkLabel: 'Check on Arbiscan'
              },
              {
                autoClose: 5000,
                hideProgressBar: true
              }
            );
          }
        });
    }
  }, [pendingMarginChangedEvents, traderAddress, chain, isMobileView]);

  return null;
};

const EventListeners = ({ ammContract, chContract }: { ammContract: Contract; chContract: Contract }) => {
  // funding payment event listener
  useContractEvent({
    ...ammContract,
    abi: ammAbi,
    eventName: 'FundingRateUpdated',
    listener(logs) {
      const newRecords = logs.map(log => ({
        amm: ammContract.address,
        timestamp: Math.round(new Date().getTime() / 1000), // log doesn't return timestamp
        underlyingPrice: formatBigInt(log.args.underlyingPrice ?? 0n),
        rateLong: formatBigInt(log.args.rateLong ?? 0n),
        rateShort: formatBigInt(log.args.rateShort ?? 0n),
        amountLong: formatBigInt(log.args.rateLong ?? 0n) * formatBigInt(log.args.underlyingPrice ?? 0n),
        amountShort: formatBigInt(log.args.rateShort ?? 0n) * formatBigInt(log.args.underlyingPrice ?? 0n)
      }));
      const oldHistory = $fundingRatesHistory.get();
      if (oldHistory) {
        $fundingRatesHistory.set([...newRecords, ...oldHistory]);
      }
    }
  });

  // future market position changed event listener
  // emit confirm toast
  useContractEvent({
    ...chContract,
    abi: chAbi,
    eventName: 'PositionChanged',
    listener(logs) {
      $pendingPositionChangedEvents.set([
        ...$pendingPositionChangedEvents.get(),
        ...logs.map(log => ({
          amm: log.args.amm ?? zeroAddress,
          trader: log.args.trader ?? zeroAddress,
          txHash: log.transactionHash ?? '',
          positionSizeAfter: formatBigInt(log.args.positionSizeAfter ?? 0n),
          exchangedNotional: formatBigInt(log.args.positionNotional ?? 0n),
          exchangedPositionSize: formatBigInt(log.args.exchangedPositionSize ?? 0n),
          liquidationPenalty: formatBigInt(log.args.liquidationPenalty ?? 0n),
          vammPrice: formatBigInt(log.args.spotPrice ?? 0n)
        }))
      ]);
    }
  });

  useContractEvent({
    ...chContract,
    abi: chAbi,
    eventName: 'MarginChanged',
    listener(logs) {
      $pendingMarginChangedEvents.set([
        ...$pendingMarginChangedEvents.get(),
        ...logs.map(log => ({
          amm: log.args.amm ?? zeroAddress,
          trader: log.args.sender ?? zeroAddress,
          txHash: log.transactionHash ?? '',
          amount: formatBigInt(log.args.amount ?? 0n)
        }))
      ]);
    }
  });

  return null;
};

const EventManager = () => {
  const chain = useNanostore($currentChain);
  const currentAmm = useNanostore($currentAmm);
  const ammContract = getAMMContract(chain, currentAmm);
  const chContract = getCHContract(chain);

  if (!currentAmm || !ammContract || !chContract) return null;

  return (
    <>
      <EventListeners chContract={chContract} ammContract={ammContract} />
      <EventHandlers />
    </>
  );
};

export default EventManager;
