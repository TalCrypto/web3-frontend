import React from 'react';
import Image from 'next/image';

// vertical gradient gray
export const BoxGradient = (props: any) => {
  const { borderWidth = 1, borderRadius = 6, isBottomRounded = true, isTopRounded = true, children } = props;

  return (
    <div
      className={`
        to-lightBluep-[1px] relative overflow-clip bg-gradient-to-b from-secondaryBlue p-[${borderWidth}px]
        ${isTopRounded ? `rounded-t-[${borderRadius}px]` : ''}
        ${isBottomRounded ? `rounded-b-[${borderRadius}px]` : ''}
      `}>
      <div
        className={`bg-lightBlue  m-[${borderWidth}px]
          ${isTopRounded ? `rounded-t-[${borderRadius}px]` : ''}
          ${isBottomRounded ? `rounded-b-[${borderRadius}px]` : ''}
        `}>
        {children}
      </div>
    </div>
  );
};

// horizontal gradient blue to pink
export const BoxGradientBluePink = (props: any) => {
  const { borderWidth = 2, borderRadius = 12, isBottomRounded = true, isTopRounded = true, children } = props;

  return (
    <div
      className={`relative bg-gradient-to-r from-gradientBlue to-gradientPink p-[${borderWidth}px]
      ${isTopRounded ? `rounded-t-[${borderRadius}px]` : ''}
      ${isBottomRounded ? `rounded-b-[${borderRadius}px]` : ''}
    `}>
      <div
        className={`bg-lightBlue  m-[${borderWidth}px]
          ${isTopRounded ? `rounded-t-[${borderRadius}px]` : ''}
          ${isBottomRounded ? `rounded-b-[${borderRadius}px]` : ''}
        `}>
        {children}
      </div>
    </div>
  );
};

export const BoxLocked = (props: any) => {
  const { blur = 10, style = {}, iconStyle = {} } = props;

  return (
    <div
      style={{
        backdropFilter: `blur(${blur}px)`,
        zIndex: 1,
        ...style
      }}
      className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-lightBlue/50 backdrop-blur-[10px]">
      <div style={iconStyle}>
        <Image src="/images/components/airdrop/lock.svg" alt="" width={43} height={43} />
      </div>
    </div>
  );
};

export const NewBoxLock = () => (
  <div
    style={{
      backdropFilter: 'blur(0px)',
      zIndex: 1
    }}
    className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-lightBlue/50">
    <div>
      <Image src="/images/components/airdrop/lock.svg" alt="" width={43} height={43} />
    </div>
  </div>
);
