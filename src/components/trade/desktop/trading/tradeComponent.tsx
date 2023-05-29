/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */

import { utils } from 'ethers';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
// import { logEvent } from 'firebase/analytics';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import { Tooltip } from 'react-bootstrap';
import { useRouter } from 'next/router';
// import { debounce } from 'lodash';
import { useStore as useNanostore } from '@nanostores/react';

import { formatterValue, calculateNumber } from '@/utils/calculateNumbers';
import { walletProvider, clearingHouseAddress } from '@/utils/walletProvider';
// import { firebaseAnalytics } from '@/const/firebaseConfig';
import collectionList from '@/const/collectionList';
import { apiConnection } from '@/utils/apiConnection';
import { pageTitleParser } from '@/utils/eventLog';
import { dataFetch, whitelisted } from '@/stores/UserState';
import TitleTips from '@/components/common/TitleTips';

import tradePanel from '@/stores/tradePanel';
import collectionsLoading from '@/stores/collectionsLoading';
import { priceGapLimit } from '@/stores/priceGap';
import InputSlider from '@/components/trade/desktop/trading/InputSlider';

// const { isWhitelisted } = walletProvider;

function LongShortRatio(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const { userPosition, setSaleOrBuyIndex, saleOrBuyIndex, currentToken } = props;

  function analyticsLogSide(index: any, currentCollection: any) {
    // logEvent(firebaseAnalytics, ['btnLong_pressed', 'btnShort_pressed'][index], {
    //   wallet: fullWalletAddress.substring(2),
    //   collection: currentCollection
    // });
    const eventName = ['btnLong_pressed', 'btnShort_pressed'][index];
    apiConnection.postUserEvent(eventName, {
      page,
      collection: currentCollection
    });
  }

  return (
    <div className="mb-6 flex h-[40px] rounded-full bg-[#242652]">
      <div
        className={`flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-full
          ${saleOrBuyIndex === 0 ? 'long-selected text-white/[.87]' : 'text-[#c3d8ff]/[.48]'}
          ${userPosition !== null ? 'opacity-30' : ''}
          text-center text-[14px] font-semibold hover:text-white/[.87]`}
        onClick={() => {
          if (userPosition === null) {
            setSaleOrBuyIndex(0);
            analyticsLogSide(0, currentToken);
          }
        }}
        key="long">
        <div className="">LONG</div>
      </div>
      <div
        className={`flex flex-1 flex-shrink-0 cursor-pointer items-center justify-center rounded-full
          ${saleOrBuyIndex === 1 ? 'short-selected text-white/[.87]' : 'text-[#c3d8ff]/[.48]'}
          ${userPosition !== null ? 'opacity-30' : ''}
          text-center text-[14px] font-semibold hover:text-white/[.87]`}
        onClick={() => {
          if (userPosition === null) {
            setSaleOrBuyIndex(1);
            analyticsLogSide(1, currentToken);
          }
        }}
        key="short">
        <div className="">SHORT</div>
      </div>
    </div>
  );
}

function QuantityTips(props: any) {
  const {
    isInsuffBalance,
    isAmountTooSmall,
    isWrongNetwork,
    isAmountNegative,
    estPriceFluctuation,
    // isFluctuationLimit,
    isPending,
    isLiquidatable,
    value
    // getTestToken
  } = props;
  // price gap

  const isChecking = !isInsuffBalance && !isAmountTooSmall && !isPending && !estPriceFluctuation && !isLiquidatable;
  const isShow = value <= 0 || isChecking || isWrongNetwork || isAmountNegative;
  return <div>{isShow ? <div className="row tbloverviewcontent" /> : null}</div>;
}

function QuantityEnter(props: any) {
  const {
    value,
    onChange,
    isApproveRequired,
    isInsuffBalance,
    wethBalance,
    isLoginState,
    isWrongNetwork,
    isAmountTooSmall,
    estPriceFluctuation,
    isFluctuationLimit,
    isLiquidatable,
    isPending,
    disabled,
    getTestToken
  } = props;

  const [isFocus, setIsFocus] = useState(false);

  const handleEnter = (target: any) => {
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

  // determine if input is valid or error state
  // const isValid = value > 0 && !isInsuffBalance && !isAmountTooSmall && !estPriceFluctuation;
  let isError = isAmountTooSmall || isInsuffBalance;
  if (value <= 0) {
    isError = false;
  }

  return (
    <>
      <div className={`mb-3 flex items-center ${disabled ? 'opacity-30' : ''}`}>
        <div className="flex-1 text-[14px] text-[#a3c2ff]/[.68]">Collateral</div>
        {isLoginState && !isWrongNetwork ? (
          <div className="font-14 text-color-secondary flex" style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            <span className="text-[14px] text-[#ffffffde]">{`${Number(wethBalance).toFixed(4)} WETH`}</span>
            {/* get weth button. was: wethBalance <= 0 */}
            <button type="button" className="ml-[8px] text-[14px] text-[#2574fb]" onClick={() => getTestToken()}>
              Get WETH
            </button>
          </div>
        ) : null}
      </div>
      <div className="py-3">
        <div
          className={`mb-3 rounded-[4px] bg-none p-[1px]
            ${isFocus ? 'valid' : ''}
            ${isError ? 'error' : ''}
            ${disabled ? 'opacity-30' : ''}
          `}>
          <div className="flex h-[48px] rounded-[4px] bg-[#242652] p-3">
            <Image src="/images/common/symbols/eth-tribe3.svg" alt="" width="24" height="24" padding-right="12dp" className="betIcon" />
            <div className="ml-[4px] flex items-center justify-center">
              <span className="input-with-text text-[12px] font-semibold">WETH</span>
            </div>
            <input
              type="text"
              pattern="[0-9]*"
              className={`${isApproveRequired ? ' blockCursor' : ''}
                txt-white w-full border-none border-[242652] bg-[#242652]
                text-right text-[15px] font-semibold outline-none
              `}
              value={value}
              placeholder="0.00"
              onChange={handleEnter}
              disabled={isApproveRequired || disabled}
              // onClick={e => {
              //   e.target.selectionStart = e.target.value.length;
              //   e.target.selectionEnd = e.target.value.length;
              // }}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              min={0}
            />
          </div>
        </div>
      </div>
      <QuantityTips
        isInsuffBalance={isInsuffBalance}
        isAmountTooSmall={isAmountTooSmall}
        isWrongNetwork={isWrongNetwork}
        estPriceFluctuation={estPriceFluctuation}
        isFluctuationLimit={isFluctuationLimit}
        isLiquidatable={isLiquidatable}
        value={value}
        isPending={isPending}
        getTestToken={getTestToken}
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
      className={`${className !== '' ? className : 'sumrow'}
      mb-3 flex items-center
    `}>
      <div className="text-[14px] text-[#a3c2ff]/[.48]">{title}</div>
      <div className={`flex-1 flex-shrink-0 text-right ${valueClassName}`}>
        <span className="text-[14px]">{value}</span> <span className={`text-[12px] ${unitClassName}`}>{unit}</span>
      </div>
    </div>
  );
}

// function DisplayValuesWithTooltips(props: any) {
//   const { title, value, unit = '', tipsText = '', size = '20px' } = props;

//   return (
//     <div className="row sumrow align-items-center">
//       <div className="font-14 text-color-secondary col-auto">
//         <TitleTips titleText={title} tipsText={tipsText} />
//       </div>
//       <div className="col font-12-600 text-color-secondary contentsmallitem">
//         <span className="value">{value}</span> {unit}
//       </div>
//     </div>
//   );
// }

function EstimatedValueDisplay(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const {
    estimatedValue,
    toleranceRate,
    setToleranceRate,
    // setIsInsuffBalance,
    // wethBalance,
    // isLoginState,
    // fullWalletAddress,
    // tokenRef,
    currentToken,
    leverageValue,
    value,
    isInsuffBalance,
    isAmountTooSmall,
    // estPriceFluctuation,
    disabled
  } = props;

  // const isEstimatedValueEmpty = Object.keys(estimatedValue).length === 0;
  const { fee } = estimatedValue;
  const { cost } = estimatedValue;
  const costInNumber = Number(formatterValue(cost, 4));
  const feeInNumber = Number(formatterValue(fee, 4));
  // const collateralCalc = isEstimatedValueEmpty ? 0 : cost.sub(feeInNumber);
  // const newCollateral = isEstimatedValueEmpty ? '-.--' : formatterValue(collateralCalc, 4);
  const sizeNotional = fee && cost && leverageValue ? ((costInNumber - feeInNumber) * Number(leverageValue))?.toFixed(4) : '-.--';

  // determine if input is valid or error state
  // const isValid = value > 0 && !isInsuffBalance && !isAmountTooSmall && !estPriceFluctuation;
  let isError = isAmountTooSmall || isInsuffBalance;
  if (value <= 0) {
    isError = false;
  }

  return (
    <>
      <div className="mb-3 flex items-center">
        <div className="font-14 text-color-secondary col-auto">
          <div className="text-[14px] text-[#a3c2ff]/[.48]">Slippage Tolerance</div>
          {/* tipsText="The maximum pricing difference between the price at the time of trade confirmation and the actual price of the transaction that the users are willing to acceptM" */}
        </div>
        <div className="flex flex-1 flex-shrink-0" style={{ display: 'flex', justifyContent: 'end' }}>
          <div
            className={`flex max-w-[100px] justify-end
            rounded-[4px] bg-[#242652] px-[10px] py-1
            ${disabled ? 'opacity-30' : ''}`}>
            <input
              disabled={disabled}
              title=""
              type="text"
              pattern="[0-9]*"
              className="w-[90%] border-none border-[#242652] bg-[#242652] text-right
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
                // logEvent(firebaseAnalytics, 'trade_open_add_slippageTolerance_pressed', {
                //   wallet: fullWalletAddress.substring(2),
                //   collection: currentToken
                // });
                apiConnection.postUserEvent('trade_open_add_slippageTolerance_pressed', {
                  page,
                  collection: currentToken
                });
              }}
            />
            <span className="my-auto">%</span>
          </div>
        </div>
      </div>
      <DisplayValues
        title="Size (Notional)"
        value={isError || value <= 0 ? '-.--' : sizeNotional}
        unit="WETH"
        className="slipagerow"
        valueClassName="text-color-primary font-14-600"
        unitClassName="font-12"
      />
      {/* <DisplayValuesWithTooltips title="Transaction Fee" value={fee} unit="WETH" tipsText="0.5% of the notional amount of the trade" /> */}
      <div className="row">
        <div className="col">
          <div className="mb-6 h-[1px] bg-[#2e3064]" />
        </div>
      </div>
      <div className="mb-3 flex items-center">
        <div className="text-[14px] text-[#a3c2ff]/[.48]">Total Balance Required</div>
        <div className="flex-1 flex-shrink-0 text-right">
          <span className=" text-[14px]">
            {isError || value <= 0 ? '-.--' : estimatedValue.cost ? formatterValue(estimatedValue.cost, 4, '') : '-.--'}
          </span>
          <span className="text-[12px]" style={{ marginLeft: 4 }}>
            WETH
          </span>
        </div>
      </div>
    </>
  );
}

function ConfirmButton(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const {
    isLoginState,
    quantity,
    createTransaction,
    isWrongNetwork,
    isApproveRequired,
    setIsApproveRequired,
    isInsuffBalance,
    isAmountTooSmall,
    // fullWalletAddress,
    // tokenRef,
    currentToken,
    setQuantity,
    setEstimatedValue,
    setEstPriceFluctuation,
    isFluctuationLimit,
    connectWallet,
    leverageValue,
    handleLeverageEnter,
    setToleranceRate,
    getTestToken,
    isPending,
    isWaiting
  } = props;

  // const { isTethCollected, isWhitelisted, isDataFetch } = walletProvider;
  const isDataFetch = useNanostore(dataFetch);
  // const isWhitelisted = useNanostore(whitelisted);
  // const isTethCollected = useNanostore(tethCollected);
  const isTethCollected = Number(walletProvider.wethBalance) !== 0;

  const [isProcessingOpenPos, setIsProcessingOpenPos] = useState(false);
  const isNormal = isLoginState && !isWrongNetwork && quantity > 0 && !isInsuffBalance && !isAmountTooSmall;

  // sync isProcessing to store/tradePanel
  useEffect(() => {
    tradePanel.setIsProcessing(isProcessingOpenPos);
  }, [isProcessingOpenPos]);

  const startOpenPosition = () => {
    setIsProcessingOpenPos(false);
    setQuantity('');
    setEstimatedValue({});
    setEstPriceFluctuation(false);
    handleLeverageEnter(1);
    setToleranceRate(0.5);
  };

  // const transSuccessCallback = () => {
  //   setIsProcessingOpenPos(false);
  //   setQuantity('');
  //   setEstimatedValue({});
  //   setEstPriceFluctuation(false);
  // };

  // const transErrorCallback = () => {
  //   setIsProcessingOpenPos(false);
  //   // do not reset state input value
  // };

  const doTransaction = async function doTransaction(erc20ContractInstance: any) {
    const amountValue = [utils.parseEther(String(quantity))];
    const allowanceValue = utils.formatEther(await erc20ContractInstance.allowance(walletProvider.holderAddress, clearingHouseAddress));
    if (Number(allowanceValue) > quantity * leverageValue) {
      createTransaction(startOpenPosition);
      return;
    }
    const approval = await erc20ContractInstance.approve(clearingHouseAddress, utils.parseEther(String(Number.MAX_SAFE_INTEGER)));
    if (approval) {
      createTransaction(startOpenPosition);
    }
  };

  const connectContract = async () => {
    if (!isLoginState || isWrongNetwork || !quantity) {
      return;
    }
    // logEvent(firebaseAnalytics, 'confirm_pressed', {
    //   wallet: fullWalletAddress.substring(2),
    //   collection: currentToken
    // });
    apiConnection.postUserEvent('confirm_pressed', {
      page,
      collection: currentToken
    });
    setIsProcessingOpenPos(true);
    walletProvider
      .connectContract()
      .then(doTransaction)
      .catch(() => {
        setIsProcessingOpenPos(false);
      });
  };

  const performApprove = async () => {
    // logEvent(firebaseAnalytics, 'approve_pressed', {
    //   wallet: fullWalletAddress.substring(2),
    //   collection: currentToken
    // });
    apiConnection.postUserEvent('approve_pressed', {
      page,
      collection: currentToken
    });
    setIsProcessingOpenPos(true);
    walletProvider
      .performApprove()
      .then(() => {
        setIsApproveRequired(false);
        setIsProcessingOpenPos(false);
        // logEvent(firebaseAnalytics, 'callbacks_performapprove_success', {
        //   wallet: fullWalletAddress.substring(2),
        //   collection: currentToken
        // });
        apiConnection.postUserEvent('callbacks_performapprove_success', {
          page,
          collection: currentToken
        });
      })
      .catch((error: any) => {
        setIsProcessingOpenPos(false);
        // logEvent(firebaseAnalytics, 'callbacks_performapprove_fail', {
        //   wallet: fullWalletAddress.substring(2),
        //   error_code: error?.code.toString(),
        //   collection: currentToken
        // });
        apiConnection.postUserEvent('callbacks_performapprove_fail', {
          page,
          error_code: error?.code.toString(),
          collection: currentToken
        });
      });
  };

  // const performWhitelistRegister = () => {
  //   logEvent(firebaseAnalytics, 'whitelist_register_pressed', {
  //     wallet: fullWalletAddress.substring(2),
  //     collection: currentToken
  //   });
  //   apiConnection.postUserEvent('whitelist_register_pressed', {
  //     page,
  //     collection: currentToken
  //   });
  //   window.open('https://gleam.io/kfydk/testnet-access-request', '_blank', 'noreferrer');
  //   logEvent(firebaseAnalytics, 'whitelist_register_pressed', {
  //     wallet: fullWalletAddress.substring(2)
  //   });
  //   apiConnection.postUserEvent('whitelist_register_pressed', {
  //     page
  //   });
  // };

  const performGetTeth = () => {
    // setIsProcessingOpenPos(true);
    getTestToken(() => setIsProcessingOpenPos(false));
  };

  const performSwitchGeorli = () => {
    // logEvent(firebaseAnalytics, 'switchGoerli_pressed', {
    //   wallet: fullWalletAddress.substring(2),
    //   collection: currentToken
    // });
    apiConnection.postUserEvent('switchGoerli_pressed', {
      page,
      collection: currentToken
    });
    const networkId = utils.hexValue(Number(process.env.NEXT_PUBLIC_SUPPORT_CHAIN || 421613));
    walletProvider.provider.provider
      .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `${networkId}` }] })
      .then(() => walletProvider.getWethBalance())
      .catch((error: any) => {
        if (error.code === 4902) {
          walletProvider.addArbitrumGoerli();
        }
      });
  };

  let disabled = !isNormal;
  if (!isLoginState || isWrongNetwork || !isTethCollected || isApproveRequired) {
    disabled = false;
  } else if (isWaiting) {
    disabled = true;
  } else if (isFluctuationLimit) {
    disabled = true;
  }

  return (
    <div className="flex">
      <div
        className={`${disabled || isPending ? 'opacity-30' : ''}
          mb-[24px] flex h-[46px] w-full cursor-pointer items-center rounded-[4px] bg-[#2574fb]
          px-[10px] py-[14px] text-center
        `}
        // onClick={
        //   !isLoginState
        //     ? connectWallet
        //     : isWrongNetwork
        //     ? performSwitchGeorli
        //     : !isTethCollected
        //     ? performGetTeth
        //     : isApproveRequired
        //     ? performApprove
        //     : isNormal && !isProcessingOpenPos && !isPending && !disabled
        //     ? connectContract
        //     : null
        // }
      >
        <div className="w-full text-center">
          {isProcessingOpenPos || isDataFetch ? (
            <div className="col loadingindicator mx-auto">
              <ThreeDots ariaLabel="loading-indicator" height={50} width={50} color="white" />
            </div>
          ) : !isLoginState ? (
            'Connect Wallet'
          ) : isWrongNetwork ? (
            'Switch to Arbitrum'
          ) : !isTethCollected ? (
            'Get WETH'
          ) : isApproveRequired ? (
            'Approve'
          ) : (
            'Trade'
          )}
        </div>
      </div>
    </div>
  );
}

function Tips(props: any) {
  const isDataFetch = useNanostore(dataFetch);
  const isWhitelisted = useNanostore(whitelisted);
  // const isTethCollected = useNanostore(tethCollected);
  const isTethCollected = Number(walletProvider.wethBalance) !== 0;
  const { isLoginState, isWrongNetwork, isApproveRequired } = props;
  if ((isLoginState && !isWrongNetwork && !isApproveRequired) || isDataFetch) {
    return <div className="row tbloverviewcontent" />;
  }
  const label = !isLoginState ? (
    'Please connect the wallets to trade !'
  ) : isWrongNetwork ? (
    'Wrong Network, please switch to Arbitrum!'
  ) : !isTethCollected ? (
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
  ) : (
    ''
  );

  return (
    <div
      className="mb-[17px] flex h-[16px] items-center text-[16px]
      font-medium leading-[16px] text-[#FFC24B]/[.87]">
      <Image src="/images/common/info_warning_icon.svg" alt="" width={12} height={12} className="mr-2" />
      <span className="warning-text">{label}</span>
    </div>
  );
}

function ExtendedEstimateComponent(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const {
    fullWalletAddress,
    tokenRef,
    currentToken,
    estimatedValue,
    leverageValue,
    userPosition,
    value,
    isAmountTooSmall,
    isInsuffBalance
  } = props;
  const [showDetail, isShowDetail] = useState(false);
  const targetCollection = collectionList.filter(({ collection }) => collection === currentToken);
  const { collectionType: currentType } = targetCollection.length !== 0 ? targetCollection[0] : collectionList[0];
  const exposure = formatterValue(estimatedValue.exposure, 4);
  const isNewPosition = 'newPosition' in estimatedValue;
  const fee = formatterValue(estimatedValue.fee, 4);

  // hide component when there is no estimatedValue
  if (!estimatedValue || !estimatedValue.cost) return null;

  // determine if input is valid or error state
  let isError = isAmountTooSmall || isInsuffBalance;
  if (value <= 0) {
    isError = false;
  }
  if (isError || value <= 0) return null;

  return (
    <div>
      <div className="row">
        <div
          className="advancebtn selectbehaviour col-auto"
          onClick={() => {
            isShowDetail(!showDetail);
            // logEvent(firebaseAnalytics, 'showAdvancedDetails_pressed', {
            //   wallet: fullWalletAddress.substring(2),
            //   is_advanced_data_shown: !showDetail,
            //   collection: currentToken
            // });
            apiConnection.postUserEvent('showAdvancedDetails_pressed', {
              page,
              is_advanced_data_shown: !showDetail,
              collection: currentToken
            });
          }}>
          {showDetail ? 'Hide' : 'Show'} Advanced Details
          {showDetail ? (
            <Image src="/images/common/angle_up.svg" style={{ marginRight: '8px' }} alt="" width={12} height={12} />
          ) : (
            <Image src="/images/common/angle_down.svg" style={{ marginRight: '8px' }} alt="" width={12} height={12} />
          )}
        </div>
      </div>

      {showDetail ? (
        <div className="">
          {userPosition != null ? (
            <>
              <div className="row">
                <div className="transactiondetail font-14-600">Estimated Blended Position</div>
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
              <DisplayValues
                title="Notional"
                value={isNewPosition ? formatterValue(estimatedValue.newPosition.marketValue, 4) : '-.--'}
                unit="WETH"
              />
              <DisplayValues
                title="Collateral"
                value={isNewPosition ? formatterValue(estimatedValue.newPosition.newRemainMargin, 4) : '-.--'}
                unit="WETH"
              />
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
                title="Leverage"
                value={isNewPosition ? formatterValue(estimatedValue.newPosition.leverage, 2) : '-.--'}
                unit="x"
              />
              <DisplayValues
                title="Liquidation Price"
                value={isNewPosition ? formatterValue(estimatedValue.newPosition.liquidationPrice, 2) : '-.--'}
                unit="WETH"
              />
            </>
          ) : null}

          <div className="row">
            <div className="transactiondetail font-14-600">
              Transaction Details
              {/* {userPosition != null ? '(Standalone Basis)' : null} */}
            </div>
          </div>
          {/* <DisplayValues title="Estimated Exposure" value={exposure} unit={currentType} /> */}
          <DisplayValues title="Transaction Fee" value={fee} unit="WETH" />
          <DisplayValues title="Entry Price" value={formatterValue(estimatedValue.entryPrice, 2)} unit="WETH" />
          <DisplayValues
            title={
              <TitleTips titleText="Price Impact" tipsText="The change in price resulted directly from a particular trade in the VAMM" />
            }
            value={formatterValue(estimatedValue.priceImpact, 2)}
            unit="%"
          />
          {userPosition != null ? null : (
            <DisplayValues
              title="Liquidation Price"
              value={isNewPosition ? formatterValue(estimatedValue.newPosition.liquidationPrice, 2) : '-.--'}
              unit="WETH"
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function TradeComponent(props: any) {
  const router = useRouter();
  const { page } = pageTitleParser(router.asPath);
  const {
    isLoginState,
    refreshPositions,
    isWrongNetwork,
    connectWallet,
    getTestToken,
    isApproveRequired,
    setIsApproveRequired,
    wethBalance,
    fullWalletAddress,
    // tokenRef,
    currentToken,
    userPosition,
    tradingData
  } = props;
  const [saleOrBuyIndex, setSaleOrBuyIndex] = useState(0);
  const [quantity, setQuantity] = useState('');
  const [estimatedValue, setEstimatedValue] = useState({});
  const [exposureValue, setExposureValue] = useState(0);
  const [toleranceRate, setToleranceRate] = useState(0.5);
  const [estPriceFluctuation, setEstPriceFluctuation] = useState(false);
  const [isFluctuationLimit, setIsFluctuationLimit] = useState(false);
  const [isLiquidatable, setIsLiquidatable] = useState(false);
  const [leverageValue, setLeverageValue] = useState(1);
  const [isAmountTooSmall, setIsAmountTooSmall] = useState(false);
  const [isInsuffBalance, setIsInsuffBalance] = useState(false);
  const [textErrorMessage, setTextErrorMessage] = useState('');
  const [textErrorMessageShow, setTextErrorMessageShow] = useState(false);
  const isProcessing = useNanostore(tradePanel.processing);
  const [isPending, setIsPending] = useState(false);
  const collectionIsPending = useNanostore(collectionsLoading.collectionsLoading);
  const [processToken, setProcessToken] = useState(null); // save current token while process tx
  const [isWaiting, setIsWaiting] = useState(false); // waiting value for getting estimated value

  const vAMMPrice = !tradingData.spotPrice ? 0 : Number(utils.formatEther(tradingData.spotPrice));
  const oraclePrice = !tradingData.twapPrice ? 0 : Number(utils.formatEther(tradingData.twapPrice));
  const priceGap = vAMMPrice && oraclePrice ? vAMMPrice / oraclePrice - 1 : 0;
  const priceGapLmt = useNanostore(priceGapLimit);

  // price gap
  const isGapAboveLimit = priceGapLmt ? Math.abs(priceGap) >= priceGapLmt : false;

  const calculateEstimation = async (wethBal: any, value: any) => {
    // console.log(value);
    setIsWaiting(true);
    const calc = Number(value);
    const result = await walletProvider.calculateEstimationValue(saleOrBuyIndex, calc, leverageValue);
    setEstimatedValue(result);
    setExposureValue(result.exposure);
    setIsWaiting(false);

    const costInNumber = Number(utils.formatEther(result.cost?.toString()));
    if (wethBal < costInNumber) {
      setIsInsuffBalance(true);
    }

    if (Math.abs(Number(formatterValue(result.priceImpact, 2))) > 2.0) {
      setIsFluctuationLimit(true);
    } else {
      setIsFluctuationLimit(false);
    }

    if (isGapAboveLimit && result.newPosition?.isLiquidatable) {
      setIsLiquidatable(true);
    } else {
      setIsLiquidatable(false);
    }

    if (Number(formatterValue(result.priceImpact, 2)) <= 0.6 && Number(formatterValue(result.priceImpact, 2)) >= -0.6) {
      setEstPriceFluctuation(false);
    } else {
      setEstPriceFluctuation(true);
    }

    // logging
    // logEvent(firebaseAnalytics, 'trade_add_input_pressed', {
    //   wallet: fullWalletAddress.substring(2),
    //   collection: currentToken
    // });
    apiConnection.postUserEvent('trade_add_input_pressed', {
      page,
      collection: currentToken
    });
  };

  // const debouncedCalculateEstimation = useCallback(debounce(calculateEstimation, 300), []);
  // const debouncedCalculateEstimation = calculateEstimation;

  const handleEnter = async (value: any) => {
    setQuantity(value);
    setTextErrorMessage('');
    setTextErrorMessageShow(false);
    setEstPriceFluctuation(false);
    setIsAmountTooSmall(false);
    setIsInsuffBalance(false);
    setIsLiquidatable(false);

    if (walletProvider.provider === null || Number(value) === 0 || !value) {
      setEstimatedValue({});
      setEstPriceFluctuation(false);
      return;
    }

    if (Number(value) < 0.01) {
      setIsAmountTooSmall(true);
      setEstimatedValue({});
      setEstPriceFluctuation(false);
      return;
    }

    if (wethBalance < Number(value)) {
      // console.log('ee');
      setIsInsuffBalance(true);
      setEstimatedValue({});
      setEstPriceFluctuation(false);
      return;
    }

    if (collectionIsPending[walletProvider?.currentTokenAmmAddress]) {
      await collectionsLoading.getCollectionsLoading(walletProvider?.currentTokenAmmAddress);
      if (collectionIsPending[walletProvider?.currentTokenAmmAddress]) {
        setIsPending(!!collectionIsPending[walletProvider?.currentTokenAmmAddress]);
        return;
      }
    } else setIsPending(false);

    await calculateEstimation(wethBalance, value);
  };

  // const loggingg = val => console.log(val);
  // const debouncedHandleEnter = useCallback(debounce(loggingg, 200), []);

  useEffect(() => {
    if (!isLoginState && isInsuffBalance) {
      setIsInsuffBalance(false);
    }
  }, [isLoginState, isInsuffBalance]);

  const calculateLeverageEnter = async (qty: any, sbIndex: any, lvrg: any) => {
    setIsWaiting(true);
    const updatedCollateral = Number(qty);
    const result = await walletProvider.calculateEstimationValue(sbIndex, updatedCollateral, lvrg);
    setEstimatedValue(result);
    setExposureValue(result.exposure);
    setIsWaiting(false);

    const costInNumber = Number(utils.formatEther(result.cost?.toString()));
    if (wethBalance < costInNumber) {
      setIsInsuffBalance(true);
    }

    if (Math.abs(Number(formatterValue(result.priceImpact, 2))) > 2.0) {
      setIsFluctuationLimit(true);
    } else {
      setIsFluctuationLimit(false);
    }

    if (isGapAboveLimit && result.newPosition?.isLiquidatable) {
      setIsLiquidatable(true);
    } else {
      setIsLiquidatable(false);
    }

    if (Number(formatterValue(result.priceImpact, 2)) <= 0.6 && Number(formatterValue(result.priceImpact, 2)) >= -0.6) {
      setEstPriceFluctuation(false);
    } else {
      setEstPriceFluctuation(true);
    }
  };

  // const debouncedcalculateLeverageEnter = useCallback(debounce(calculateLeverageEnter, 500), []);

  const handleLeverageEnter = async function handleLeverageEnter(leverage: any) {
    setLeverageValue(leverage);
    setTextErrorMessage('');
    setTextErrorMessageShow(false);
    setEstPriceFluctuation(false);
    setIsLiquidatable(false);
    setIsAmountTooSmall(false);
    setIsInsuffBalance(false);
    if (walletProvider.provider === null || Number(quantity) === 0 || quantity === '') {
      setEstimatedValue({});
      setEstPriceFluctuation(false);
      return;
    }

    if (Number(quantity) < 0.01) {
      setIsAmountTooSmall(true);
      setEstimatedValue({});
      setEstPriceFluctuation(false);
      return;
    }

    if (wethBalance < Number(quantity)) {
      setIsInsuffBalance(true);
      setEstimatedValue({});
      setEstPriceFluctuation(false);
      return;
    }

    if (collectionIsPending[walletProvider?.currentTokenAmmAddress]) {
      await collectionsLoading.getCollectionsLoading(walletProvider?.currentTokenAmmAddress);
      if (collectionIsPending[walletProvider?.currentTokenAmmAddress]) {
        setIsPending(!!collectionIsPending[walletProvider?.currentTokenAmmAddress]);
        return;
      }
    } else setIsPending(false);

    await calculateLeverageEnter(quantity, saleOrBuyIndex, leverage);
  };

  const createTransaction = async function createTransaction(startTransaction = () => {}) {
    setProcessToken(currentToken);
    walletProvider
      .createTransaction(
        saleOrBuyIndex,
        Number(quantity) * leverageValue,
        leverageValue,
        toleranceRate,
        exposureValue,
        userPosition ? 'Add Position' : 'Open Position',
        startTransaction
      )
      .then(() => {
        // setQuantity('');
        // prevent refreshing when page has changed
        // if (currentToken === processToken) {
        refreshPositions();
        // }
        // logEvent(firebaseAnalytics, 'callbacks_performtrades_success', {
        //   wallet: fullWalletAddress.substring(2),
        //   collection: currentToken
        // });
        apiConnection.postUserEvent('callbacks_performtrades_success', {
          page,
          collection: currentToken
        });
      })
      .catch((error: any) => {
        console.error(error);
        // set trade modal message and show
        if (error?.error && error.error?.message && error.error?.type === 'modal') {
          error?.error.showToast();
          // tradePanelModal.setMessage(error.error.message);
          // tradePanelModal.setIsShow(true);
        }
        if (error?.error && error.error?.message && error.error?.type === 'text') {
          setTextErrorMessage(error?.error?.message);
          setTextErrorMessageShow(true);
        }

        // logEvent(firebaseAnalytics, 'callbacks_performtrades_fail', {
        //   wallet: fullWalletAddress.substring(2),
        //   collection: currentToken,
        //   error_code: error?.code?.toString()
        // });
        apiConnection.postUserEvent('callbacks_performtrades_fail', {
          page,
          collection: currentToken,
          error_code: error?.code?.toString()
        });
      });
  };

  function analyticsLogLeverageValue(index: any, currentCollection: any) {
    // logEvent(firebaseAnalytics, 'leverage_pressed', {
    //   wallet: fullWalletAddress.substring(2),
    //   leverage_value: index,
    //   collection: currentCollection
    // });
    apiConnection.postUserEvent('leverage_pressed', {
      page,
      leverage_value: index,
      collection: currentCollection
    });
  }

  useEffect(() => {
    if (userPosition) {
      setSaleOrBuyIndex(Number(calculateNumber(userPosition.size, 4)) < 0 ? 1 : 0);
    }
    if (isPending) {
      handleEnter(quantity);
    }
  }, [userPosition]);

  useEffect(() => {
    // set error message under button
    setTextErrorMessage('');
    setTextErrorMessageShow(true);

    setQuantity('');
    setEstimatedValue({});
    setLeverageValue(1);
  }, [currentToken, saleOrBuyIndex]); // from tokenRef.current

  useEffect(() => {
    if (isPending) {
      handleEnter(quantity);
    }
  }, [collectionIsPending[walletProvider?.currentTokenAmmAddress]]);

  useEffect(() => {
    setTextErrorMessage('');
    setTextErrorMessageShow(true);

    setQuantity('');
    setEstimatedValue({});
    setLeverageValue(1);
  }, [walletProvider.holderAddress]);

  return (
    <div>
      <LongShortRatio
        saleOrBuyIndex={saleOrBuyIndex}
        setSaleOrBuyIndex={setSaleOrBuyIndex}
        userPosition={userPosition}
        // tokenRef={tokenRef}
        currentToken={currentToken}
        fullWalletAddress={fullWalletAddress}
      />
      <QuantityEnter
        disabled={isProcessing || isWrongNetwork}
        value={quantity}
        // isApproveRequired={isApproveRequired}
        onChange={(value: any) => {
          handleEnter(value);
        }}
        isInsuffBalance={isInsuffBalance}
        wethBalance={wethBalance}
        isLoginState={isLoginState}
        isWrongNetwork={isWrongNetwork}
        isAmountTooSmall={isAmountTooSmall}
        estPriceFluctuation={estPriceFluctuation}
        isFluctuationLimit={isFluctuationLimit}
        isPending={isPending}
        getTestToken={getTestToken}
        isLiquidatable={isLiquidatable}
      />
      <LeverageComponent
        disabled={isProcessing || isWrongNetwork}
        value={leverageValue}
        setValue={setLeverageValue}
        onChange={(value: any) => {
          analyticsLogLeverageValue(value, currentToken);
          handleLeverageEnter(value);
        }}
      />
      <div className="row">
        <div className="col">
          <div className="mb-6 h-[1px] bg-[#2e3064]" />
        </div>
      </div>
      <EstimatedValueDisplay
        disabled={isProcessing || isWrongNetwork}
        estimatedValue={estimatedValue}
        toleranceRate={toleranceRate}
        setToleranceRate={setToleranceRate}
        setIsInsuffBalance={setIsInsuffBalance}
        wethBalance={wethBalance}
        isLoginState={isLoginState}
        fullWalletAddress={fullWalletAddress}
        // tokenRef={tokenRef}
        currentToken={currentToken}
        leverageValue={leverageValue}
        value={quantity}
        isInsuffBalance={isInsuffBalance}
        isAmountTooSmall={isAmountTooSmall}
        estPriceFluctuation={estPriceFluctuation}
      />
      <ConfirmButton
        isLoginState={isLoginState}
        quantity={quantity}
        createTransaction={createTransaction}
        isWrongNetwork={isWrongNetwork}
        isApproveRequired={isApproveRequired}
        setIsApproveRequired={setIsApproveRequired}
        isInsuffBalance={isInsuffBalance}
        isAmountTooSmall={isAmountTooSmall}
        fullWalletAddress={fullWalletAddress}
        // tokenRef={tokenRef}
        currentToken={currentToken}
        setQuantity={setQuantity}
        setEstimatedValue={setEstimatedValue}
        setEstPriceFluctuation={setEstPriceFluctuation}
        isFluctuationLimit={isFluctuationLimit}
        connectWallet={connectWallet}
        leverageValue={leverageValue}
        handleLeverageEnter={handleLeverageEnter}
        setToleranceRate={setToleranceRate}
        getTestToken={getTestToken}
        isPending={isPending}
        isWaiting={isWaiting}
      />
      {textErrorMessageShow && isLoginState && !isWrongNetwork && !isApproveRequired && !isInsuffBalance ? (
        <p className="font-12 text-color-warning">{textErrorMessage}</p>
      ) : null}
      <Tips
        isLoginState={isLoginState}
        isWrongNetwork={isWrongNetwork}
        isApproveRequired={isApproveRequired}
        isInsuffBalance={isInsuffBalance}
      />
      <ExtendedEstimateComponent
        estimatedValue={estimatedValue}
        fullWalletAddress={fullWalletAddress}
        // tokenRef={tokenRef}
        currentToken={currentToken}
        leverageValue={leverageValue}
        userPosition={userPosition}
        value={quantity}
        isAmountTooSmall={isAmountTooSmall}
        isInsuffBalance={isInsuffBalance}
      />
    </div>
  );
}