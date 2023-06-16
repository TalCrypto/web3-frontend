import { getAddressConfig } from '@/const/addresses';
import { Chain } from 'wagmi/chains';
import { Address } from 'wagmi';
import { AMM } from '@/const/collectionList';

export interface Contract {
  address: Address;
  chainId: number;
}

export const getAMMContract = (chain: Chain, amm: AMM): Contract | undefined => {
  const { config: addressConf, chainId } = getAddressConfig(chain);
  const ammAddress = addressConf.amms[amm];
  if (ammAddress) {
    return {
      address: ammAddress,
      chainId
    };
  }
  return undefined;
};

export const getCHContract = (chain: Chain): Contract => {
  const { config: addressConf, chainId } = getAddressConfig(chain);
  return {
    address: addressConf.ch,
    chainId
  };
};

export const getWEthContract = (chain: Chain): Contract => {
  const { config: addressConf, chainId } = getAddressConfig(chain);
  return {
    address: addressConf.weth,
    chainId
  };
};

export const getCHViewerContract = (chain: Chain): Contract => {
  const { config: addressConf, chainId } = getAddressConfig(chain);
  return {
    address: addressConf.chViewer,
    chainId
  };
};

export const getAMMViewerContract = (chain: Chain): Contract => {
  const { config: addressConf, chainId } = getAddressConfig(chain);
  return {
    address: addressConf.ammViewer,
    chainId
  };
};
