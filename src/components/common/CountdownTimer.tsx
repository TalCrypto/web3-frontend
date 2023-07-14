import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface CountdownTimerProps {
  date: string;
  timeZone: string;
  className: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ date, timeZone, className = '' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const eventTime = new Date(date).toLocaleString('en-US', { timeZone });

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const remainingTime = new Date(eventTime).getTime() - currentTime.getTime();

    if (remainingTime <= 0) {
      // Countdown has reached or passed the target time
      // You can handle this case as per your requirement
      // For now, we'll set all values to 0
      setDays(0);
      setHours(0);
      setMinutes(0);
    } else {
      const remainingSeconds = Math.floor(remainingTime / 1000);
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      const remainingHours = Math.floor(remainingMinutes / 60);
      const remainingDays = Math.floor(remainingHours / 24);

      setDays(remainingDays);
      setHours(remainingHours % 24);
      setMinutes(remainingMinutes % 60);
    }
  }, [currentTime, eventTime]);

  return (
    <div className={`flex items-center justify-center space-x-[8px] overflow-clip ${className}`}>
      <Image className="mb-[1px]" src="/images/common/timer.svg" width={12} height={13.34} alt="Timer Icon" />
      <div className="flex space-x-1 text-center text-b2 text-mediumEmphasis">
        <span id="cd-d" className="animate__animated animate__faster text-highEmphasis">
          {days}
        </span>
        <span>Days</span>
        <span id="cd-h" className="animate__animated animate__faster text-highEmphasis">
          {hours}
        </span>
        <span>Hours</span>
        <span id="cd-m" className="animate__animated animate__faster text-highEmphasis">
          {minutes}
        </span>
        <span>Minutes</span>
        <span>left</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
