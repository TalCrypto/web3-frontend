import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const ScrollTopButton = () => {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTopValue = document.documentElement.scrollTop;
      setScrollTop(scrollTopValue);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    document.documentElement.scrollTo({ behavior: 'smooth', top: 0 });
  };

  const isVisible = scrollTop >= 300;

  return (
    <div
      className={`
        transform transition duration-[400] ease-in-out
        ${isVisible ? '' : 'translate-y-[120px]'}
        fixed bottom-[60px] right-[40px] z-10 hidden cursor-pointer text-highEmphasis 
        hover:text-white lg:block 2xl:right-[calc(50%-700px)]
      `}
      onClick={scrollToTop}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black">
        <Image src="/images/common/scroll_top_rocket.svg" width={26} height={26} alt="" />
      </div>
      <p className="mt-1 text-center text-xs">TOP</p>
    </div>
  );
};

export default ScrollTopButton;
