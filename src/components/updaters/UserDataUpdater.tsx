import { getAddressConfig } from '@/const/addresses';
import { AMM } from '@/const/collectionList';
import { getContracts, Contract, Contracts } from '@/const/contracts';
import { setIsConnecting, setUserInfo, setWethBalance } from '@/stores/user';
import { apiConnection } from '@/utils/apiConnection';
import { useWeb3Modal } from '@web3modal/react';
import React, { useEffect, useState } from 'react';
import { Address, useAccount, useContractRead, useBalance, useNetwork } from 'wagmi';

const PositionInfoUpdater: React.FC<{ chViewer: Contract; ammAddr: Address }> = ({ chViewer, ammAddr }) => {
  const { address } = useAccount();
  if (!address) return null;
  const { data, isError, isLoading } = useContractRead({
    ...chViewer,
    functionName: 'getTraderPositionInfoWithoutPriceImpact',
    args: [ammAddr, address],
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
  const [amms, setAmms] = useState<Array<keyof typeof AMM> | undefined>();
  const [contracts, setContracts] = useState<Contracts | undefined>();

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
    if (chain && isConnected) {
      const addressConf = getAddressConfig(chain, chain.unsupported ?? false);
      setWethAddr(addressConf.weth);
      const ammKeys = Object.keys(addressConf.amms) as Array<keyof typeof AMM>;
      setAmms(ammKeys);
      const conts = getContracts(chain, chain.unsupported ?? false);
      setContracts(conts);
    }
  }, [chain, isConnected]);

  if (!amms || !contracts) return null;

  return (
    <>
      {amms.map(ammKey => {
        const amm = contracts.amms[AMM[ammKey]];
        if (!amm) return null;
        return <PositionInfoUpdater key={ammKey} chViewer={contracts.chViewer} ammAddr={amm.address} />;
      })}
    </>
  );
};

export default UserDataUpdater;
