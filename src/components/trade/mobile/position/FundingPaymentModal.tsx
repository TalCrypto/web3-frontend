/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
import { PriceWithIcon } from '@/components/common/PricWithIcon';
import { apiConnection } from '@/utils/apiConnection';
import { calculateNumber } from '@/utils/calculateNumbers';
import { walletProvider } from '@/utils/walletProvider';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDateTime } from '@/utils/date';
import { ThreeDots } from 'react-loader-spinner';
import collectionList from '@/const/collectionList';
import { useStore as useNanostore } from '@nanostores/react';
import { wsCurrentToken, wsFullWalletAddress } from '@/stores/WalletState';
import { $isShowMobileModal } from '@/stores/common';

const FundingPaymentModal = (props: any) => {
  const { showFundingPaymentModal, setShowFundingPaymentModal } = props;

  const currentToken = useNanostore(wsCurrentToken);
  const currentCollection = collectionList.filter((item: any) => item.collection.toUpperCase() === currentToken.toUpperCase())[0];
  const currentCollectionName = currentCollection.shortName || 'DEGODS';

  const [isLoading, setIsLoading] = useState(false);
  const [fpRecords, setFpRecords] = useState([]);
  const [fpTotal, setFpTotal] = useState(0);

  const currentAmm = currentCollection.amm;

  useEffect(() => {
    setIsLoading(true);
    setFpTotal(0);
    if (walletProvider.holderAddress) {
      apiConnection.getUserFundingPaymentHistoryWithAmm(walletProvider.holderAddress, currentAmm).then(data => {
        const total: any = Number(calculateNumber(data.data.total, 6))?.toFixed(6);
        setFpTotal(total);
        setFpRecords(data.data.fundingPaymentPnlHistory);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [wsFullWalletAddress]);

  const handleBackClick = () => {
    setShowFundingPaymentModal(false);
    $isShowMobileModal.set(false);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 top-0 z-10 flex h-full w-full
        ${showFundingPaymentModal ? 'left-[0]' : 'left-[100%]'}
        transition-left z-[12] w-full items-center justify-center
        bg-black/[.2] backdrop-blur-[4px] duration-500
      `}
      onClick={() => setShowFundingPaymentModal(false)}>
      <div
        className="relative h-full w-full rounded-[12px] border-[1px]
        border-[#71aaff38] bg-lightBlue text-[14px] font-normal text-mediumEmphasis"
        onClick={e => e.stopPropagation()}>
        <div className="scrollable h-full overflow-y-scroll pb-[100px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
            </div>
          ) : fpRecords.length > 0 ? (
            <>
              <div className="py-6 pl-[38px]">P/L</div>
              {fpRecords.map((item: any, idx: any) => {
                const timeValue = formatDateTime(item.timestamp, 'L HH:mm');
                const value = Number(calculateNumber(item.fundingPaymentPnl, 6))?.toFixed(6);
                return (
                  <div className="p-3" key={`fp-row-${idx}`}>
                    <div className="flex min-w-[190px] items-center px-[18px]">
                      <div className="mr-2 h-[46px] w-[2px] rounded-[2px] bg-[#4287f5]" />
                      <div>
                        <p className="text-[16px]">{timeValue}</p>
                        <div className="">
                          <PriceWithIcon
                            priceValue={Number(value) > 0 ? `+${value}` : Number(value) === 0 ? '0.000000' : value}
                            className={Number(value) > 0 ? 'text-marketGreen' : Number(value) === 0 ? '' : 'text-marketRed'}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-2" />
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div>
                <div className="mb-2 flex items-center justify-center">
                  <Image src="/images/mobile/common/empty_folder.svg" width={48} height={48} alt="" onClick={handleBackClick} />
                </div>
                <div className="text-highEmphasis">No funding payment history.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="absolute bottom-0 h-[100px] w-full
        bg-secondaryBlue  text-[15px] text-white
      ">
        <div className="flex h-[50px] w-full justify-between px-[22px] py-4">
          <span className="mr-[36px] text-highEmphasis">Total Received: </span>
          {fpRecords.length > 0 ? (
            <PriceWithIcon
              priceValue={fpTotal > 0 ? `+${fpTotal}` : fpTotal === 0 ? '0.000000' : fpTotal}
              className={fpTotal > 0 ? 'text-marketGreen' : fpTotal === 0 ? '' : 'text-marketRed'}
            />
          ) : (
            <PriceWithIcon priceValue="-:--" />
          )}
        </div>
        <div className="flex h-[50px] w-full items-center justify-center px-[22px] py-4">
          <Image
            src="/images/mobile/common/angle-right.svg"
            className="absolute left-[22px] cursor-pointer"
            width={14}
            height={14}
            alt=""
            onClick={handleBackClick}
          />
          <div className="flex">{currentCollectionName} Funding Payment History</div>
        </div>
      </div>
    </div>
  );
};

export default FundingPaymentModal;
