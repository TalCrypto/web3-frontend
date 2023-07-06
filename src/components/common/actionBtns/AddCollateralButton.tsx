/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/common/actionBtns/BaseButton';
import { useAddCollateralTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';
import { CollateralActions } from '@/const';
import { $isMobileView } from '@/stores/modal';

function AddCollateralButton({
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
  const isMobileView = useNanostore($isMobileView);

  const { write, isError, error, isPreparing, isPending, isSuccess, txHash } = useAddCollateralTransaction(deltaMargin);

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
    }
    onError(isError ? error : null);
  }, [isError, error, onError]);

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  useEffect(() => {
    if (isPending) {
      if (!isMobileView) {
        showToast(
          {
            warning: true,
            title: `${collectionInfo.shortName} - ${CollateralActions.ADD}`,
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
  }, [isPending, collectionInfo.shortName, txHash]);

  return (
    <BaseButton
      disabled={!write}
      isLoading={isLoading || isPreparing || isPending || isEstimating}
      onClick={() => {
        onPending();
        setIsLoading(true);
        write?.();
      }}
      label="Add Collateral"
    />
  );
}

export default AddCollateralButton;
