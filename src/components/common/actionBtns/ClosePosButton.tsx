import React, { useEffect, useState } from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/common/actionBtns/BaseButton';
import { useClosePositionTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';
import { PositionActions } from '@/const';

function ClosePosButton({
  isEstimating,
  slippagePercent,
  onPending,
  onSuccess,
  onError
}: {
  isEstimating: boolean;
  slippagePercent: number;
  onPending: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line no-unused-vars
  onError: (error: Error | null) => void;
}) {
  const currentAmm = useNanostore($currentAmm);
  const collectionInfo = getCollectionInformation(currentAmm);
  const [isLoading, setIsLoading] = useState(false);

  const { write, isError, error, isPreparing, isPending, isSuccess, txHash } = useClosePositionTransaction(slippagePercent);

  useEffect(() => {
    setIsLoading(false);
    onError(isError ? error : null);
  }, [isError, error, onError]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
      setIsLoading(false);
    }
  }, [isSuccess, onSuccess]);

  useEffect(() => {
    if (isPending) {
      showToast(
        {
          warning: true,
          title: `${collectionInfo.shortName} - ${PositionActions.CLOSE} Position`,
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
  }, [isPending, onPending, collectionInfo.shortName, txHash]);

  return (
    <BaseButton
      disabled={!write}
      isLoading={isLoading || isPreparing || isPending || isEstimating}
      onClick={() => {
        onPending();
        setIsLoading(true);
        write?.();
      }}
      label="Close Position"
    />
  );
}

export default ClosePosButton;
