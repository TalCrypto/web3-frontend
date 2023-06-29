/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import { calculateNumber } from '@/utils/calculateNumbers';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import HistoryModal from '@/components/portfolio/desktop/HistoryModal';
import { useStore as useNanostore } from '@nanostores/react';
import { $psShowFundingPayment, $psShowHistory, $psShowShareIndicator, $psUserPosition } from '@/stores/portfolio';
import PositionList from '@/components/portfolio/desktop/PositionList';
import FundingPaymentModal from '@/components/portfolio/desktop/FundingPaymentModal';
import SharePosition from '@/components/portfolio/desktop/SharePosition';
import OutlineButton from '@/components/common/OutlineButton';
import { $userIsConnected } from '@/stores/user';
import SortingIndicator from '@/components/common/SortingIndicator';

function PositionInfo() {
  const initSorting = { notionalValue: 0, collateralValue: 0 };
  const [positionSorting, setPositionSort] = useState(initSorting);

  const isConnected = useNanostore($userIsConnected);
  const psUserPosition = useNanostore($psUserPosition);
  const showFundingPayment = useNanostore($psShowFundingPayment);
  const showSharePosition = useNanostore($psShowShareIndicator);
  const showHistory = useNanostore($psShowHistory);

  useEffect(() => {
    const { notionalValue, collateralValue } = positionSorting;
    let temp = psUserPosition;
    if (temp.length === 0) {
      return;
    }
    if (notionalValue !== 0) {
      temp = psUserPosition.filter((item: any) => item !== null);
      temp.sort((a: any, b: any) => {
        const result =
          Math.abs(Number(calculateNumber(Number(b?.currentNotional), 4))) -
          Math.abs(Number(calculateNumber(Number(a?.currentNotional), 4)));
        return notionalValue === 2 ? -result : result;
      });
      $psUserPosition.set(temp);
      return;
    }
    if (collateralValue !== 0) {
      temp = psUserPosition.filter((item: any) => item !== null);
      temp.sort((a: any, b: any) => {
        const result = Number(calculateNumber(b?.realMargin, 4)) - Number(calculateNumber(a?.realMargin, 4));
        return collateralValue === 2 ? -result : result;
      });
      $psUserPosition.set(temp);
      return;
    }
    $psUserPosition.set(temp);
  }, [positionSorting]);

  const currentPositionCount = psUserPosition.filter((item: any) => item !== null).length;

  return (
    <div>
      <div className="mt-6 rounded-[12px] bg-lightBlue">
        <div className="flex justify-between border-b-[1px] border-b-secondaryBlue p-6">
          <div className="flex items-center">
            <Image src="/images/components/portfolio/position_new.svg" width={20} height={20} alt="" />
            <h4 className="ml-[6px] text-[20px] font-semibold text-highEmphasis">
              My Position {isConnected ? ` (${currentPositionCount})` : ''}
            </h4>
          </div>
          {isConnected ? <OutlineButton onClick={() => $psShowHistory.set(true)}>Trade History</OutlineButton> : null}
        </div>

        <div className="mb-[66px] min-h-[444px]">
          {isConnected ? (
            <div className="dashboard-list">
              <div
                className="flex border-b-[1px] border-b-secondaryBlue
                px-9 py-3 text-[14px] text-mediumEmphasis">
                <div className="w-[20%] pl-3">Collection</div>
                <div className="w-[13%]">
                  vAMM Price
                  <br />
                  <span className="text-[12px]">Avg. Entry Price</span>
                </div>
                <div className="w-[13%]">
                  Liq. Price <br />
                  <span className="text-[12px]">Leverage</span>
                </div>
                <div
                  className="w-[14%] cursor-pointer"
                  onClick={() =>
                    setPositionSort({
                      ...initSorting,
                      notionalValue: (positionSorting.notionalValue + 1) % 3
                    })
                  }>
                  <div className="flex">
                    Contract Size <SortingIndicator value={positionSorting.notionalValue} />
                  </div>
                  <span className="text-[12px]">Notional Value</span>
                </div>
                <div
                  className="w-[15%] cursor-pointer"
                  onClick={() =>
                    setPositionSort({
                      ...initSorting,
                      collateralValue: (positionSorting.collateralValue + 1) % 3
                    })
                  }>
                  <div className="flex">
                    Collateral Value
                    <SortingIndicator value={positionSorting.collateralValue} />
                  </div>
                </div>
                <div className="w-[13%]">Unrealized P/L</div>
                {/* <div className="w-[17%]">Accu. Fund. Payment</div> */}
                <div className="w-[12%]" />
              </div>

              <PositionList />
            </div>
          ) : (
            <div className="mt-[130px] text-center font-medium text-mediumEmphasis">You have no open positions and history record.</div>
          )}
        </div>
      </div>

      {showFundingPayment ? <FundingPaymentModal /> : null}

      {showSharePosition ? <SharePosition /> : null}

      {showHistory ? <HistoryModal /> : null}
    </div>
  );
}

export default PositionInfo;
