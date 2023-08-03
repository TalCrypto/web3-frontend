import Image from 'next/image';
import React, { FC, PropsWithChildren } from 'react';

const PrizePool: FC<PropsWithChildren> = () => (
  <div
    className="items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] 
    from-[rgba(78,85,121,0.6)] 
    to-darkBlue to-100% px-5 py-9 
    lg:flex lg:h-[280px]
    lg:flex-col lg:bg-[radial-gradient(farthest-side_at_center,_var(--tw-gradient-stops))] lg:to-transparent lg:to-85%">
    <div className="mb-[26px] flex justify-center space-x-1">
      <Image src="/images/components/competition/revamp/prizepool/gift.svg" width={16} height={16} alt="" />
      <p className="text-b2e lg:text-h5">Total Prize Pool For Top Gainer</p>
    </div>

    <div className="hidden lg:flex lg:flex-col lg:items-center">
      <Image className="mb-4" src="/images/components/competition/revamp/prizepool/title.svg" width={386} height={39} alt="" />
      <Image src="/images/components/competition/revamp/prizepool/progress.svg" width={675} height={111} alt="" />
    </div>

    <div className="mb-[64px] flex flex-col items-center lg:hidden">
      <Image className="mb-4" src="/images/components/competition/revamp/prizepool/title_m.svg" width={189} height={96} alt="" />
    </div>

    <div className="flex items-center justify-between lg:hidden">
      <div className="flex space-x-[3px]">
        <Image src="/images/components/competition/revamp/timer.svg" width={16} height={16} alt="" />
        <p className="text-b3 text-highEmphasis">
          Ends in: <span className="text-b3e">4d 3h 12m</span>
        </p>
      </div>
      <div className="flex space-x-[3px]">
        <Image src="/images/common/rules.svg" width={16} height={16} alt="" />
        <p className="text-b2e text-highEmphasis">View Rules</p>
      </div>
    </div>
  </div>
);

export default PrizePool;
