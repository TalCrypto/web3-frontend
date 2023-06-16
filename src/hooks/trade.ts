/* eslint-disable operator-linebreak */
/* eslint-disable indent */
import { getAMMAddress } from '@/const/addresses';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useStore as useNanostore } from '@nanostores/react';
import { $currentAmm } from '@/stores/trading';
import { absBigInt, formatBigInt, parseBigInt } from '@/utils/bigInt';
import { getCHContract, getCHViewerContract, getWEthContract } from '@/const/contracts';
import { chAbi, chViewerAbi, wethAbi } from '@/const/abi';

// eslint-disable-next-line no-shadow
export enum Side {
  // eslint-disable-next-line no-unused-vars
  LONG,
  // eslint-disable-next-line no-unused-vars
  SHORT
}

export const useOpenPosition = (args: {
  side: Side;
  notionalAmount: number;
  slippagePercent: number;
  leverage: number;
  isClose: boolean;
}) => {
  const amm = useNanostore($currentAmm);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [side, setSide] = useState(0);
  const [notionalAmount, setNotionalAmount] = useState(0n);
  const [sizeLimit, setSizeLimit] = useState(0n);
  const [notionalLimit, setNotionalLimit] = useState(0n);
  const [leverage, setLeverage] = useState(0n);
  if (!amm || !chain) return;
  const ammAddr = getAMMAddress(chain, amm);
  if (!ammAddr || !address) return;
  const chViewer = getCHViewerContract(chain);
  const chContract = getCHContract(chain);
  const weth = getWEthContract(chain);

  // estimate position
  const { data, isLoading: isEstLoading } = useContractRead({
    address: chViewer.address,
    abi: chViewerAbi,
    functionName: 'getOpenPositionEstimation',
    args: [ammAddr, address, side, notionalAmount, leverage]
  });

  // get allowance
  const { data: allowanceData, isLoading: isApprovalLoading } = useContractRead({
    ...weth,
    abi: wethAbi,
    functionName: 'allowance',
    args: [address, chContract.address]
  });

  const allowance = formatBigInt(allowanceData ?? 0n);

  const estimation = data
    ? {
        posInfo: {
          size: formatBigInt(data.positionInfo.positionSize),
          openNotional: formatBigInt(data.positionInfo.openNotional),
          marginRatio: formatBigInt(data.positionInfo.marginRatio * 100n),
          avgEntryPrice: formatBigInt(data.positionInfo.avgEntryPrice),
          leverage: formatBigInt(data.positionInfo.leverage),
          liquidationPrice: formatBigInt(data.positionInfo.liquidationPrice),
          positionNotional: formatBigInt(data.positionInfo.positionNotional),
          margin: formatBigInt(data.positionInfo.margin),
          isLiquidatable: data.positionInfo.isLiquidatable
        },
        txSummary: {
          exposure: formatBigInt(data.txSummary.exchangedPositionSize),
          entryPrice: formatBigInt(data.txSummary.entryPrice),
          priceImpact: formatBigInt(data.txSummary.priceImpact * 100n),
          fee: formatBigInt(data.txSummary.spreadFee + data.txSummary.tollFee),
          cost: formatBigInt(data.txSummary.spreadFee + data.txSummary.tollFee + data.txSummary.marginToVault),
          collateral: formatBigInt(data.txSummary.marginToVault)
        }
      }
    : undefined;

  // check approval
  const approvalAmountNeeded = estimation ? Math.max(estimation.txSummary.cost, estimation.txSummary.fee) : 0;

  const isNeedApproval = allowance < approvalAmountNeeded;

  // debouncing
  useEffect(() => {
    const timeout = setTimeout(() => {
      const exposure = estimation?.txSummary.exposure;
      if (args.isClose && exposure) {
        const slippage = args.side === Side.SHORT ? 1 - args.slippagePercent / 100 : 1 + args.slippagePercent / 100;
        const limit = exposure * slippage;
        setNotionalLimit(parseBigInt(limit));
      } else if (exposure) {
        const slippage = args.side === Side.LONG ? 1 - args.slippagePercent / 100 : 1 + args.slippagePercent / 100;
        const limit = exposure * slippage;
        setSizeLimit(parseBigInt(limit));
      }
      setSide(args.side);
      setNotionalAmount(parseBigInt(args.notionalAmount));
      setLeverage(parseBigInt(args.leverage));
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [args.side, args.notionalAmount, args.leverage, args.slippagePercent, args.isClose, estimation?.txSummary.exposure]);

  // create approve transaction
  if (isNeedApproval) {
    const {
      config,
      error: prepareError,
      isError: isPrepareError,
      isLoading: isPrepareLoading
    } = usePrepareContractWrite({
      ...weth,
      abi: wethAbi,
      functionName: 'approve',
      args: [chContract.address, parseBigInt(approvalAmountNeeded)]
    });

    const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

    const txHash = writeData?.hash;

    const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

    const isLoading = isEstLoading || isApprovalLoading || isPrepareLoading;

    const isError = isPrepareError || isWriteError;

    const error = prepareError || writeError;

    // eslint-disable-next-line consistent-return
    return { isNeedApproval, estimation, write, isError, error, isLoading, isPending, isSuccess, txHash };
  }

  // create close transaction
  if (args.isClose) {
    const {
      config,
      error: prepareError,
      isError: isPrepareError,
      isLoading: isPrepareLoading
    } = usePrepareContractWrite({
      ...chContract,
      abi: chAbi,
      functionName: 'closePosition',
      args: [ammAddr, notionalLimit]
    });

    const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

    const txHash = writeData?.hash;

    const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

    const isLoading = isEstLoading || isApprovalLoading || isPrepareLoading;

    const isError = isPrepareError || isWriteError;

    const error = prepareError || writeError;

    // eslint-disable-next-line consistent-return
    return { isNeedApproval, estimation, write, isError, error, isLoading, isPending, isSuccess, txHash };
  }

  // create open position transaction
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPrepareLoading
  } = usePrepareContractWrite({
    ...chContract,
    abi: chAbi,
    functionName: 'openPosition',
    args: [ammAddr, side, notionalAmount, leverage, sizeLimit, true]
  });

  const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

  const txHash = writeData?.hash;

  const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

  const isLoading = isEstLoading || isApprovalLoading || isPrepareLoading;

  const isError = isPrepareError || isWriteError;

  const error = prepareError || writeError;

  // eslint-disable-next-line consistent-return
  return { isNeedApproval, estimation, write, isError, error, isLoading, isPending, isSuccess, txHash };
};

/**
 *
 * @param deltaMargin positive means adding margin, otherwise means removing margin
 */
export const useAdjustCollateral = (deltaMargin: number) => {
  const amm = useNanostore($currentAmm);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [dmargin, setDmargin] = useState(0n);
  if (!amm || !chain) return;
  const ammAddr = getAMMAddress(chain, amm);
  if (!ammAddr || !address) return;
  const chViewer = getCHViewerContract(chain);
  const chContract = getCHContract(chain);
  const weth = getWEthContract(chain);

  // estimate position
  const { data, isLoading: isEstLoading } = useContractRead({
    ...chViewer,
    abi: chViewerAbi,
    functionName: 'getMarginAdjustmentEstimation',
    args: [ammAddr, address, dmargin]
  });

  // get allowance
  const { data: allowance, isLoading: isApprovalLoading } = useContractRead({
    ...weth,
    abi: wethAbi,
    functionName: 'allowance',
    args: [address, chContract.address]
  });

  const estimation = data
    ? {
        marginRatio: formatBigInt(data.marginRatio * 100n),
        leverage: formatBigInt(data.leverage),
        liquidationPrice: formatBigInt(data.liquidationPrice),
        isLiquidatable: data.isLiquidatable
      }
    : undefined;

  // debouncing
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDmargin(parseBigInt(deltaMargin));
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [deltaMargin]);

  let isNeedApproval = false;

  if (dmargin >= 0n) {
    isNeedApproval = allowance ? allowance < dmargin : false;
    // create approval transaction
    if (isNeedApproval) {
      const {
        config,
        error: prepareError,
        isError: isPrepareError,
        isLoading: isPrepareLoading
      } = usePrepareContractWrite({
        ...weth,
        abi: wethAbi,
        functionName: 'approve',
        args: [chContract.address, dmargin]
      });

      const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

      const txHash = writeData?.hash;

      const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

      const isLoading = isEstLoading || isApprovalLoading || isPrepareLoading;

      const isError = isPrepareError || isWriteError;

      const error = prepareError || writeError;

      // eslint-disable-next-line consistent-return
      return { isNeedApproval, estimation, write, isError, error, isLoading, isPending, isSuccess, txHash };
    }
    // create add margin transaction
    const {
      config,
      error: prepareError,
      isError: isPrepareError,
      isLoading: isPrepareLoading
    } = usePrepareContractWrite({
      ...chContract,
      abi: chAbi,
      functionName: 'addMargin',
      args: [ammAddr, dmargin]
    });
    const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

    const txHash = writeData?.hash;

    const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

    const isLoading = isEstLoading || isApprovalLoading || isPrepareLoading;

    const isError = isPrepareError || isWriteError;

    const error = prepareError || writeError;

    // eslint-disable-next-line consistent-return
    return { isNeedApproval, estimation, write, isError, error, isLoading, isPending, isSuccess, txHash };
  }

  // create remove margin
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
    isLoading: isPrepareLoading
  } = usePrepareContractWrite({
    ...chContract,
    abi: chAbi,
    functionName: 'removeMargin',
    args: [ammAddr, absBigInt(dmargin)]
  });

  const { write, data: writeData, error: writeError, isError: isWriteError } = useContractWrite(config);

  const txHash = writeData?.hash;

  const { isLoading: isPending, isSuccess } = useWaitForTransaction({ hash: txHash });

  const isLoading = isEstLoading || isApprovalLoading || isPrepareLoading;

  const isError = isPrepareError || isWriteError;

  const error = prepareError || writeError;

  // eslint-disable-next-line consistent-return
  return { isNeedApproval, estimation, write, isError, error, isLoading, isPending, isSuccess, txHash };
};
