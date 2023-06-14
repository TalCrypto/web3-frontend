import React from 'react';

const PrimaryButton = (props: any) => {
  const { className = '', children, onClick = null, isDisabled = false } = props;
  const normalClasses = `cursor-pointer bg-primaryBlue btn-primary`;

  return (
    <div
      className={`flex items-center justify-center rounded-[6px] text-[16px]
        ${isDisabled ? 'cursor-default bg-[#272955]' : normalClasses}
        ${className}`}
      onClick={onClick}>
      {children}
    </div>
  );
};

export default PrimaryButton;
