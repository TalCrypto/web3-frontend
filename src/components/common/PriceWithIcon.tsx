import React, { useEffect, useState } from 'react';
import Image from 'next/image';

function Base(props: any, image: any) {
  const { priceValue = 0, children, colorChange, large, medium, className } = props;
  const [localValue, setLocalValue] = useState('--.--');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (priceValue !== 0 && priceValue !== '0.00') {
      if (colorChange && localValue !== '-.--') {
        const textColor = priceValue > localValue ? 'greentext' : priceValue < localValue ? 'redtext' : '';
        setColor(textColor);
        setTimeout(() => {
          setColor('');
        }, 1000);
      }
      setLocalValue(priceValue);
    }
  }, [priceValue, colorChange, localValue]);

  return (
    <div
      className={`flex text-highEmphasis ${color} ${className} items-center
      ${large ? `text-[32px] font-semibold` : medium ? `text-[24px] font-semibold` : 'text-[14px]'}
    `}>
      {image}
      {localValue}
      {children}
    </div>
  );
}

export function PriceWithIcon(props: any) {
  return Base(
    props,
    <Image
      src="/images/common/symbols/eth-tribe3.svg"
      className="mr-[6px]"
      width={props.width ? props.width : 16}
      height={props.height ? props.height : 16}
      alt=""
    />
  );
}

export function PriceWithUsdc(props: any) {
  return Base(
    props,
    <Image
      src="/images/common/symbols/usdc.svg"
      className="mr-[6px]"
      width={props.width ? props.width : 16}
      height={props.height ? props.height : 16}
      alt=""
    />
  );
}
