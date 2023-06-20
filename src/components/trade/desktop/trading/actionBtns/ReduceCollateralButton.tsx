import React from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/trade/desktop/trading/actionBtns/BaseButton';
import { useReduceCollateralTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';

function ReduceCollateralButton({
  deltaMargin,
  onSuccess,
  onError
}: {
  deltaMargin: number;
  onSuccess: () => void;
  // eslint-disable-next-line no-unused-vars
  onError: (error: Error | null) => void;
}) {
  if (deltaMargin < 0) throw new Error('invalid prop');
  const currentAmm = useNanostore($currentAmm);
  const collectionInfo = getCollectionInformation(currentAmm);

  const { write, isError, error, isLoading, isSuccess, txHash } = useReduceCollateralTransaction(deltaMargin);

  if (isError) {
    onError(error);
  }

  if (isSuccess) {
    onSuccess();
  }

  if (isLoading) {
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

  return <BaseButton isPending={isLoading} onClickButton={write} label="Trade" />;
}

export default ReduceCollateralButton;
