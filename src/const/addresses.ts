/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { Address } from 'wagmi';
import { Chain, arbitrum, arbitrumGoerli } from 'wagmi/chains';

export enum AMM {
  BAYC = 'bayc',
  MAYC = 'mayc',
  AZUKI = 'azuki',
  PUNKS = 'punks',
  DEGODS = 'degods',
  CAPTAINZ = 'captainz'
}

interface AddressConfig {
  weth: Address;
  amms: {
    [value in AMM]?: string;
  };
}

// ensure to call with supported chains
export const getAddressConfig = (chain: Chain): AddressConfig => {
  switch (chain.id) {
    case arbitrum.id:
      return {
        weth: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        amms: {
          [AMM.BAYC]: '0xd490246758b4dFED5Fb8576cB9Ac20073BB111dD',
          [AMM.AZUKI]: '0xf33c2F463d5aD0e5983181B49A2d9b7b29032085',
          [AMM.MAYC]: '0x75416ee73fD8C99c1AA33e1e1180E8ed77d4C715',
          [AMM.PUNKS]: '0x2396cC2b3c814609dAEb7413b7680F569BBC16e0',
          [AMM.DEGODS]: '0x1BBC1f49497F4f1a08A93df26ADfc7b0cECD95E0',
          [AMM.CAPTAINZ]: '0xcbA1F8Cdd6c9D6eA71b3d88dCfB777BE9Bc7C737'
        }
      };
    case arbitrumGoerli.id:
      return {
        weth: '0xB7a08f35E16958A610857e212Fd0F0bc8623A317',
        amms: {
          [AMM.BAYC]: '0x1812DBda7a954E829a6AdA968CEE0d3F315dDBa2',
          [AMM.AZUKI]: '0x77EB2F64a0A94B98283060D35645e6E2EAde029c',
          [AMM.MAYC]: '0xf7749f92627985Afde9BC8577a66caDc3e055589',
          [AMM.PUNKS]: '0xFdeE694aB487321A205ff077c757692Ea172AafC'
        }
      };
    default:
      throw new Error('unsupported chain');
  }
};
