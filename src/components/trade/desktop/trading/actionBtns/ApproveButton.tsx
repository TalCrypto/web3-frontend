import React, { useEffect, useState } from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/trade/desktop/trading/actionBtns/BaseButton';
import { useApproveTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';

function ApproveButton({
  isEstimating,
  approvalAmount,
  onPending,
  onSuccess,
  onError,
  disabled = false
}: {
  isEstimating: boolean;
  approvalAmount: number;
  onPending: () => void;
  onSuccess: () => void;
  // eslint-disable-next-line no-unused-vars
  onError: (error: Error | null) => void;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
}) {
  if (approvalAmount < 0) throw new Error('invalid prop');
  const currentAmm = useNanostore($currentAmm);
  const collectionInfo = getCollectionInformation(currentAmm);
  const [isLoading, setIsLoading] = useState(false);

  const { write, isError, error, isPreparing, isPending, isSuccess, txHash } = useApproveTransaction(approvalAmount);

  useEffect(() => {
    setIsLoading(false);
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
      showToast(
        {
          warning: true,
          title: `${collectionInfo.shortName} - Add Collateral`,
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
      disabled={!write || disabled}
      isLoading={isLoading || isPreparing || isPending || isEstimating}
      onClick={() => {
        onPending();
        setIsLoading(true);
        write?.();
      }}
      label="Approve"
    />
  );
}

export default ApproveButton;
