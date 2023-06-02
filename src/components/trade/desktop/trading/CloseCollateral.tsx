/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import Image from 'next/image';
import { logEvent } from 'firebase/analytics';
import { ThreeDots } from 'react-loader-spinner';
import { BigNumber, utils } from 'ethers';
import { useRouter } from 'next/router';
// import { debounce } from 'throttle-debounce';
import { useStore as useNanostore } from '@nanostores/react';
import collectionsLoading from '@/stores/collectionsLoading';

import { firebaseAnalytics } from '@/const/firebaseConfig';
import { walletProvider } from '@/utils/walletProvider';
import { calculateNumber, formatterValue } from '@/utils/calculateNumbers';
// import collectionList from '@/const/collectionList';
import TitleTips from '@/components/common/TitleTips';
import tradePanel from '@/stores/tradePanel';
import { apiConnection } from '@/utils/apiConnection';
import { pageTitleParser } from '@/utils/eventLog';
import { hasPartialClose } from '@/stores/UserState';
import InputSlider from '@/components/trade/desktop/trading/InputSlider';
import PartialCloseModal from '@/components/trade/desktop/trading/PartialCloseModal';

import { wsIsWrongNetwork, wsIsApproveRequired } from '@/stores/WalletState';

function SectionDividers() {
  return (
    <div className="">
      <div className="">
        <div className="mb-6 h-[1px] bg-[#2e3064]" />
      </div>
    </div>
  );
}

const fullCloseEstimation = {
  exposure: BigNumber.from('0'),
  entryPrice: BigNumber.from('0'),
  priceImpact: BigNumber.from('0'),
  fee: BigNumber.from('0'),
  cost: BigNumber.from('0'),
  liquidationPrice: BigNumber.from('0'),
  newPosition: {
    type: 'close',
    size: BigNumber.from('0'),
    sizeAbs: BigNumber.from('0'),
    margin: BigNumber.from('0'),
    openNotional: BigNumber.from('0'),
    marginRatio: BigNumber.from('0'),
    entryPrice: BigNumber.from('0'),
    leverage: BigNumber.from('0'),
    liquidationPrice: BigNumber.from('0'),
    marketValue: BigNumber.from('0'),
    sizeValueInWETH: BigNumber.from('0')
  }
};

function QuantityEnter(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const {
    onChange,
    isAmountTooSmall,
    isAmountTooLarge,
    userPosition,
    closeValue,
    tradingData,
    setCloseValue,
    setCurrentMaxValue,
    fullWalletAddress,
    // tokenRef,
    currentToken,
    disabled
  } = props;

  const [isFocus, setIsFocus] = useState(false);
  const isApproveRequired = useNanostore(wsIsApproveRequired);

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
  // const size = 0;
  // const currentPrice = 0;
  let sizeInEth = '';
  let newValue = '0';
  if (userPosition !== null && tradingData !== null) {
    sizeInEth = `${calculateNumber(userPosition.currentNotional, 4)} `;
  }
  const showHalfValue = () => {
    newValue = (Number(sizeInEth) / 2).toFixed(4);
    setCloseValue(newValue);
    onChange(newValue);
    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'trade_close_half_pressed', {
        wallet: fullWalletAddress.substring(2),
        collection: currentToken // from tokenRef.current
      });
    }
    apiConnection.postUserEvent('trade_close_half_pressed', {
      page,
      collection: currentToken // from tokenRef.current
    });
  };
  const showMaxValue = () => {
    const ethNum = Number(sizeInEth);
    setCloseValue(ethNum);
    setCurrentMaxValue(ethNum);
    onChange(ethNum);

    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'trade_close_max_pressed', {
        wallet: fullWalletAddress.substring(2),
        collection: currentToken // from tokenRef.current
      });
    }

    apiConnection.postUserEvent('trade_close_max_pressed', {
      page,
      collection: currentToken // from tokenRef.current
    });
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
        <div className="mb-3 text-[14px] text-[#a3c2ff]/[.68]">Amount to Close (Notional)</div>
      </div>
      <div className="mb-3">
        <div
          className={`trade-input-outline rounded-[4px] bg-none p-[1px]
              ${isFocus ? 'valid' : ''}
              ${isError ? 'error' : ''}
              ${disabled ? 'disabled' : ''}`}>
          <div className="flex h-12 items-center rounded-[4px] bg-[#242652] p-3">
            <Image src="/images/components/layout/header/eth-tribe3.svg" alt="" width="18" height="24" className="" />
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
                <span className="text-center text-[#a3c2ff]/[.6]">MAX</span>
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
                <span className="text-center text-[#a3c2ff]/[.6]">HALF</span>
              </div>
            </div>
            <input
              type="text"
              pattern="[0-9]*"
              className={`w-full border-none border-[#242652] bg-[#242652]
                  text-right text-[15px] font-bold text-white outline-none
                  ${isApproveRequired ? 'cursor-not-allowed' : ''}`}
              value={closeValue === 0 ? '' : closeValue}
              placeholder="0.00"
              onChange={handleEnter}
              disabled={isApproveRequired || disabled}
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
      <div className="w-[45%] text-[14px] text-[#a3c2ff]/[.68]">{title}</div>
      <div className="flex-1">
        <span className="text-[14px] font-semibold text-[#a3c2ff]/[.68]">{currentValue + currentUnit}</span>
        <span className="text-[14px] font-semibold text-white/[.87]">{' → '}</span>
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
      <div className="text-[14px] text-[#a3c2ff]/[.68]">{title}</div>
      <div className="text-[14px] font-semibold text-white/[.87]">
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
      <div className="text-[14px] text-[#a3c2ff]/[.48]">{title}</div>
      <div className={`flex-1 flex-shrink-0 text-right text-[#a3c2ff]/[.68] ${valueClassName}`}>
        <span className="text-[14px]">{value}</span> <span className={`text-[12px] ${unitClassName}`}>{unit}</span>
      </div>
    </div>
  );
}

function AdjustMarginButton(props: any) {
  const {
    closeValue,
    isClosingPosition,
    closePosition,
    maxValueComparison,
    minValueComparison,
    isPending,
    isWaiting,
    isFluctuationLimit,
    isBadDebt
  } = props;
  const isWrongNetwork = useNanostore(wsIsWrongNetwork);

  const isChecked1 = closeValue <= 0 || closeValue === '' || isWrongNetwork || closeValue === 0;
  const isChecked2 = maxValueComparison || minValueComparison || isPending || isWaiting || isFluctuationLimit || isBadDebt;

  if (isChecked1 || isChecked2) {
    return (
      <div className="mb-6 flex h-[46px] w-full cursor-pointer items-center justify-center rounded-[6px] bg-[#272955]">
        <div className="text-center font-semibold text-[#373961]">Close Position</div>
      </div>
    );
  }
  if (isClosingPosition) {
    return (
      <div className="mb-6 flex h-[46px] w-full cursor-pointer items-center justify-center rounded-[6px] bg-[#2574fb]">
        <div className="col loadingindicator confirmtradingbtntextallow mx-auto text-center">
          <ThreeDots ariaLabel="loading-indicator" height={40} width={40} color="white" />
        </div>
      </div>
    );
  }
  return (
    <div
      className="mb-6 flex h-[46px] w-full cursor-pointer
        items-center justify-center rounded-[6px] bg-[#2574fb] hover:bg-[#5190fc]"
      onClick={closePosition}>
      <div className="text-center font-semibold text-white">Close Position</div>
    </div>
  );
}

const ActionButtons = forwardRef((props: any, ref: any) => {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const [isClosingPosition, setIsClosingPosition] = useState(false);
  const [isProcessingClosePos, setIsProcessingClosePos] = useState(false);
  const {
    refreshPositions,
    fullWalletAddress,
    // tokenRef,
    currentToken,
    exposureValue,
    closeValue,
    closeLeverage,
    contractSide,
    toleranceRate,
    currentMaxValue,
    maxValueComparison,
    minValueComparison,
    setCloseValue,
    setEstimatedValue,
    setEstPriceFluctuation,
    isFluctuationLimit,
    setShowOverFluctuationContent,
    setIsShowPartialCloseModal,
    setTextErrorMessage,
    setTextErrorMessageShow,
    isPending,
    setToleranceRate,
    isWaiting,
    userPosition,
    isBadDebt
  } = props;

  const [processToken, setProcessToken] = useState(null); // save current token while process tx

  const isHasPartialClose = useNanostore(hasPartialClose);

  // sync isProcessing to store/tradePanel
  useEffect(() => {
    tradePanel.setIsProcessing(isClosingPosition);
  }, [isClosingPosition]);

  function startClosePosition() {
    setIsClosingPosition(false);
    setCloseValue('');
    setEstimatedValue({});
    setToleranceRate(0.5);
    // refreshPositions();
    setEstPriceFluctuation(false);

    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'callbacks_performclose_start', {
        wallet: fullWalletAddress.substring(2),
        collection: currentToken // from tokenRef.current
      });
    }

    apiConnection.postUserEvent('callbacks_performclose_start', {
      page,
      collection: currentToken // from tokenRef.current
    });
  }

  function completeClosePosition() {
    // refresh on trx complete
    // prevent refreshing when page has changed
    // if (currentToken === processToken) {
    refreshPositions();
    // }

    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'callbacks_performclose_success', {
        wallet: fullWalletAddress.substring(2),
        collection: currentToken // from tokenRef.current
      });
    }

    apiConnection.postUserEvent('callbacks_performclose_success', {
      page,
      collection: currentToken // from tokenRef.current
    });
  }

  function catchFinishPosition() {
    setIsClosingPosition(false);
  }

  /**
   * Check Partial Close Modal if its should be shown
   */
  const checkAndShowPartialCloseModal = (callback: any) => {
    const PARTIAL_CLOSE_MODAL_KEY = 'alreadyShowPartialCloseModal';
    const alreadyShow = localStorage.getItem(PARTIAL_CLOSE_MODAL_KEY);

    // check localstorage or api
    if (alreadyShow || isHasPartialClose) {
      // call close position directly in callback, becouse no modal is shown
      if (callback) callback();
      return;
    }
    // show modal
    setIsShowPartialCloseModal(true);
    // save modal already show state to localStorage
    localStorage.setItem(PARTIAL_CLOSE_MODAL_KEY, 'true');
    // dont call callback close position here, user need to click submit button in modal
  };

  const closePosition = async () => {
    setProcessToken(currentToken);

    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'trade_close_button_pressed', {
        wallet: fullWalletAddress.substring(2),
        collection: currentToken // from tokenRef.current
      });
    }

    apiConnection.postUserEvent('trade_close_button_pressed', {
      page,
      collection: currentToken // from tokenRef.current
    });
    if (isProcessingClosePos) {
      return;
    }
    setIsClosingPosition(true);
    if (Number(closeValue) !== Number(currentMaxValue)) {
      const saleOrBuyIndex = Number(calculateNumber(userPosition.size, 4)) > 0 ? 1 : 0;
      const result = await walletProvider.calculateEstimationValue(saleOrBuyIndex, closeValue, closeLeverage);
      const currentAllowance = await walletProvider.checkAllowance();
      const expectedFee = Number(utils.formatEther(result.fee));
      if (expectedFee > currentAllowance) {
        await walletProvider.performApprove();
      }
      walletProvider
        .createTransaction(
          contractSide,
          closeValue,
          closeLeverage,
          toleranceRate,
          exposureValue,
          'Partial Close Position',
          startClosePosition
        )
        .then(() => {
          completeClosePosition();
        })
        .catch((error: any) => {
          catchFinishPosition();
          if ('error' in error) {
            if (error.error.message === 'execution reverted: price is over fluctuation limit') {
              setShowOverFluctuationContent(true);
            }
          }

          console.error(error);
          // set trade modal message and show
          if (error.error && error.error.message && error.error.type === 'modal') {
            error.error.showToast();
            // tradePanelModal.setMessage(error.error.message);
            // tradePanelModal.setIsShow(true);
          }
          if (error.error && error.error.message && error.error.type === 'text') {
            setTextErrorMessage(error.error.message);
            setTextErrorMessageShow(true);
          }

          if (firebaseAnalytics) {
            logEvent(firebaseAnalytics, 'callbacks_performclose_fail', {
              wallet: fullWalletAddress.substring(2),
              collection: currentToken, // from tokenRef.current
              error_code: error.code.toString()
            });
          }

          apiConnection.postUserEvent('callbacks_performclose_fail', {
            page,
            collection: currentToken, // from tokenRef.current
            error_code: error.code.toString()
          });
        });
    } else {
      const saleOrBuyIndex = Number(calculateNumber(userPosition.size, 4)) > 0 ? 1 : 0;
      const result = await walletProvider.calculateEstimationValue(saleOrBuyIndex, closeValue, closeLeverage);
      const currentAllowance = await walletProvider.checkAllowance();
      const expectedFee = Number(utils.formatEther(result.fee));
      if (expectedFee > currentAllowance) {
        await walletProvider.performApprove();
      }
      walletProvider
        .closePosition(startClosePosition)
        .then(() => {
          completeClosePosition();
        })
        .catch((error: any) => {
          catchFinishPosition();
          if ('error' in error) {
            if (error.error.message === 'execution reverted: over fluctuation limit') {
              setShowOverFluctuationContent(true);
            }
          }

          console.error(error);
          // set trade modal message and show
          if (error.error && error.error.message && error.error.type === 'modal') {
            error.error.showToast();
            // tradePanelModal.setMessage(error.error.message);
            // tradePanelModal.setIsShow(true);
          }
          if (error.error && error.error.message && error.error.type === 'text') {
            setTextErrorMessage(error.error.message);
            setTextErrorMessageShow(true);
          }

          if (firebaseAnalytics) {
            logEvent(firebaseAnalytics, 'callbacks_performclose_fail', {
              wallet: fullWalletAddress.substring(2),
              collection: currentToken, // from tokenRef.current
              error_code: error.code.toString()
            });
          }

          apiConnection.postUserEvent('callbacks_performclose_fail', {
            page,
            collection: currentToken, // from tokenRef.current
            error_code: error.code.toString()
          });
        });
    }
  };

  useImperativeHandle(ref, () => ({
    closePosition
  }));

  const showModalOrClose = () => {
    if (Number(closeValue) < Number(currentMaxValue)) {
      // partial close, check modal
      checkAndShowPartialCloseModal(() => closePosition());
    } else {
      // full close
      closePosition();
    }
  };

  return (
    <div className="flex">
      <AdjustMarginButton
        closeValue={closeValue}
        isClosingPosition={isClosingPosition}
        closePosition={showModalOrClose}
        maxValueComparison={maxValueComparison}
        minValueComparison={minValueComparison}
        isPending={isPending}
        isWaiting={isWaiting}
        isFluctuationLimit={isFluctuationLimit}
        isBadDebt={isBadDebt}
      />
    </div>
  );
});

function QuantityTips(props: any) {
  const { maxValueComparison, minValueComparison, estPriceFluctuation, isFluctuationLimit, isBadDebt, isPending, closeValue } = props;

  if ((closeValue <= 0 && !isBadDebt) || (!maxValueComparison && !minValueComparison && !estPriceFluctuation && !isPending && !isBadDebt)) {
    return <div className="row tbloverviewcontent" />;
  }

  const label = isPending
    ? 'Your previous transaction is pending, you can trade this collection again after the transaction is completed.'
    : isBadDebt
    ? 'Positions with negative collateral value cannot be closed.'
    : maxValueComparison
    ? 'Value is too large!'
    : minValueComparison
    ? 'Minimum collateral size 0.01'
    : isFluctuationLimit
    ? 'Transaction will fail due to high price impact of the trade. To increase the chance of executing the transaction, please reduce the notional size of your trade.'
    : estPriceFluctuation
    ? 'Transaction might fail due to high price impact of the trade. To increase the chance of executing the transaction, please reduce the notional size of your trade.'
    : '';

  const isError = (estPriceFluctuation || isPending || isFluctuationLimit) && !(maxValueComparison || minValueComparison);

  return (
    <div className={`quantity-tips-container ${estPriceFluctuation || isPending ? 'price-fluc' : ''}`}>
      <span
        className={`${isError ? 'text-[#ffc24b]/[.87]' : 'text-[#ff5656]}'}
          mb-2 text-[12px] leading-[20px]
        `}>
        {label}
      </span>
    </div>
  );
}

function EstimationComponent(props: any) {
  const { userPosition, estimatedValue = {}, sizeInEth, closeValue, currentMaxValue, isAmountTooSmall, isAmountTooLarge } = props;
  const isNewPosition = 'newPosition' in estimatedValue;

  // determine if input is valid or error state
  let isError = isAmountTooSmall || isAmountTooLarge;
  if (closeValue <= 0) {
    isError = false;
  }

  return (
    <div>
      {userPosition === null || estimatedValue === null ? (
        <UpdateValueNoDataDisplay title="Notional Value" unit=" WETH" />
      ) : (
        <UpdateValueDisplay
          title="Notional Value"
          userPosition={userPosition}
          currentValue={!userPosition ? '-.--' : sizeInEth}
          newValue={
            !isNewPosition || isError || closeValue <= 0
              ? '-.--'
              : Number(closeValue) === Number(currentMaxValue)
              ? '-.--'
              : calculateNumber(estimatedValue.newPosition?.marketValue, 4)
          }
          unit=" WETH"
        />
      )}
      {userPosition === null || estimatedValue === null ? (
        <UpdateValueNoDataDisplay title="Collateral" unit="%" />
      ) : (
        <UpdateValueDisplay
          title={
            <span className="flex">
              Collateral&nbsp;
              {Number(closeValue) > 0 && Number(closeValue) < Number(currentMaxValue) ? (
                <TitleTips
                  titleText={<Image src="/images/components/trade/alert.svg" width={16} height={16} alt="" />}
                  tipsText="Collateral will not change."
                  placement="top"
                />
              ) : null}
            </span>
          }
          userPosition={userPosition}
          currentValue={userPosition === null ? '-.--' : calculateNumber(userPosition.realMargin, 4)}
          currentUnit=""
          newValue={
            !isNewPosition || isError || closeValue <= 0
              ? '-.--'
              : Number(closeValue) === Number(currentMaxValue)
              ? '-.--'
              : calculateNumber(estimatedValue.collateral, 4)
          }
          unit=" WETH"
        />
      )}
      {userPosition === null && estimatedValue === null ? (
        <UpdateValueNoDataDisplay title="Leverage" unit="x" />
      ) : (
        <UpdateValueDisplay
          title="Leverage"
          userPosition={userPosition}
          currentValue={userPosition === null ? '-.--' : calculateNumber(userPosition.remainMarginLeverage, 2)}
          currentUnit="x"
          newValue={
            !isNewPosition || isError || closeValue <= 0
              ? '-.--'
              : Number(closeValue) === Number(currentMaxValue)
              ? '-.--'
              : calculateNumber(estimatedValue.newPosition.leverage, 2)
          }
          unit="x"
        />
      )}
      {/* {userPosition === null || estimatedValue === null ? (
        <UpdateValueNoDataDisplay title="Collateral Ratio" unit="%" />
      ) : (
        <UpdateValueDisplay
          title="Collateral Ratio"
          userPosition={userPosition}
          currentValue={userPosition === null ? '-.--' : calculateNumber(userPosition.realMarginRatio, 2)}
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

function ExtendedEstimateComponent(props: any) {
  const {
    displayAdvanceDetail,
    // tokenRef,
    // currentToken,
    estimatedValue = {},
    closeValue,
    currentMaxValue,
    isAmountTooSmall,
    isAmountTooLarge
  } = props;
  // const targetCollection = collectionList.filter(({ collection }) => collection === currentToken); // from tokenRef.current
  // const { collectionType: currentType } = targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
  // const exposure = formatterValue(estimatedValue.exposure, 4);
  const isNewPosition = 'newPosition' in estimatedValue;

  // determine if input is valid or error state
  let isError = isAmountTooSmall || isAmountTooLarge;
  if (closeValue <= 0) {
    isError = false;
  }
  if (isError) return null;

  return (
    <div>
      {displayAdvanceDetail !== 0 ? (
        <>
          {Number(closeValue) < Number(currentMaxValue) ? (
            <>
              <div className="row">
                <div className="mb-1 mt-4 text-[14px] font-semibold text-white underline">Estimated Blended Position</div>
              </div>
              {/* <div className="row detailrow">
                <div className="col-auto text-[14px] text-[#a3c2ff]/[.68]">Position Type</div>
                <div className="col contentls">{isNewPosition ? (estimatedValue.newPosition.type === 'long' ? 'Long' : 'Short') : '---'}</div>
              </div> */}
              {/* <DisplayValues
                title="Contract Size"
                value={isNewPosition ? formatterValue(estimatedValue.newPosition.size, 4) : '-.--'}
                unit={currentType}
              /> */}
              {/* <DisplayValues
                title="Notional"
                value={isNewPosition ? formatterValue(estimatedValue.newPosition.marketValue, 2) : '-.--'}
                unit="WETH"
              /> */}
              <DisplayValues title="Collateral" value={isNewPosition ? formatterValue(estimatedValue.collateral, 4) : '-.--'} unit="WETH" />
              <DisplayValues
                title="Average Entry Price"
                value={isNewPosition ? formatterValue(estimatedValue.newPosition.entryPrice, 2) : '-.--'}
                unit="WETH"
              />
              {/* <DisplayValues
                title="Collateral Ratio"
                value={isNewPosition ? formatterValue(estimatedValue.newPosition.marginRatio, 2) : '-.--'}
                unit="%"
              /> */}
              <DisplayValues
                title="Liquidation Price"
                value={isNewPosition ? formatterValue(estimatedValue.newPosition.liquidationPrice, 2) : '-.--'}
                unit="WETH"
              />
            </>
          ) : null}

          <div className="row">
            <div className="mb-1 mt-4 text-[14px] font-semibold text-white underline">Transaction Details</div>
          </div>
          <DisplayValues title="Transaction Fee" unit=" WETH" value={!isNewPosition ? '-.--' : formatterValue(estimatedValue.fee, 5)} />
          {/* <DisplayValues title="Estimated Exposure" value={exposure} unit={currentType} /> */}
          <DisplayValues title="Entry Price" value={formatterValue(estimatedValue.entryPrice, 2)} unit="WETH" />
          <div className="row detaillastrow">
            <div className="col-auto text-[14px] text-[#a3c2ff]/[.68]">Price Impact</div>
            <div className="col contentsmallitem text-[14px] text-[#a3c2ff]/[.68]">
              <span className="value">{formatterValue(estimatedValue.priceImpact, 2)}</span> %
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function CloseSlider(props: any) {
  const { closeValue, currentMaxValue, onChange, setCloseValue, disabled } = props;
  const numMax = Number(currentMaxValue);
  // const marks = {
  //   0: {
  //     style: { fontSize: '12px' },
  //     label: '0'
  //   },
  //   numMax: {
  //     style: { fontSize: '12px', textAlign: 'end', transform: 'translateX(-95%)' },
  //     label: 'Total Notional Value'
  //   }
  // };
  // const tooltipStyling = {
  //   open: true
  // };
  return (
    <div className={`${disabled ? 'disabled' : ''}`}>
      <InputSlider
        disabled={disabled}
        value={closeValue}
        min={0}
        max={numMax}
        defaultValue={0}
        onChange={(value: any) => setCloseValue(value)}
        onAfterChange={onChange}
        step={0.0001}
      />
      <div className="mb-6 flex justify-between text-[12px] text-white/[.87]">
        <div className="">0</div>
        <div className="">Total Notional Value</div>
      </div>
    </div>
  );
}

export default function CloseCollateral(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const {
    refreshPositions,
    userPosition,
    wethBalance,
    fullWalletAddress,
    tradingData,
    // tokenRef,
    currentToken,
    setShowOverFluctuationContent,
    setTradeWindowIndex
  } = props;

  const [closeValue, setCloseValue] = useState(0);
  const [estimatedValue, setEstimatedValue] = useState({});
  const [toleranceRate, setToleranceRate] = useState(0.5);
  const [closeLeverage, setCloseLeverage] = useState(1);
  const [exposureValue, setExposureValue] = useState(0);
  const [contractSide, setContractSide] = useState(0);
  const [currentMaxValue, setCurrentMaxValue] = useState(-1);
  const [maxValueComparison, setMaxValueComparison] = useState(false);
  const [displayAdvanceDetail, setDisplayAdvanceDetail] = useState(0);
  const [minValueComparison, setMinValueComparison] = useState(false);
  const [estPriceFluctuation, setEstPriceFluctuation] = useState(false);
  const [isFluctuationLimit, setIsFluctuationLimit] = useState(false);
  const [isBadDebt, setIsBadDebt] = useState(false);
  const [isShowPartialCloseModal, setIsShowPartialCloseModal] = useState(false);
  const [textErrorMessage, setTextErrorMessage] = useState('');
  const [textErrorMessageShow, setTextErrorMessageShow] = useState(false);
  const isProcessing = useNanostore(tradePanel.processing);
  const [isPending, setIsPending] = useState(false);
  const collectionIsPending = useNanostore(collectionsLoading.collectionsLoading);
  const [isWaiting, setIsWaiting] = useState(false); // waiting value for getting estimated value

  const actionButtonRef = useRef();

  let size = 0;
  let currentPrice = 0;
  let sizeInEth = '';
  const newValue = 0;
  if (userPosition !== null && tradingData !== null) {
    size = Number(calculateNumber(userPosition.size, 4));
    currentPrice = Number(calculateNumber(tradingData.spotPrice, 3));
    sizeInEth = `${calculateNumber(userPosition.currentNotional, 4)} `;
  }

  const handleEnter = useCallback(
    async (value: any) => {
      setTextErrorMessage('');
      setTextErrorMessageShow(false);
      setEstPriceFluctuation(false);
      const saleOrBuyIndex = Number(calculateNumber(userPosition.size, 4)) > 0 ? 1 : 0;
      setContractSide(saleOrBuyIndex);
      if (walletProvider.provider === null || Number(value) === 0 || !value) {
        setEstimatedValue({});
        setEstPriceFluctuation(false);
        return;
      }

      // if (collectionIsPending[walletProvider?.currentTokenAmmAddress]) {
      //   return;
      // }

      if (Number(value) > Number(sizeInEth)) {
        setMaxValueComparison(true);
        setEstimatedValue({});
      } else {
        setMaxValueComparison(false);
      }
      if (Number(value) < 0.01 && Number(value) !== Number(sizeInEth)) {
        setMinValueComparison(true);
        setEstimatedValue({});
      } else {
        setMinValueComparison(false);
      }
      if (Number(value) === Number(currentMaxValue)) {
        setEstimatedValue(fullCloseEstimation);
      }

      if (collectionIsPending[walletProvider?.currentTokenAmmAddress]) {
        await collectionsLoading.getCollectionsLoading(walletProvider?.currentTokenAmmAddress);
        if (collectionIsPending[walletProvider?.currentTokenAmmAddress]) {
          setIsPending(!!collectionIsPending[walletProvider?.currentTokenAmmAddress]);
          return;
        }
      } else setIsPending(false);

      setIsWaiting(true);
      const result = await walletProvider.calculateEstimationValue(saleOrBuyIndex, value, closeLeverage);
      setEstimatedValue(result);
      setExposureValue(result.exposure);
      setCurrentMaxValue(Number(sizeInEth));
      setIsWaiting(false);
      if (Number(formatterValue(result.priceImpact, 2)) <= 0.6 && Number(formatterValue(result.priceImpact, 2)) >= -0.6) {
        setEstPriceFluctuation(false);
      } else {
        setEstPriceFluctuation(true);
      }

      if (Math.abs(Number(formatterValue(result.priceImpact, 2))) > 2.0) {
        setIsFluctuationLimit(true);
      } else {
        setIsFluctuationLimit(false);
      }
    },
    [closeLeverage, collectionIsPending, currentMaxValue, sizeInEth, userPosition]
  );

  // todo: idk, debounced for handle enter still doesnt work
  // const debouncedhandleEnter = debounce(200, handleEnter);

  useEffect(() => {
    setCurrentMaxValue(Number(sizeInEth));
  }, [sizeInEth]);

  useEffect(() => {
    if (userPosition !== null && tradingData !== null) {
      size = Number(calculateNumber(userPosition.size, 4));
      currentPrice = Number(calculateNumber(tradingData.spotPrice, 3));
      sizeInEth = `${calculateNumber(userPosition.currentNotional, 4)} `;
      setCurrentMaxValue(Number(sizeInEth));
    }
  }, [userPosition.size, tradingData.spotPrice]);

  useEffect(() => {
    if (userPosition && Number(utils.formatEther(userPosition.remainMarginLeverage)) === 0) {
      setIsBadDebt(true);
    } else {
      setIsBadDebt(false);
    }
  }, [userPosition]);

  useEffect(() => {
    if (isPending) {
      handleEnter(closeValue);
    }
    // console.log('collection pending is changed');
  }, [collectionIsPending[walletProvider?.currentTokenAmmAddress], closeValue, isPending, handleEnter]);

  useEffect(() => {
    setCloseValue(0);
    handleEnter(0);
  }, [walletProvider.holderAddress]);

  return (
    <div>
      <QuantityEnter
        fullWalletAddress={fullWalletAddress}
        // tokenRef={tokenRef}
        currentToken={currentToken}
        onChange={(e: any) => {
          if (firebaseAnalytics) {
            logEvent(firebaseAnalytics, 'trade_close_input_pressed', {
              wallet: fullWalletAddress.substring(2),
              collection: currentToken // from tokenRef.current
            });
          }

          apiConnection.postUserEvent('trade_close_input_pressed', {
            page,
            collection: currentToken // from tokenRef.current
          });
          setCloseValue(e);
          handleEnter(e);
        }}
        wethBalance={wethBalance}
        userPosition={userPosition}
        closeValue={closeValue}
        tradingData={tradingData}
        setCloseValue={setCloseValue}
        setCurrentMaxValue={setCurrentMaxValue}
        estPriceFluctuation={estPriceFluctuation}
        isAmountTooSmall={minValueComparison}
        isAmountTooLarge={maxValueComparison}
        disabled={isProcessing || isBadDebt}
      />
      <QuantityTips
        maxValueComparison={maxValueComparison}
        minValueComparison={minValueComparison}
        estPriceFluctuation={estPriceFluctuation}
        closeValue={closeValue}
        isPending={isPending}
        isFluctuationLimit={isFluctuationLimit}
        isBadDebt={isBadDebt}
      />
      <CloseSlider
        closeValue={closeValue}
        currentMaxValue={currentMaxValue}
        setCloseValue={setCloseValue}
        onChange={(e: any) => {
          setCloseValue(e);
          handleEnter(e);
        }}
        disabled={isProcessing || isBadDebt}
      />
      <SectionDividers />
      <div className={`mb-4 flex items-center ${isProcessing ? 'disabled' : ''}`}>
        <div className="text-[14px] text-[#a3c2ff]/[.68]">Slippage Tolerance</div>
        <div className="flex flex-1 justify-end">
          <div
            className={`rounded-[4px] border-[#242652] bg-[#242652]
              px-[10px] py-[4px] text-white
              ${isProcessing ? 'disabled' : ''}`}>
            <input
              disabled={isProcessing}
              title=""
              type="text"
              pattern="[0-9]*"
              className="w-[90%] max-w-[100px]  border-[1px]
                border-[#242652] bg-[#242652] text-[15px]
                font-semibold outline-none"
              placeholder="0.0 "
              value={toleranceRate}
              onChange={e => {
                const { value: inputValue } = e.target;
                const reg = /^\d*(\.\d*)?$/;
                if (reg.test(inputValue) || inputValue === '') {
                  setToleranceRate(Number(e.target.value));
                }
              }}
              onClick={e => {
                // e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                if (firebaseAnalytics) {
                  logEvent(firebaseAnalytics, 'trade_close_slippageTolerance_pressed', {
                    wallet: fullWalletAddress.substring(2),
                    collection: currentToken // from tokenRef.current
                  });
                }

                apiConnection.postUserEvent('trade_close_slippageTolerance_pressed', {
                  page,
                  collection: currentToken // from tokenRef.current
                });
              }}
            />
            <span className="my-auto">%</span>
          </div>
        </div>
      </div>
      <EstimationComponent
        userPosition={userPosition}
        estimatedValue={estimatedValue}
        sizeInEth={sizeInEth}
        closeValue={closeValue}
        currentMaxValue={currentMaxValue}
        isAmountTooSmall={minValueComparison}
        isAmountTooLarge={maxValueComparison}
      />
      <ActionButtons
        ref={actionButtonRef}
        refreshPositions={refreshPositions}
        fullWalletAddress={fullWalletAddress}
        // tokenRef={tokenRef}
        currentToken={currentToken}
        exposureValue={exposureValue}
        closeValue={closeValue}
        closeLeverage={closeLeverage}
        contractSide={contractSide}
        toleranceRate={toleranceRate}
        currentMaxValue={currentMaxValue}
        maxValueComparison={maxValueComparison}
        minValueComparison={minValueComparison}
        setCloseValue={setCloseValue}
        setEstimatedValue={setEstimatedValue}
        setEstPriceFluctuation={setEstPriceFluctuation}
        isFluctuationLimit={isFluctuationLimit}
        setShowOverFluctuationContent={setShowOverFluctuationContent}
        setIsShowPartialCloseModal={setIsShowPartialCloseModal}
        setTextErrorMessage={setTextErrorMessage}
        setTextErrorMessageShow={setTextErrorMessageShow}
        isPending={isPending}
        setToleranceRate={setToleranceRate}
        isWaiting={isWaiting}
        userPosition={userPosition}
        isBadDebt={isBadDebt}
      />
      {textErrorMessageShow ? <p className="text-color-warning text-[12px]">{textErrorMessage}</p> : null}
      {/* <div className="row">
        <div className="col-auto text-[14px] text-[#a3c2ff]/[.68]">
          * Collateral will {closeValue >= currentMaxValue ? '' : 'not'} be released
        </div>
      </div> */}
      {estimatedValue /* && estimatedValue.newPosition */ && !minValueComparison && !maxValueComparison && closeValue > 0 ? (
        <div className="row">
          <div
            className="flex cursor-pointer text-[14px] font-semibold text-[#2574fb] hover:text-[#6286e3]"
            onClick={() => setDisplayAdvanceDetail(displayAdvanceDetail ? 0 : 1)}>
            {displayAdvanceDetail === 0 ? 'Show' : 'Hide'} Advanced Details
            {displayAdvanceDetail === 0 ? (
              <Image src="/images/common/angle_down.svg" className="mr-2" alt="" width={12} height={12} />
            ) : (
              <Image src="/images/common/angle_up.svg" className="mr-2" alt="" width={12} height={12} />
            )}
          </div>
        </div>
      ) : null}
      <ExtendedEstimateComponent
        displayAdvanceDetail={displayAdvanceDetail}
        // tokenRef={tokenRef}
        currentToken={currentToken}
        estimatedValue={estimatedValue}
        closeValue={closeValue}
        currentMaxValue={currentMaxValue}
        isAmountTooSmall={minValueComparison}
        isAmountTooLarge={maxValueComparison}
      />
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
