import React from 'react';
import { useConnect } from 'wagmi';
import { $userIsConnected } from '@/stores/user';
import { useStore } from '@nanostores/react';

const MyPerformance = () => {
  const isConnected = useStore($userIsConnected);

  return !isConnected ? (
    <div className="mt-[72px] flex items-center justify-center text-[16px] text-mediumEmphasis">
      Please connect to your wallet to get started.
    </div>
  ) : (
    <div>
      <div className="mt-[16px] flex items-center justify-center text-[24pt] font-[700] ">General Performance</div>
    </div>
  );
};

export default MyPerformance;
