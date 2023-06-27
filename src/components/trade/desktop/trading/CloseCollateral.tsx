/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable operator-linebreak */
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
// import { useRouter } from 'next/router';
// import { debounce } from 'throttle-debounce';
import { useStore as useNanostore } from '@nanostores/react';
// import { firebaseAnalytics } from '@/const/firebaseConfig';
// import collectionList from '@/const/collectionList';
import TitleTips from '@/components/common/TitleTips';
// import tradePanel from '@/stores/tradePanel';
// import { apiConnection } from '@/utils/apiConnection';
// import { pageTitleParser } from '@/utils/eventLog';
// import { hasPartialClose } from '@/stores/UserState';
import InputSlider from '@/components/trade/desktop/trading/InputSlider';
import PartialCloseModal from '@/components/trade/desktop/trading/PartialCloseModal';

import { $currentAmm } from '@/stores/trading';
import { usePositionInfo } from '@/hooks/collection';
import { OpenPositionEstimation, Side, getApprovalAmountFromEstimation, useApprovalCheck, useOpenPositionEstimation } from '@/hooks/trade';
import { MINIMUM_COLLATERAL } from '@/const';
import { UserPositionInfo } from '@/stores/user';
import ApproveButton from '@/components/common/actionBtns/ApproveButton';
import OpenPosButton from '@/components/common/actionBtns/OpenPosButton';
import ClosePosButton from '@/components/common/actionBtns/ClosePosButton';

function SectionDividers() {
  return (
    <div className="">
      <div className="">
        <div className="mb-6 h-[1px] bg-[#2e3064]" />
      </div>
    </div>
  );
}

function QuantityEnter(props: {
  closeValue: number;
  maxCloseValue: number;
  onChange: (value: any) => void;
  isAmountTooSmall: boolean;
  isAmountTooLarge: boolean;
  disabled: boolean;
}) {
  const { closeValue, maxCloseValue, onChange, isAmountTooSmall, isAmountTooLarge, disabled } = props;

  const [isFocus, setIsFocus] = useState(false);

  const handleEnter = (params: any) => {
    const { value: inputValue } = params.target;
    const reg = /^\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '') {
      const decimalNumber = inputValue?.split('.')?.[1];
      if (decimalNumber?.length > 4) {
        return;
      }
      onChange(inputValue);
    }
  };

  const showHalfValue = () => {
    onChange(Number(maxCloseValue / 2).toFixed(4));
  };
  const showMaxValue = () => {
    onChange(Number(maxCloseValue).toFixed(4));
  };

  // determine if input is valid or error state
  // const isValid = closeValue > 0 && !isInsuffBalance && !isAmountTooSmall && !isAmountTooLarge && !estPriceFluctuation;
  let isError = isAmountTooSmall || isAmountTooLarge;
  if (closeValue <= 0) {
    isError = false;
  }

  return (
    <>
      <div className={`${disabled ? 'disabled' : ''}`}>
        <div className="mb-3 text-[14px] text-mediumEmphasis">Amount to Close (Notional)</div>
      </div>
      <div className="mb-3">
        <div
          className={`trade-input-outline rounded-[4px] bg-none p-[1px]
              ${isFocus ? 'valid' : ''}
              ${isError ? 'error' : ''}
              ${disabled ? 'disabled' : ''}`}>
          <div className="flex h-12 items-center rounded-[4px] bg-mediumBlue p-3">
            <Image src="/images/components/layout/header/eth-tribe3.svg" alt="" width={18} height={24} className="" />
            <div className="inputweth">
              <span className="input-with-text ml-1 text-[12px] font-bold">WETH</span>
            </div>
            <div className="mx-2 h-[40%] w-[1px] bg-[#404f84]" />

            <div className="flex">
              <div
                className={`trade-btn mr-1 flex h-[22px] w-[42px] cursor-pointer
                    items-center justify-center rounded-[6px] text-[12px] font-bold
                    ${disabled ? 'disabled' : ''}`}
                onClick={() => {
                  if (!disabled) {
                    showMaxValue();
                  }
                }}>
                <span className="text-center text-mediumEmphasis">MAX</span>
              </div>
              <div
                className={`trade-btn mr-1 flex h-[22px] w-[42px] cursor-pointer
                    items-center justify-center rounded-[6px] text-[12px] font-bold
                    ${disabled ? 'disabled' : ''}`}
                onClick={() => {
                  if (!disabled) {
                    showHalfValue();
                  }
                }}>
                <span className="text-center text-mediumEmphasis">HALF</span>
              </div>
            </div>
            <input
              type="text"
              // pattern="[0-9]*"
              className="w-full border-none border-mediumBlue bg-mediumBlue text-right text-[15px] font-bold text-white outline-none"
              value={closeValue}
              placeholder="0.00"
              onChange={handleEnter}
              disabled={disabled}
              min={0}
              // onClick={e => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function UpdateValueDisplay(props: any) {
  const { title, currentValue, newValue, unit, unitSizing = 'normal', currentUnit = '' } = props;

  return (
    <div className="mb-4 flex">
      <div className="w-[45%] text-[14px] text-mediumEmphasis">{title}</div>
      <div className="flex-1">
        <span className="text-[14px] font-semibold text-mediumEmphasis">{currentValue + currentUnit}</span>
        <span className="text-[14px] font-semibold text-highEmphasis">{' → '}</span>
        <span className={unitSizing === 'normal' ? 'text-[12px]' : ''}>
          <span className="text-[14px] font-semibold">{newValue}</span>
          {unit}
        </span>
      </div>
    </div>
  );
}

function UpdateValueNoDataDisplay(props: any) {
  const { title, unit } = props;

  return (
    <div className="flex items-center">
      <div className="text-[14px] text-mediumEmphasis">{title}</div>
      <div className="text-[14px] font-semibold text-highEmphasis">
        <span>-.--</span>
        <span className="text-[14px]">{unit}</span>
      </div>
    </div>
  );
}

function DisplayValues(props: any) {
  const { title, value, unit = '', valueClassName = '', unitClassName = '', className = '' } = props;

  return (
    <div
      className={`${className !== '' ? className : 'sumrow'}
      mb-[2px] flex items-center
    `}>
      <div className="text-[14px] text-mediumEmphasis">{title}</div>
      <div className={`flex-1 flex-shrink-0 text-right text-mediumEmphasis ${valueClassName}`}>
        <span className="text-[14px]">{value}</span> <span className={`text-[12px] ${unitClassName}`}>{unit}</span>
      </div>
    </div>
  );
}

function QuantityTips(props: any) {
  const { isAmountTooSmall, isAmountTooLarge } = props;

  const label = isAmountTooLarge ? 'Value is too large!' : isAmountTooSmall ? 'Minimum collateral size 0.01' : '';

  if (!label) return null;

  return (
    <div className="quantity-tips-container">
      <span className="mb-2 text-[12px] leading-[20px] text-marketRed">{label}</span>
    </div>
  );
}

function EstimationComponent(props: {
  userPosition: UserPositionInfo | undefined;
  estimation: OpenPositionEstimation | undefined;
  isAmountTooSmall: boolean;
  isAmountTooLarge: boolean;
  isFullClose: boolean;
}) {
  const { userPosition, estimation, isAmountTooSmall, isAmountTooLarge, isFullClose } = props;

  return (
    <div>
      <UpdateValueDisplay
        title="Notional Value"
        currentValue={!userPosition ? '-.--' : userPosition.currentNotional.toFixed(4)}
        newValue={!estimation || isFullClose ? '-.--' : estimation.posInfo.positionNotional.toFixed(4)}
        unit=" WETH"
      />
      <UpdateValueDisplay
        title={
          <span className="flex">
            Collateral&nbsp;
            {!isFullClose ? (
              <TitleTips
                titleText={<Image className="cursor-pointer" src="/images/components/trade/alert.svg" width={16} height={16} alt="" />}
                tipsText="Collateral will not change."
                placement="top"
              />
            ) : null}
          </span>
        }
        currentValue={!userPosition ? '-.--' : userPosition.margin.toFixed(4)}
        currentUnit=""
        newValue={!estimation || isFullClose ? '-.--' : estimation.posInfo.margin.toFixed(4)}
        unit=" WETH"
      />
      <UpdateValueDisplay
        title="Leverage"
        currentValue={!userPosition ? '-.--' : userPosition.leverage.toFixed(2)}
        currentUnit="x"
        newValue={!estimation || isFullClose ? '-.--' : estimation.posInfo.leverage.toFixed(2)}
        unit="x"
      />
      {/* {!userPosition || estimatedValue === null ? (
        <UpdateValueNoDataDisplay title="Collateral Ratio" unit="%" />
      ) : (
        <UpdateValueDisplay
          title="Collateral Ratio"
          
          currentValue={!userPosition ? '-.--' : calculateNumber(userPosition.realMarginRatio, 2)}
          currentUnit="%"
          newValue={
            !isNewPosition
              ? '-.--'
              : Number(closeValue) === Number(currentMaxValue)
              ? '0.00'
              : calculateNumber(estimatedValue.newPosition.marginRatio, 2)
          }
          unit="%"
        />
      )} */}
      <SectionDividers />
      {/* <DisplayValues title="Transaction Fee" unit=" WETH" value={!isNewPosition ? '-.-' : formatterValue(estimatedValue.fee, 5)} /> */}
      {/* <DisplayValues title="Price Impact" value={!isNewPosition ? '-.-' : formatterValue(estimatedValue.priceImpact, 2, '%')} /> */}
    </div>
  );
}

function ExtendedEstimateComponent(props: { estimation: OpenPositionEstimation; isFullClose: boolean }) {
  const { estimation, isFullClose } = props;

  return (
    <>
      {!isFullClose ? (
        <>
          <div className="row">
            <div className="mb-1 mt-4 text-[14px] font-semibold text-white underline">Estimated Blended Position</div>
          </div>
          <DisplayValues title="Collateral" value={estimation ? estimation.posInfo.margin.toFixed(4) : '-.--'} unit="WETH" />
          <DisplayValues
            title="Average Entry Price"
            value={estimation ? estimation.posInfo.avgEntryPrice.toFixed(2) : '-.--'}
            unit="WETH"
          />
          <DisplayValues
            title="Liquidation Price"
            value={estimation ? estimation.posInfo.liquidationPrice.toFixed(2) : '-.--'}
            unit="WETH"
          />
        </>
      ) : null}

      <div className="row">
        <div className="mb-1 mt-4 text-[14px] font-semibold text-white underline">Transaction Details</div>
      </div>
      <DisplayValues title="Transaction Fee" unit=" WETH" value={!estimation ? '-.--' : estimation.txSummary.fee.toFixed(5)} />
      {/* <DisplayValues title="Estimated Exposure" value={exposure} unit={currentType} /> */}
      <DisplayValues title="Entry Price" value={!estimation ? '-.--' : estimation.txSummary.entryPrice.toFixed(2)} unit="WETH" />
      <div className="flex justify-between">
        <div className="col-auto text-[14px] text-mediumEmphasis">Price Impact</div>
        <div className="col contentsmallitem text-[14px] text-mediumEmphasis">
          <span className="value">{!estimation ? '-.--' : estimation.txSummary.priceImpactPct.toFixed(2)}</span> %
        </div>
      </div>
    </>
  );
}

function CloseSlider(props: {
  closeValue: number;
  maxCloseValue: number;
  onChange: (value: any) => void;
  onSlide: (value: any) => void;
  disabled: boolean;
}) {
  const { closeValue, maxCloseValue, onChange, onSlide, disabled } = props;
  return (
    <div className={`${disabled ? 'disabled' : ''}`}>
      <InputSlider
        disabled={disabled}
        value={closeValue}
        min={0}
        max={maxCloseValue}
        defaultValue={0}
        onChange={onSlide}
        onAfterChange={onChange}
        step={0.0001}
      />
      <div className="mb-6 flex justify-between text-[12px] text-highEmphasis">
        <div className="">0</div>
        <div className="">Total Notional Value</div>
      </div>
    </div>
  );
}

export default function CloseCollateral(props: any) {
  const currentAmm = useNanostore($currentAmm);
  const userPosition = usePositionInfo(currentAmm);
  const maxCloseValue = userPosition?.currentNotional ?? 0;
  const closeSide = userPosition?.size && userPosition?.size > 0 ? Side.SHORT : Side.LONG;
  const [isFullClose, setIsFullClose] = useState(false);
  const [closeValue, setCloseValue] = useState(0);
  const [toleranceRate, setToleranceRate] = useState<number | string>(0.5);
  const [showDetail, setShowDetail] = useState(false);
  const [isShowPartialCloseModal, setIsShowPartialCloseModal] = useState(false);
  const [isAmountTooSmall, setIsAmountTooSmall] = useState(false);
  const [isAmountTooLarge, setIsAmountTooLarge] = useState(false);
  const [textErrorMessage, setTextErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { isLoading: isEstLoading, estimation } = useOpenPositionEstimation({
    side: closeSide,
    notionalAmount: closeValue,
    slippagePercent: Number(toleranceRate),
    leverage: 1
  });
  const approvalAmount = getApprovalAmountFromEstimation(estimation);
  const isNeedApproval = useApprovalCheck(approvalAmount);

  useEffect(() => {
    if (estimation?.txSummary.notionalSize && estimation?.txSummary.notionalSize < MINIMUM_COLLATERAL && !isFullClose) {
      setIsAmountTooSmall(true);
    } else {
      setIsAmountTooSmall(false);
    }

    if (estimation?.txSummary.notionalSize && estimation?.txSummary.notionalSize > Number(maxCloseValue.toFixed(4))) {
      setIsAmountTooLarge(true);
    } else {
      setIsAmountTooLarge(false);
    }

    if (estimation?.txSummary.notionalSize && estimation?.txSummary.notionalSize === Number(maxCloseValue.toFixed(4))) {
      setIsFullClose(true);
    } else {
      setIsFullClose(false);
    }
  }, [estimation?.txSummary.notionalSize, isFullClose]);

  const initializeState = useCallback(() => {
    setCloseValue(0);
    setToleranceRate(0.5);
    setIsPending(false);
  }, []);

  const handleError = useCallback((error: Error | null) => {
    setIsPending(false);
    setTextErrorMessage(error ? error.message : null);
  }, []);

  const handlePending = useCallback(() => {
    setIsPending(true);
  }, []);

  useEffect(() => {
    // set error message under button
    initializeState();
  }, [currentAmm]);

  const handleChange = (value: any) => {
    setCloseValue(value);
  };

  return (
    <div>
      <QuantityEnter
        closeValue={closeValue}
        maxCloseValue={maxCloseValue}
        onChange={(value: any) => {
          handleChange(value);
        }}
        isAmountTooSmall={isAmountTooSmall}
        isAmountTooLarge={isAmountTooLarge}
        disabled={isPending}
      />
      <QuantityTips isAmountTooSmall={isAmountTooSmall} isAmountTooLarge={isAmountTooLarge} />
      <CloseSlider
        closeValue={closeValue}
        maxCloseValue={maxCloseValue}
        onChange={(value: any) => {
          handleChange(value);
        }}
        onSlide={(value: any) => {
          handleChange(value);
        }}
        disabled={isPending}
      />
      <SectionDividers />
      <div className={`mb-4 flex items-center ${isPending ? 'disabled' : ''}`}>
        <div className="text-[14px] text-mediumEmphasis">Slippage Tolerance</div>
        <div className="flex flex-1 justify-end text-right">
          <div
            className={`rounded-[4px] border-mediumBlue bg-mediumBlue
              px-[10px] py-[4px] text-white
              ${isPending ? 'disabled' : ''}`}>
            <input
              disabled={isPending}
              title=""
              type="text"
              // pattern="[0-9]*"
              className="w-[90%] max-w-[100px]  border-[1px] border-mediumBlue
                bg-mediumBlue px-1 text-right
                text-[15px] font-semibold outline-none"
              placeholder="0.0 "
              value={toleranceRate}
              onChange={e => {
                const { value: inputValue } = e.target;
                const reg = /^\d*(\.\d*)?$/;
                if (reg.test(inputValue) || inputValue === '') {
                  setToleranceRate(e.target.value);
                }
              }}
            />
            <span className="my-auto">%</span>
          </div>
        </div>
      </div>
      <EstimationComponent
        userPosition={userPosition}
        estimation={estimation}
        isAmountTooSmall={isAmountTooSmall}
        isAmountTooLarge={isAmountTooLarge}
        isFullClose={isFullClose}
      />
      {isNeedApproval ? (
        <ApproveButton
          isEstimating={isEstLoading}
          approvalAmount={isAmountTooLarge || isAmountTooSmall ? 0 : approvalAmount}
          onPending={handlePending}
          onSuccess={() => {}}
          onError={handleError}
        />
      ) : isFullClose ? (
        <ClosePosButton
          isEstimating={isEstLoading}
          slippagePercent={Number(toleranceRate)}
          onPending={handlePending}
          onSuccess={initializeState}
          onError={handleError}
        />
      ) : (
        <OpenPosButton
          isEstimating={isEstLoading}
          side={closeSide}
          notionalAmount={closeValue}
          leverage={1}
          slippagePercent={Number(toleranceRate)}
          estimation={isAmountTooLarge || isAmountTooSmall ? undefined : estimation}
          onPending={handlePending}
          onSuccess={initializeState}
          onError={handleError}
        />
      )}
      {/* {textErrorMessage ? <p className="text-color-warning text-[12px]">{textErrorMessage}</p> : null} */}
      {/* <div className="row">
        <div className="col-auto text-[14px] text-mediumEmphasis">
          * Collateral will {closeValue >= currentMaxValue ? '' : 'not'} be released
        </div>
      </div> */}
      {estimation && !isAmountTooLarge && !isAmountTooSmall && closeValue > 0 ? (
        <div className="mt-6">
          <div
            className="flex cursor-pointer text-[14px] font-semibold text-primaryBlue hover:text-[#6286e3]"
            onClick={() => setShowDetail(val => !val)}>
            {!showDetail ? 'Show' : 'Hide'} Advanced Details
            {!showDetail ? (
              <Image src="/images/common/angle_down.svg" className="mr-2" alt="" width={12} height={12} />
            ) : (
              <Image src="/images/common/angle_up.svg" className="mr-2" alt="" width={12} height={12} />
            )}
          </div>
          {showDetail && <ExtendedEstimateComponent estimation={estimation} isFullClose={isFullClose} />}
        </div>
      ) : null}

      <PartialCloseModal
        isShow={isShowPartialCloseModal}
        setIsShow={setIsShowPartialCloseModal}
        onClickSubmit={() => {
          // setTradeWindowIndex(2); // set tab to adjust collateral

          // actionButtonRef.current?.closePosition();
          setIsShowPartialCloseModal(false);
        }}
      />
    </div>
  );
}
