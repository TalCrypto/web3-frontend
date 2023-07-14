import React, { useState } from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';
import { $isShowMetamaskModal, $metamaskModalTarget } from '@/stores/modal';

export default function MetamaskModal() {
  const isShowMetamaskModal = useNanostore($isShowMetamaskModal);
  const metamaskModalTarget = useNanostore($metamaskModalTarget);

  const [currentPage, setCurrentPage] = useState(0);

  const displayContent =
    metamaskModalTarget === 0
      ? [
          { title: '1. Open Metamask Console Window👇', image: '/images/components/common/modal/metamask-modal/openMetamask.png' },
          { title: '2. Click Swap👇', image: '/images/components/common/modal/metamask-modal/swap.png' },
          { title: '3. Select WETH for Swapping👇', image: '/images/components/common/modal/metamask-modal/selectWETH.png' }
        ]
      : [
          { title: '1. Open Metamask Console Window👇', image: '/images/components/common/modal/metamask-modal/openMetamask.png' },
          { title: '2. Click Swap👇', image: '/images/components/common/modal/metamask-modal/bridge.png' }
        ];

  const currentItem = displayContent[currentPage];

  const closeModal = () => {
    $isShowMetamaskModal.set(false);
    setCurrentPage(0);
  };

  const jumpNextPage = () => {
    if (currentPage + 1 < displayContent.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!isShowMetamaskModal) return null;

  return (
    <div
      className="fixed inset-0 z-20 flex h-screen items-center
        justify-center overflow-auto bg-black bg-opacity-40"
      onClick={closeModal}>
      <div
        className="my-[36px] w-[500px] rounded-xl bg-lightBlue px-[16px] pt-[16px] text-[14px]
          font-normal leading-normal"
        onClick={e => e.stopPropagation()}>
        <div className="items-initial flex content-center justify-end">
          <Image
            src="/images/components/common/modal/close.svg"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="relative flex flex-col items-center justify-center">
          <div className="mt-[4px] text-[15px] font-[600] text-[#fff] ">{displayContent[currentPage].title}</div>
          <div className="z-[2] mt-[16px] flex flex-row items-center justify-center ">
            {currentPage !== 0 ? (
              <Image
                src="/images/common/page-prev.svg"
                width={10}
                height={20}
                alt=""
                className="mr-[30px] cursor-pointer"
                onClick={() => setCurrentPage(currentPage - 1)}
              />
            ) : (
              <div className="mr-[30px] h-[20px] w-[10px]" />
            )}
            <Image src={currentItem.image} width={356} height={219} alt="" className="" />
            {currentPage + 1 < displayContent.length ? (
              <Image
                src="/images/common/page-next.svg"
                width={10}
                height={20}
                alt=""
                className="ml-[30px] cursor-pointer "
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            ) : (
              <div className="ml-[30px] h-[20px] w-[10px]" />
            )}
          </div>
          <div className="my-[24px] flex flex-row ">
            {displayContent.map((item, index) => (
              <div
                className={`h-[8px] w-[8px] ${index !== currentPage ? 'cursor-pointer' : ''} rounded-[50%]
                bg-[#D9D9D9]
                [&:not(:last-child)]:mr-[8px]
                ${index !== currentPage ? 'opacity-30' : ''} `}
                onClick={() => setCurrentPage(index)}
              />
            ))}
          </div>
          <Image
            src="/images/components/common/modal/modal-logo.svg"
            width={170}
            height={165}
            alt=""
            className="absolute bottom-0 right-0 mr-3 flex items-end"
          />
        </div>
      </div>
    </div>
  );
}
