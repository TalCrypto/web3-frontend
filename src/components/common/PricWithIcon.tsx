import React, { useEffect, useState } from 'react';
import Image from 'next/image';

function base(props: any, image: any) {
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
      className={`flex text-white/[.87] ${color} ${className}
      ${large ? `text-[36px] font-semibold` : 'text-[14px]'}
      ${medium ? `text-[24px] font-semibold` : 'text-[14px]'}
    `}>
      {image}
      {localValue}
      {children}
    </div>
  );
}

export function PriceWithIcon(props: any) {
  return base(
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
  return base(
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
