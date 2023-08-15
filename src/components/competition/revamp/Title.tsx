/* eslint-disable no-unused-vars */
import PrimaryButton from '@/components/common/PrimaryButton';
import { DEFAULT_CHAIN } from '@/const/supportedChains';
import { $isShowLoginModal, $isShowMobileTncModal, $showSwitchNetworkErrorModal } from '@/stores/modal';
import { $userIsConnected, $userIsWrongNetwork } from '@/stores/user';
import { $isMobileScreen } from '@/stores/window';
import { useStore } from '@nanostores/react';
import { useWeb3Modal } from '@web3modal/react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { useSwitchNetwork } from 'wagmi';

const Title = () => {
  const { open } = useWeb3Modal();
  const { switchNetwork } = useSwitchNetwork();
  const router = useRouter();
  const videoRef: any = useRef(null);

  const isConnected = useStore($userIsConnected);
  const isWrongNetwork = useStore($userIsWrongNetwork);
  const isMobileScreen = useStore($isMobileScreen);

  useEffect(() => {
    const handleUserInteraction = () => {
      // Play the video when the user interacts with the site
      if (videoRef.current) {
        videoRef.playsInline = true;
        videoRef.current.play();
      }
    };

    // Listen for user interaction events (e.g., click, touch, key press)
    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  const renderButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (isWrongNetwork) return 'Switch to Arbitrum';
    return 'Trade Now!';
  };

  const handleButton = () => {
    if (!isConnected) {
      if (isMobileScreen) {
        const localStorageTncApproved = localStorage.getItem('isTncApproved') === 'true';
        if (!localStorageTncApproved) {
          $isShowMobileTncModal.set(true);
          return;
        }
        open();
        return;
      }
      $isShowLoginModal.set(true);
    } else if (isWrongNetwork) {
      if (switchNetwork) {
        switchNetwork(DEFAULT_CHAIN.id);
      } else {
        $showSwitchNetworkErrorModal.set(true);
      }
    } else {
      router.push('/trade/bayc');
    }
  };

  return (
    <div className="relative">
      <video
        // onError={failed}
        ref={videoRef}
        autoPlay
        playsInline
        loop
        muted
        preload="auto"
        className="absolute top-0 z-[-1] h-full w-full object-fill md:hidden">
        <source src="/images/components/competition/backgrounds/CompetitionBgVideo.mp4" type="video/mp4" />
        {/* Your browser does not support the video tag. */}
      </video>
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
          <p className="text-b1e">15 Aug 2023 - 12 Sep 2023</p>
        </div>

        <PrimaryButton onClick={handleButton} className="px-6 py-3 text-b1e">
          {renderButtonText()}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Title;
