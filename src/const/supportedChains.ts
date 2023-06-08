import { Chain, arbitrum, arbitrumGoerli } from 'wagmi/chains';

const PROD_CHAINS: Chain[] = [arbitrum];
const DEV_CHAINS: Chain[] = [arbitrumGoerli];

const env = process.env.NODE_ENV;

export const CHAINS = env === 'production' ? PROD_CHAINS : DEV_CHAINS;

export const DEFAULT_CHAIN: Chain = CHAINS[0];
