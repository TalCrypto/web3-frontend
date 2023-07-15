import { WETH_INSUFFICIENT } from '@/const/errorList';
import { $showGetWEthModal } from '@/stores/modal';
import React from 'react';

export const ErrorTip = ({ label }: { label: string | null }) => {
  if (!label) return null;

  return (
    <div className="mb-3 text-[12px] leading-[20px] text-marketRed">
      {label !== WETH_INSUFFICIENT ? (
        label
      ) : (
        <>
          Not enough WETH (including transaction fee).
          <span onClick={() => $showGetWEthModal.set(true)} className="ml-1 cursor-pointer text-white underline">
            Get WETH
          </span>{' '}
          first
        </>
      )}
    </div>
  );
};
