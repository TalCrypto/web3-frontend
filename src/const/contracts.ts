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
}
export interface Contracts {
  ch: Contract;
  chViewer: Contract;
  amms: {
    // eslint-disable-next-line no-unused-vars
    [value in AMM]?: Contract;
  };
}

export const getContracts = (chain: Chain, unsupported: boolean): Contracts => {
  const addressConf: AddressConfig = getAddressConfig(chain, unsupported);

  const ammContracts = Object.keys(addressConf.amms).reduce((acc, key) => {
    const ammKey = key as keyof typeof AMM;
    acc[AMM[ammKey]] = {
      address: addressConf.amms[AMM[ammKey]] as Address,
      abi: AMM_ABI
    };

    return acc;
    // eslint-disable-next-line no-unused-vars
  }, {} as { [value in AMM]?: Contract });

  return {
    ch: {
      address: addressConf.ch,
      abi: CH_ABI
    },
    chViewer: {
      address: addressConf.chViewer,
      abi: CH_VIEWER_ABI
    },
    amms: ammContracts
  };
};
