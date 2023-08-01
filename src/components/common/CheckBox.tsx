/* eslint-disable max-len */
import React from 'react';

const CheckBox = ({ checked, disabled, onClick }: { checked?: boolean; disabled?: boolean; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`${checked ? 'bg-primaryBlue' : 'bg-transparent'} 
    ${disabled ? 'opacity-60' : ''}
    flex h-[14px] w-[14px] items-center justify-center rounded-[1px] border border-primaryBlue `}>
    <svg className={`${checked ? '' : 'hidden'}`} width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 4.22727L3.44495 7.06119C3.6444 7.29237 4.00266 7.29237 4.20211 7.06119L9 1.5"
        stroke="white"
        strokeOpacity="0.87"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

CheckBox.defaultProps = {
  checked: false,
  disabled: false,
  onClick: undefined
};

export default CheckBox;
