/* eslint-disable no-unused-vars */
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FC, PropsWithChildren, ReactNode } from 'react';

type ItemProps = PropsWithChildren & {
  className?: string;
  title?: ReactNode;
  rank: 1 | 2 | 3;
};

const Item: FC<ItemProps> = ({ children, className, title, rank }) => (
  <div className={`relative flex w-fit flex-col items-center ${className}`}>
    <div className="relative h-16 w-full">
      <div
        className="absolute bottom-0 left-0 right-0 h-2 w-full 
        border-b-[27px] border-l-[16px] border-r-[16px] border-b-[#1D1F36] border-l-transparent border-r-transparent"
      />
      <div className="absolute top-0 flex w-full flex-col items-center">
        {title}
        <Image src={`/images/components/competition/revamp/medal${rank}.svg`} className="z-[1]" width={70} height={40} alt="rank2" />
      </div>
    </div>
    <div className="relative flex w-full flex-col items-center bg-gradient-to-b from-[#282B45] to-[#14173100] px-4 pb-4 pt-6">
      {children}
    </div>
  </div>
);

Item.defaultProps = {
  className: undefined,
  title: undefined
};

const TopThree: FC<PropsWithChildren> = () => {
  const foo = 'bar';
  return (
    <div
      className="flex h-[400px] items-center justify-center space-x-4
      bg-[radial-gradient(farthest-side_at_50%_35%,_var(--tw-gradient-stops))] from-[rgba(104,84,12,0.6)] to-55%">
      <Item rank={2} className="mt-8 w-[200px]" title={<p className="mb-4 text-h5 text-white">JEFFGPT8888</p>}>
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Total Trading Vol.</p>
        <div className="flex space-x-1">
          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
          <p className="text-b2e text-marketGreen">+89.99</p>
        </div>
        <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
        <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
      </Item>
      <Item rank={1} className="w-[200px]" title={<p className="mb-4 text-h5 text-[#FFD540]">JEFFGPT9999</p>}>
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Total Trading Vol.</p>
        <div className="flex space-x-1">
          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
          <p className="text-b2e text-marketGreen">+99.99</p>
        </div>
        <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
        <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
      </Item>
      <Item rank={3} className="mt-8 w-[200px]" title={<p className="mb-4 text-h5 text-[#FF8A65]">JEFFGPT7777</p>}>
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Total Trading Vol.</p>
        <div className="flex space-x-1">
          <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
          <p className="text-b2e text-marketGreen">+79.99</p>
        </div>
        <div className="my-4 h-[1px] w-full bg-[#2E4371]" />
        <p className="mb-[6px] text-b3 text-mediumEmphasis">Prize</p>
        <p className="text-b2 text-highEmphasis">500USDT + 1,500Pts</p>
      </Item>
    </div>
  );
};

export default TopThree;
