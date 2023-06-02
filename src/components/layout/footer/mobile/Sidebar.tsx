import React, { useState } from 'react';
import Image from 'next/image';

function Sidebar() {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const modules = [
    {
      name: 'Collections',
      handle: () => {
        window.location.href = '/marketoverview';
      }
    },
    {
      name: 'Portfolio',
      handle: () => {
        window.location.href = '/dashboard';
      }
    },
    {
      name: 'Trade',
      handle: () => {
        window.location.href = '/trade/degods';
      }
    },
    {
      name: 'Leaderboard',
      handle: () => {
        window.location.href = '/leaderboard';
      }
    },
    {
      name: 'Battle',
      handle: () => {
        window.location.href = '/comingsoonbattle';
      }
    },
    {
      name: 'Avatar',
      handle: () => {
        window.location.href = '/comingsoonavatar';
      }
    }
  ];

  return (
    <div
      className="absolute left-0 top-0 box-border h-full w-full
        transform-none rounded-tl-[4px] bg-[#202249] shadow-md">
      <div className="z-1 relative box-border h-full overflow-auto overscroll-auto">
        <div className="h-[80%] overflow-auto">
          {modules.map(({ name, handle }) => (
            <div key={name} className="ml-8 mt-6 text-base font-medium text-white/[.87]" onClick={handle}>
              {name}
            </div>
          ))}

          <div className="ml-8 mt-6 h-[1px] bg-[#c3d8ff]/[.48] pr-9" />
          <div className="mobile_no-margin__NrHZj ml-8 mt-6 flex text-base font-medium text-white/[.87]">
            Referral <Image src="/images/mobile/common/gift.svg" width={16} height={16} alt="" className="ml-[6px]" />
          </div>
          <div className="relative ml-8 mt-6 flex flex-col bg-transparent">
            <div
              className="w-full pr-6"
              onClick={() => {
                setIsWalletOpen(!isWalletOpen);
              }}>
              <div className="flex items-center justify-between">
                Wallet
                <Image
                  className={isWalletOpen ? 'rotate-90' : ''}
                  src="/images/mobile/common/angle-right.png"
                  alt=""
                  width={6}
                  height={10}
                />
              </div>
            </div>
            {isWalletOpen ? (
              <div className="accordion-item-content">
                <div className="mobile_top__bW5rl mt-6 pl-6 text-[14px] font-medium text-white/[.87]">Disconnect Wallet</div>
                <div className="mt-6 pl-6 text-[14px] font-medium text-white/[.87]">Get GoerliETH</div>
                <div className="mt-6 pl-6 text-[14px] font-medium text-white/[.87]">Get TETH</div>
              </div>
            ) : null}
          </div>
          <div className="relative ml-8 mt-6 flex flex-col bg-transparent">
            <div
              className="w-full pr-6"
              onClick={() => {
                setIsFeedbackOpen(!isFeedbackOpen);
              }}>
              <div className="flex items-center justify-between">
                Feedback
                <Image
                  className={isFeedbackOpen ? 'rotate-90' : ''}
                  src="/images/mobile/common/angle-right.png"
                  alt=""
                  width={6}
                  height={10}
                />
              </div>
            </div>
            {isFeedbackOpen ? (
              <div className="accordion-item-content">
                <div className="mobile_top__bW5rl mt-6 pl-6 text-[14px] font-medium text-white/[.87]">Product Feedback</div>
                <div className="mt-6 pl-6 text-[14px] font-medium text-white/[.87]">Report Issues</div>
                <div className="mt-6 pl-6 text-[14px] font-medium text-white/[.87]">Partnership</div>
              </div>
            ) : null}
          </div>
          <div className="mobile_no-margin__NrHZj ml-8 mt-6 text-base font-medium text-white/[.87]">Docs</div>
        </div>
        <div
          className="sidebar-profile absolute bottom-0 left-0 right-0 mt-6 h-[110px]
            bg-[#000000] pt-[10px]">
          <div className="px-6 pb-0 pt-2">
            <div className="flex flex-initial items-center justify-between">
              <div className="text-[16px] font-semibold text-white/[.87]">Unnamed</div>
              <div className="text-semibold text-[12px] text-[#2574fb]">View&gt;</div>
            </div>
            <div className="mt-2 flex flex-initial items-center justify-start">
              <Image src="/images/mobile/common/crown_silver.png" alt="" width={17} height={15} className="mr-1" />
              <span className="text-[14px] text-[#D9D9D9]">NO TITLE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
