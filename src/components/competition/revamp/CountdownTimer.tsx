/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  date: string;
  timeZone: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ date, timeZone }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

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
      setSeconds(remainingSeconds % 60);
    }
  }, [currentTime, eventTime]);

  return (
    <>
      {days}d {hours}h {minutes}m
    </>
  );
};

export default CountdownTimer;
