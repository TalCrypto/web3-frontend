/* eslint-disable no-unused-vars */
import Image from 'next/image';
import React, { FC, PropsWithChildren } from 'react';
import UserMedal from '../common/UserMedal';

const dummyList = Array.from({ length: 40 }).map((v, i) => i + 1);

const Table: FC<PropsWithChildren> = () => {
  const foo = 'bar';
  return (
    <div>
      <div className="flex items-center py-4 text-b2 text-mediumEmphasis">
        <div className="basis-1/4 text-center">Rank</div>
        <div className="basis-1/4">User</div>
        <div className="basis-1/4 text-center">Realized P/L</div>
        <div className="basis-1/4">Prize</div>
      </div>
      <div className="scrollable h-[480px] overflow-auto">
        {dummyList.map(i => (
          <div
            key={i}
            className={`${
              i === 1 ? 'sticky top-0 z-[2] bg-secondaryBlue' : ''
            } flex items-center border-b border-b-[#2E4371] py-3 text-b2 text-mediumEmphasis transition hover:bg-secondaryBlue`}>
            <div className="flex basis-1/4 justify-center">
              <UserMedal rank={i} isYou={i === 1} />
            </div>
            <div className="basis-1/4">0xbf44b...980</div>
            <div className="basis-1/4 text-center">
              <div className="flex justify-center space-x-1">
                <Image src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} alt="" />
                <p className="text-b2e text-marketGreen">+89.99</p>
              </div>
            </div>
            <div className="basis-1/4">
              <div className="flex w-fit space-x-1 rounded-[12px] bg-[#2E4371] px-4 py-1">
                <Image src="/images/components/competition/revamp/gift.svg" width={16} height={16} alt="" />
                <p className="text-b2">200USDT</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
