import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import PrimaryButton from '@/components/common/PrimaryButton';

function BaseButton({
  label,
  isLoading,
  onClick,
  disabled = false
}: {
  label: string;
  isLoading: boolean;
  onClick: () => void;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
}) {
  const greenButton = label === 'Open Long' || label === 'Add Collateral';
  const redButton = label === 'Open Short' || label === 'Reduce Collateral';

  return (
    <div className="flex">
      <PrimaryButton
        isDisabled={!isLoading && disabled}
        className={`${!isLoading && disabled ? 'opacity-30' : ''}
          ${greenButton ? '!bg-buttonGreen' : ''}
          ${redButton ? '!bg-buttonRed' : ''}
          h-[46px] w-full px-[10px] py-[14px]
        `}
        onClick={!isLoading && !disabled ? onClick : null}>
        <div className="w-full text-center text-[15px] font-semibold">
          {isLoading ? (
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
