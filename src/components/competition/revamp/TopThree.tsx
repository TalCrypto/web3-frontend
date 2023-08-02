/* eslint-disable no-unused-vars */
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, PropsWithChildren } from 'react';

const TopThree: FC<PropsWithChildren> = () => {
  const foo = 'bar';
  return (
    <div className="relative flex w-fit flex-col items-center">
      <div className="relative h-16 w-full">
        <div
          className="absolute bottom-0 left-0 right-0 h-2 w-full 
        border-b-[27px] border-l-[16px] border-r-[16px] border-b-[#1D1F36] border-l-transparent border-r-transparent"
        />
        <div className="absolute top-0 flex w-full flex-col items-center">
          <p className="mb-4 text-h5 text-white">JEFFGPT8888</p>
          <Image src="/images/components/competition/revamp/medal2.svg" className="z-[1]" width={70} height={40} alt="rank2" />
        </div>
      </div>
      <div className="relative flex w-fit flex-col items-center bg-gradient-to-b from-[#282B45] to-[#14173100] p-4">
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Total Trading Vol.</p>
        <p className="text-b2e text-marketGreen">+89.99</p>
        <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
        <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
      </div>
    </div>
  );
};

export default TopThree;
