import React from 'react';
import { showToast } from '@/components/common/Toast';
import BaseButton from '@/components/trade/desktop/trading/actionBtns/BaseButton';
import { OpenPositionEstimation, Side, useOpenPositionTransaction } from '@/hooks/trade';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { getCollectionInformation } from '@/const/collectionList';
import { usePositionInfo } from '@/hooks/collection';

function OpenPosButton({
  side,
  notionalAmount,
  leverage,
  slippagePercent,
  estimation,
  onSuccess,
  onError
}: {
  side: Side;
  notionalAmount: number;
  leverage: number;
  slippagePercent: number;
  estimation: OpenPositionEstimation;
  onSuccess: () => void;
  // eslint-disable-next-line no-unused-vars
  onError: (error: Error | null) => void;
}) {
  const currentAmm = useNanostore($currentAmm);
  const collectionInfo = getCollectionInformation(currentAmm);
  const positionInfo = usePositionInfo(currentAmm);

  const { write, isError, error, isLoading, isSuccess, txHash } = useOpenPositionTransaction({
    side,
    notionalAmount,
    leverage,
    slippagePercent,
    estimation
  });

  if (isError) {
    onError(error);
  }

  if (isSuccess) {
    onSuccess();
  }

  if (isLoading) {
    const type =
      positionInfo && positionInfo.size === 0 ? 'Open' : positionInfo && (-1) ** side * positionInfo.size > 0 ? 'Add' : 'Partial Close';
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

  return <BaseButton isPending={isLoading} onClickButton={write} label="Trade" />;
}

export default OpenPosButton;
