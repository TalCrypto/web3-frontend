/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */

import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import { useStore as useNanostore } from '@nanostores/react';

import InputSlider from '@/components/trade/desktop/trading/InputSlider';

import Tooltip from '@/components/common/Tooltip';
import { $userIsConnected, $userIsWrongNetwork, $userWethBalance } from '@/stores/user';
import { $currentAmm } from '@/stores/trading';
import { usePositionInfo } from '@/hooks/collection';

import ApproveButton from '@/components/trade/common/actionBtns/ApproveButton';
import ConnectButton from '@/components/trade/common/actionBtns/ConnectButton';
import GetWETHButton from '@/components/trade/common/actionBtns/GetWETHButton';
import OpenPosButton from '@/components/trade/common/actionBtns/OpenPosButton';
import SwitchButton from '@/components/trade/common/actionBtns/SwitchButton';

import {
  OpenPositionEstimation,
  Side,
  getApprovalAmountFromEstimation,
  useApprovalCheck,
  useFluctuationLimit,
  useOpenPositionEstimation
} from '@/hooks/trade';

import { MINIMUM_COLLATERAL } from '@/const';
import { formatError } from '@/const/errorList';
import { ErrorTip } from '@/components/trade/common/ErrorTip';
import { $showGetWEthModal } from '@/stores/modal';
import ApprovalModal from '@/components/trade/desktop/modals/ApprovalModal';

function LongShortRatio(props: any) {
  const { setSaleOrBuyIndex, saleOrBuyIndex, disabled } = props;
  const currentAmm = useNanostore($currentAmm);
  const userPosition = usePositionInfo(currentAmm);

  return (
    <div className="mb-[26px] flex h-[40px] rounded-full bg-mediumBlue">
      {userPosition && userPosition.size < 0 ? (
        <Tooltip
          direction="top"
          content={
            <div className="text-center font-normal text-highEmphasis">
              To open a long position, please
              <br /> close your short position first
            </div>
          }
          className={`flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-full
          ${saleOrBuyIndex === Side.LONG ? 'long-selected text-highEmphasis' : 'text-direction-unselected-disabled'}
          text-center text-[14px] font-semibold`}
          key="long">
          <div>LONG</div>
        </Tooltip>
      ) : (
        <div
          className={`flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-full
            ${saleOrBuyIndex === Side.LONG ? 'long-selected text-highEmphasis' : 'text-direction-unselected-normal'}
            ${!disabled ? 'hover:text-highEmphasis' : ''}
            text-center text-[14px] font-semibold`}
          key="long"
          onClick={() => {
            if (!disabled) {
              if (!userPosition || userPosition.size === 0) {
                setSaleOrBuyIndex(Side.LONG);
              }
            }
          }}>
          LONG
        </div>
      )}

      {userPosition && userPosition.size > 0 ? (
        <Tooltip
          direction="top"
          content={
            <div className="text-center font-normal text-highEmphasis">
              To open a short position, please
              <br /> close your long position first
            </div>
          }
          className={`flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-full
            ${saleOrBuyIndex === Side.SHORT ? 'short-selected text-highEmphasis' : 'text-direction-unselected-disabled'}
            text-center text-[14px] font-semibold`}
          key="short">
          <div>SHORT</div>
        </Tooltip>
      ) : (
        <div
          className={`flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-full
            ${saleOrBuyIndex === Side.SHORT ? 'short-selected text-highEmphasis' : 'text-direction-unselected-normal'}
            ${!disabled ? 'hover:text-highEmphasis' : ''}
            text-center text-[14px] font-semibold `}
          key="short"
          onClick={() => {
            if (!disabled) {
              if (!userPosition || userPosition.size === 0) {
                setSaleOrBuyIndex(Side.SHORT);
              }
            }
          }}>
          SHORT
        </div>
      )}
    </div>
  );
}

function QuantityTips(props: any) {
  const { isAmountTooSmall, isInsuffBalance, estPriceFluctuation, prepareTextErrorMessage } = props;
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
  ) : !prepareTextErrorMessage && isEstPriceFluctuation ? (
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
  const { value, onChange, isAmountTooSmall, disabled, prepareTextErrorMessage, estimation, isInputBlur, setIsInputBlur } = props;

  const isConnected = useNanostore($userIsConnected);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const wethBalance = useNanostore($userWethBalance);

  const [isFocus, setIsFocus] = useState(false);
  const [isInsuffBalance, setIsInsuffBalance] = useState(false);

  const fluctuationPct =
    (Number(estimation?.txSummary?.priceImpactPct) / 100) * 2 + (Number(estimation?.txSummary.priceImpactPct) / 100) ** 2;
  const fluctuationLmt = useFluctuationLimit();
  const estPriceFluctuation =
    value > 0 && fluctuationPct && !(fluctuationPct <= fluctuationLmt * 0.3 && fluctuationPct >= fluctuationLmt * -0.3);

  const handleEnter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { value: inputValue } = target;

    const reg = /^\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '') {
      const decimalNumber = inputValue?.split('.')?.[1];
      if (decimalNumber?.length > 4) {
        return;
      }
      onChange(inputValue);
    }

    setIsInsuffBalance(wethBalance < Number(inputValue));
  };

  return (
    <>
      <div className={`mb-3 flex items-center ${disabled ? 'opacity-30' : ''}`}>
        <div className="flex-1 text-[14px] text-mediumEmphasis">Collateral</div>
        {isConnected && !isWrongNetwork ? (
          <div className="font-14 text-color-secondary flex" style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            <div className="mr-1 flex flex-1">
              <Image alt="" src="/images/common/wallet-white.svg" height={16} width={16} />
            </div>
            <span className="text-[14px] text-[#ffffffde]">{`${wethBalance.toFixed(4)} WETH`}</span>
            {/* get weth button. was: wethBalance <= 0 */}
            <button
              type="button"
              className="ml-[8px] text-[14px] text-primaryBlue"
              onClick={() => {
                $showGetWEthModal.set(true);
              }}>
              Get WETH
            </button>
          </div>
        ) : null}
      </div>
      {/* ${isError ? 'bg-marketRed' : ''} */}
      <div className="pb-3">
        <div
          className={`trade-input-outline mb-3 rounded-[4px] bg-none p-[1px]
            ${isFocus ? 'valid' : ''}
            ${disabled ? 'opacity-30' : ''}
          `}>
          <div className="flex h-[48px] rounded-[4px] bg-mediumBlue p-3">
            <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width={24} height={24} padding-right="12dp" className="betIcon" />
            <div className="ml-[4px] flex items-center justify-center">
              <span className="input-with-text text-[12px] font-semibold">WETH</span>
            </div>
            <input
              type="text"
              // pattern="[0-9]*"
              className="w-full border-none border-mediumBlue bg-mediumBlue text-right
                text-[15px] font-semibold text-white outline-none"
              value={value}
              placeholder="0.00"
              onChange={handleEnter}
              disabled={disabled}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              min={0}
            />
          </div>
        </div>
        <QuantityTips
          estPriceFluctuation={estPriceFluctuation}
          isAmountTooSmall={isAmountTooSmall}
          isInsuffBalance={isInsuffBalance}
          prepareTextErrorMessage={prepareTextErrorMessage}
          value={value}
        />
        {!isAmountTooSmall && !isInsuffBalance ? <ErrorTip label={prepareTextErrorMessage} /> : null}
      </div>
    </>
  );
}

function LeverageComponent(props: any) {
  const { value, onChange, disabled } = props;

  const leverageMarks = Array(10)
    .fill(0)
    .reduce((pre, item, index) => ({ ...pre, [index + 1]: { style: { color: 'rgb(255, 255, 255)' }, label: `${index + 1}` } }), {});

  return (
    <>
      <div className={`flex items-center ${disabled ? 'opacity-30' : ''}`}>
        <div className="text-[14px] text-[#a3c2ff]">Leverage</div>
        <div className="flex-1 flex-shrink-0 text-right text-[14px] font-semibold">{`${value}x`}</div>
      </div>
      <div className="mb-6 mt-3">
        <InputSlider
          disabled={disabled}
          defaultValue={1}
          value={value}
          min={1}
          max={10}
          step={0.1}
          onChange={onChange}
          marks={leverageMarks}
        />
      </div>
    </>
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
        <span className="text-[14px]">{value ?? '-.--'}</span> <span className={`text-[12px] ${unitClassName}`}>{unit}</span>
      </div>
    </div>
  );
}

function EstimatedValueDisplay(props: {
  estimation: OpenPositionEstimation | undefined;
  toleranceRate: number;
  setToleranceRate: (value: any) => void;
  isAmountTooSmall: boolean;
  disabled: boolean;
}) {
  const { estimation, toleranceRate, setToleranceRate, isAmountTooSmall, disabled } = props;

  const sizeNotional = estimation ? estimation.txSummary.notionalSize.toFixed(4) : '-.--';

  return (
    <>
      <div className="mb-4 flex items-center">
        <div className="font-14 text-color-secondary">
          <Tooltip
            direction="top"
            tooltipId="slippage"
            content={
              <div className="text-center">
                The maximum pricing <br />
                difference between the price at <br />
                the time of trade confirmation <br />
                the actual price of the <br />
                transaction that the users are <br />
                willing to accept
              </div>
            }>
            <div className="cursor-pointer text-[14px] text-mediumEmphasis">Slippage Tolerance</div>
          </Tooltip>
        </div>
        <div className="flex flex-1 flex-shrink-0" style={{ display: 'flex', justifyContent: 'end' }}>
          <div
            className={`flex max-w-[100px] justify-end
            rounded-[4px] bg-mediumBlue px-[10px] py-1
            ${disabled ? 'opacity-30' : ''}`}>
            <input
              disabled={disabled}
              title=""
              type="text"
              // pattern="[0-9]*"
              className="w-[90%] border-none border-mediumBlue bg-mediumBlue text-right
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
      <DisplayValues
        title="Size (Notional)"
        value={isAmountTooSmall ? '-.--' : sizeNotional}
        unit="WETH"
        valueClassName="text-color-primary font-14-600"
        unitClassName="font-12"
      />
      {/* <DisplayValuesWithTooltips title="Transaction Fee" value={fee} unit="WETH" tipsText="0.5% of the notional amount of the trade" /> */}
      <div className="mb-6 mt-4 h-[0.5px] bg-[#2E4371]" />
      <div className="mb-4 flex items-center">
        <div className="text-[14px] text-mediumEmphasis">Total Balance Required</div>
        <div className="flex-1 flex-shrink-0 text-right">
          <span className="text-[14px]">{isAmountTooSmall || !estimation ? '-.--' : estimation.txSummary.cost.toFixed(4)}</span>
          <span className="text-[12px]" style={{ marginLeft: 4 }}>
            WETH
          </span>
        </div>
      </div>
    </>
  );
}

function ExtendedEstimateComponent(props: { estimation: OpenPositionEstimation }) {
  const { estimation } = props;
  const currentAmm = useNanostore($currentAmm);
  const userPosition = usePositionInfo(currentAmm);
  const [showDetail, isShowDetail] = useState(false);

  const isNewPosition = !userPosition || userPosition.size === 0;

  return (
    <div>
      <div className="mt-6 flex">
        <div
          className="flex cursor-pointer text-[14px] font-semibold text-primaryBlue hover:text-[#6286e3]"
          onClick={() => {
            isShowDetail(!showDetail);
          }}>
          {showDetail ? 'Hide' : 'Show'} Advanced Details
          {showDetail ? (
            <Image src="/images/common/angle_up.svg" alt="" width={12} height={12} />
          ) : (
            <Image src="/images/common/angle_down.svg" alt="" width={12} height={12} />
          )}
        </div>
        <div className="flex-1" />
      </div>

      {showDetail ? (
        <div>
          {!isNewPosition ? (
            <>
              <div className="mb-1 mt-4 text-[14px] font-semibold text-white underline">Estimated Blended Position</div>
              <DisplayValues title="Notional" value={estimation?.posInfo.positionNotional.toFixed(4)} unit="WETH" />
              <DisplayValues title="Collateral" value={estimation?.posInfo.margin.toFixed(4)} unit="WETH" />
              <DisplayValues title="Average Entry Price" value={estimation?.posInfo.avgEntryPrice.toFixed(2)} unit="WETH" />
              <DisplayValues title="Leverage" value={estimation?.posInfo.leverage.toFixed(2)} unit="x" />
              <DisplayValues title="Liquidation Price" value={estimation?.posInfo.liquidationPrice.toFixed(2)} unit="WETH" />
            </>
          ) : null}

          <div className="row">
            <div className="mb-2 mt-4 text-[14px] font-semibold text-white underline">Transaction Details</div>
          </div>
          <DisplayValues title="Transaction Fee" value={estimation?.txSummary.fee.toFixed(4)} unit="WETH" />
          <DisplayValues title="Execution Price" value={estimation?.txSummary.entryPrice.toFixed(2)} unit="WETH" />
          <DisplayValues title="Resulting Price" value={estimation?.posInfo.resultingPrice.toFixed(2)} unit="WETH" />
          <DisplayValues
            title={
              <Tooltip
                direction="right"
                tooltipId="slippage"
                content={
                  <div className="text-center">
                    The change in price resulted <br />
                    directly from a particular trade <br />
                    in the VAMM
                  </div>
                }>
                <div className="cursor-pointer"> Price Impact</div>
              </Tooltip>
            }
            value={estimation?.txSummary.priceImpactPct.toFixed(2)}
            unit="%"
          />
          {!isNewPosition ? null : (
            <DisplayValues title="Liquidation Price" value={estimation?.posInfo.liquidationPrice.toFixed(2)} unit="WETH" />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function MainTradeComponent() {
  const currentAmm = useNanostore($currentAmm);
  const userPosition = usePositionInfo(currentAmm);
  const isConnected = useNanostore($userIsConnected);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  const wethBalance = useNanostore($userWethBalance);
  const [isPending, setIsPending] = useState(false);
  const [saleOrBuyIndex, setSaleOrBuyIndex] = useState(Side.LONG);
  const [quantity, setQuantity] = useState('');
  const [toleranceRate, setToleranceRate] = useState(0.5);
  const [leverageValue, setLeverageValue] = useState(1);
  const [isAmountTooSmall, setIsAmountTooSmall] = useState(false);
  const [prepareTextErrorMessage, setPrepareTextErrorMessage] = useState<string | null>(null);
  const [writeTextErrorMessage, setWriteTextErrorMessage] = useState<string | null>(null);
  const notionalAmount = Number(quantity) * leverageValue ?? 0;
  const {
    isLoading: isEstLoading,
    estimation,
    isError: isEstError,
    error: estError
  } = useOpenPositionEstimation({
    side: saleOrBuyIndex,
    notionalAmount,
    slippagePercent: toleranceRate,
    leverage: leverageValue
  });
  const approvalAmount = getApprovalAmountFromEstimation(estimation);
  const isNeedApproval = useApprovalCheck(approvalAmount);

  useEffect(() => {
    if (userPosition && userPosition.size !== 0) {
      setSaleOrBuyIndex(userPosition.size < 0 ? 1 : 0);
    }
  }, [userPosition]);

  useEffect(() => {
    if (estimation?.txSummary.collateral && estimation?.txSummary.collateral < MINIMUM_COLLATERAL) {
      setIsAmountTooSmall(true);
    } else {
      setIsAmountTooSmall(false);
    }
  }, [estimation?.txSummary.collateral]);

  useEffect(() => {
    if (isEstError) {
      setPrepareTextErrorMessage(estError ? formatError(estError.message) : null);
    }
  }, [isEstError, estError]);

  const initializeState = useCallback(() => {
    setQuantity('');
    setLeverageValue(1);
    setToleranceRate(0.5);
    setIsPending(false);
  }, []);

  const handleError = useCallback((error: Error | null, isPrepareError: boolean) => {
    setIsPending(false);
    if (isPrepareError) {
      setPrepareTextErrorMessage(error ? formatError(error.message) : null);
    } else {
      setWriteTextErrorMessage(error ? formatError(error.message) : null);
    }
  }, []);

  const handlePending = useCallback(() => {
    setIsPending(true);
  }, []);

  useEffect(() => {
    // set error message under button
    initializeState();
  }, [currentAmm, saleOrBuyIndex, isConnected]);

  const handleQuantityInput = (value: string) => {
    setQuantity(value);
  };

  const handleLeverageChange = (leverage: number) => {
    setLeverageValue(leverage);
  };

  useEffect(() => {
    setPrepareTextErrorMessage(null);
  }, [currentAmm, saleOrBuyIndex]);

  return (
    <div>
      <LongShortRatio
        disabled={isPending || isWrongNetwork || !isConnected}
        saleOrBuyIndex={saleOrBuyIndex}
        setSaleOrBuyIndex={setSaleOrBuyIndex}
      />
      <QuantityEnter
        estimation={estimation}
        disabled={isWrongNetwork || isPending || !isConnected}
        value={quantity}
        onChange={(value: string) => {
          handleQuantityInput(value);
        }}
        isAmountTooSmall={isAmountTooSmall}
        prepareTextErrorMessage={prepareTextErrorMessage}
      />
      <LeverageComponent
        disabled={isPending || isWrongNetwork || !isConnected}
        value={leverageValue}
        setValue={setLeverageValue}
        onChange={(value: any) => {
          handleLeverageChange(value);
        }}
      />

      <div className="mb-4 h-[0.5px] bg-[#2E4371]" />

      <EstimatedValueDisplay
        disabled={isPending || isWrongNetwork || !isConnected}
        estimation={estimation}
        toleranceRate={toleranceRate}
        setToleranceRate={setToleranceRate}
        isAmountTooSmall={isAmountTooSmall}
      />
      {!isConnected ? (
        <ConnectButton />
      ) : isWrongNetwork ? (
        <SwitchButton />
      ) : wethBalance === 0 ? (
        <GetWETHButton />
      ) : isNeedApproval ? (
        <ApproveButton
          isEstimating={isEstLoading}
          approvalAmount={isAmountTooSmall ? 0 : approvalAmount}
          onPending={handlePending}
          onSuccess={() => {}}
          onError={handleError}
        />
      ) : (
        <OpenPosButton
          isEstimating={isEstLoading}
          side={saleOrBuyIndex}
          notionalAmount={notionalAmount}
          leverage={leverageValue}
          slippagePercent={toleranceRate}
          estimation={isAmountTooSmall ? undefined : estimation}
          onPending={handlePending}
          onSuccess={initializeState}
          onError={handleError}
        />
      )}

      <div className="mt-4">
        <ErrorTip label={writeTextErrorMessage} />
      </div>

      {estimation && <ExtendedEstimateComponent estimation={estimation} />}
      <ApprovalModal />
    </div>
  );
}
