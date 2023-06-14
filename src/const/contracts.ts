import { AddressConfig, getAddressConfig } from '@/const/addresses';
import { Chain } from 'wagmi/chains';
import { Address } from 'wagmi';
import { AMM } from '@/const/collectionList';
import CH_ABI from '@/const/abi/clearingHouse.json';
import CH_VIEWER_ABI from '@/const/abi/clearingHouseViewer.json';
import AMM_ABI from '@/const/abi/amm.json';

export interface Contract {
  address: Address;
  abi: any;
  chainId: number;
}

export const getAMMContract = (chain: Chain, amm: AMM): Contract | undefined => {
  const { config: addressConf, chainId } = getAddressConfig(chain);
  const ammAddress = addressConf.amms[amm];
  if (ammAddress) {
    return {
      address: ammAddress,
      abi: AMM_ABI,
      chainId
    };
  }
  return undefined;
};

export const getCHContract = (chain: Chain): Contract => {
  const { config: addressConf, chainId } = getAddressConfig(chain);
  return {
    address: addressConf.ch,
    abi: CH_ABI,
    chainId
  };
};

export const getCHViewerContract = (chain: Chain): Contract => {
  const { config: addressConf, chainId } = getAddressConfig(chain);
  return {
    address: addressConf.chViewer,
    abi: CH_VIEWER_ABI,
    chainId
  };
};
