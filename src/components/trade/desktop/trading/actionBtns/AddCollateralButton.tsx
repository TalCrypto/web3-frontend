import React from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/trade/desktop/trading/actionBtns/BaseButton';
import { useAddCollateralTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';

function AddCollateralButton({
  deltaMargin,
  onSuccess,
  onError
}: {
  deltaMargin: number;
  onSuccess: () => void;
  onError: (error: Error | null) => void;
}) {
  if (deltaMargin < 0) throw new Error('invalid prop');
  const currentAmm = useNanostore($currentAmm);
  const collectionInfo = getCollectionInformation(currentAmm);

  const { write, isError, error, isLoading, isSuccess, txHash } = useAddCollateralTransaction(deltaMargin);

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

  return <BaseButton isPending={isLoading} onClickButton={write} label="Trade" />;
}

export default AddCollateralButton;
