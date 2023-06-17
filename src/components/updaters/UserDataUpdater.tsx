import { chViewerAbi } from '@/const/abi';
import { getAMMAddress, getAddressConfig, getSupportedAMMs } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { getCHViewerContract } from '@/const/contracts';
import {
  $currentChain,
  $userAddress,
  $userIsConnected,
  $userIsWrongNetwork,
  $userPositionInfos,
  setIsConnecting,
  setUserInfo,
  setWethBalance
} from '@/stores/user';
import { apiConnection } from '@/utils/apiConnection';
import { formatBigInt } from '@/utils/bigInt';
import { useWeb3Modal } from '@web3modal/react';
import React, { useEffect, useState } from 'react';
import { Address, useAccount, useContractRead, useBalance, Chain, useNetwork } from 'wagmi';
import { $userPoint, defaultUserPoint } from '@/stores/airdrop';

const PositionInfoUpdater: React.FC<{ chain: Chain; amm: AMM; ammAddress: Address; trader: Address }> = ({
  chain,
  amm,
  ammAddress,
  trader
}) => {
  const chViewer = getCHViewerContract(chain);
  const { data } = useContractRead({
    ...chViewer,
    abi: chViewerAbi,
    functionName: 'getTraderPositionInfoWithoutPriceImpact',
    args: [ammAddress, trader],
    watch: true
  });

  const size = data ? formatBigInt(data.positionSize) : 0;
  const collateral = data ? formatBigInt(data.margin) : 0;
  const openNotional = data ? formatBigInt(data.openNotional) : 0;
  const currentNotional = data ? formatBigInt(data.positionNotional) : 0;
  const unrealizedPnl = data ? formatBigInt(data.unrealizedPnl) : 0;
  const marginRatio = data ? formatBigInt(data.marginRatio) : 0;
  const entryPrice = data ? formatBigInt(data.avgEntryPrice) : 0;
  const openLeverage = data ? formatBigInt(data.openLeverage) : 0;
  const liquidationPrice = data ? formatBigInt(data.liquidationPrice) : 0;
  const vammPrice = data ? formatBigInt(data.spotPrice) : 0;
  const leverage = data ? formatBigInt(data.leverage) : 0;
  const fundingPayment = data ? formatBigInt(data.fundingPayment) : 0;
  const isLiquidatable = data ? data.isLiquidatable : false;
  useEffect(() => {
    if (amm) {
      $userPositionInfos.setKey(amm, {
        amm: ammAddress,
        size,
        collateral,
        openNotional,
        currentNotional,
        unrealizedPnl,
        marginRatio,
        entryPrice,
        openLeverage,
        liquidationPrice,
        vammPrice,
        leverage,
        fundingPayment,
        isLiquidatable
      });
    }
  }, [
    amm,
    chain,
    ammAddress,
    size,
    collateral,
    openNotional,
    currentNotional,
    unrealizedPnl,
    marginRatio,
    entryPrice,
    openLeverage,
    liquidationPrice,
    vammPrice,
    leverage,
    fundingPayment,
    isLiquidatable
  ]);
  return null;
};

const UserDataUpdater: React.FC = () => {
  const [wethAddr, setWethAddr] = useState<Address>();
  const { address, isConnected, isConnecting } = useAccount();
  const { chain } = useNetwork();
  const { isOpen } = useWeb3Modal();
  const { data } = useBalance({ address, token: wethAddr, watch: true });
  const [amms, setAmms] = useState<Array<AMM>>();

  useEffect(() => {
    if (address) {
      apiConnection.getUserInfo(address).then(result => {
        setUserInfo(result.data);
      });
      apiConnection.getUserPoint(address).then(res => {
        if (res?.multiplier) {
          $userPoint.set(res);
        } else {
          $userPoint.set(defaultUserPoint);
        }
      });
      $userAddress.set(address);
    }
  }, [address]);

  useEffect(() => {
    setIsConnecting(isOpen && isConnecting);
  }, [isConnecting, isOpen]);

  useEffect(() => {
    if (data && data.symbol !== 'ETH') {
      setWethBalance(parseFloat(data.formatted));
    }
  }, [data]);

  useEffect(() => {
    if (chain && isConnected && !chain.unsupported) {
      const { config: addressConf } = getAddressConfig(chain);
      setWethAddr(addressConf.weth);
      setAmms(getSupportedAMMs(chain));
    }
  }, [chain, isConnected]);

  useEffect(() => {
    $userIsWrongNetwork.set(chain?.unsupported ?? false);
    $currentChain.set(chain);
  }, [chain]);

  useEffect(() => {
    $userIsConnected.set(isConnected);
  }, [isConnected]);

  if (!amms || !chain) return null;

  return (
    <>
      {amms.map(amm => {
        const ammAddr = getAMMAddress(chain, amm);
        if (ammAddr && address) {
          return <PositionInfoUpdater key={amm} chain={chain} amm={amm} ammAddress={ammAddr} trader={address} />;
        }
        return null;
      })}
    </>
  );
};

export default UserDataUpdater;
