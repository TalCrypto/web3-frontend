/* eslint-disable operator-linebreak */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { $isShowMobileModal } from '@/stores/modal';
import { useRouter } from 'next/router';
import { airdropTabsInfo } from '@/const/airdrop';

export default function AirdropTabListModal(props: any) {
  const router = useRouter();
  const { setIsShowSwitcher } = props;
  const [isExpand, setIsExpand] = useState(false);

  const handleCloseModal = () => {
    setIsExpand(false);
    setTimeout(() => {
      setIsShowSwitcher(false);
      $isShowMobileModal.set(false);
    }, 500);
  };

  useEffect(() => {
    setIsExpand(true);
  }, []);

  return (
    <div
      className={`t-0 fixed bottom-0 left-0 right-0 z-[12] w-full
        ${isExpand ? 'h-full' : 'h-0'}
       bg-black/[.3] backdrop-blur-[4px]`}
      onClick={handleCloseModal}>
      <div
        className={`transition-bottom absolute bottom-0 w-full
        ${isExpand ? 'bottom-0' : 'bottom-[-550px]'}
        bg-secondaryBlue duration-500
      `}>
        {Object.values(airdropTabsInfo).map((tabInfo: any, index) => {
          const key = `tab_switcher_${index}`;

          return (
            <div
              key={key}
              className="flex px-5 py-5"
              onClick={() => {
                router.push(`/airdrop/${tabInfo.route}`, undefined, { shallow: true });
                handleCloseModal();
              }}>
              <Image className="mr-[6px]" src={tabInfo.image} width={16} height={16} alt="" />
              {tabInfo.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
