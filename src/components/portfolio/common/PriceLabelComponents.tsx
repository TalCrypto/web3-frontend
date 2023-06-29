import React from 'react';
import Image from 'next/image';
import { $currentAmm } from '@/stores/trading';
import { useStore as useNanostore } from '@nanostores/react';
import { getCollectionInformation } from '@/const/collectionList';

export function SingleRowPriceContent(props: any) {
  const { priceValue, width = 20, height = 20, className = '', isElement = false, amm } = props;
  const currentAmm: any = useNanostore($currentAmm);
  const collectionInfo = getCollectionInformation(currentAmm);
  const iconImage = amm && collectionInfo ? collectionInfo.logo : '/images/common/symbols/eth-tribe3.svg';

  return (
    <div className={`${className} flex text-[14px] font-medium`}>
      <Image src={iconImage} alt="" width={width} height={height} className="mr-[6px]" />
      {isElement ? (
        <span>{priceValue}</span>
      ) : (
        <span className={`${priceValue > 0 ? 'text-marketGreen' : priceValue < 0 ? 'text-marketRed' : ''}`}>
          {priceValue > 0 ? `${`+${priceValue}`}` : priceValue < 0 ? `${`-${priceValue.replace('-', '')}`}` : priceValue}
        </span>
      )}
    </div>
  );
}

export function DoubleRowPriceContent(props: any) {
  const { priceContent, normalContent, amm } = props;
  const collectionInfo = getCollectionInformation(amm);
  const iconImage = amm && collectionInfo ? collectionInfo.logo : '/images/common/symbols/eth-tribe3.svg';

  return (
    <div className="">
      <div className="flex items-center text-[14px] font-medium">
        <Image src={iconImage} alt="" width={20} height={20} className="mr-[6px]" />
        {priceContent}
      </div>
      <div className="mt-2 text-[14px] text-mediumEmphasis">
        <div className="ml-[26px]">{normalContent}</div>
      </div>
    </div>
  );
}

export function LargeTypeIcon(props: any) {
  const { size, isShowBalance, className, amm } = props;
  const collectionInfo = getCollectionInformation(amm);

  return (
    <div className="flex items-center">
      <div className="mr-2">
        <Image src={collectionInfo?.image} alt="" width={32} height={32} />
      </div>
      <div className="text-[14px] font-medium">
        <div className="">{collectionInfo?.displayCollectionPair}</div>
        <div className="">
          <div className={`${className} ${size > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
            {isShowBalance ? (size > 0 ? 'LONG' : 'SHORT') : '****'}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SmallTypeIcon(props: any) {
  const { size, isShowBalance, className, amm } = props;
  const collectionInfo = getCollectionInformation(amm);

  return (
    <div className="flex items-center">
      <div className="text-[14px]">
        <div className="mb-1 flex">
          <Image className="mr-[6px]" src={collectionInfo?.image} alt="" width={20} height={20} />
          {collectionInfo?.displayCollectionPair}
        </div>
        <div className="ml-[26px] text-[12px]">
          <div className={`${className} ${size > 0 ? 'text-marketGreen' : 'text-marketRed'}`}>
            {isShowBalance ? (size > 0 ? 'LONG' : 'SHORT') : '****'}
          </div>
        </div>
      </div>
    </div>
  );
}
