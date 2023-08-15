/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable operator-linebreak */
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';
import InputSlider from '@/components/trade/desktop/trading/InputSlider';
import PartialCloseModal from '@/components/trade/mobile/trading/PartialCloseModal';

import { $currentAmm } from '@/stores/trading';
import { usePositionInfo } from '@/hooks/collection';
import { OpenPositionEstimation, Side, getApprovalAmountFromEstimation, useApprovalCheck, useOpenPositionEstimation } from '@/hooks/trade';
import { MINIMUM_COLLATERAL } from '@/const';
import { $userIsConnected, $userIsWrongNetwork, $userWethBalance, UserPositionInfo } from '@/stores/user';
import ApproveButton from '@/components/trade/common/actionBtns/ApproveButton';
import OpenPosButton from '@/components/trade/common/actionBtns/OpenPosButton';
import ClosePosButton from '@/components/trade/common/actionBtns/ClosePosButton';
import ConnectButton from '@/components/trade/common/actionBtns/ConnectButton';
import SwitchButton from '@/components/trade/common/actionBtns/SwitchButton';
import GetWETHButton from '@/components/trade/common/actionBtns/GetWETHButton';

import { formatError } from '@/const/errorList';
import { ErrorTip } from '@/components/trade/common/ErrorTip';
import MobileTooltip from '@/components/common/mobile/Tooltip';
import { $showGetWEthModal, $isShowMobileTokenModal } from '@/stores/modal';

function SectionDividers() {
  return (
    <div>
      <div>
        <div className="mb-6 h-[1px] bg-[#2e3064]" />
      </div>
    </div>
  );
}

function QuantityTips(props: any) {
  const { isAmountTooSmall, isAmountTooLarge, isOverFee } = props;
  const onClickWeth = () => {
    // $showGetWEthModal.set(true);
    $isShowMobileTokenModal.set(true);
  };

  const label = isAmountTooLarge ? (
    'Notional Collateral is too large!'
  ) : isAmountTooSmall ? (
    'Minimum collateral size 0.01'
  ) : isOverFee ? (
    <>
      Not enough transaction fee to close your position. <br />
      <span className="cursor-pointer text-white underline" onClick={onClickWeth}>
        Get WETH
      </span>{' '}
    </>
  ) : (
    ''
  );

  if (!label) return null;

  return (
    <div>
      <span className="mb-3 text-[12px] leading-[16px] text-marketRed">{label}</span>
    </div>
  );
}

function QuantityEnter(props: {
  closeValue: number;
  maxCloseValue: number;
  onChange: (value: any) => void;
  isAmountTooSmall: boolean;
  isAmountTooLarge: boolean;
  estimation: OpenPositionEstimation | undefined;
  disabled: boolean;
  isInputBlur: boolean;
  setIsInputBlur: (value: any) => void;
}) {
  const { closeValue, maxCloseValue, onChange, isAmountTooSmall, isAmountTooLarge, disabled, estimation, isInputBlur, setIsInputBlur } =
    props;

  const [isFocus, setIsFocus] = useState(false);
  const wethBalance = useNanostore($userWethBalance);
  const isOverFee = Number(estimation?.txSummary?.fee) > wethBalance;

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
    // onChange(Number(maxCloseValue - 0.00005).toFixed(4));
    onChange(Number(maxCloseValue).toFixed(4));
  };

  // determine if input is valid or error state
  // const isValid = closeValue > 0 && !isInsuffBalance && !isAmountTooSmall && !isAmountTooLarge && !estPriceFluctuation;
  let isError = isAmountTooSmall || isAmountTooLarge;
  if (closeValue <= 0) {
    isError = false;
  }

  const refInputBox = useRef(null);

  useEffect(() => {
    if (isInputBlur && refInputBox.current) {
      const ref: any = refInputBox.current;
      ref.blur();
    }
  }, [isInputBlur]);

  return (
    <>
      <div className={`${disabled ? 'disabled opacity-30' : ''}`}>
        <div className="mb-3 text-[14px] text-mediumEmphasis">Amount to Close (Notional)</div>
      </div>
      <div className={`mb-3 ${disabled ? 'opacity-30' : ''}`}>
        <div
          className={`trade-input-outline rounded-[4px] bg-none p-[1px]
              ${isFocus ? 'valid' : ''}
              ${isError ? 'error' : ''}
              ${disabled ? 'disabled' : ''}`}>
          <div className="flex h-12 items-center rounded-[4px] bg-mediumBlue p-3">
            <Image src="/images/components/layout/header/eth-tribe3.svg" alt="" width={18} height={24} />
            <div className="leading-[10px]">
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
              ref={refInputBox}
              type="text"
              // pattern="[0-9]*"
              className="w-full border-none border-mediumBlue bg-mediumBlue text-right text-[15px] font-bold text-white outline-none"
              value={closeValue === 0 ? '' : closeValue}
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
        <QuantityTips isOverFee={isOverFee} isAmountTooSmall={isAmountTooSmall} isAmountTooLarge={isAmountTooLarge} />
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

function DisplayValues(props: any) {
  const { title, value, unit = '', valueClassName = '', unitClassName = '', className = '' } = props;

  return (
    <div
      className={`${className !== '' ? className : ''}
      mb-[2px] flex items-center
    `}>
      <div className="text-[14px] text-mediumEmphasis">{title}</div>
      <div className={`flex-1 flex-shrink-0 text-right text-mediumEmphasis ${valueClassName}`}>
        <span className="text-[14px]">{value}</span> <span className={`text-[12px] ${unitClassName}`}>{unit}</span>
      </div>
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
              <MobileTooltip content="Partial close will not free any collateral">
                <Image className="cursor-pointer" src="/images/components/trade/alert.svg" width={16} height={16} alt="" />
              </MobileTooltip>
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
      <SectionDividers />
    </div>
  );
}

function ExtendedEstimateComponent(props: { estimation: OpenPositionEstimation; isFullClose: boolean }) {
  const { estimation, isFullClose } = props;

  return (
    <>
      {!isFullClose ? (
        <>
          <div>
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

      <div>
        <div className="mb-1 mt-4 text-[14px] font-semibold text-white underline">Transaction Details</div>
      </div>
      <DisplayValues title="Transaction Fee" unit=" WETH" value={!estimation ? '-.--' : estimation.txSummary.fee.toFixed(5)} />
      <DisplayValues title="Execution Price" value={!estimation ? '-.--' : estimation.txSummary.entryPrice.toFixed(2)} unit="WETH" />
      <DisplayValues title="Resulting Price" value={!estimation ? '-.--' : estimation.posInfo.resultingPrice.toFixed(2)} unit="WETH" />
      <div className="flex justify-between">
        <MobileTooltip
          content={
            <div className="text-center">
              The change in price resulted <br />
              directly from a particular trade <br />
              in the VAMM
            </div>
          }>
          <div className="col-auto text-[14px] text-mediumEmphasis">Price Impact</div>
        </MobileTooltip>
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
        max={Number(maxCloseValue.toFixed(4))}
        defaultValue={0}
        onChange={onSlide}
        onAfterChange={onChange}
        step={0.0001}
      />
      <div className="mb-6 mt-[6px] flex justify-between text-[12px] text-highEmphasis">
        <div>0</div>
        <div>Total Notional Value</div>
      </div>
    </div>
  );
}

const waitAndScrollToBottom = () => {
  const timer = setTimeout(() => {
    const tradingMobileContent = document.getElementById('tradingMobileScroll');
    if (tradingMobileContent) tradingMobileContent.scrollTo({ top: tradingMobileContent.scrollHeight, behavior: 'smooth' });
  }, 200);

  return () => clearTimeout(timer);
};

export default function CloseCollateral() {
  const currentAmm = useNanostore($currentAmm);
  const userPosition = usePositionInfo(currentAmm);
  const maxCloseValue = userPosition?.currentNotional ?? 0;
  const closeSide = userPosition?.size && userPosition?.size > 0 ? Side.SHORT : Side.LONG;
  const [isFullClose, setIsFullClose] = useState(false);
  const [closeValue, setCloseValue] = useState(0);
  const [toleranceRate, setToleranceRate] = useState<number | string>(0.5);
  const [showDetail, setShowDetail] = useState(false);
  const [isAmountTooSmall, setIsAmountTooSmall] = useState(false);
  const [isAmountTooLarge, setIsAmountTooLarge] = useState(false);
  const [prepareTextErrorMessage, setPrepareTextErrorMessage] = useState<string | null>(null);
  const [writeTextErrorMessage, setWriteTextErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isInputBlur, setIsInputBlur] = useState(false);

  const {
    isLoading: isEstLoading,
    estimation,
    isError: isEstError,
    error: estError
  } = useOpenPositionEstimation({
    side: closeSide,
    notionalAmount: Number(closeValue) || 0,
    slippagePercent: Number(toleranceRate),
    leverage: 1
  });
  const approvalAmount = getApprovalAmountFromEstimation(estimation);
  const isNeedApproval = useApprovalCheck(approvalAmount);
  const isConnected = useNanostore($userIsConnected);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const wethBalance = useNanostore($userWethBalance);
  const [isFirstPartialClose, setIsFirstPartialClose] = useState(true);

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

  useEffect(() => {
    if (isEstError) {
      setPrepareTextErrorMessage(estError ? formatError(estError.message) : null);
    }
  }, [isEstError, estError]);

  const initializeState = useCallback(() => {
    setCloseValue(0);
    setToleranceRate(0.5);
    setIsPending(false);
    setPrepareTextErrorMessage(null);
  }, []);

  const handleError = useCallback((error: Error | null, isPrepareError: boolean) => {
    setIsPending(false);

    setPrepareTextErrorMessage(error && isPrepareError ? formatError(error.message) : null);
    setWriteTextErrorMessage(error && !isPrepareError ? formatError(error.message) : null);
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
        estimation={estimation}
        disabled={isPending || isWrongNetwork}
        isInputBlur={isInputBlur}
        setIsInputBlur={setIsInputBlur}
      />
      <ErrorTip label={prepareTextErrorMessage} />
      <CloseSlider
        closeValue={closeValue}
        maxCloseValue={maxCloseValue}
        onChange={(value: any) => {
          setIsInputBlur(true);
          handleChange(value);
        }}
        onSlide={(value: any) => {
          setIsInputBlur(true);
          handleChange(value);
        }}
        disabled={isPending || isWrongNetwork}
      />
      <SectionDividers />
      <div className={`mb-4 flex items-center ${isPending || isWrongNetwork ? 'disabled' : ''}`}>
        <MobileTooltip
          direction="top"
          content={
            <div className="text-center">
              The maximum pricing difference between the price at the time of trade confirmation the actual price of the transaction that
              the users are willing to accept
            </div>
          }>
          <div className="text-[14px] text-mediumEmphasis">Slippage Tolerance</div>
        </MobileTooltip>

        <div className="flex flex-1 justify-end text-right">
          <div
            className={`rounded-[4px] border-mediumBlue bg-mediumBlue
              px-[10px] py-[4px] text-white
              ${isPending || isWrongNetwork ? 'disabled opacity-30' : ''}`}>
            <input
              disabled={isPending || isWrongNetwork}
              title=""
              type="text"
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

      <div className="pb-4">
        {!isConnected ? (
          <ConnectButton />
        ) : isWrongNetwork ? (
          <SwitchButton />
        ) : wethBalance === 0 ? (
          <GetWETHButton />
        ) : isNeedApproval ? (
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
            notionalAmount={Number(closeValue) || 0}
            leverage={1}
            slippagePercent={Number(toleranceRate)}
            estimation={isAmountTooLarge || isAmountTooSmall ? undefined : estimation}
            onPending={handlePending}
            onSuccess={initializeState}
            onError={handleError}
          />
        )}
      </div>

      <div className="mt-4">
        <ErrorTip label={writeTextErrorMessage} />
      </div>

      {estimation && !isAmountTooLarge && !isAmountTooSmall && closeValue > 0 ? (
        <>
          <div className="flex pb-4">
            <div
              className="flex cursor-pointer text-[14px] font-semibold text-primaryBlue hover:text-[#6286e3]"
              onClick={() => {
                setShowDetail(val => !val);
                waitAndScrollToBottom();
              }}>
              {!showDetail ? 'Show' : 'Hide'} Advanced Details
              {!showDetail ? (
                <Image src="/images/common/angle_down.svg" alt="" width={12} height={12} />
              ) : (
                <Image src="/images/common/angle_up.svg" alt="" width={12} height={12} />
              )}
            </div>
            <div className="flex-1" />
          </div>
          <div>{showDetail && <ExtendedEstimateComponent estimation={estimation} isFullClose={isFullClose} />}</div>
        </>
      ) : null}

      <PartialCloseModal />
    </div>
  );
}
