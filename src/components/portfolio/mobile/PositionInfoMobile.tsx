/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import HistoryModal from '@/components/portfolio/mobile/HistoryModal';
import { useStore as useNanostore } from '@nanostores/react';
import { $psShowBalance, $psShowHistory, $psUserPosition } from '@/stores/portfolio';
import PositionList from '@/components/portfolio/mobile/PositionList';
import FundingPaymentModal from '@/components/portfolio/mobile/FundingPaymentModal';
import OutlineButton from '@/components/common/OutlineButton';
import { SingleRowPriceContent } from '@/components/portfolio/common/PriceLabelComponents';
import { $userIsConnected } from '@/stores/user';
import { $isShowMobileModal } from '@/stores/modal';

function PositionInfoMobile() {
  const isConnected = useNanostore($userIsConnected);
  const isShowBalance = useNanostore($psShowBalance);
  const psUserPosition = useNanostore($psUserPosition);

  const currentPositionCount = psUserPosition.filter((item: any) => item !== null).length;

  const totalUnrealized = psUserPosition.reduce((pre: any, item: any) => (!item ? pre : pre + item.unrealizedPnl), 0);
  const totalFundingPaymentAccount = psUserPosition.reduce((pre: any, item: any) => (!item ? pre : pre + item.fundingPayment), 0);

  return (
    <div>
      <div className="mt-3 bg-lightBlue">
        <div className="flex justify-between p-6">
          <div className="flex items-center">
            <div className="h-[20px] w-[3px] bg-primaryBlue" />
            <h4 className="ml-[6px] text-[16px] font-semibold text-highEmphasis">
              My Position {isConnected ? ` (${currentPositionCount})` : ''}
            </h4>
          </div>
          {isConnected ? (
            <OutlineButton
              className="!px-2 !py-[6px] !text-[12px]
                !font-normal !text-primaryBlue hover:!text-highEmphasis"
              onClick={() => {
                $psShowHistory.set(true);
                $isShowMobileModal.set(true);
              }}>
              Trade History
            </OutlineButton>
          ) : null}
        </div>

        <div className={`mb-[6px] ${psUserPosition.length > 0 ? 'pb-9' : 'min-h-[486px]'}`}>
          {isConnected ? (
            <div>
              {psUserPosition.length > 0 ? (
                <div className="mx-5 mb-9 mt-7 flex justify-between">
                  <div>
                    <div className="mb-1 text-[12px] font-normal text-mediumEmphasis">Total Unrealized P/L</div>
                    <div>
                      <SingleRowPriceContent
                        className="text-[20px]"
                        priceValue={isShowBalance ? Math.abs(totalUnrealized)?.toFixed(4) : '****'}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-[12px] font-normal text-mediumEmphasis">Accu. Fund.Payment</div>
                    <div>
                      <SingleRowPriceContent
                        className="justify-end text-[20px]"
                        priceValue={isShowBalance ? Math.abs(totalFundingPaymentAccount)?.toFixed(4) : '****'}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex px-5 py-3 text-[12px] text-mediumEmphasis">
                <div className="w-[35%]">
                  Collection <br />
                  Type
                </div>
                <div className="w-[33%] text-right">
                  Notional <br />
                  Leverage
                </div>
                <div className="w-[32%] text-right">
                  Unrealized P/L <br />
                  Accu. FP
                </div>
              </div>

              <PositionList />
            </div>
          ) : (
            <div className="mt-[130px] text-center font-medium text-mediumEmphasis">You have no open positions and history record.</div>
          )}
        </div>
      </div>

      <FundingPaymentModal />
      <HistoryModal />
    </div>
  );
}

export default PositionInfoMobile;
