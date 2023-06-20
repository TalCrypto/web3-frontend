import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import PrimaryButton from '@/components/common/PrimaryButton';

function BaseButton(props: { isPending: boolean; label: string; onClickButton: (() => void) | undefined }) {
  const { isPending, label, onClickButton } = props;

  return (
    <div className="flex">
      <PrimaryButton
        isDisabled={!onClickButton}
        className={`${!onClickButton ? 'opacity-30' : ''}
          h-[46px] w-full px-[10px] py-[14px]
        `}
        onClick={isPending || !onClickButton ? null : onClickButton}>
        <div className="w-full text-center text-[15px] font-semibold">
          {isPending ? (
            <div className="flex justify-center">
              <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
            </div>
          ) : (
            label
          )}
        </div>
      </PrimaryButton>
    </div>
  );
}

export default BaseButton;
