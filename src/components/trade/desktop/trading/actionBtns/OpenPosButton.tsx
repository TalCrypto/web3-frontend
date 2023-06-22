import React, { useEffect, useState } from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/trade/desktop/trading/actionBtns/BaseButton';
import { OpenPositionEstimation, Side, useOpenPositionTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';
import { usePositionInfo } from '@/hooks/collection';

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
      onError(error);
      setIsLoading(false);
    }
  }, [isError, error, onError]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
      setIsLoading(false);
    }
  }, [isSuccess, onSuccess]);

  useEffect(() => {
    if (isPending && txHash) {
      const type = positionInfo?.size === 0 ? 'Open' : (-1) ** side * (positionInfo?.size ?? 0) > 0 ? 'Add' : 'Partial Close';
      showToast(
        {
          warning: true,
          title: `${collectionInfo.shortName} - ${type} Position`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  return (
    <BaseButton
      disabled={!write}
      isLoading={isLoading || isPreparing || isPending || isEstimating}
      onClick={() => {
        onPending();
        setIsLoading(true);
        write?.();
      }}
      label="Trade"
    />
  );
}

export default OpenPosButton;
