import React from 'react';
import Image from 'next/image';

const CustomReward = (props: any) => {
  const { prizeLeftText, prizeRightText, mainClassName = '', mainStyle = {} } = props;

  return (
    <div className="md:mb-4">
      <div className="h-[1px] bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
      <div className={`flex h-auto min-h-[32px] w-full items-center ${mainClassName}`} style={mainStyle}>
        <Image alt="animated gift" src="/images/components/competition/icons/animated-gift.gif" width={22} height={22} />
        <div />
        <div className="text-glow-yellow pl-[7px]">
          <span className="text-b3">{prizeLeftText} </span>
          <span className="text-b3e">{prizeRightText}</span>
        </div>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
    </div>
  );
};

export default CustomReward;
