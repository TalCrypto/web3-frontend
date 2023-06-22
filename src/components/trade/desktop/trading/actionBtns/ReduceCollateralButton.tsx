import React, { useEffect, useState } from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/trade/desktop/trading/actionBtns/BaseButton';
import { useReduceCollateralTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';

function ReduceCollateralButton({
  isEstimating,
  deltaMargin,
  onPending,
  onSuccess,
  onError
}: {
  isEstimating: boolean;
  deltaMargin: number;
  onPending: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line no-unused-vars
  onError: (error: Error | null) => void;
}) {
  if (deltaMargin < 0) throw new Error('invalid prop');
  const currentAmm = useNanostore($currentAmm);
  const collectionInfo = getCollectionInformation(currentAmm);
  const [isLoading, setIsLoading] = useState(false);

  const { write, isError, error, isPreparing, isPending, isSuccess, txHash } = useReduceCollateralTransaction(deltaMargin);

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
    if (isPending) {
      onPending();
      showToast(
        {
          warning: true,
          title: `${collectionInfo.shortName} - Reduce Collateral`,
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
        setIsLoading(true);
        write?.();
      }}
      label="Trade"
    />
  );
}

export default ReduceCollateralButton;
