import React from 'react';
import Image from 'next/image';
import { convertStringToNumber } from '@/utils/localeConversion';

const CustomValue = (props: any) => {
  const { ethIcon, value } = props;
  return (
    <div className="flex items-center justify-end md:justify-normal">
      {ethIcon ? <Image alt="eth icon" src="/images/common/symbols/eth-tribe3.svg" width={16} height={16} /> : null}
      <span
        className={`text-b2e ${ethIcon ? 'pl-1' : ''}`}
        style={{
          color: convertStringToNumber(value) > 0 ? '#78F363' : convertStringToNumber(value) < 0 ? '#FF5656' : 'rgba(255, 255, 255, 0.87)'
        }}>
        {value}
      </span>
    </div>
  );
};

export default CustomValue;
