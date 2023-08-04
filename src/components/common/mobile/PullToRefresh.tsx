/* eslint-disable no-unused-vars */
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type PullToRefreshProps = {
  isRefreshing: boolean;
  onRefresh: () => void;
};

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
const lerp = (start: number, end: number, val: number) => (1 - val) * start + val * end;

const PullToRefresh = ({ isRefreshing, onRefresh }: PullToRefreshProps) => {
  const [willRefresh, setWillRefresh] = useState(false);

  useEffect(() => {
    const mobileView = document.querySelector('.mobile-view');
    const pullToRefresh = document.getElementById('pullToRefresh');

    const pullThreshold = 200; // in px
    let touchstartY = 0;
    let touchDiff = 0;

    if (!pullToRefresh) return () => {};

    const startHandler = (e: TouchEvent) => {
      touchstartY = e.touches[0].clientY;
    };

    const moveHandler = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      touchDiff = touchY - touchstartY;
      if (mobileView?.scrollTop === 0) {
        const translateMult = clamp(touchDiff / pullThreshold, 0, 1);
        const lerpVal = lerp(-80, 0, translateMult);
        pullToRefresh.style.transform = `translate(0, ${lerpVal}px)`;
      }
    };

    const endHandler = () => {
      pullToRefresh.style.transform = 'translate(0, -80px)';
      if (mobileView?.scrollTop === 0 && touchDiff > pullThreshold) {
        onRefresh();
      }
    };

    document.addEventListener('touchstart', startHandler);
    document.addEventListener('touchmove', moveHandler);
    document.addEventListener('touchend', endHandler);
    return () => {
      document.removeEventListener('touchstart', startHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', endHandler);
    };
  }, [onRefresh]);

  return (
    <div
      id="pullToRefresh"
      className={`${willRefresh ? '' : ''} fixed top-0 z-10 flex w-full -translate-y-[80px] flex-col items-center 
      justify-center bg-darkBlue py-4 text-highEmphasis transition`}>
      <p>Pull to refresh</p>
      <div>
        <Image src="/images/components/common/arrow-down.svg" alt="" width={24} height={24} />
      </div>
    </div>
  );
};

export default PullToRefresh;
