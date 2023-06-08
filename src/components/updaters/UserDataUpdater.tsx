import { getAddressConfig } from '@/const/addresses';
import { setIsConnecting, setUserInfo, setWethBalance } from '@/stores/user';
import { apiConnection } from '@/utils/apiConnection';
import { useWeb3Modal } from '@web3modal/react';
import React, { useEffect, useState } from 'react';
import { Address, useAccount, useBalance, useNetwork } from 'wagmi';

const UserDataUpdater: React.FC = () => {
  const [wethAddr, setWethAddr] = useState<Address>();
  const { address, isConnected, isConnecting } = useAccount();
  const { chain } = useNetwork();
  const { isOpen } = useWeb3Modal();
  const { data } = useBalance({ address, token: wethAddr, watch: true });

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
    }
  }, [chain, isConnected]);

  return null;
};

export default UserDataUpdater;
