import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import Link from 'next/link';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';
import { $userPoint } from '@/stores/airdrop';
import { localeConversion } from '@/utils/localeConversion';
import { isEligable } from '@/utils/airdrop';
import { useAccount } from 'wagmi';

const AirdropPoint: React.FC = () => {
  const { isConnected } = useAccount();
  const airdropPoints = useNanostore($userPoint);
  if (!isConnected) return null;
  return (
    <Link href="/airdrop" className="hidden md:block">
      <div
        className="flex h-[32px] cursor-pointer items-center space-x-[4px] rounded-full
        border-[1px] border-warn px-[16px] py-[6px] text-warn hover:bg-warn/20">
        {!airdropPoints ? (
          <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
        ) : (
          <>
            <Image src="/images/components/layout/header/user-point.svg" alt="" width={14} height={14} />
            <span className="text-[16px] font-[500] leading-[20px]">
              {isEligable(Number(airdropPoints.tradeVol.vol)) && !airdropPoints.isBan ? localeConversion(airdropPoints.total) : '0.0'}
            </span>
          </>
        )}
      </div>
    </Link>
  );
};

export default AirdropPoint;
