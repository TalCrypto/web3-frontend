import React from 'react';
import type { AppProps } from 'next/app';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';

import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/all.scss';
import { DEV_CHAINS, PROD_CHAINS } from '@/const/supportedChains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? '';
const env = process.env.NODE_ENV;

const chains = env === 'production' ? PROD_CHAINS : DEV_CHAINS;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        defaultChain={chains[0]}
        explorerRecommendedWalletIds={[
          'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // metamask
          '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709', // okx wallet
          'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa' // coinbase
        ]}
        themeMode="dark"
        themeVariables={{
          '--w3m-font-family': 'Montserrat',
          '--w3m-accent-fill-color': '#babac0',
          '--w3m-background-image-url': '/images/backgrounds/wallet_bg.png',
          '--w3m-logo-image-url': '/images/logos/wallet_nav_logo.svg',
          '--w3m-background-border-radius': '0.5rem'
        }}
      />
    </>
  );
}
