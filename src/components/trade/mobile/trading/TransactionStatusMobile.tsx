/* eslint-disable react/no-unescaped-entities */
import PrimaryButton from '@/components/common/PrimaryButton';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useStore as useNanostore } from '@nanostores/react';
import { $isShowTradingMobile, $tsTransactionStatus } from '@/stores/trading';
import { $isShowMobileModal } from '@/stores/modal';

function TransactionStatusMobile() {
  const tsShowTransactionStatus = useNanostore($tsTransactionStatus);
  const { linkUrl, isSuccess } = tsShowTransactionStatus;
  const router = useRouter();

  const onClickGoPortfolio = () => {
    $tsTransactionStatus.set({
      isShow: false,
      isSuccess: true,
      linkUrl: ''
    });
    $isShowMobileModal.set(false);
    $isShowTradingMobile.set(false);
    router.push(`/portfolio`);
  };

  const onClickBack = () => {
    $tsTransactionStatus.set({
      isShow: false,
      isSuccess: true,
      linkUrl: ''
    });
    $isShowMobileModal.set(false);
  };

  return (
    <div
      className={`fixed inset-0 h-screen w-full
        ${tsShowTransactionStatus.isShow ? 'left-[0]' : 'left-[100%]'}
        transition-left z-[12] h-full
        overflow-auto  bg-secondaryBlue duration-500
      `}>
      <div className="flex h-[calc(100%-70px)] items-center justify-center">
        {isSuccess ? (
          <div className="flex flex-col items-center text-center">
            <Image src="/images/components/trade/success.svg" width={100} height={100} alt="" />
            <div
              className="mt-[46px] text-[20px]
                font-semibold text-highEmphasis">
              Transaction Successful!
            </div>
            <div className="mt-4 text-[14px] text-highEmphasis">
              It may take a short while to <br />
              update transaction records.
            </div>
            <div className="mt-4 flex items-center justify-center text-[14px] text-highEmphasis">
              <a
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 text-[16px] font-semibold text-primaryBlue no-underline">
                Check on Arbiscan
                <Image src="/images/common/out.svg" className="ml-1" alt="" width={16} height={16} />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <Image src="/images/components/trade/failed.svg" width={100} height={100} alt="" />
            <div
              className="mt-[46px] text-[20px]
                font-semibold text-highEmphasis">
              Transaction Error
            </div>
            <div className="mt-4 text-[14px] text-highEmphasis">
              Your transaction didn't go through. <br />
              Please double-check your wallet <br />
              and try again.
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 w-full px-6 pb-6">
        {isSuccess ? (
          <div>
            <PrimaryButton onClick={onClickGoPortfolio} className="py-3 text-[15px] font-semibold text-highEmphasis">
              Go to Portfolio
            </PrimaryButton>
          </div>
        ) : (
          <div>
            <PrimaryButton onClick={onClickBack} className="py-3 text-[15px] font-semibold text-highEmphasis">
              Back to Trade
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionStatusMobile;
