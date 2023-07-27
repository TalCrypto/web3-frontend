import React from 'react';

const OutlineButton = (props: any) => {
  const { className = '', children, onClick = null, isDisabled = false } = props;
  const normalClasses = `cursor-pointer border-[1px] border-primaryBlue btn-primary`;

  return (
    <div
      className={`${className} flex items-center justify-center rounded-[4px]
        px-[14px] py-[6px] text-[14px] font-semibold text-white
        ${isDisabled ? 'cursor-default' : normalClasses}`}
      onClick={onClick}>
      {children}
    </div>
  );
};

export default OutlineButton;
