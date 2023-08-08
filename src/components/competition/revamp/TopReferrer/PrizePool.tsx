/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { $isShowMobileDrawer } from '@/stores/competition';
import Image from 'next/image';
import React, { FC, PropsWithChildren } from 'react';

const radialBgClassName =
  'from-[rgba(78,85,121,0.6)] to-darkBlue to-100% bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] lg:bg-[radial-gradient(farthest-side_at_center,_var(--tw-gradient-stops))] lg:to-transparent lg:to-85%';

const PrizePool: FC<PropsWithChildren> = () => (
  <div className="justify-center md:flex md:flex-col">
    <div className="mb-24 hidden md:flex md:flex-col md:items-center">
      <Image
        className="pointer-events-none scale-[1.4] object-cover"
        src="/images/components/competition/revamp/prizepool-top-referrer.svg"
        width={937}
        height={345}
        alt=""
      />
    </div>

    <div className="relative overflow-clip md:hidden">
      <div className="flex flex-col items-center">
        <Image
          className="h-[400px] object-cover sm:scale-[1.1]"
          src="/images/components/competition/revamp/prizepool-top-referrer_m.svg"
          width={375}
          height={529}
          alt=""
        />
      </div>

      <div className="absolute bottom-0 w-full space-y-6 px-5 pb-9">
        <div className="flex justify-center">
          <div className="flex space-x-[3px] rounded-2xl bg-[#2E4371] px-3 py-[6px]">
            <Image src="/images/components/competition/revamp/timer.svg" width={16} height={16} alt="" />
            <p className="text-b3 text-highEmphasis">
              Ends in: <span className="text-b3e">4d 3h 12m</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div
            className="flex space-x-[3px] text-primaryBlue"
            onClick={() => {
              $isShowMobileDrawer.set(true);
            }}>
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_17315_22649)">
                <path
                  d="M8 3.56982C5.5902 3.56982 3.63636 5.48579 3.63636 7.84889C3.63636 10.212 5.5902 12.128 8 12.128C10.4098 12.128 12.3636 10.212 12.3636 7.84889C12.3636 5.48579 10.4098 3.56982 8 3.56982ZM5.08523 9.26968H10.9148C10.3778 10.3227 9.28267 11.0582 8 11.0582C6.71733 11.0582 5.62216 10.3227 5.08523 9.26968ZM5.47727 12.8634C4.02113 13.2382 2.84949 14.0769 2.20215 15.7833C2.08513 16.0918 2.32547 16.407 2.65539 16.407H13.3446C13.6745 16.407 13.9149 16.0918 13.7979 15.7833C13.1505 14.0769 11.9789 13.2382 10.5227 12.8634C9.7706 13.2583 8.91193 13.4819 8 13.4819C7.08807 13.4819 6.2294 13.2583 5.47727 12.8634Z"
                  fill="url(#paint0_linear_17315_22649)"
                />
                <path
                  d="M9.67151 3.98837H6.32267L5.625 1.19767L7.02035 2.31395L7.99709 0.5L8.97384 2.31395L10.3692 1.19767L9.67151 3.98837Z"
                  fill="#FFC107"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_17315_22649"
                  x1="15.908"
                  y1="9.98843"
                  x2="-0.0671589"
                  y2="11.2854"
                  gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F703D9" />
                  <stop offset="0.427083" stopColor="#795AF4" />
                  <stop offset="0.921875" stopColor="#04AEFC" />
                </linearGradient>
                <clipPath id="clip0_17315_22649">
                  <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                </clipPath>
              </defs>
            </svg>
            <p className="text-b2e">My Referrer</p>
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
            <p className="text-b2e">Rules</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PrizePool;
