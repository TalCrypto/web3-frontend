/* eslint-disable max-len */
import { $isShowMobileDrawer } from '@/stores/competition';
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
      <div className="flex space-x-[3px] rounded-2xl bg-[#2E4371] px-3 py-[6px]">
        <Image src="/images/components/competition/revamp/timer.svg" width={16} height={16} alt="" />
        <p className="text-b3 text-highEmphasis">
          Ends in: <span className="text-b3e">4d 3h 12m</span>
        </p>
      </div>
      <div
        className="flex space-x-[3px] text-primaryBlue"
        onClick={() => {
          $isShowMobileDrawer.set(true);
        }}>
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            className="fill-primaryBlue"
            d="M12.0002 10.5V4.5C12.0002 3.39533 11.1048 2.5 10.0002 2.5H3.3335C2.22883 2.5 1.3335 3.39533 1.3335 4.5V5.83333C1.3335 6.20133 1.63216 6.5 2.00016 6.5H3.3335V12.5C3.3335 13.6047 4.22883 14.5 5.3335 14.5H12.6668C13.7715 14.5 14.6668 13.6047 14.6668 12.5V11.1667C14.6668 10.7987 14.3682 10.5 14.0002 10.5H12.0002ZM10.0002 8.5C10.0002 8.868 9.7015 9.16667 9.3335 9.16667H6.00016C5.63216 9.16667 5.3335 8.868 5.3335 8.5C5.3335 8.132 5.63216 7.83333 6.00016 7.83333H9.3335C9.7015 7.83333 10.0002 8.132 10.0002 8.5ZM10.0002 11.1667C10.0002 11.5347 9.7015 11.8333 9.3335 11.8333H6.00016C5.63216 11.8333 5.3335 11.5347 5.3335 11.1667C5.3335 10.7987 5.63216 10.5 6.00016 10.5H9.3335C9.7015 10.5 10.0002 10.7987 10.0002 11.1667ZM2.66683 4.5C2.66683 4.132 2.96616 3.83333 3.3335 3.83333H8.11416C8.04083 4.042 8.00016 4.266 8.00016 4.5V5.16667H2.66683V4.5ZM13.3335 12.5C13.3335 12.868 13.0342 13.1667 12.6668 13.1667C12.2995 13.1667 12.0002 12.868 12.0002 12.5V11.8333H13.3335V12.5Z"
          />
        </svg>
        <p className="text-b2e">View Rules</p>
      </div>
    </div>
  </div>
);

export default PrizePool;
