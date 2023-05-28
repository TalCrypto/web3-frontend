/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable operator-linebreak */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { logEvent } from 'firebase/analytics';
import { utils } from 'ethers';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/router';
import { useStore as useNanostore } from '@nanostores/react';

import { calculateNumber } from '@/utils/calculateNumbers';
import { walletProvider } from '@/utils/walletProvider';

import { firebaseAnalytics } from '@/const/firebaseConfig';
import { apiConnection } from '@/utils/apiConnection';
import { pageTitleParser } from '@/utils/eventLog';
import tradePanel from '@/stores/tradePanel';
// import tradePanelModal from '@/stores/tradePanelModal';
import collectionsLoading from '@/stores/collectionsLoading';

import InputSlider from '@/components/trade/desktop/InputSlider';

function SaleOrBuyRadio(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const {
    marginIndex,
    setMarginIndex,
    // adjustMarginValue,
    setMarginEstimation,
    fullWalletAddress,
    // tokenRef,
    currentToken,
    // setEstMargin,
    // userPosition,
    // estMargin,
    setAdjustMarginValue
  } = props;
  // const radioButtonIndex = marginIndex ? 0 : 1;

  function getAnalyticsLongShort(index: any) {
    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, ['mytrades_increase_margin_pressed', 'mytrades_decrease_margin_pressed'][index], {
        wallet: fullWalletAddress.substring(2),
        collection: currentToken // from tokenRef.current
      });
    }

    const eventName = ['mytrades_increase_margin_pressed', 'mytrades_decrease_margin_pressed'][index];
    apiConnection.postUserEvent(eventName, {
      page,
      collection: currentToken // from tokenRef.current
    });
  }

  const radioGroup = ['Add', 'Reduce'].map((item, index) => {
    const className = marginIndex === index ? ['longSelected', 'shortSelected'][marginIndex] : 'selectbehaviour';
    return (
      <div
        className={`col button font-14-600 ${className}`}
        onClick={() => {
          setAdjustMarginValue('');
          setMarginEstimation(null);
          getAnalyticsLongShort(index);
          setMarginIndex(index);
        }}
        key={item}>
        <div className="col my-auto">{item}</div>
      </div>
    );
  });
  return <div className="selectLongShortButtonSet flex">{radioGroup}</div>;
}

function QuantityEnter(props: any) {
  const {
    value,
    setValue,
    userPosition,
    onChange,
    isApproveRequired,
    isInsuffBalance,
    wethBalance,
    maxReduceValue,
    isLoginState,
    isWrongNetwork,
    marginIndex,
    balanceChecking,
    marginRatioChecker,
    minimalMarginChecking,
    initialMarginChecker,
    reduceMarginChecking,
    isProcessing,
    getTestToken
  } = props;

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

  let newValue = '0';

  const increaseMax = Number(wethBalance) - 0.0001;
  const decreaseMax = Number(maxReduceValue) - 0.0001;
  const maxValue = marginIndex === 0 ? increaseMax : decreaseMax;
  const disabled = isProcessing || initialMarginChecker || reduceMarginChecking || (decreaseMax <= 0 && marginIndex === 1);

  const showHalfValue = () => {
    newValue = (maxValue / 2).toFixed(4);
    setValue(newValue);
    onChange(newValue);
  };

  const showMaxValue = () => {
    newValue = maxValue.toFixed(4);
    setValue(newValue);
    onChange(newValue);
  };

  // determine if input is valid or error state
  const isValid =
    value > 0 && !balanceChecking && !marginRatioChecker && !minimalMarginChecking && !initialMarginChecker && !reduceMarginChecking;
  let isError = balanceChecking || marginRatioChecker || minimalMarginChecking || initialMarginChecker || reduceMarginChecking;
  if (value <= 0) {
    isError = false;
  }

  return (
    <>
      <div className={`betsizetitle flex ${disabled ? 'disabled' : ''}`}>
        <div className="font-14 text-color-secondary flex-1">{marginIndex === 0 ? 'Add' : 'Reduce'} Amount</div>
        {isLoginState && !isWrongNetwork && marginIndex === 0 ? (
          <div className="font-14 text-color-secondary flex" style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            <div className="flex-1" style={{ display: 'flex', marginRight: '4px' }}>
              <Image alt="" src="/static/wallet-white.svg" height={16} width={16} />
            </div>
            {/* {marginIndex === 0 ? 'Balance' : 'Free Collateral'} */}
            <span className="text-b2 text-highEmphasis">{`${Number(wethBalance).toFixed(4)} WETH`}</span>
            {/* get weth button. was: wethBalance <= 0 */}
            <button type="button" className="ml-[8px] text-b2 text-primaryBlue" onClick={() => getTestToken()}>
              Get WETH
            </button>
          </div>
        ) : null}
      </div>
      <div className="row">
        <div className="col">
          <div className={`betsizebg-outline ${isFocus ? 'valid' : ''} ${isError ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
            <div className="betsizebg">
              <Image src="/static/eth-tribe3.svg" alt="" width="36" height="36" padding-right="12dp" className="betIcon" />
              <div className="inputweth">
                <span className="inputwethtext font-12-600">WETH</span>
              </div>
              <div className="col straightdiv">
                <div className="straightdivider" />
              </div>
              <div className="col sizebtncontent">
                <div
                  className={`sizebutton lefting ${disabled ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!disabled) {
                      showMaxValue();
                    }
                  }}>
                  <span className="btntext">MAX</span>
                </div>
                <div
                  className={`sizebutton ${disabled ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!disabled) {
                      showHalfValue();
                    }
                  }}>
                  <span className="btntext">HALF</span>
                </div>
              </div>
              <input
                type="text"
                pattern="[0-9]*"
                className={`inputnum font-15-600 ${isApproveRequired ? ' blockCursor' : ''}`}
                value={value}
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
      </div>
    </>
  );
}

function UpdateValueDisplay(props: any) {
  const { title, currentValue, newValue, unit, unitSizing = 'normal' } = props;

  return (
    <div className="adjustcollateralrow">
      <div className="font-14 text-color-secondary left">{title}</div>
      <div className="right">
        <span className="text-color-secondary font-14-600">{currentValue}</span>
        <span className="text-color-primary font-14-600">{' → '}</span>
        <span className={unitSizing === 'normal' ? 'font-12' : ''}>
          <span className="font-14-600">{newValue}</span>
          {unit}
        </span>
      </div>
    </div>
  );
}

function UpdateValueNoDataDisplay(props: any) {
  const { title, unit } = props;

  return (
    <div className="row adjustcollateralrow align-items-center">
      <div className="col font-14 text-color-secondary">{title}</div>
      <div className="font-14-600 text-color-secondary col-auto">
        <span>{`-.--${unit}`}</span>
      </div>
    </div>
  );
}

function SectionDividers() {
  return (
    <div className="row">
      <div className="col">
        <div className="dividers" />
      </div>
    </div>
  );
}

function UpdatedCollateralValue(props: any) {
  const { value, marginIndex } = props;

  return (
    <div className="row detaillastrow align-items-center">
      <div className="font-14 text-color-secondary col-auto">{marginIndex === 0 ? 'Total Balance Required' : 'Total Balance Returned'}</div>
      <div className="col totalsizeback">
        <span className="font-14-600">{value}</span>
        <span className="font-12" style={{ marginLeft: '4px' }}>
          WETH
        </span>
      </div>
    </div>
  );
}

function AdjustMarginButton(props: any) {
  const {
    adjustMarginValue,
    isAdjustingMargin,
    adjustPositionMargin,
    isWrongNetwork,
    marginEstimation,
    exceedBalance,
    balanceChecking,
    marginRatioChecker,
    minimalMarginChecking,
    initialMarginChecker,
    marginIndex,
    isPending,
    isWaiting
  } = props;

  const isChecked1 = adjustMarginValue === '' || isWrongNetwork || adjustMarginValue === 0 || balanceChecking;
  const isChecked2 = marginRatioChecker || minimalMarginChecking || initialMarginChecker || isPending || isWaiting;

  if (isChecked1 || isChecked2) {
    return (
      <div className="col confirmtradingbtnbgallow disabled">
        <div className="col confirmtradingbtntextallow">{marginIndex === 0 ? 'Add Collateral' : 'Reduce Collateral'}</div>
      </div>
    );
  }
  if (isAdjustingMargin) {
    return (
      <div className="col confirmtradingbtnbgallow">
        <div className="col loadingindicator confirmtradingbtntextallow mx-auto">
          <ThreeDots ariaLabel="loading-indicator" height={40} width={40} color="white" />
        </div>
      </div>
    );
  }
  return (
    <div className="col button confirmtradingbtnbgallow selectbehaviour" onClick={adjustPositionMargin}>
      <div className="col confirmtradingbtntextallow">{marginIndex === 0 ? 'Add Collateral' : 'Reduce Collateral'}</div>
    </div>
  );
}

function ActionButtons(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const {
    adjustMarginValue,
    refreshPositions,
    isWrongNetwork,
    marginIndex,
    marginEstimation,
    exceedBalance,
    balanceChecking,
    marginRatioChecker,
    minimalMarginChecking,
    fullWalletAddress,
    // tokenRef,
    currentToken,
    initialMarginChecker,
    setAdjustMarginValue,
    setTextErrorMessage,
    setTextErrorMessageShow,
    isPending,
    isWaiting
  } = props;
  const [isAdjustingMargin, setIsAdjustingMargin] = useState(false);

  const [processToken, setProcessToken] = useState(null); // save current token while process tx

  // sync isProcessing to store/tradePanel
  useEffect(() => {
    tradePanel.setIsProcessing(isAdjustingMargin);
  }, [isAdjustingMargin]);

  function startAdjustMargin() {
    setIsAdjustingMargin(false);
    setAdjustMarginValue(0);
    // refreshPositions();

    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'callbacks_adjustmargin_start', {
        wallet: fullWalletAddress.substring(2),
        collection: currentToken // from tokenRef.current
      });
    }
    apiConnection.postUserEvent('callbacks_adjustmargin_start', {
      page,
      collection: currentToken // from tokenRef.current
    });
  }

  function completeAdjustMargin() {
    // refresh on trx complete
    // prevent refreshing when page has changed
    // if (currentToken === processToken) {
    // console.log('refreshPositions from completeAdjustMargin');
    refreshPositions();
    // }

    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'callbacks_adjustmargin_success', {
        wallet: fullWalletAddress.substring(2),
        collection: currentToken // from tokenRef.current
      });
    }

    apiConnection.postUserEvent('callbacks_adjustmargin_success', {
      page,
      collection: currentToken // from tokenRef.current
    });
  }

  const adjustPositionMargin = async () => {
    setProcessToken(currentToken);

    if (firebaseAnalytics) {
      logEvent(firebaseAnalytics, 'trade_adjust_collateral_button_pressed', {
        wallet: fullWalletAddress.substring(2),
        collection: currentToken // from tokenRef.current
      });
    }

    apiConnection.postUserEvent('trade_adjust_collateral_button_pressed', {
      page,
      collection: currentToken // from tokenRef.current
    });
    setIsAdjustingMargin(true);
    if (marginIndex === 0) {
      const currentAllowance = await walletProvider.checkAllowance();
      if (Number(adjustMarginValue) > currentAllowance) {
        await walletProvider.performApprove();
      }
      walletProvider
        .adjustPositionMargin(adjustMarginValue, startAdjustMargin)
        .then(() => {
          completeAdjustMargin();
        })
        .catch((error: any) => {
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

          setIsAdjustingMargin(false);

          if (firebaseAnalytics) {
            logEvent(firebaseAnalytics, 'callbacks_adjustmargin_fail', {
              wallet: fullWalletAddress.substring(2),
              collection: currentToken, // from tokenRef.current
              error_code: error.error.code.toString()
            });
          }

          apiConnection.postUserEvent('callbacks_adjustmargin_fail', {
            page,
            collection: currentToken, // from tokenRef.current
            error_code: error.error.code.toString()
          });
        });
    } else {
      walletProvider
        .reduceMargin(adjustMarginValue, startAdjustMargin)
        .then(() => completeAdjustMargin())
        .catch((error: any) => {
          setIsAdjustingMargin(false);
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
        });
    }
  };

  return (
    <div className="flex">
      <AdjustMarginButton
        adjustMarginValue={adjustMarginValue}
        isAdjustingMargin={isAdjustingMargin}
        adjustPositionMargin={adjustPositionMargin}
        isWrongNetwork={isWrongNetwork}
        marginEstimation={marginEstimation}
        exceedBalance={exceedBalance}
        balanceChecking={balanceChecking}
        marginRatioChecker={marginRatioChecker}
        minimalMarginChecking={minimalMarginChecking}
        initialMarginChecker={initialMarginChecker}
        marginIndex={marginIndex}
        isPending={isPending}
        isWaiting={isWaiting}
      />
    </div>
  );
}

function QuantityTips(props: any) {
  const {
    balanceChecking,
    marginRatioChecker,
    minimalMarginChecking,
    initialMarginChecker,
    reduceMarginChecking,
    value,
    maxReduceValue,
    isPending,
    marginIndex,
    getTestToken
  } = props;
  const decreaseMax = Number(maxReduceValue) - 0.0001;

  if (
    (decreaseMax > 0 || marginIndex === 0) &&
    (value === 0 ||
      (!balanceChecking && !marginRatioChecker && !minimalMarginChecking && !initialMarginChecker && !reduceMarginChecking && !isPending))
  ) {
    return <div className="row tbloverviewcontent" />;
  }

  const label =
    initialMarginChecker || reduceMarginChecking || decreaseMax <= 0 ? (
      'Your current collateral is below Initial Collateral Requirement, you can only add Collateral to prevent liquidation.'
    ) : isPending ? (
      'Your previous transaction is pending, you can trade this collection again after the transaction is completed.'
    ) : marginRatioChecker ? (
      'New Collateral must be above Initial Collateral Requirement.'
    ) : balanceChecking ? (
      <>
        Not enough WETH (including transaction fee).
        <button onClick={() => getTestToken()} className="ml-1 text-white underline">
          Get WETH
        </button>{' '}
        first
      </>
    ) : minimalMarginChecking ? (
      'Minimum collateral size 0.01'
    ) : (
      ''
    );

  return (
    <div className={`quantity-tips-container ${isPending ? 'price-fluc' : ''}`}>
      <span className={`${!isPending ? 'errortext' : ''}`}>{label}</span>
    </div>
  );
}

function EstimationValueDisplay(props: any) {
  const {
    userPosition,
    marginEstimation = {},
    marginRatioChecker,
    estMargin,
    adjustMarginValue,
    value,
    balanceChecking,
    minimalMarginChecking,
    initialMarginChecker,
    reduceMarginChecking
  } = props;

  let isError = balanceChecking || marginRatioChecker || minimalMarginChecking || initialMarginChecker || reduceMarginChecking;
  if (value <= 0) {
    isError = false;
  }

  return (
    <div>
      {!userPosition && !marginEstimation ? (
        <UpdateValueNoDataDisplay title="Collateral Amount" unit=" WETH" />
      ) : (
        <UpdateValueDisplay
          title="Collateral Amount"
          userPosition={userPosition}
          currentValue={!userPosition ? '-.--' : calculateNumber(userPosition.realMargin, 4)}
          newValue={!marginEstimation || marginRatioChecker || isError || adjustMarginValue <= 0 ? '-.--' : estMargin}
          unit=" WETH"
        />
      )}
      {/* {!userPosition && !marginEstimation ? (
        <UpdateValueNoDataDisplay title="Collateral Ratio" unit="" />
      ) : (
        <UpdateValueDisplay
          title="Collateral Ratio"
          userPosition={userPosition}
          currentValue={!userPosition ? '-.--' : calculateNumber(userPosition.marginRatio, 1)}
          newValue={!marginEstimation || marginRatioChecker ? '-.--' : calculateNumber(marginEstimation.marginRatio, 1)}
          unit="%"
          unitSizing=""
        />
      )} */}
      {!userPosition && !marginEstimation ? (
        <UpdateValueNoDataDisplay title="Leverage" unit="" />
      ) : (
        <UpdateValueDisplay
          title="Leverage"
          userPosition={userPosition}
          currentValue={!userPosition ? '-.--' : calculateNumber(userPosition.remainMarginLeverage, 2)}
          newValue={
            !marginEstimation || marginRatioChecker || isError
              ? '-.--'
              : adjustMarginValue <= 0
              ? '-.--'
              : calculateNumber(marginEstimation.leverage, 2)
          }
          unit="x"
        />
      )}
      {!userPosition && !marginEstimation ? (
        <UpdateValueNoDataDisplay title="Liquidation Price" unit="" />
      ) : (
        <UpdateValueDisplay
          title="Liquidation Price"
          userPosition={userPosition}
          currentValue={!userPosition ? '-.--' : calculateNumber(userPosition.liquidationPrice, 4)}
          newValue={
            !marginEstimation || marginRatioChecker || isError
              ? '-.--'
              : adjustMarginValue <= 0
              ? '-.--'
              : calculateNumber(marginEstimation.liquidationPrice, 4)
          }
          unit=" WETH"
        />
      )}
    </div>
  );
}

function AdjustCollateralSlidingBars(props: any) {
  const { marginIndex, onChange, adjustMarginValue, wethBalance, maxReduceValue, setAdjustMarginValue, reduceMarginChecking, disabled } =
    props;
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
  const increaseMax = Number(wethBalance) - 0.0001;
  const decreaseMax = Number(maxReduceValue) - 0.0001;
  const maxValue = marginIndex === 0 ? increaseMax : decreaseMax;
  return (
    <div className={`${disabled ? 'disabled' : ''}`}>
      <InputSlider
        min={0}
        max={maxValue}
        step={0.0001}
        value={adjustMarginValue}
        disabled={reduceMarginChecking || disabled}
        onChange={(value: any) => setAdjustMarginValue(value)}
        onAfterChange={onChange}
      />
      <div className="row adjust-slide-row font-12 text-color-primary">
        <div className="col left">
          Current
          <br />
          Collateral
        </div>
        <div className="col right">{rightText}</div>
      </div>
    </div>
  );
}

export default function AdjustCollateral(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const {
    isWrongNetwork,
    refreshPositions,
    userPosition,
    wethBalance,
    fullWalletAddress,
    tokenRef,
    currentToken,
    isLoginState,
    maxReduceValue,
    getTestToken
  } = props;
  const [adjustMarginValue, setAdjustMarginValue] = useState('');
  const [marginIndex, setMarginIndex] = useState(0);
  const [marginEstimation, setMarginEstimation] = useState(null);
  const [exceedBalance, setExceedBalance] = useState(false);
  const [estMargin, setEstMargin] = useState('-.--');
  const [textErrorMessage, setTextErrorMessage] = useState('');
  const [textErrorMessageShow, setTextErrorMessageShow] = useState(false);
  const isProcessing = useNanostore(tradePanel.processing);
  const [isPending, setIsPending] = useState(false);
  const collectionIsPending = useNanostore(collectionsLoading.collectionsLoading);
  const [isWaiting, setIsWaiting] = useState(false); // waiting value for getting estimated value

  const balanceChecking = Number(adjustMarginValue) > Number(wethBalance) && marginIndex === 0;
  const newMarginEstimation: any = marginEstimation;
  const marginRatioChecker =
    marginEstimation !== null && marginIndex === 1 && Number(utils.formatEther(newMarginEstimation.marginRatio)) < 20;
  const minimalMarginChecking = Number(adjustMarginValue) !== 0 && Number(adjustMarginValue) < 0.01 && adjustMarginValue !== '';
  const initialMarginChecker = marginEstimation !== null && marginIndex === 1 && Number(utils.formatEther(userPosition.marginRatio)) < 20;
  const reduceMarginChecking = Number(maxReduceValue) - 0.0001 < 0 && marginIndex === 1;

  const handleMarginEnter = async function handleMarginEnter(marginValue: any) {
    setTextErrorMessage('');
    setTextErrorMessageShow(false);

    // if (collectionIsPending[walletProvider?.currentTokenAmmAddress]) {
    //   return;
    // }

    if (Number(marginValue) > 0 && !!collectionIsPending[walletProvider?.currentTokenAmmAddress]) {
      await collectionsLoading.getCollectionsLoading(walletProvider?.currentTokenAmmAddress);
      if (collectionIsPending[walletProvider?.currentTokenAmmAddress]) {
        setIsPending(!!collectionIsPending[walletProvider?.currentTokenAmmAddress]);
        return;
      }
      setIsPending(false);
    } else setIsPending(false);

    setIsWaiting(true);
    const estimation = await walletProvider.getMarginEstimation(marginValue, marginIndex);
    const realMarginVal = Number(calculateNumber(userPosition.realMargin, 4));
    const calc = marginIndex === 0 ? (Number(marginValue) + realMarginVal).toFixed(4) : (realMarginVal - Number(marginValue)).toFixed(4);
    const newEstimation = String(calc);
    setMarginEstimation(estimation);
    setIsWaiting(false);
    if (Number(marginValue) <= 0) {
      setEstMargin('-.--');
    } else {
      setEstMargin(newEstimation);
    }
  };

  let initialCollateral = '0';
  if (userPosition !== null) {
    const collaAmountCalc = Number(calculateNumber(userPosition.realMargin, 4));
    const marginRatioCalc = Number(calculateNumber(userPosition.marginRatio, 1) / 100).toFixed(2);
    initialCollateral = Number(collaAmountCalc - (collaAmountCalc / Number(marginRatioCalc)) * 0.2).toFixed(3);
  }

  const handleSuccess = () => {
    refreshPositions();
    setMarginEstimation(null);
    setEstMargin('-.--');
  };

  let isInputError = balanceChecking || marginRatioChecker || minimalMarginChecking || initialMarginChecker || reduceMarginChecking;
  if (Number(adjustMarginValue) <= 0) {
    isInputError = false;
  }

  useEffect(() => {
    if (isPending) {
      handleMarginEnter(adjustMarginValue);
    }
    // console.log('collection pending is changed');
  }, [collectionIsPending[walletProvider?.currentTokenAmmAddress]]);

  useEffect(() => {
    setAdjustMarginValue('');
    handleMarginEnter('');
  }, [walletProvider.holderAddress]);

  return (
    <div>
      <SaleOrBuyRadio
        marginIndex={marginIndex}
        setMarginIndex={setMarginIndex}
        adjustMarginValue={adjustMarginValue}
        setMarginEstimation={setMarginEstimation}
        fullWalletAddress={fullWalletAddress}
        // tokenRef={tokenRef}
        currentToken={currentToken}
        setEstMargin={setEstMargin}
        userPosition={userPosition}
        setAdjustMarginValue={setAdjustMarginValue}
      />
      <QuantityEnter
        adjustMarginValue={adjustMarginValue}
        fullWalletAddress={fullWalletAddress}
        // tokenRef={tokenRef}
        currentToken={currentToken}
        onChange={(e: any) => {
          if (firebaseAnalytics) {
            logEvent(firebaseAnalytics, 'trade_adjust_collateral_input_pressed', {
              wallet: fullWalletAddress.substring(2),
              collection: currentToken // from tokenRef.current
            });
          }

          apiConnection.postUserEvent('trade_adjust_collateral_input_pressed', {
            page,
            collection: currentToken // from tokenRef.current
          });
          setAdjustMarginValue(e);
          handleMarginEnter(e);
        }}
        marginIndex={marginIndex}
        wethBalance={wethBalance}
        isLoginState={isLoginState}
        isWrongNetwork={isWrongNetwork}
        value={adjustMarginValue}
        setValue={setAdjustMarginValue}
        maxReduceValue={maxReduceValue}
        userPosition={userPosition}
        balanceChecking={balanceChecking}
        marginRatioChecker={marginRatioChecker}
        minimalMarginChecking={minimalMarginChecking}
        initialMarginChecker={initialMarginChecker}
        reduceMarginChecking={reduceMarginChecking}
        isProcessing={isProcessing}
        getTestToken={getTestToken}
      />
      <QuantityTips
        balanceChecking={balanceChecking}
        marginRatioChecker={marginRatioChecker}
        minimalMarginChecking={minimalMarginChecking}
        initialMarginChecker={initialMarginChecker}
        reduceMarginChecking={reduceMarginChecking}
        value={adjustMarginValue}
        maxReduceValue={maxReduceValue}
        marginIndex={marginIndex}
        isPending={isPending}
        getTestToken={getTestToken}
      />
      <AdjustCollateralSlidingBars
        marginIndex={marginIndex}
        adjustMarginValue={adjustMarginValue}
        wethBalance={wethBalance}
        initialCollateral={initialCollateral}
        maxReduceValue={maxReduceValue}
        setAdjustMarginValue={setAdjustMarginValue}
        reduceMarginChecking={reduceMarginChecking}
        onChange={(e: any) => {
          const number = Math.round(e * 10000) / 10000;
          const stringValue = number.toString();
          setAdjustMarginValue(stringValue);
          handleMarginEnter(stringValue);
        }}
        disabled={isProcessing}
      />
      <SectionDividers />
      <EstimationValueDisplay
        userPosition={userPosition}
        marginEstimation={marginEstimation}
        marginRatioChecker={marginRatioChecker}
        estMargin={estMargin}
        adjustMarginValue={adjustMarginValue}
        balanceChecking={balanceChecking}
        minimalMarginChecking={minimalMarginChecking}
        initialMarginChecker={initialMarginChecker}
        reduceMarginChecking={reduceMarginChecking}
      />
      <SectionDividers />
      <UpdatedCollateralValue
        marginIndex={marginIndex}
        value={
          userPosition === null || marginEstimation === null || marginRatioChecker || isInputError || Number(adjustMarginValue) <= 0
            ? '-.-'
            : Number(adjustMarginValue).toFixed(4)
        }
      />
      <ActionButtons
        adjustMarginValue={adjustMarginValue}
        refreshPositions={handleSuccess}
        isWrongNetwork={isWrongNetwork}
        marginIndex={marginIndex}
        marginEstimation={marginEstimation}
        exceedBalance={exceedBalance}
        balanceChecking={balanceChecking}
        marginRatioChecker={marginRatioChecker}
        minimalMarginChecking={minimalMarginChecking}
        fullWalletAddress={fullWalletAddress}
        // tokenRef={tokenRef}
        currentToken={currentToken}
        initialMarginChecker={initialMarginChecker}
        setAdjustMarginValue={setAdjustMarginValue}
        setTextErrorMessage={setTextErrorMessage}
        setTextErrorMessageShow={setTextErrorMessageShow}
        isPending={isPending}
        isWaiting={isWaiting}
      />
      {textErrorMessageShow ? <p className="font-12 text-color-warning">{textErrorMessage}</p> : null}
    </div>
  );
}
