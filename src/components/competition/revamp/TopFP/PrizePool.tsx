/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { $isShowMobileRules } from '@/stores/competition';
import Image from 'next/image';
import React, { FC, PropsWithChildren } from 'react';
import CountdownTimer from '../CountdownTimer';

const radialBgClassName = 'from-[rgba(93,75,122,0.8)] to-darkBlue to-90% bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]';

const PrizePool: FC<PropsWithChildren> = () => (
  <div className="justify-center md:flex md:flex-col">
    <div className="relative mb-24 hidden h-[500px] overflow-clip md:block">
      <Image
        className="pointer-events-none scale-[1.2] object-cover"
        src="/images/components/competition/revamp/prize_topFP_desktop.png"
        width={1337}
        height={664}
        alt=""
      />
      <div className="absolute top-[90px] flex w-full items-center justify-center space-x-1 xl:top-[100px]">
        <Image src="/images/components/competition/icons/animated-gift.gif" width={24} height={24} alt="" />
        <p className="bg-gradient-to-b from-[#F0A45D] to-white bg-clip-text text-h5 font-bold text-transparent">
          Total Prize Pool for Top FP
        </p>
      </div>
    </div>

    <div className="relative overflow-clip md:hidden">
      <div className={`flex h-[400px] flex-col items-center sm:h-[500px] ${radialBgClassName}`}>
        <Image
          className="absolute top-[95px] xs:top-[90px] sm:top-[80px]"
          src="/images/components/competition/revamp/prize_topFP_mobile.png"
          width={600}
          height={300}
          alt=""
        />
        <div className="absolute top-[100px] flex w-full items-center justify-center space-x-1">
          <Image src="/images/components/competition/icons/animated-gift.gif" width={24} height={24} alt="" />
          <p className="bg-gradient-to-b from-[#F0A45D] to-white bg-clip-text text-b2e text-transparent">Total Prize Pool for Top FP</p>
        </div>
      </div>

      <div className="absolute bottom-0 w-full space-y-6 px-5 pb-9">
        <div className="flex items-center justify-between">
          <div className="flex space-x-[3px] rounded-2xl bg-[#2E4371] px-3 py-[6px]">
            <Image src="/images/components/competition/revamp/timer.svg" width={16} height={16} alt="" />
            <p className="text-b3 text-highEmphasis">
              Ends in:{' '}
              <span className="text-b3e">
                <CountdownTimer date="2023-09-12T20:00:00.000+08:00" timeZone="Asia/Hong_Kong" />
              </span>
            </p>
          </div>
          <div
            className="flex space-x-[3px] text-primaryBlue"
            onClick={() => {
              $isShowMobileRules.set(true);
            }}>
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                className="fill-primaryBlue"
                d="M12.0002 10.5V4.5C12.0002 3.39533 11.1048 2.5 10.0002 2.5H3.3335C2.22883 2.5 1.3335 3.39533 1.3335 4.5V5.83333C1.3335 6.20133 1.63216 6.5 2.00016 6.5H3.3335V12.5C3.3335 13.6047 4.22883 14.5 5.3335 14.5H12.6668C13.7715 14.5 14.6668 13.6047 14.6668 12.5V11.1667C14.6668 10.7987 14.3682 10.5 14.0002 10.5H12.0002ZM10.0002 8.5C10.0002 8.868 9.7015 9.16667 9.3335 9.16667H6.00016C5.63216 9.16667 5.3335 8.868 5.3335 8.5C5.3335 8.132 5.63216 7.83333 6.00016 7.83333H9.3335C9.7015 7.83333 10.0002 8.132 10.0002 8.5ZM10.0002 11.1667C10.0002 11.5347 9.7015 11.8333 9.3335 11.8333H6.00016C5.63216 11.8333 5.3335 11.5347 5.3335 11.1667C5.3335 10.7987 5.63216 10.5 6.00016 10.5H9.3335C9.7015 10.5 10.0002 10.7987 10.0002 11.1667ZM2.66683 4.5C2.66683 4.132 2.96616 3.83333 3.3335 3.83333H8.11416C8.04083 4.042 8.00016 4.266 8.00016 4.5V5.16667H2.66683V4.5ZM13.3335 12.5C13.3335 12.868 13.0342 13.1667 12.6668 13.1667C12.2995 13.1667 12.0002 12.868 12.0002 12.5V11.8333H13.3335V12.5Z"
              />
            </svg>
            <p className="text-b2e">Rules</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PrizePool;
