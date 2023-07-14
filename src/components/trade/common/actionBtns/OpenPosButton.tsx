/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/trade/common/actionBtns/BaseButton';
import { OpenPositionEstimation, Side, useOpenPositionTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm, $tsTransactionStatus } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';
import { usePositionInfo } from '@/hooks/collection';
import { TradeActions } from '@/const';
import { $isMobileView } from '@/stores/modal';

function OpenPosButton({
  isEstimating,
  side,
  notionalAmount,
  leverage,
  slippagePercent,
  estimation,
  onPending,
  onSuccess,
  onError
}: {
  isEstimating: boolean;
  side: Side;
  notionalAmount: number;
  leverage: number;
  slippagePercent: number;
  estimation: OpenPositionEstimation | undefined;
  onPending: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line no-unused-vars
  onError: (error: Error | null) => void;
}) {
  const currentAmm = useNanostore($currentAmm);
  const collectionInfo = getCollectionInformation(currentAmm);
  const positionInfo = usePositionInfo(currentAmm);
  const [isLoading, setIsLoading] = useState(false);
  const [label, setLabel] = useState('');
  const isMobileView = useNanostore($isMobileView);

  const sideDisplay = side === 0 ? 'LONG' : 'SHORT';

  useEffect(() => {
    if (positionInfo) {
      const posType =
        positionInfo.size === 0
          ? `${TradeActions.OPEN} ${sideDisplay}`
          : (-1) ** side * positionInfo.size > 0
          ? `${TradeActions.ADD}`
          : `Close Position`;
      setLabel(posType);
    }
  }, [positionInfo, side]);

  useEffect(() => {
    setIsLoading(false);
  }, [currentAmm]);

  const { write, isError, error, isPreparing, isPending, isSuccess, txHash } = useOpenPositionTransaction({
    side,
    notionalAmount,
    leverage,
    slippagePercent,
    estimation
  });

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
    }
    onError(isError ? error : null);
  }, [isError, error, onError]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
      if (isMobileView && txHash) {
        $tsTransactionStatus.set({
          isShow: true,
          isSuccess: true,
          linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${txHash}`
        });
      }
      setIsLoading(false);
    }
  }, [isSuccess, txHash, onSuccess]);

  useEffect(() => {
    if (isPending && txHash) {
      if (!isMobileView) {
        showToast(
          {
            warning: true,
            title: `${collectionInfo.shortName} - ${label}`,
            message: 'Order Received!',
            linkUrl: `${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${txHash}`,
            linkLabel: 'Check on Arbiscan'
          },
          {
            autoClose: 5000,
            hideProgressBar: true
          }
        );
      }
    }
  }, [isPending, label, txHash]);

  return (
    <BaseButton
      disabled={!write}
      isLoading={isLoading || isPreparing || isPending || isEstimating}
      onClick={() => {
        onPending();
        setIsLoading(true);
        write?.();
      }}
      label={label}
    />
  );
}

export default OpenPosButton;
