import React from 'react';
import Image from 'next/image';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';

export function ExplorerButton(props: any) {
  const { txHash, onClick, className = '' } = props;
  return (
    <a
      href={`${process.env.NEXT_PUBLIC_TRANSACTIONS_DETAILS_URL}${txHash}`}
      onClick={onClick}
      target="_blank"
      rel="noreferrer"
      className={className}>
      <Image alt="" src="/images/common/out.svg" width={24} height={24} />
    </a>
  );
}

export function LiquidationWarning() {
  return (
    <div className="flex items-start">
      <Image src="/images/common/alert/dashboard_notice.svg" alt="" className="mr-[6px]" width={16} height={16} />
      <div className="text-[12px] text-warn">Your position has been liquidated because it no longer meet the collateral requirement.</div>
    </div>
  );
}

export function DetailRowWithPriceIcon(props: any) {
  const { label, content } = props;
  const numberVal = Number(content);
  return (
    <div className="mt-6 flex justify-between text-[14px]">
      <div>{label}</div>
      <div className="text-white">
        <PriceWithIcon className={`${numberVal > 0 ? 'plus' : numberVal < 0 ? 'minus' : ''}`} priceValue={content} />
      </div>
    </div>
  );
}

export function LargeEthPrice(props: any) {
  const { pnlValue } = props;

  return (
    <div className="row eths">
      <div className="flex">
        <Image src="/images/common/symbols/eth-tribe3.svg" alt="" className="eth-icon" width={36} height={36} />
        <span
          className={`ml-1 text-[36px] font-semibold
            ${Number(pnlValue) > 0 ? 'text-marketGreen' : Number(pnlValue) < 0 ? 'text-marketRed' : ''}`}>
          {(Number(pnlValue) > 0 ? '+' : '') + (Number(pnlValue) === 0 ? '0.00' : pnlValue)}
        </span>
      </div>
    </div>
  );
}

export function NormalEthPrice(props: any) {
  const { price } = props;

  return (
    <div className="flex">
      <div className="flex">
        <Image src="/images/common/symbols/eth-tribe3.svg" alt="" className="eth-icon" width={20} height={20} />
        <span className="ml-1 text-[16px] font-medium">{price}</span>
      </div>
    </div>
  );
}
