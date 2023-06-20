import React from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/trade/desktop/trading/actionBtns/BaseButton';
import { useClosePositionTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';

function ClosePosButton({
  slippagePercent,
  onSuccess,
  onError
}: {
  slippagePercent: number;
  onSuccess: () => void;
  // eslint-disable-next-line no-unused-vars
  onError: (error: Error | null) => void;
}) {
  const currentAmm = useNanostore($currentAmm);
  const collectionInfo = getCollectionInformation(currentAmm);

  const { write, isError, error, isLoading, isSuccess, txHash } = useClosePositionTransaction(slippagePercent);

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
        title: `${collectionInfo.shortName} - Full Close Position`,
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

export default ClosePosButton;
