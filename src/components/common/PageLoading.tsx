import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

function PageLoading() {
  return (
    <div
      className="fixed bottom-0 left-0 top-0 z-20 flex h-full w-full
        flex-col items-center justify-center bg-black/[.2] backdrop-blur-[4px]">
      <div className="mb-4">
        <ThreeDots ariaLabel="loading-indicator" height={100} width={100} color="white" />
      </div>
      <div className="loading-text">Please be patient, loading will take a while</div>
    </div>
  );
}

export default PageLoading;
