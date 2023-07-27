import { Chain, arbitrum, arbitrumGoerli } from 'wagmi/chains';

const PROD_CHAINS: Chain[] = [arbitrum];
const DEV_CHAINS: Chain[] = [arbitrumGoerli];

const env = process.env.NEXT_PUBLIC_ENV;

export const CHAINS = env === 'dev' ? DEV_CHAINS : PROD_CHAINS;

export const DEFAULT_CHAIN: Chain = CHAINS[0];

export const isSupportedChain = (chain: Chain) => CHAINS.map(item => item.id).includes(chain.id);
