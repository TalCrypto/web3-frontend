/* eslint-disable no-unused-vars */
import PrimaryButton from '@/components/common/PrimaryButton';
import { useRouter } from 'next/router';
import React from 'react';

const Title = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center py-16">
      <h1 className="text-glow-yellow text-shadow-lb mb-8 hidden text-center text-h1 md:block">TRADING COMPETITION</h1>

      <div className="m_main_title_ mb-3 md:hidden">
        <span data-text="TRADING" />
        <br />
        <span data-text="COMPETITION" />
      </div>

      <h4 className="mb-6 text-center text-h4">
        <span className="text-[#FFC93E]">Trade, Compete, Win!</span> Join our Trading Competition Today 🔥
      </h4>

      <p className="mb-9 text-center text-b1 text-highEmphasis">
        Competition Period: <span className="text-b1e">15 Aug 2023 - 15 Sep 2023</span>
      </p>

      <PrimaryButton className="px-6 py-3">Trade Now!</PrimaryButton>
    </div>
  );
};

export default Title;
