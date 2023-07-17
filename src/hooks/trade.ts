/* eslint-disable operator-linebreak */
/* eslint-disable indent */
import { getAMMAddress } from '@/const/addresses';
import { useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { absBigInt, formatBigInt, parseBigInt } from '@/utils/bigInt';
import { getCHContract, getCHViewerContract, getWEthContract } from '@/const/contracts';
import { ammAbi, chAbi, chViewerAbi, wethAbi } from '@/const/abi';
import { $userAddress, $currentChain, $userWethAllowance } from '@/stores/user';
import { useDebounce } from '@/hooks/debounce';
import { usePositionInfo } from '@/hooks/collection';

// eslint-disable-next-line no-shadow
export enum Side {
  // eslint-disable-next-line no-unused-vars
  LONG,
  // eslint-disable-next-line no-unused-vars
  SHORT
}

export interface OpenPositionEstimation {
  posInfo: {
    size: number;
    openNotional: number;
    marginRatioPct: number;
    avgEntryPrice: number;
    leverage: number;
    liquidationPrice: number;
    positionNotional: number;
    margin: number;
    isLiquidatable: boolean;
    resultingPrice: number;
  };
  txSummary: {
    notionalSize: number;
    exposure: number;
    entryPrice: number;
    priceImpactPct: number;
    fee: number;
    cost: number;
    collateral: number;
  };
}

export interface AdjustMarginEstimation {
  marginRequirement: number;
  margin: number;
  marginRatioPct: number;
  leverage: number;
  liquidationPrice: number;
  isLiquidatable: boolean;
}

export const getApprovalAmountFromEstimation = (estimation?: OpenPositionEstimation) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  estimation ? Math.max(estimation.txSummary.cost, estimation.txSummary.fee) : 0;

export const useOpenPositionEstimation = (args: {
  side: Side;
  notionalAmount: number;
  slippagePercent: number;
  leverage: number;
}): { isLoading: boolean; estimation?: OpenPositionEstimation; error: Error | null; isError: boolean } => {
  const amm = useNanostore($currentAmm);
  const chain = useNanostore($currentChain);
  const address = useNanostore($userAddress);
  const side = useDebounce(BigInt(args.side));
  const notionalAmount = useDebounce(parseBigInt(args.notionalAmount));
  const leverage = useDebounce(parseBigInt(args.leverage));
  const ammAddr = getAMMAddress(chain, amm);
  const chViewer = getCHViewerContract(chain);
  // estimate position
  const { data, isLoading, isError, error } = useContractRead({
    address: chViewer.address,
    abi: chViewerAbi,
    functionName: 'getOpenPositionEstimation',
    args: ammAddr && address && notionalAmount && leverage ? [ammAddr, address, Number(side), notionalAmount, leverage] : undefined,
    enabled: Boolean(ammAddr && address && notionalAmount && leverage)
  });

  const estimation = data
    ? {
        posInfo: {
          size: formatBigInt(data.positionInfo.positionSize),
          openNotional: formatBigInt(data.positionInfo.openNotional),
          marginRatioPct: formatBigInt(data.positionInfo.marginRatio * 100n),
          avgEntryPrice: formatBigInt(data.positionInfo.avgEntryPrice),
          leverage: formatBigInt(data.positionInfo.leverage),
          liquidationPrice: Math.max(formatBigInt(data.positionInfo.liquidationPrice), 0),
          positionNotional: formatBigInt(data.positionInfo.positionNotional),
          margin: formatBigInt(data.positionInfo.margin),
          isLiquidatable: data.positionInfo.isLiquidatable,
          resultingPrice: formatBigInt(data.positionInfo.spotPrice)
        },
        txSummary: {
          notionalSize: formatBigInt(data.txSummary.exchangedQuoteAssetAmount),
          exposure: formatBigInt(data.txSummary.exchangedPositionSize),
          entryPrice: formatBigInt(data.txSummary.entryPrice),
          priceImpactPct: formatBigInt(data.txSummary.priceImpact * 100n),
          fee: formatBigInt(data.txSummary.spreadFee + data.txSummary.tollFee),
          cost: formatBigInt(data.txSummary.spreadFee + data.txSummary.tollFee + data.txSummary.marginToVault),
          collateral: formatBigInt(data.txSummary.marginToVault)
        }
      }
    : undefined;

  return { isLoading, estimation, isError, error };
};

export const useApprovalCheck = (amount: number) => {
  const [isNeedApproval, setIsNeedApproval] = useState(false);
  const allowance = useNanostore($userWethAllowance);

  useEffect(() => {
    setIsNeedApproval(allowance <= 0 || allowance < amount);
  }, [amount, allowance]);

  return isNeedApproval;
};

export const useApproveTransaction = () => {
  const chain = useNanostore($currentChain);
  const chContract = getCHContract(chain);
  const weth = getWEthContract(chain);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPreparing
  } = usePrepareContractWrite({
    ...weth,
    abi: wethAbi,
    functionName: 'approve',
    args: chContract && [chContract.address, parseBigInt(10)],
    enabled: Boolean(chContract)
  });

  const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

  const txHash = writeData?.hash;

  const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

  const isError = isPrepareError || isWriteError;

  const error = prepareError || writeError;

  // eslint-disable-next-line consistent-return
  return { write, isError, error, isPreparing, isPending, isSuccess, txHash };
};

export const useOpenPositionTransaction = (args: {
  side: Side;
  notionalAmount: number;
  slippagePercent: number;
  leverage: number;
  estimation: OpenPositionEstimation | undefined;
}) => {
  const amm = useNanostore($currentAmm);
  const chain = useNanostore($currentChain);
  const side = useDebounce(BigInt(args.side));
  const notionalAmount = useDebounce(parseBigInt(args.notionalAmount));
  const leverage = useDebounce(parseBigInt(args.leverage));
  const slippagePercent = useDebounce(parseBigInt(args.slippagePercent));

  const exposure = args.estimation ? args.estimation.txSummary.exposure : null;
  const slippage = slippagePercent
    ? side === BigInt(Side.LONG)
      ? 1 - formatBigInt(slippagePercent) / 100
      : 1 + formatBigInt(slippagePercent) / 100
    : 0;
  const sizeLimit = exposure ? absBigInt(parseBigInt(exposure * slippage)) : 0n;

  const ammAddr = getAMMAddress(chain, amm);

  const chContract = getCHContract(chain);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPreparing
  } = usePrepareContractWrite({
    ...chContract,
    abi: chAbi,
    functionName: 'openPosition',
    args: ammAddr && notionalAmount && leverage ? [ammAddr, Number(side), notionalAmount, leverage, sizeLimit, true] : undefined,
    enabled: Boolean(ammAddr && notionalAmount && leverage && args.estimation)
  });

  const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

  const txHash = writeData?.hash;

  const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

  const isError = isPrepareError || isWriteError;

  const error = prepareError || writeError;

  // eslint-disable-next-line consistent-return
  return { write, isError, error, isPreparing, isPending, isSuccess, txHash };
};

export const useClosePositionTransaction = (_slippagePercent: number) => {
  const amm = useNanostore($currentAmm);
  const chain = useNanostore($currentChain);
  const positionInfo = usePositionInfo(amm);
  const slippagePercent = useDebounce(parseBigInt(_slippagePercent));
  const slippage = slippagePercent
    ? positionInfo
      ? positionInfo.size > 0 // long => lower limit
        ? 1 - formatBigInt(slippagePercent) / 100
        : 1 + formatBigInt(slippagePercent) / 100
      : 0
    : 0;
  const notionalLimit = positionInfo ? parseBigInt(positionInfo.currentNotional * slippage) : 0n;
  const ammAddr = getAMMAddress(chain, amm);
  const chContract = getCHContract(chain);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPreparing
  } = usePrepareContractWrite({
    ...chContract,
    abi: chAbi,
    functionName: 'closePosition',
    args: ammAddr ? [ammAddr, notionalLimit] : undefined,
    enabled: Boolean(ammAddr)
  });

  const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

  const txHash = writeData?.hash;

  const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

  const isError = isPrepareError || isWriteError;

  const error = prepareError || writeError;

  // eslint-disable-next-line consistent-return
  return { write, isError, error, isPreparing, isPending, isSuccess, txHash };
};
/**
 *
 * @param deltaMargin negative means reduce collateral, otherwise increase collateral
 * @returns
 */
export const useAdjustCollateralEstimation = (
  deltaMargin: number
): { isLoading: boolean; estimation: AdjustMarginEstimation | undefined } => {
  const amm = useNanostore($currentAmm);
  const chain = useNanostore($currentChain);
  const address = useNanostore($userAddress);
  const dmargin = useDebounce(parseBigInt(deltaMargin));
  const ammAddr = getAMMAddress(chain, amm);
  const chViewer = getCHViewerContract(chain);

  const { data, isLoading } = useContractRead({
    ...chViewer,
    abi: chViewerAbi,
    functionName: 'getMarginAdjustmentEstimation',
    args: ammAddr && address && dmargin ? [ammAddr, address, dmargin] : undefined,
    enabled: Boolean(ammAddr && address && dmargin && Math.abs(formatBigInt(dmargin)) >= 0.01)
  });

  const estimation = data
    ? {
        margin: formatBigInt(data.margin),
        marginRatioPct: formatBigInt(data.marginRatio * 100n),
        leverage: formatBigInt(data.leverage),
        liquidationPrice: Math.max(formatBigInt(data.liquidationPrice), 0),
        isLiquidatable: data.isLiquidatable,
        marginRequirement: deltaMargin
      }
    : undefined;

  return { isLoading, estimation };
};

export const useFreeCollateral = () => {
  const amm = useNanostore($currentAmm);
  const chain = useNanostore($currentChain);
  const address = useNanostore($userAddress);
  const ammAddr = getAMMAddress(chain, amm);
  const chViewer = getCHViewerContract(chain);

  const { data } = useContractRead({
    ...chViewer,
    abi: chViewerAbi,
    functionName: 'getFreeCollateral',
    args: ammAddr && address ? [ammAddr, address] : undefined,
    enabled: Boolean(ammAddr && address),
    watch: true
  });

  return data ? formatBigInt(data) : undefined;
};

export const useAddCollateralTransaction = (deltaMargin: number) => {
  const amm = useNanostore($currentAmm);
  const chain = useNanostore($currentChain);
  const dmargin = useDebounce(parseBigInt(deltaMargin));
  const ammAddr = getAMMAddress(chain, amm);
  const chContract = getCHContract(chain);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPreparing
  } = usePrepareContractWrite({
    ...chContract,
    abi: chAbi,
    functionName: 'addMargin',
    args: ammAddr && dmargin ? [ammAddr, dmargin] : undefined,
    enabled: Boolean(ammAddr && dmargin)
  });
  const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

  const txHash = writeData?.hash;

  const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

  const isError = isPrepareError || isWriteError;

  const error = prepareError || writeError;

  // eslint-disable-next-line consistent-return
  return { write, isError, error, isPreparing, isPending, isSuccess, txHash };
};

export const useReduceCollateralTransaction = (deltaMargin: number) => {
  const amm = useNanostore($currentAmm);
  const chain = useNanostore($currentChain);
  const dmargin = useDebounce(parseBigInt(deltaMargin));
  const ammAddr = getAMMAddress(chain, amm);
  const chContract = getCHContract(chain);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPreparing
  } = usePrepareContractWrite({
    ...chContract,
    abi: chAbi,
    functionName: 'removeMargin',
    args: ammAddr && dmargin ? [ammAddr, dmargin] : undefined,
    enabled: Boolean(ammAddr && dmargin)
  });
  const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

  const txHash = writeData?.hash;

  const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

  const isError = isPrepareError || isWriteError;

  const error = prepareError || writeError;

  // eslint-disable-next-line consistent-return
  return { write, isError, error, isPreparing, isPending, isSuccess, txHash };
};

export const useFluctuationLimit = () => {
  const amm = useNanostore($currentAmm);
  const chain = useNanostore($currentChain);
  const ammAddr = getAMMAddress(chain, amm);
  // estimate position
  const rate = useContractRead({
    address: ammAddr,
    abi: ammAbi,
    functionName: 'fluctuationLimitRatio'
  });

  if (typeof rate?.data === 'bigint') {
    return formatBigInt(rate?.data);
  }

  return 0;
};
