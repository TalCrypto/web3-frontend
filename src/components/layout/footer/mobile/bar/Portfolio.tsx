import React from 'react';
import Image from 'next/image';

function MobilePortfolioFooterInfo() {
  return (
    <>
      <Image className="absolute left-[20px]" src="/images/components/portfolio/footer_logo.svg" width={24} height={24} alt="" />
      <div className="w-full pl-[66px] text-center text-[15px] text-highEmphasis">Portfolio</div>
    </>
  );
}

export default MobilePortfolioFooterInfo;
