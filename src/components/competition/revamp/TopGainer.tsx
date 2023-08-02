/* eslint-disable no-unused-vars */
import { useRouter } from 'next/router';
import React from 'react';
import TopThree from './TopThree';

const TopGainer = () => {
  const router = useRouter();
  return (
    <div>
      <TopThree />
    </div>
  );
};

export default TopGainer;
