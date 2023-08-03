/* eslint-disable no-unused-vars */
import PrimaryButton from '@/components/common/PrimaryButton';
import { useRouter } from 'next/router';
import React from 'react';

const Title = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center py-16">
      <h1 className="text-glow-yellow text-shadow-lb mb-8 hidden text-center text-h1 md:block">TRADING COMPETITION</h1>

      <div className="m_main_title_ mb-9 md:hidden">
        <span data-text="TRADING" />
        <br />
        <span data-text="COMPETITION" />
      </div>

      <div className="lgtext-h4 mb-6 flex flex-col text-center text-h5 lg:flex-row lg:space-x-2">
        <p className="text-[#FFC93E]">Trade, Compete, Win!</p>
        <p>Join our Trading Competition Today 🔥</p>
      </div>

      <div className="mb-9 flex flex-col text-center text-b1 text-highEmphasis lg:flex-row lg:space-x-2">
        <p>Competition Period:</p>
        <p className="text-b1e">15 Aug 2023 - 15 Sep 2023</p>
      </div>

      <PrimaryButton className="px-6 py-3 text-b1e">Trade Now!</PrimaryButton>
    </div>
  );
};

export default Title;
