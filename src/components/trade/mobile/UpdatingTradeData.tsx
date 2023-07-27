import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

function UpdatingTradeData() {
  return (
    <div className="flex h-[56px] w-full items-center justify-center bg-darkBlue text-highEmphasis">
      <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
    </div>
  );
}

export default UpdatingTradeData;
