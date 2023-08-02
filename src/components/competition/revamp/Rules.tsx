import React from 'react';

const Item = () => (
  <div className="flex flex-1 flex-col items-center">
    <p className="mb-[10px] text-b3 text-mediumEmphasis">15 Aug 2023</p>
    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-primaryBlue">
      <p>W1</p>
    </div>
    <p className="text-b3e text-highEmphasis">1st Round Starts</p>
  </div>
);

const Rules = () => (
  <div>
    <p className="mb-7 text-center text-h4">Rules</p>

    <div className="relative">
      <div className="absolute left-20 right-20 top-[42px] h-[6px] rounded-[3px] bg-[#2E4371]">
        <div className="h-full w-[30%] rounded-[3px] bg-primaryBlue" />
      </div>

      <div className="relative flex items-center">
        <Item />
        <Item />
        <Item />
        <Item />
        <Item />
      </div>
    </div>
  </div>
);

export default Rules;
