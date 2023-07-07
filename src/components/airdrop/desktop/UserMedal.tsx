import React from 'react';
import Image from 'next/image';
import Tooltip from '@/components/common/Tooltip';

const UserMedal = (props: any) => {
  let medal = null;
  const { rank, isBan = false, isYou = false, isUnranked = false } = props;

  if (isBan) {
    medal = (
      <div className="w-[50px]">
        <Image src="/images/components/airdrop/banned.svg" width={50} height={26} alt="" />
      </div>
    );
  } else if (isUnranked) {
    medal = <div className="flex h-[38px] items-center text-[12px] font-bold">Unranked</div>;
  } else if (rank <= 3) {
    medal = (
      <div className="w-[50px]">
        <Image src={`/images/components/airdrop/medal/medal${rank}.svg`} width={50} height={28} alt="" />
      </div>
    );
  } else {
    medal = (
      <div className={`px-3 ${isYou ? 'pb-[10px]' : ''}`}>
        <div
          className="relative flex h-[26px] w-[26px] items-center justify-center
            rounded-full text-center text-[13px] font-semibold text-highEmphasis">
          <Image className="absolute left-0 top-0" src="/images/components/airdrop/medal/outer-circle.svg" width={26} height={26} alt="" />
          <Image
            className="absolute left-[2px] top-[2px]"
            src="/images/components/airdrop/medal/inner-circle.svg"
            width={22}
            height={22}
            alt=""
          />
          <div className="z-10">{rank}</div>
        </div>
      </div>
    );
  }

  const content = (
    <div className="relative">
      {medal}
      {isYou ? (
        <div style={{ left: 'calc(50% - 13px)' }} className="absolute bottom-1 h-[12px] w-[27px]">
          <Image src="/images/components/airdrop/YOU.svg" width={27} height={12} alt="" />
        </div>
      ) : null}
    </div>
  );

  if (isBan) {
    return (
      <Tooltip direction="top" content="This user was disqualified">
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default UserMedal;
