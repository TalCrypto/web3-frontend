import React, { CSSProperties, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import CollectionModal from '@/components/trade/desktop/trading/CollectionModal';
import { useStore as useNanostore } from '@nanostores/react';
import { AMM, getCollectionInformation } from '@/const/collectionList';
import { $currentAmm } from '@/stores/trading';
import { $currentChain, $userPositionInfos } from '@/stores/user';
import { usePositionInfosIsLoading } from '@/hooks/collection';
import { getSupportedAMMs } from '@/const/addresses';
import Tooltip from '@/components/common/Tooltip';

function SidebarCollection() {
  const router = useRouter();
  const chain = useNanostore($currentChain);
  const currentAmm = useNanostore($currentAmm);
  const positionInfos = useNanostore($userPositionInfos);
  const [isColModalVisible, setIsColModalVisible] = useState(false);
  const isLoading = usePositionInfosIsLoading();

  const selectCollection = (amm: AMM) => {
    router.push(`/trade/${amm}`, undefined, { shallow: true });
  };

  const isHasPos = (amm: AMM): boolean => {
    const size = positionInfos[amm]?.size;
    if (size) {
      return size !== 0;
    }
    return false;
  };

  const activeIndex = currentAmm ? Object.values(AMM).indexOf(currentAmm) : 0;
  const yPos = (activeIndex < 0 ? 0 : activeIndex) * 56 + (activeIndex > 1 ? 52 : 51);

  return (
    <div
      className={`absolute ml-[-45px] mt-4 flex w-[45px]
        flex-col rounded-l-[12px] bg-gradient-to-r from-[#71aaff66]
        to-[#ffffff00] py-[1px] pl-[1px]
      `}>
      <div
        className="flex w-[44px] flex-col rounded-l-[12px] bg-secondaryBlue px-1 py-3"
        style={{ '--highlight-y-pos': `${yPos}px` } as CSSProperties}>
        {activeIndex >= 0 ? (
          <div
            className="transition-width absolute right-0 top-[6px] h-[48px] w-[48px]
              translate-y-[var(--highlight-y-pos)] transform
              rounded-l-[12px] bg-[#2574fb] transition duration-300 ease-in-out"
          />
        ) : null}
        <div
          className={`item ${isLoading ? 'opacity-30' : ''}
            relative flex cursor-pointer items-center justify-center rounded-full
             hover:border-[hsla(0,0%,100%,.2)]`}
          onClick={() => setIsColModalVisible(true)}>
          <Image
            src="/images/collections/more.svg"
            width={32}
            height={32}
            alt=""
            className="ml-[2px] rounded-full border-[4px] border-transparent
              hover:border-[4px] hover:border-[hsla(0,0%,100%,.2)]"
          />
          {isLoading ? (
            <div
              className="loading-indicator absolute left-[4px] top-[3px] flex h-7
                  w-7 items-center justify-center rounded-full text-[10px]">
              <div
                className="spinner-border inline-block h-4 w-4
                    animate-spin rounded-full border-2 border-solid
                  border-white border-r-transparent"
              />
            </div>
          ) : null}
        </div>
        {getSupportedAMMs(chain)
          .map(amm => getCollectionInformation(amm))
          .sort((a, b) => a.sort - b.sort)
          .map(item => (
            <div
              key={`side-col-${item.collection}`}
              className={`${isLoading ? 'opacity-30' : ''}
              relative mt-5 flex cursor-pointer items-center`}
              onClick={() => selectCollection(item.amm)}>
              <Tooltip direction="right" content={item.displayCollectionPair}>
                {item.isNew ? (
                  <Image className="absolute right-0 top-[-4px] z-[2]" src="/images/collections/new.svg" alt="" width={26} height={12} />
                ) : null}
                <Image
                  src={item.sidebarLogo}
                  width={36}
                  height={36}
                  alt=""
                  className="rounded-full border-[4px] border-transparent
                    hover:border-[4px] hover:border-[hsla(0,0%,100%,.2)]"
                />
                {isHasPos(item.amm) ? (
                  <Image
                    className="absolute bottom-[3px] right-0"
                    src="/images/mobile/pages/trade/shopping-bag-green.svg"
                    width={14}
                    height={14}
                    alt=""
                  />
                ) : null}
              </Tooltip>

              {isLoading ? (
                <div
                  className="loading-indicator absolute left-[4px] top-[4px] flex h-7
                    w-7 items-center justify-center rounded-full text-[10px]">
                  <div
                    className="spinner-border inline-block h-4 w-4
                      animate-spin rounded-full border-2 border-solid
                    border-white border-r-transparent"
                  />
                </div>
              ) : null}
            </div>
          ))}
      </div>

      {isColModalVisible && <CollectionModal setVisible={setIsColModalVisible} selectCollection={selectCollection} />}
    </div>
  );
}
export default SidebarCollection;
