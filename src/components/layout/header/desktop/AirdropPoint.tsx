import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import { ThreeDots } from 'react-loader-spinner';
import Image from 'next/image';
import { $userPoint } from '@/stores/airdrop';
import { localeConversion } from '@/utils/localeConversion';
import { isEligable } from '@/utils/airdrop';
import { useRouter } from 'next/router';
import { $userIsConnected } from '@/stores/user';

const AirdropPoint: React.FC = () => {
  const router = useRouter();
  const isConnected = useNanostore($userIsConnected);
  const airdropPoints = useNanostore($userPoint);
  if (!isConnected) return null;
  return (
    <div className="hidden md:block" onClick={() => router.push('/airdrop')}>
      <div
        className="flex h-[32px] cursor-pointer items-center
          space-x-[4px] rounded-full border-[1px] border-seasonGreen
          px-[16px] py-[6px] text-seasonGreen hover:bg-seasonGreen/20">
        {!airdropPoints ? (
          <ThreeDots ariaLabel="loading-indicator" height={20} width={50} color="white" />
        ) : (
          <>
            <Image src="/images/components/layout/header/user-point.svg" alt="" width={14} height={14} />
            <span className="text-[16px] font-medium leading-[20px]">
              {isEligable(Number(airdropPoints.tradeVol.vol)) && !airdropPoints.isBan ? localeConversion(airdropPoints.total) : '0.0'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default AirdropPoint;
