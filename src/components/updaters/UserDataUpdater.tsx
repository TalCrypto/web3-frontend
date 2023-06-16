import { chViewerAbi } from '@/const/abi';
import { getAddressConfig, getSupportedAMMs } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { getAMMContract, getCHViewerContract } from '@/const/contracts';
import { setIsConnecting, setUserInfo, setWethBalance } from '@/stores/user';
import { apiConnection } from '@/utils/apiConnection';
import { useWeb3Modal } from '@web3modal/react';
import React, { useEffect, useState } from 'react';
import { Address, useAccount, useContractRead, useBalance, useNetwork, Chain } from 'wagmi';

const PositionInfoUpdater: React.FC<{ chain: Chain; amm: AMM }> = ({ chain, amm }) => {
  const { address } = useAccount();
  if (!address) return null;
  const ammContract = getAMMContract(chain, amm);
  if (!ammContract) return null;
  const chViewer = getCHViewerContract(chain);
  const { data, isError, isLoading } = useContractRead({
    ...chViewer,
    abi: chViewerAbi,
    functionName: 'getTraderPositionInfoWithoutPriceImpact',
    args: [ammContract.address, address],
    watch: true
  });

  console.log(data, isError, isLoading);

  // const [spotPrice, nextFundingTimeInfo, fundingPeriodInfo, longSize, shortSize, fundingRateInfo] = await multicallProvider.all([
  //   ammContract.getSpotPrice(),
  //   ammContract.nextFundingTime(),
  //   ammContract.fundingPeriod(),
  //   ammContract.longPositionSize(),
  //   ammContract.shortPositionSize(),
  //   clearingHouseViewerContract.getFundingRates(ammAddr)
  // ]);

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

  if (!amms || !chain) return null;

  return (
    <>
      {amms.map(amm => (
        <PositionInfoUpdater key={amm} chain={chain} amm={amm} />
      ))}
    </>
  );
};

export default UserDataUpdater;
