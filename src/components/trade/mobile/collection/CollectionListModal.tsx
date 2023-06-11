import React from 'react';
import { useStore as useNanostore } from '@nanostores/react';
import collectionList from '@/const/collectionList';
import Image from 'next/image';
import { PriceWithIcon } from '@/components/common/PricWithIcon';
import { calculateNumber, formatterValue, isPositive } from '@/utils/calculateNumbers';
import { wsCurrentToken } from '@/stores/WalletState';

export default function CollectionListModal(props: any) {
  const { marketData, isShowModal, setIsShowModal } = props;
  const currentToken = useNanostore(wsCurrentToken);

  const handleMap = (item: any, index: any) => {
    const targetCollection = marketData.filter((param: any) => param.amm === item.amm);
    const collections = collectionList.filter((param: any) => item.amm === param.amm);
    const defaultValues = { futurePrice: 0, priceChangeRatio24h: 0 };
    const { futurePrice, priceChangeRatio24h } = targetCollection.length !== 0 ? targetCollection[0] : defaultValues;

    return (
      <div
        key={index}
        className="flex justify-between px-5 py-3"
        onClick={() => {
          // logHelper('switchCollection_collection_pressed', holderAddress, {
          //   current_collection: collectionInfo.collection,
          //   new_collection: collections[0].collection
          // });
          wsCurrentToken.set(collections[0].collection || 'DEGODS');
          setIsShowModal(false);
        }}>
        <Image src={item.logo} className="" alt="" width={32} height={32} />
        <div className="ml-[6px] flex-1">
          <div className="text-[14px] font-semibold text-highEmphasis">{item.title}</div>
          <div className="text-[12px] text-mediumEmphasis">{item.name}</div>
        </div>
        <div className="flex w-[140px] items-center justify-between">
          <div className="">
            <PriceWithIcon priceValue={calculateNumber(futurePrice, 2)} className="!text-mediumEmphasis" />
          </div>
          <div
            className={`flex w-[70px] text-[14px]
            ${isPositive(Number(priceChangeRatio24h)) ? 'text-marketGreen' : 'text-marketRed'}`}>
            <Image
              src={
                isPositive(Number(priceChangeRatio24h))
                  ? '/images/components/trade/chart/polygon_pos.svg'
                  : '/images/components/trade/chart/polygon_neg.svg'
              }
              className=""
              alt=""
              width={16}
              height={16}
            />
            <span className="ml-1">{formatterValue(Math.abs(Number(priceChangeRatio24h)), 2, '%')}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`t-0 fixed bottom-0 left-0 right-0 z-10 w-full
        ${isShowModal && marketData.length > 0 ? 'h-full' : 'h-0'}
       bg-black/[.3] backdrop-blur-[4px]`}
      onClick={() => {
        setIsShowModal(false);
      }}>
      <div
        className={`absolute bottom-0 w-full bg-secondaryBlue
        ${isShowModal && marketData.length > 0 ? 'bottom-0' : 'bottom-[-400px]'}
        transition-bottom duration-500
      `}>
        {isShowModal ? collectionList.filter(collection => collection.collectionName !== currentToken).map(handleMap) : null}
      </div>
    </div>
  );
}
