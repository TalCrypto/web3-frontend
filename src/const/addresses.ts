/* eslint-disable no-unused-vars */
import { Address } from 'wagmi';
import { Chain, arbitrum, arbitrumGoerli } from 'wagmi/chains';
import { AMM, DEFAULT_AMM } from '@/const/collectionList';
import { DEFAULT_CHAIN, isSupportedChain } from '@/const/supportedChains';

export interface AddressConfig {
  ch: Address;
  chViewer: Address;
  ammViewer: Address;
  weth: Address;
  amms: {
    [value in AMM]?: Address;
  };
}

const ADDRESSES: Record<number, AddressConfig> = {
  [arbitrum.id]: {
    ch:
      process.env.NEXT_PUBLIC_ENV === 'staging'
        ? '0x550763c20554ea59092c85be847E7292fE7A6295'
        : '0x01b6407ADf740d135ddF1eBDD1529407845773F3',
    chViewer:
      process.env.NEXT_PUBLIC_ENV === 'staging'
        ? '0x00d857B5FAF26Cbb231283F0FAb4eB781cE29440'
        : '0x74183D4Afe2f5bd240f24CD690323629A02dF08f',
    ammViewer:
      process.env.NEXT_PUBLIC_ENV === 'staging'
        ? '0x00d857B5FAF26Cbb231283F0FAb4eB781cE29440'
        : '0x233A76584d5D91140459Be8fd75b799a39EC91dB',
    weth:
      process.env.NEXT_PUBLIC_ENV === 'staging'
        ? '0x7F4C5d495Fd0FFBD76992505200d9dF604Fa0715'
        : '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    amms: {
      [AMM.BAYC]:
        process.env.NEXT_PUBLIC_ENV === 'staging'
          ? '0x26f7786A917f226608c43E18D054829b33dACFca'
          : '0xd490246758b4dFED5Fb8576cB9Ac20073BB111dD',
      [AMM.AZUKI]:
        process.env.NEXT_PUBLIC_ENV === 'staging'
          ? '0x2DB4FB36Bca527b53af5e1E9C977EE230179eee9'
          : '0xf33c2F463d5aD0e5983181B49A2d9b7b29032085',
      [AMM.MAYC]:
        process.env.NEXT_PUBLIC_ENV === 'staging'
          ? '0xf58b3C0e97B8BD6Bd8F49fB170bd6674f037Cffe'
          : '0x75416ee73fD8C99c1AA33e1e1180E8ed77d4C715',
      [AMM.PUNKS]:
        process.env.NEXT_PUBLIC_ENV === 'staging'
          ? '0xCF34C7c0bdD1330B313db5a0Ba82d1684abBCA9F'
          : '0x2396cC2b3c814609dAEb7413b7680F569BBC16e0',
      [AMM.DEGODS]:
        process.env.NEXT_PUBLIC_ENV === 'staging'
          ? '0xE280c8907841d8601837973B6F4cd003A11202c0'
          : '0x1BBC1f49497F4f1a08A93df26ADfc7b0cECD95E0',
      [AMM.CAPTAINZ]:
        process.env.NEXT_PUBLIC_ENV === 'staging'
          ? '0xaeaec732d2878b74a7144B217CCbbB3658e3cC1D'
          : '0xcbA1F8Cdd6c9D6eA71b3d88dCfB777BE9Bc7C737',
      [AMM.MILADY]:
        process.env.NEXT_PUBLIC_ENV === 'staging'
          ? '0xbD890621129D5022f967e633198e0938b9397483'
          : '0x64244464a3e15990299d4106Deca4F4839f3DD99',
      [AMM.PPG]:
        process.env.NEXT_PUBLIC_ENV === 'staging'
          ? '0x1Ee3e2510d31BF77D7e50Edea8B6a04Ec2DE95De'
          : '0x0e9148000Cc4368a5C091D85e5AA91596408594d'
    }
  },
  [arbitrumGoerli.id]: {
    ch: '0x8e9aed761C1f73A0f41D7a2fd51E38b76B3601a2',
    chViewer: '0x1251B47a95f7F5BD1F9D3904C93197959139D1D8',
    ammViewer: '0xf03FBaC9066871A15AA6552b94eff81c33d5E6bC',
    weth: '0xB7a08f35E16958A610857e212Fd0F0bc8623A317',
    amms: {
      [AMM.BAYC]: '0x1812DBda7a954E829a6AdA968CEE0d3F315dDBa2',
      [AMM.AZUKI]: '0x77EB2F64a0A94B98283060D35645e6E2EAde029c',
      [AMM.MAYC]: '0xf7749f92627985Afde9BC8577a66caDc3e055589',
      [AMM.PUNKS]: '0xFdeE694aB487321A205ff077c757692Ea172AafC',
      [AMM.DEGODS]: '0x6Aad9D74c2A9C0a185FC08aDee633aB6A6968375',
      [AMM.CAPTAINZ]: '0x0C237DF9AF7C2246001c30e632839Efb7c58a2f4',
      [AMM.MILADY]: '0x98347F01B6B023BfbeB4b534CC48d43f2CFB562b',
      [AMM.PPG]: '0x99cdBb85154be3a2Eb1876aead11d78cd9C17034'
    }
  }
};

// get addresses, if chain is unsupported, then get the addresses of default chain
export const getAddressConfig = (chain?: Chain): { chainId: number; config: AddressConfig } => {
  if (chain && isSupportedChain(chain)) {
    return {
      chainId: chain.id,
      config: ADDRESSES[chain.id]
    };
  }
  return {
    chainId: DEFAULT_CHAIN.id,
    config: ADDRESSES[DEFAULT_CHAIN.id]
  };
};

export const getAMMAddress = (chain?: Chain, amm?: AMM): Address | undefined => {
  const { config: addressConfig } = getAddressConfig(chain);
  return addressConfig.amms[amm ?? DEFAULT_AMM];
};

export const getAMMByAddress = (address?: Address, chain?: Chain): AMM | undefined => {
  const { config: addressConfig } = getAddressConfig(chain);
  const amms = Object.keys(addressConfig.amms) as AMM[];
  for (let i = 0; i < amms.length; i += 1) {
    if (addressConfig.amms[amms[i]]?.toLowerCase() === address?.toLowerCase()) {
      return amms[i];
    }
  }
  return undefined;
};

export const getSupportedAMMs = (chain?: Chain): AMM[] => {
  const { config: addressConfig } = getAddressConfig(chain);
  return Object.keys(addressConfig.amms) as AMM[];
};

export const getSupportedAMMAddresses = (chain?: Chain): Address[] => {
  const { config: addressConfig } = getAddressConfig(chain);
  return Object.values(addressConfig.amms);
};
