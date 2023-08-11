/* eslint-disable no-unused-vars */
import PrimaryButton from '@/components/common/PrimaryButton';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';

const Title = () => {
  const router = useRouter();
  const videoRef: any = useRef(null);

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

        <PrimaryButton onClick={() => router.push('/trade/bayc')} className="px-6 py-3 text-b1e">
          Trade Now!
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Title;
