import Image from 'next/image';
import React from 'react';

const Portfolio: React.FC = () => (
  <div className="md:grid md:grid-cols-2 xl:grid-cols-4">
    {/* card */}
    <div
      className={`rounded-[6px] border border-[rgba(113,170,255,0.25)] 
        bg-gradient-to-b from-[#37387280] to-[#0C0D1F80] p-[24px] text-b2 text-mediumEmphasis`}>
      <div className="flex">
        <div className="flex-1">
          <span
            className={`mb-[6px] bg-gradient-to-r from-gradientBlue via-[#795AF4] to-gradientPink 
          bg-clip-text text-h5 text-transparent`}>
            BAYC
          </span>
          <p className="mb-[24px] text-b3 text-highEmphasis">PUNKS/WETH</p>
        </div>
        <div>
          <Image src="/images/collections/normal/bayc.svg" alt="" width={40} height={40} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex">
          <p className="flex-1">Unrealized P/L</p>
          <div className="flex flex-1 space-x-[6px]">
            <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={16} height={16} />
            <p className="text-marketGreen">+0.1234</p>
          </div>
        </div>
        <div className="flex">
          <p className="flex-1">Notional</p>
          <div className="flex flex-1 space-x-[6px]">
            <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={16} height={16} />
            <p className="text-highEmphasis">2.1234</p>
          </div>
        </div>
        <div className="flex">
          <p className="flex-1">Leverage</p>
          <p className="flex-1 text-highEmphasis">2.13X</p>
        </div>
        <div className="flex">
          <p className="flex-1">Type</p>
          <p className="flex-1 text-marketGreen">LONG</p>
        </div>
      </div>
    </div>
    {/* end of card */}
  </div>
);

export default Portfolio;
