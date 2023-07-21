/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useStore as useNanostore } from '@nanostores/react';

import InputSlider from '@/components/trade/desktop/trading/InputSlider';
import { AdjustMarginEstimation, useAdjustCollateralEstimation, useApprovalCheck, useFreeCollateral } from '@/hooks/trade';
import { $userIsConnected, $userIsWrongNetwork, $userWethBalance } from '@/stores/user';
import { usePositionInfo } from '@/hooks/collection';
import { $collectionConfig, $currentAmm } from '@/stores/trading';
import { useDebounce } from '@/hooks/debounce';
import { formatBigInt, parseBigInt } from '@/utils/bigInt';
import ApproveButton from '@/components/trade/common/actionBtns/ApproveButton';
import AddCollateralButton from '@/components/trade/common/actionBtns/AddCollateralButton';
import ReduceCollateralButton from '@/components/trade/common/actionBtns/ReduceCollateralButton';
import ConnectButton from '@/components/trade/common/actionBtns/ConnectButton';
import GetWETHButton from '@/components/trade/common/actionBtns/GetWETHButton';
import SwitchButton from '@/components/trade/common/actionBtns/SwitchButton';

import { formatError } from '@/const/errorList';
import { ErrorTip } from '@/components/trade/common/ErrorTip';
import { $showGetWEthModal } from '@/stores/modal';

function SaleOrBuyRadio(props: any) {
  const { marginIndex, setMarginIndex, onChange, disabled } = props;

  const radioGroup = ['Add', 'Reduce'].map((item, index) => {
    const className = marginIndex === index ? ['long-selected', 'short-selected'][marginIndex] : 'selectbehaviour';
    return (
      <div
        className={`flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center 
          rounded-full text-center text-[14px] font-semibold hover:text-highEmphasis
          ${className} ${marginIndex === index ? 'text-highEmphasis' : 'text-direction-unselected-normal'}
        `}
        onClick={() => {
          if (!disabled) {
            onChange();
            setMarginIndex(index);
          }
        }}
        key={item}>
        <div className="col my-auto">{item}</div>
      </div>
    );
  });
  return <div className="mb-[26px] flex h-[40px] rounded-full bg-mediumBlue">{radioGroup}</div>;
}

function QuantityTips(props: any) {
  const { isInsuffBalance, isAmountTooSmall, estPriceFluctuation, textErrorMessage } = props;
  const [isEstPriceFluctuation, setIsEstPriceFluctuation] = useState(false);

  const onClickWeth = () => {
    $showGetWEthModal.set(true);
  };

  useEffect(() => {
    if (estPriceFluctuation) {
      const interval = setTimeout(() => {
        setIsEstPriceFluctuation(true);
        clearInterval(interval);
      }, 1000);
    } else {
      setIsEstPriceFluctuation(false);
    }
  }, [estPriceFluctuation]);

  const label = isAmountTooSmall ? (
    'Minimum collateral size 0.01'
  ) : isInsuffBalance ? (
    <>
      Not enough WETH (including transaction fee). <br />
      <span className="cursor-pointer text-white underline" onClick={onClickWeth}>
        Get WETH
      </span>{' '}
      first.
    </>
  ) : !textErrorMessage && isEstPriceFluctuation ? (
    <span className="text-warn">
      Transaction might fail due to high price impact of the trade. To increase the chance of executing the transaction, please reduce the
      notional size of your trade.
    </span>
  ) : null;

  return label ? (
    <div>
      <div className="mb-3 text-[12px] leading-[16px] text-marketRed">{label}</div>
    </div>
  ) : null;
}

function QuantityEnter(props: any) {
  const {
    disabled,
    adjustMarginValue,
    onChange,
    estPriceFluctuation,
    textErrorMessage,
    marginIndex,
    freeCollateral,
    wethBalance,
    estimation,
    isError,
    isInputBlur,
    setIsInputBlur
  } = props;

  const [isFocus, setIsFocus] = useState(false);
  const [isAmountTooSmall, setIsAmountTooSmall] = useState(false);
  const [isInsuffBalance, setIsInsuffBalance] = useState(false);

  const userPosition = usePositionInfo();
  const { initMarginRatio } = useNanostore($collectionConfig);

  const initialMarginChecker = estimation !== null && marginIndex === 1 && Number(userPosition?.marginRatio) < initMarginRatio;
  const reduceMarginChecking = Number(freeCollateral) - 0.0001 < 0 && marginIndex === 1;
  const isNotReduce = initialMarginChecker || reduceMarginChecking;
  // const isCollateralErorr =
  //   'Your current collateral is below Initial Collateral Requirement, you can only add Collateral to prevent liquidation.';

  const refInputBox = useRef(null);

  useEffect(() => {
    if (isInputBlur && refInputBox.current) {
      const ref: any = refInputBox.current;
      ref.blur();
    }
  }, [isInputBlur]);

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

    setIsAmountTooSmall(Number(inputValue) < 0.01);
    setIsInsuffBalance(marginIndex === 0 && wethBalance < Number(inputValue));
  };

  const increaseMax = wethBalance;
  const decreaseMax = freeCollateral;
  const maxValue = marginIndex === 0 ? increaseMax : decreaseMax;

  const showHalfValue = () => {
    onChange(Number(maxValue / 2).toFixed(4));
  };

  const showMaxValue = () => {
    onChange(Number(maxValue - 0.00005).toFixed(4));
  };

  const handleGetWethClick = () => {
    $showGetWEthModal.set(true);
  };

  return (
    <>
      <div className={`mb-4 flex ${disabled ? 'opacity-30' : ''}`}>
        <div className="flex-1 text-[14px] text-mediumEmphasis">{marginIndex === 0 ? 'Add' : 'Reduce'} Amount</div>
        {marginIndex === 0 ? (
          <div className="flex text-[14px] text-mediumEmphasis" style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            <div className="flex-1" style={{ display: 'flex', marginRight: '4px' }}>
              <Image alt="" src="/images/common/wallet-white.svg" height={16} width={16} />
            </div>
            {/* {marginIndex === 0 ? 'Balance' : 'Free Collateral'} */}
            <span className="text-b2 text-highEmphasis">{`${Number(wethBalance).toFixed(4)} WETH`}</span>
            {/* get weth button. was: wethBalance <= 0 */}
            <button type="button" className="ml-[8px] text-b2 text-primaryBlue" onClick={handleGetWethClick}>
              Get WETH
            </button>
          </div>
        ) : null}
      </div>
      <div className="mb-3">
        <div
          className={`trade-input-outline mb-3 rounded-[4px] bg-none p-[1px]
              ${isFocus ? 'valid' : ''}
              ${isError ? 'error' : ''}
              ${disabled ? 'opacity-30' : ''}`}>
          <div className="flex h-12 items-center rounded-[4px] bg-mediumBlue p-3">
            <Image src="/images/components/layout/header/eth-tribe3.svg" alt="" width={18} height={24} />
            <div className="leading-[10px]">
              <span className="input-with-text ml-1 text-[12px] font-bold">WETH</span>
            </div>
            <div className="mx-2 h-[40%] w-[1px] bg-[#404f84]" />
            <div className="flex">
              <div
                className={`trade-btn mr-1 flex h-[22px] w-[42px]
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
                className={`trade-btn mr-1 flex h-[22px] w-[42px]
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
              ref={refInputBox}
              className={`w-full border-none border-mediumBlue bg-mediumBlue
                  text-right text-[15px] font-bold text-white outline-none`}
              value={adjustMarginValue}
              placeholder="0.00"
              onChange={handleEnter}
              disabled={disabled}
              min={0}
              // onClick={e => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
              onFocus={() => {
                setIsFocus(true);
                setIsInputBlur(false);
              }}
              onBlur={() => setIsFocus(false)}
            />
          </div>
        </div>
        <QuantityTips
          estPriceFluctuation={estPriceFluctuation}
          isAmountTooSmall={isAmountTooSmall}
          isInsuffBalance={isInsuffBalance}
          textErrorMessage={textErrorMessage}
          value={adjustMarginValue}
        />
        {!isAmountTooSmall && isNotReduce && !isInsuffBalance ? (
          <ErrorTip label="Your current collateral is below Initial Collateral Requirement, you can only add Collateral to prevent liquidation." />
        ) : textErrorMessage ? (
          <ErrorTip label={textErrorMessage} />
        ) : null}{' '}
      </div>
    </>
  );
}

function UpdateValueDisplay(props: any) {
  const { title, currentValue, newValue, unit, unitSizing = 'normal' } = props;

  return (
    <div className="mb-4 flex">
      <div className="w-[45%] text-[14px] text-mediumEmphasis">{title}</div>
      <div className="right">
        <span className="text-[14px] font-semibold text-mediumEmphasis">{currentValue}</span>
        <span className="text-[14px] font-semibold text-highEmphasis">{' → '}</span>
        <span className={unitSizing === 'normal' ? 'text-[12px]' : ''}>
          <span className="text-[14px] font-semibold">{newValue}</span>
          {unit}
        </span>
      </div>
    </div>
  );
}

function SectionDividers() {
  return (
    <div className="row">
      <div className="col">
        <div className="mb-6 h-[1px] bg-[#2e3064]" />
      </div>
    </div>
  );
}

function UpdatedCollateralValue(props: any) {
  const { value, marginIndex } = props;

  return (
    <div className="mb-4 flex items-center">
      <div className="text-[14px] text-mediumEmphasis">{marginIndex === 0 ? 'Total Balance Required' : 'Total Balance Returned'}</div>
      <div className="flex-1 text-right">
        <span className="text-[14px] font-semibold">{value}</span>
        <span className="text-[12px]" style={{ marginLeft: '4px' }}>
          WETH
        </span>
      </div>
    </div>
  );
}

function EstimationValueDisplay(props: { isError: boolean; estimation: AdjustMarginEstimation | undefined }) {
  const { isError, estimation } = props;
  const currentAmm = useNanostore($currentAmm);
  const userPosition = usePositionInfo(currentAmm);

  return (
    <div>
      <UpdateValueDisplay
        title="Collateral Amount"
        currentValue={!userPosition ? '-.--' : userPosition.margin.toFixed(4)}
        newValue={!estimation || isError ? '-.--' : estimation.margin.toFixed(4)}
        unit=" WETH"
      />
      <UpdateValueDisplay
        title="Leverage"
        currentValue={!userPosition ? '-.--' : userPosition.leverage.toFixed(2)}
        newValue={!estimation || isError ? '-.--' : estimation.leverage.toFixed(2)}
        unit="x"
      />
      <UpdateValueDisplay
        title="Liquidation Price"
        currentValue={!userPosition ? '-.--' : userPosition.liquidationPrice.toFixed(4)}
        newValue={!estimation || isError ? '-.--' : estimation.liquidationPrice.toFixed(4)}
        unit=" WETH"
      />
    </div>
  );
}

function AdjustCollateralSlidingBars(props: any) {
  const { marginIndex, adjustMarginValue, freeCollateral, wethBalance, onChange, disabled } = props;

  const rightText =
    marginIndex === 0 ? (
      'Max'
    ) : (
      <>
        Initial Collateral
        <br />
        Requirement
      </>
    );
  const increaseMax = wethBalance;
  const decreaseMax = freeCollateral;
  const maxValue = marginIndex === 0 ? increaseMax : decreaseMax;

  return (
    <div className={`${disabled ? 'disabled' : ''}`}>
      <InputSlider
        min={0}
        max={maxValue}
        step={0.0001}
        value={adjustMarginValue}
        disabled={disabled}
        onChange={onChange}
        onAfterChange={onChange}
      />
      <div className="mb-6 mt-[6px] flex justify-between text-[12px] text-highEmphasis">
        <div>
          Current
          <br />
          Collateral
        </div>
        <div>{rightText}</div>
      </div>
    </div>
  );
}

export default function AdjustCollateral() {
  const currentAmm = useNanostore($currentAmm);
  const [adjustMarginValue, setAdjustMarginValue] = useState(0);
  const debonceBigIntValue = useDebounce(parseBigInt(adjustMarginValue));
  const [marginIndex, setMarginIndex] = useState(0);
  const [textErrorMessage, setTextErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isConnected = useNanostore($userIsConnected);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);

  const freeCollateral = useFreeCollateral();
  const wethBalance = useNanostore($userWethBalance);

  const { isLoading: isEstLoading, estimation } = useAdjustCollateralEstimation(adjustMarginValue * (-1) ** marginIndex);

  const approvalAmount = marginIndex === 1 || !debonceBigIntValue ? 0 : formatBigInt(debonceBigIntValue);
  const isNeedApproval = useApprovalCheck(approvalAmount);
  const [isInputBlur, setIsInputBlur] = useState(false);

  const initializeState = useCallback(() => {
    setAdjustMarginValue(0);
    setIsPending(false);
  }, []);

  const handleError = useCallback((error: Error | null) => {
    setIsPending(false);
    setTextErrorMessage(error ? formatError(error.message) : null);
  }, []);

  const handlePending = useCallback(() => {
    setIsPending(true);
  }, []);

  const handleChange = (value: any) => {
    setAdjustMarginValue(value);
  };

  useEffect(() => {
    // set error message under button
    initializeState();
  }, [currentAmm]);

  useEffect(() => {
    setTextErrorMessage(null);
  }, [currentAmm, marginIndex]);

  return (
    <div>
      <SaleOrBuyRadio disabled={isPending} marginIndex={marginIndex} setMarginIndex={setMarginIndex} onChange={initializeState} />
      <QuantityEnter
        disabled={isPending || (marginIndex === 1 && freeCollateral && Number(freeCollateral) < 0.0001) || isWrongNetwork}
        adjustMarginValue={adjustMarginValue}
        onChange={(value: any) => {
          handleChange(value);
        }}
        marginIndex={marginIndex}
        freeCollateral={freeCollateral}
        wethBalance={wethBalance}
        isError={textErrorMessage !== null}
        estimation={estimation}
        textErrorMessage={textErrorMessage}
        isInputBlur={isInputBlur}
        setIsInputBlur={setIsInputBlur}
      />

      <AdjustCollateralSlidingBars
        marginIndex={marginIndex}
        adjustMarginValue={adjustMarginValue}
        freeCollateral={freeCollateral}
        wethBalance={wethBalance}
        onChange={(value: any) => {
          setIsInputBlur(true);
          handleChange(value);
        }}
        disabled={isPending || (marginIndex === 1 && freeCollateral && Number(freeCollateral) < 0.0001) || isWrongNetwork}
      />
      <SectionDividers />
      <EstimationValueDisplay isError={textErrorMessage !== null} estimation={estimation} />
      <SectionDividers />
      <UpdatedCollateralValue marginIndex={marginIndex} value={!estimation ? '-.-' : Math.abs(estimation.marginRequirement).toFixed(4)} />

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
            approvalAmount={approvalAmount}
            onPending={handlePending}
            onSuccess={() => {}}
            onError={handleError}
          />
        ) : marginIndex === 0 ? (
          <AddCollateralButton
            isEstimating={isEstLoading}
            deltaMargin={estimation ? Math.abs(estimation.marginRequirement) : 0}
            onPending={handlePending}
            onSuccess={initializeState}
            onError={handleError}
          />
        ) : (
          <ReduceCollateralButton
            isEstimating={isEstLoading}
            deltaMargin={estimation ? Math.abs(estimation.marginRequirement) : 0}
            onPending={handlePending}
            onSuccess={initializeState}
            onError={handleError}
          />
        )}
      </div>
      {/* {textErrorMessageShow ? <p className="text-color-warning text-[12px]">{textErrorMessage}</p> : null} */}
    </div>
  );
}
