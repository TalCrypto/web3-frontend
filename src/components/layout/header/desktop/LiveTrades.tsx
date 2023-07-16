import React from 'react';
import Image from 'next/image';
import { $isShowDiscordModal } from '@/stores/modal';

export default function LiveTrades() {
  const openDiscordModal = () => {
    localStorage.setItem('isDiscordShown', 'true');
    $isShowDiscordModal.set(true);
  };
  return (
    <div className="navbar-outer">
      <button type="button" className="navbar-button connected" onClick={openDiscordModal}>
        <div className="btn-connect-before absolute bottom-0 left-0 right-0 top-0 z-10 rounded-full p-[1px]" />
        <div className="flex flex-row items-center justify-center px-5" id="login-btn">
          <Image src="/images/components/layout/header/live-trades.svg" width={20} height={20} alt="" className="mr-[4px]" />
          Live Trades
        </div>
      </button>
    </div>
  );
}
