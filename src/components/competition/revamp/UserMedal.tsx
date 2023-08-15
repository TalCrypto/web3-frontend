import React from 'react';
import Image from 'next/image';
import Tooltip from '@/components/common/Tooltip';

const UserMedal = (props: any) => {
  const { rank, isBan = false, isYou = false, isUnranked = false, type } = props;
  let medal = null;
  if (isBan) {
    medal = (
      <div className="flex items-center">
        <Image alt="banned icon" src="/images/components/airdrop/banned.svg" width={50} height={26} />
      </div>
    );
  } else if (rank <= 3 && rank !== 0) {
    if (type === 'losers') {
      medal = (
        <div className="flex items-center pl-5">
          <Image alt="losers icon type" src={`/images/components/competition/icons/losers${rank}.svg`} width={22.25} height={21.89} />
        </div>
      );
    } else {
      medal = (
        <div className="flex items-center">
          <Image alt="ranked icon" src={`/images/components/airdrop/medal/medal${rank}.svg`} width={50} height={28} />
        </div>
      );
    }
  } else {
    medal = (
      <div className="px-[12px]">
        <div
          className="relative flex h-[26px] w-[26px] items-center justify-center
            rounded-full text-center text-[13px] font-semibold text-highEmphasis">
          {isUnranked ? (
            'Unranked'
          ) : (
            <>
              <Image
                className="absolute left-0 top-0"
                src="/images/components/airdrop/medal/outer-circle.svg"
                width={26}
                height={26}
                alt=""
              />
              <Image
                className="absolute left-[2px] top-[2px]"
                src="/images/components/airdrop/medal/inner-circle.svg"
                width={22}
                height={22}
                alt=""
              />
              <div className="z-[1]">{rank}</div>
            </>
          )}
        </div>
      </div>
    );
  }
  const content = (
    <div className="relative">
      {medal}
      {isYou ? (
        <div style={{ left: 'calc(50% - 13px)' }} className="absolute -bottom-[2px] h-[12px] w-[27px]">
          <Image alt="YOU" src="/images/components/airdrop/YOU.svg" width={27} height={12} />
        </div>
      ) : null}
    </div>
  );

  if (isBan) {
    return (
      <Tooltip placement="top" content="This user was disqualified">
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default UserMedal;
