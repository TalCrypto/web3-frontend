/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */

import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useStore as useNanostore } from '@nanostores/react';

import { apiConnection } from '@/utils/apiConnection';
import { pageTitleParser } from '@/utils/eventLog';
import TitleTips from '@/components/common/TitleTips';

import InputSlider from '@/components/trade/desktop/trading/InputSlider';

import { firebaseAnalytics } from '@/const/firebaseConfig';
import { logEvent } from 'firebase/analytics';
import Tooltip from '@/components/common/Tooltip';
import { Address } from 'wagmi';
import { OpenPositionEstimation, Side, getApprovalAmountFromEstimation, useApprovalCheck, useOpenPositionEstimation } from '@/hooks/trade';
import { $userAddress, $userIsConnected, $userIsWrongNetwork, $userWethBalance } from '@/stores/user';
import { $currentAmm } from '@/stores/trading';
import { usePositionInfo } from '@/hooks/collection';
import { zeroAddress } from 'viem';
import ConnectButton from '@/components/trade/desktop/trading/actionBtns/ConnectButton';
import SwitchButton from '@/components/trade/desktop/trading/actionBtns/SwitchButton';
import GetWETHButton from '@/components/trade/desktop/trading/actionBtns/GetWETHButton';
import ApproveButton from '@/components/trade/desktop/trading/actionBtns/ApproveButton';
import OpenPosButton from '@/components/trade/desktop/trading/actionBtns/OpenPosButton';
import { MINIMUM_COLLATERAL } from '@/const';

function LongShortRatio(props: any) {
  const router = useRouter();
  const { setSaleOrBuyIndex, saleOrBuyIndex } = props;
  const fullWalletAddress = useNanostore($userAddress);
  const currentAmm = useNanostore($currentAmm);
  const userPosition = usePositionInfo(currentAmm);

  function analyticsLogSide(index: any, currentCollection: any, walletAddress: Address) {
    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, ['btnLong_pressed', 'btnShort_pressed'][index], {
        wallet: walletAddress.substring(2),
        collection: currentCollection
      });
    }
    const eventName = ['btnLong_pressed', 'btnShort_pressed'][index];
    apiConnection.postUserEvent(
      eventName,
      {
        page: pageTitleParser(router.asPath).page,
        collection: currentCollection
      },
      walletAddress
    );
  }

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
          ${saleOrBuyIndex === 0 ? 'long-selected text-highEmphasis' : 'text-direction-unselected-disabled'}
          text-center text-[14px] font-semibold`}
          key="long">
          <div className="">LONG</div>
        </Tooltip>
      ) : (
        <div
          className={`flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-full
          ${saleOrBuyIndex === Side.LONG ? 'long-selected text-highEmphasis' : 'text-direction-unselected-normal'}
          text-center text-[14px] font-semibold hover:text-highEmphasis`}
          onClick={() => {
            if (!userPosition || userPosition.size === 0) {
              setSaleOrBuyIndex(Side.LONG);
              analyticsLogSide(0, currentAmm, fullWalletAddress ?? zeroAddress);
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
          <div className="">SHORT</div>
        </Tooltip>
      ) : (
        <div
          className={`flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-full
            ${saleOrBuyIndex === Side.SHORT ? 'short-selected text-highEmphasis' : 'text-direction-unselected-normal'}
            text-center text-[14px] font-semibold hover:text-highEmphasis`}
          key="short"
          onClick={() => {
            if (!userPosition || userPosition.size === 0) {
              setSaleOrBuyIndex(Side.SHORT);
              analyticsLogSide(1, currentAmm, fullWalletAddress ?? zeroAddress);
            }
          }}>
          SHORT
        </div>
      )}
    </div>
  );
}

function QuantityTips(props: any) {
  const {
    // isInsuffBalance,
    isAmountTooSmall,
    // isAmountNegative,
    // estPriceFluctuation,
    // isFluctuationLimit,
    // isPending,
    // isLiquidatable,
    value
    //
  } = props;
  // price gap
  // const isWrongNetwork = useNanostore(wsIsWrongNetwork);

  // const isChecking = !isInsuffBalance && !isAmountTooSmall && !isPending && !estPriceFluctuation && !isLiquidatable;
  // const isShow = value <= 0 || isChecking || isWrongNetwork || isAmountNegative;

  // if (isShow) {
  //   return null;
  // }

  // const label = isPending ? (
  //   'Your previous transaction is pending, you can trade this collection again after the transaction is completed.'
  // ) : isAmountTooSmall ? (
  //   'Minimum collateral size 0.01'
  // ) : isInsuffBalance ? (
  //   <>
  //     Not enough WETH (including transaction fee).
  //     <a href="#" onClick={() => {}} className="ml-1 text-white underline">
  //       Get WETH
  //     </a>{' '}
  //     first
  //   </>
  // ) : isFluctuationLimit ? (
  //   'Transaction will fail due to high price impact of the trade. To increase the chance of executing the transaction, please reduce the notional size of your trade.'
  // ) : isLiquidatable ? (
  //   'Resulting position DOES NOT meet the maintenance leverage requirement of 10x calculated based on Oracle Price.'
  // ) : estPriceFluctuation ? (
  //   'Transaction might fail due to high price impact of the trade. To increase the chance of executing the transaction, please reduce the notional size of your trade.'
  // ) : (
  //   ''
  // );

  const label = isAmountTooSmall ? 'Minimum collateral size 0.01' : null;

  // const isRedText = isInsuffBalance || isAmountTooSmall || isFluctuationLimit || isLiquidatable;
  // return (
  //   <div className={`quantity-tips-container ${(!isInsuffBalance && estPriceFluctuation) || isPending ? 'price-fluc' : ''}`}>
  //     <div className={`${isAmountTooSmall ? 'text-marketRed' : 'text-warn'} mb-2 text-[12px] leading-[20px]`}>{label}</div>
  //   </div>
  // );
  return label ? (
    <div className="quantity-tips-container">
      <div className="mb-2 text-[12px] leading-[20px] text-marketRed">{label}</div>
    </div>
  ) : null;
}

function QuantityEnter(props: any) {
  const {
    value,
    onChange,
    // isInsuffBalance,
    isAmountTooSmall,
    // estPriceFluctuation,
    // isFluctuationLimit,
    // isLiquidatable,
    // isPending,
    disabled
  } = props;

  const isConnected = useNanostore($userIsConnected);
  const isWrongNetwork = useNanostore($userIsWrongNetwork);
  // const isApproveRequired = useNanostore(wsIsApproveRequired);
  const wethBalance = useNanostore($userWethBalance);

  const [isFocus, setIsFocus] = useState(false);

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
            <button type="button" className="ml-[8px] text-[14px] text-primaryBlue" onClick={() => {}}>
              Get WETH
            </button>
          </div>
        ) : null}
      </div>
      {/* ${isError ? 'bg-marketRed' : ''} */}
      <div className="py-3">
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
              className={`
                w-full border-none border-mediumBlue bg-mediumBlue text-right
                text-[15px] font-semibold text-white outline-none
              `}
              value={value}
              placeholder="0.00"
              onChange={handleEnter}
              disabled={disabled}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              min={0}

              // onClick={e => {
              //   e.target.selectionStart = e.target.value.length;
              //   e.target.selectionEnd = e.target.value.length;
              // }}
            />
          </div>
        </div>
      </div>
      <QuantityTips
        // isInsuffBalance={isInsuffBalance}
        isAmountTooSmall={isAmountTooSmall}
        // estPriceFluctuation={estPriceFluctuation}
        // isFluctuationLimit={isFluctuationLimit}
        // isLiquidatable={isLiquidatable}
        value={value}
        // isPending={isPending}
      />
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
      <div className="row">
        <div className="col mb-6 mt-3">
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
      <div className="mb-3 flex items-center">
        <div className="font-14 text-color-secondary col-auto">
          <div className="text-[14px] text-mediumEmphasis">Slippage Tolerance</div>
          {/* tipsText="The maximum pricing difference between the price at the time of trade confirmation and the actual price of the transaction that the users are willing to acceptM" */}
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
              onClick={e => {
                // e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                // if (firebaseAnalytics) {
                //   logEvent(firebaseAnalytics, 'trade_open_add_slippageTolerance_pressed', {
                //     wallet: fullWalletAddress.substring(2),
                //     collection: currentToken
                //   });
                // }
                // apiConnection.postUserEvent('trade_open_add_slippageTolerance_pressed', {
                //   page,
                //   collection: currentToken
                // });
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
        className="slipagerow"
        valueClassName="text-color-primary font-14-600"
        unitClassName="font-12"
      />
      {/* <DisplayValuesWithTooltips title="Transaction Fee" value={fee} unit="WETH" tipsText="0.5% of the notional amount of the trade" /> */}
      <div className="my-4 h-[1px] bg-[#2e3064]" />
      <div className="mb-4 flex items-center">
        <div className="text-[14px] text-mediumEmphasis">Total Balance Required</div>
        <div className="flex-1 flex-shrink-0 text-right">
          <span className=" text-[14px]">{isAmountTooSmall || !estimation ? '-.--' : estimation.txSummary.cost.toFixed(4)}</span>
          <span className="text-[12px]" style={{ marginLeft: 4 }}>
            WETH
          </span>
        </div>
      </div>
    </>
  );
}

function Tips({
  isConnected,
  isWrongNetwork,
  isRequireWeth,
  isApproveRequired
}: {
  isConnected: boolean;
  isWrongNetwork: boolean;
  isRequireWeth: boolean;
  isApproveRequired: boolean;
}) {
  const label = !isConnected ? (
    'Please connect the wallets to trade !'
  ) : isWrongNetwork ? (
    'Wrong Network, please switch to Arbitrum!'
  ) : isRequireWeth ? (
    'Please get WETH first !'
  ) : isApproveRequired ? (
    <>
      Please approve before trading! <br />{' '}
      <a
        target="_blank"
        href="https://tribe3.gitbook.io/tribe3/getting-started/set-up-wallet-get-weth-and-start"
        rel="noreferrer"
        className="underline">
        Learn more
      </a>
    </>
  ) : null;

  return label ? (
    <div
      className="mt-4 flex h-[16px] items-center text-[12px]
    font-normal leading-[16px] text-warn">
      <Image src="/images/common/info_warning_icon.svg" alt="" width={12} height={12} className="mr-2" />
      <span className="">{label}</span>
    </div>
  ) : null;
}

function ExtendedEstimateComponent(props: { estimation: OpenPositionEstimation }) {
  // const router = useRouter();
  // const currentToken = useNanostore(wsCurrentToken);
  // const { page } = pageTitleParser(router.asPath);
  const { estimation } = props;
  const currentAmm = useNanostore($currentAmm);
  const userPosition = usePositionInfo(currentAmm);
  const [showDetail, isShowDetail] = useState(false);
  // const targetCollection = collectionList.filter(({ collection }) => collection === currentToken);
  // const { collectionType: currentType } = targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
  // const exposure = formatterValue(estimatedValue.exposure, 4);
  // const isNewPosition = 'newPosition' in estimatedValue;
  // const fee = formatterValue(estimatedValue.fee, 4);
  // const fullWalletAddress = useNanostore(wsFullWalletAddress);
  // const userPosition: any = useNanostore(wsUserPosition);

  // // hide component when there is no estimatedValue
  // if (!estimatedValue || !estimatedValue.cost) return null;

  // // determine if input is valid or error state
  // let isError = isAmountTooSmall || isInsuffBalance;
  // if (value <= 0) {
  //   isError = false;
  // }
  // if (isError || value <= 0) return null;
  const isNewPosition = !userPosition || userPosition.size === 0;

  return (
    <div>
      <div className="mt-6">
        <div
          className="flex cursor-pointer text-[14px] font-semibold text-primaryBlue hover:text-[#6286e3]"
          onClick={() => {
            isShowDetail(!showDetail);
            // if (firebaseAnalytics) {
            //   logEvent(firebaseAnalytics, 'showAdvancedDetails_pressed', {
            //     wallet: fullWalletAddress.substring(2),
            //     is_advanced_data_shown: !showDetail,
            //     collection: currentToken
            //   });
            // }
            // apiConnection.postUserEvent('showAdvancedDetails_pressed', {
            //   page,
            //   is_advanced_data_shown: !showDetail,
            //   collection: currentToken
            // });
          }}>
          {showDetail ? 'Hide' : 'Show'} Advanced Details
          {showDetail ? (
            <Image src="/images/common/angle_up.svg" className="mr-2" alt="" width={12} height={12} />
          ) : (
            <Image src="/images/common/angle_down.svg" className="mr-2" alt="" width={12} height={12} />
          )}
        </div>
      </div>

      {showDetail ? (
        <div className="">
          {!isNewPosition ? (
            <>
              <div className="row">
                <div className="mb-1 mt-4 text-[14px] font-semibold text-white underline">Estimated Blended Position</div>
              </div>
              {/* <DisplayValues
                title="Position Type"
                value={isNewPosition ? (estimatedValue.newPosition.type === 'long' ? 'Long' : 'Short') : '---'}
                unit=""
              /> */}
              {/* <DisplayValues
                title="Contract Size"
                value={isNewPosition ? formatterValue(estimatedValue.newPosition.size, 4) : '-.--'}
                unit={currentType}
              /> */}
              <DisplayValues title="Notional" value={estimation?.posInfo.positionNotional.toFixed(4)} unit="WETH" />
              <DisplayValues title="Collateral" value={estimation?.posInfo.margin.toFixed(4)} unit="WETH" />
              <DisplayValues title="Average Entry Price" value={estimation?.posInfo.avgEntryPrice.toFixed(2)} unit="WETH" />
              {/* <DisplayValues
              title="Collateral Ratio"
              value={isNewPosition ? formatterValue(estimatedValue.newPosition.marginRatio, 2) : '-.--'}
              unit="%"
            /> */}
              <DisplayValues title="Leverage" value={estimation?.posInfo.leverage.toFixed(2)} unit="x" />
              <DisplayValues title="Liquidation Price" value={estimation?.posInfo.liquidationPrice.toFixed(2)} unit="WETH" />
            </>
          ) : null}

          <div className="row">
            <div className="mb-2 mt-4 text-[14px] font-semibold text-white underline">
              Transaction Details
              {/* {userPosition != null ? '(Standalone Basis)' : null} */}
            </div>
          </div>
          {/* <DisplayValues title="Estimated Exposure" value={exposure} unit={currentType} /> */}
          <DisplayValues title="Transaction Fee" value={estimation?.txSummary.fee.toFixed(4)} unit="WETH" />
          <DisplayValues title="Entry Price" value={estimation?.txSummary.entryPrice.toFixed(2)} unit="WETH" />
          <DisplayValues
            title={
              <TitleTips titleText="Price Impact" tipsText="The change in price resulted directly from a particular trade in the VAMM" />
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

export default function TradeComponent() {
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
  const [textErrorMessage, setTextErrorMessage] = useState<string | null>(null);
  const notionalAmount = Number(quantity) * leverageValue ?? 0;
  const { isLoading: isEstLoading, estimation } = useOpenPositionEstimation({
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

  const initializeState = useCallback(() => {
    setQuantity('');
    setLeverageValue(1);
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
  }, [currentAmm, saleOrBuyIndex, isConnected]);

  const handleQuantityInput = (value: string) => {
    setQuantity(value);
  };

  const handleLeverageChange = (leverage: number) => {
    setLeverageValue(leverage);
  };

  return (
    <div>
      <LongShortRatio saleOrBuyIndex={saleOrBuyIndex} setSaleOrBuyIndex={setSaleOrBuyIndex} />
      <QuantityEnter
        disabled={isWrongNetwork || isPending}
        value={quantity}
        onChange={(value: string) => {
          handleQuantityInput(value);
        }}
        isAmountTooSmall={isAmountTooSmall}
      />
      <LeverageComponent
        disabled={isPending || isWrongNetwork}
        value={leverageValue}
        setValue={setLeverageValue}
        onChange={(value: any) => {
          handleLeverageChange(value);
        }}
      />
      <div className="row">
        <div className="col">
          <div className="mb-6 h-[1px] bg-[#2e3064]" />
        </div>
      </div>
      <EstimatedValueDisplay
        disabled={isPending || isWrongNetwork}
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
      {textErrorMessage ? <p className="font-12 text-marketRed">{textErrorMessage}</p> : null}
      <Tips
        isConnected={isConnected}
        isWrongNetwork={isWrongNetwork}
        isRequireWeth={wethBalance === 0}
        isApproveRequired={isNeedApproval}
      />
      {estimation && <ExtendedEstimateComponent estimation={estimation} />}
    </div>
  );
}
