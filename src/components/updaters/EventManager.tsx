/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { showToast } from '@/components/common/Toast';
import { getAMMAddress, getAMMByAddress } from '@/const/addresses';
import { getCollectionInformation } from '@/const/collectionList';
import { $pendingPositionChangedEvents, $pendingMarginChangedEvents } from '@/stores/events';
import { $currentAmm, $fundingRatesHistory, $futureMarketHistory, $tsTransactionStatus, addGraphRecord } from '@/stores/trading';
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

          if (!isMobileView) {
            showToast(
              {
                title: `${ammInfo?.shortName} - ${type} Position`,
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

          if (isMobileView) {
            $tsTransactionStatus.set({
              isShow: true,
              isSuccess: true,
              linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${event.txHash ?? ''}`
            });
          }
        }
      });

      const filteredLogs = pendingPositionChangedEvents.filter(event => event.amm === ammAddress);
      if (filteredLogs.length > 0) {
        const traderAddresses = filteredLogs.map(event => event.trader);
        apiConnection.getUsernameFromAddress(traderAddresses).then(usernameList => {
          filteredLogs.forEach(event => {
            const newRecord = {
              ammAddress,
              timestamp: Math.round(new Date().getTime() / 1000), // log doesn't return timestamp
              exchangedPositionSize: event.exchangedPositionSize,
              positionNotional: event.exchangedNotional,
              positionSizeAfter: event.positionSizeAfter,
              liquidationPenalty: event.liquidationPenalty,
              spotPrice: event.vammPrice,
              userAddress: event.trader,
              userId: !usernameList?.[event.trader] || usernameList?.[event.trader] === event.trader ? '' : usernameList?.[event.trader],
              txHash: event.txHash,
              isNew: true
            };
            $futureMarketHistory.set([newRecord, ...$futureMarketHistory.get().map(history => ({ ...history, isNew: false }))]);
            addGraphRecord(event.vammPrice);
          });
        });
      }
    }
  }, [pendingPositionChangedEvents, traderAddress, chain, ammAddress]);

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

          if (isMobileView) {
            $tsTransactionStatus.set({
              isShow: true,
              isSuccess: true,
              linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${event.txHash ?? ''}`
            });
          }
        });
    }
  }, [pendingMarginChangedEvents, traderAddress, chain]);

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
  const [ammContract, setAmmContract] = useState<Contract | undefined>();
  const [chContract, setChContract] = useState<Contract | undefined>();

  useEffect(() => {
    if (currentAmm) {
      setAmmContract(getAMMContract(chain, currentAmm));
      setChContract(getCHContract(chain));
    }
  }, [chain, currentAmm]);

  if (!ammContract || !chContract) return null;

  return (
    <>
      <EventListeners chContract={chContract} ammContract={ammContract} />
      <EventHandlers />
    </>
  );
};

export default EventManager;
