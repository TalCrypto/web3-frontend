import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

function MobileCommonFooterInfo() {
  const router = useRouter();
  const title =
    router.pathname === '/portfolio'
      ? 'Portfolio'
      : router.pathname === '/airdrop'
      ? 'Airdrop'
      : router.pathname === '/terms'
      ? 'Terms & Conditions'
      : '';

  const gotoTrade = () => {
    router.push(`/trade`);
  };

  return (
    <>
      <Image
        onClick={gotoTrade}
        className="absolute left-[20px]"
        src="/images/components/portfolio/footer_logo.svg"
        width={24}
        height={24}
        alt=""
      />
      <div className="w-full pl-[66px] text-center text-[15px] text-highEmphasis">{title}</div>
    </>
  );
}

export default MobileCommonFooterInfo;
