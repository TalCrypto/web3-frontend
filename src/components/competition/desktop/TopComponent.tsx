/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import React from 'react';
import Image from 'next/image';
import CountdownTimer from '@/components/common/CountdownTimer';
import { useRouter } from 'next/router';
import MobileDropdown from '@/components/competition/desktop/MobileDropdown';
import { useStore as useNanostore } from '@nanostores/react';
import { $activeDropdown, $asCompetitionLeaderboardUpdateTrigger } from '@/stores/competition';

const TopComponent = () => {
  const router = useRouter();
  const openRules = () => window.open('https://mirror.xyz/tribe3.eth/Zjg7s1ORT06DtFJXOBDgTbW2O8v4y6bKaCUhKSsxDcI', '_blank');
  const activeDropdown = useNanostore($activeDropdown);

  return (
    <>
      <div className={`${activeDropdown === 0 ? '' : 'hidden md:block'} relative mb-6 px-6 pb-6 pt-6 md:mt-12 md:px-0`}>
        {/* view rule mobile btn */}
        <div className="mb-6 flex justify-end md:hidden">
          <div className="flex cursor-pointer items-center space-x-[5px]" onClick={openRules}>
            <Image className="mb-[1px]" src="/images/common/rules.svg" alt="rules" width={16} height={16} />
            <span className="text-b2e">View Rules</span>
          </div>
        </div>

        <h1 className="text-glow-yellow text-shadow-lb mb-[14px] hidden text-center text-h1 md:block">TRADING COMPETITION</h1>

        <div className="m_main_title_ mb-3 md:hidden">
          <span data-text="TRADING" />
          <br />
          <span data-text="COMPETITION" />
        </div>

        <CountdownTimer className="mb-9 md:mb-11" date="2023-07-16 17:00:00" timeZone="Asia/Hong_Kong" />
        <h5 className="mb-9 flex flex-col justify-center text-center text-h5 md:flex-row md:space-x-2">
          <span className="text-[#3EF3FF]">Trade, Compete, Win! </span>
          <span>Join our Trading Competition Today</span>
        </h5>
        <div className="item-center flex justify-center">
          <button
            type="button"
            className="rounded bg-primaryBlue px-6 py-[12px] text-b1e hover:bg-primaryBlueHover"
            onClick={() => router.push('/trade/MILADY')}>
            Trade Now !
          </button>
        </div>
        <div className="absolute bottom-0 right-0 hidden items-center justify-center md:flex">
          <div className="mr-2 flex cursor-pointer items-center justify-center" onClick={openRules}>
            <Image className="mb-[1px]" src="/images/common/rules.svg" alt="rules" width={20} height={18} />
            <span className="pl-[5.33px] text-b2e">View Rules</span>
          </div>
          <div className="flex w-56 items-center justify-end">
            <div
              className="flex cursor-pointer items-center"
              onClick={() => {
                $asCompetitionLeaderboardUpdateTrigger.set(!$asCompetitionLeaderboardUpdateTrigger.get());
              }}>
              <Image
                alt="refresh"
                // className={`${leaderboardIsLoading ? 'animate-spin' : ''}`}
                src="/images/components/airdrop/refresh.svg"
                width={30}
                height={30}
              />
              <span className="pl-[1px] text-b2e">{false ? 'Updating Leaderboards...' : 'Update Leaderboards'}</span>
            </div>
          </div>
        </div>
      </div>
      <MobileDropdown />
    </>
  );
};

export default TopComponent;
