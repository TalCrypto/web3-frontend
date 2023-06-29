/* eslint-disable operator-linebreak */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { PriceWithIcon } from '@/components/common/PriceWithIcon';
import { $isShowMobileModal } from '@/stores/modal';
import { useRouter } from 'next/router';
import { AMM, getCollectionInformation } from '@/const/collectionList';
import { $currentAmm } from '@/stores/trading';
import { useStore as useNanostore } from '@nanostores/react';
import { getSupportedAMMs } from '@/const/addresses';
import { useMarketOverview } from '@/hooks/market';

export default function CollectionListModal(props: any) {
  const { isShowModal, setIsShowModal } = props;
  const router = useRouter();
  const currentAmm = useNanostore($currentAmm);
  const ammList = getSupportedAMMs().filter((amm: AMM) => amm !== currentAmm);
  const { data } = useMarketOverview();
  const [overviewData, setOverviewData]: any = useState();

  useEffect(() => {
    setOverviewData(data);
  }, [data]);

  return (
    <div
      className={`t-0 fixed bottom-0 left-0 right-0 z-[12] w-full
        ${isShowModal && data ? 'h-full' : 'h-0'}
       bg-black/[.3] backdrop-blur-[4px]`}
      onClick={() => {
        setIsShowModal(false);
        $isShowMobileModal.set(false);
      }}>
      <div
        className={`transition-bottom absolute bottom-0 w-full
        ${isShowModal && data ? 'bottom-0' : 'bottom-[-550px]'}
        bg-secondaryBlue duration-500
      `}>
        {ammList.map((item: any, index) => {
          const key = `switcher_collection_${index}`;
          const collectionInfo = getCollectionInformation(item);
          const tradingDataList: any = overviewData?.filter((dataItem: any) => item === dataItem.amm);
          const tradingData = tradingDataList?.length > 0 ? tradingDataList[0] : null;

          return (
            <div
              key={key}
              className="flex justify-between px-5 py-3"
              onClick={() => {
                router.push(`/trade/${collectionInfo.amm.toLowerCase()}`, undefined, { shallow: true });
                setIsShowModal(false);
              }}>
              <Image src={collectionInfo.logo} alt="" width={32} height={32} />
              <div className="ml-[6px] flex-1">
                <div className="text-[14px] font-semibold text-highEmphasis">{collectionInfo.title}</div>
                <div className="text-[12px] text-mediumEmphasis">{collectionInfo.name}</div>
              </div>
              <div className="flex w-[140px] items-center justify-between">
                <div>
                  <PriceWithIcon
                    priceValue={tradingData && tradingData.vammPrice ? tradingData.vammPrice.toFixed(2) : '0.00'}
                    className="!text-mediumEmphasis"
                  />
                </div>
                <div
                  className={`flex w-[70px] text-[14px]
                    ${
                      !tradingData || !tradingData.priceChangeRatio24h
                        ? ''
                        : tradingData.priceChangeRatio24h > 0
                        ? 'text-marketGreen'
                        : tradingData.priceChangeRatio24h < 0
                        ? 'text-marketRed'
                        : ''
                    }`}>
                  <Image
                    src={
                      tradingData && tradingData.priceChangeRatio24h > 0
                        ? '/images/components/trade/chart/polygon_pos.svg'
                        : '/images/components/trade/chart/polygon_neg.svg'
                    }
                    alt=""
                    width={16}
                    height={16}
                  />
                  <span className="ml-1">
                    {tradingData && tradingData.priceChangeRatio24h
                      ? `${Math.abs(tradingData.priceChangeRatio24h.toFixed(2))} %`
                      : '0.00  %'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
