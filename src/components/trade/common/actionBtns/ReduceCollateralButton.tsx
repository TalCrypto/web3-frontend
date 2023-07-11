/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/trade/common/actionBtns/BaseButton';
import { useReduceCollateralTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm, $tsTransactionStatus } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';
import { CollateralActions } from '@/const';
import { $isMobileView } from '@/stores/modal';

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
  const isMobileView = useNanostore($isMobileView);

  const { write, isError, error, isPreparing, isPending, isSuccess, txHash } = useReduceCollateralTransaction(deltaMargin);

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
    if (isPending) {
      if (!isMobileView) {
        showToast(
          {
            warning: true,
            title: `${collectionInfo.shortName} - ${CollateralActions.REDUCE}`,
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
      label="Reduce Collateral"
    />
  );
}

export default ReduceCollateralButton;
