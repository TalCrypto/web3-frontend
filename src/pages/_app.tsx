import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';

import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/all.scss';
import { CHAINS, DEFAULT_CHAIN } from '@/const/supportedChains';
import UserDataUpdater from '@/components/updaters/UserDataUpdater';
import TransferTokenModal from '@/components/layout/header/desktop/TransferTokenModal';
import { publicProvider } from 'wagmi/providers/public';
import MetamaskModal from '@/components/layout/header/desktop/MetamaskModal';
import LoginModal from '@/components/layout/header/desktop/LoginModal';
import MobileGetTokenModal from '@/components/trade/mobile/trading/MobileGetTokenModal';

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { Web3Modal } from '@web3modal/react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import MobileTncModal from '@/components/common/mobile/TncModal';

// Wagmi config
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? '';
const alchemyProjectId = process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? '';
const infuraProjectId = process.env.NEXT_PUBLIC_INFURA_KEY ?? '';

const { chains, publicClient, webSocketPublicClient } = configureChains(CHAINS, [
  alchemyProvider({ apiKey: alchemyProjectId }),
  infuraProvider({ apiKey: infuraProjectId }),
  w3mProvider({ projectId }),
  publicProvider()
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [...w3mConnectors({ projectId, chains })],
  publicClient,
  webSocketPublicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, CHAINS);

const outlineToastClass = {
  success: 'border border-marketGreen',
  error: 'border border-marketRed',
  info: 'border border-gray-600',
  warning: 'border border-yellow-500',
  default: 'border border-marketGreen',
  dark: 'border border-white-600 font-gray-300'
};

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Layout>
          <ToastContainer
            enableMultiContainer
            containerId="GLOBAL"
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            theme="dark"
            progressClassName="toastLoading"
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <ToastContainer
            className="flex flex-col items-center space-y-2"
            toastClassName={opt => {
              if (!opt) return '';
              const { type } = opt;
              return `bg-[#121212] ${
                outlineToastClass[type || 'default']
              } w-[350px] relative flex min-h-10 justify-between overflow-hidden rounded-lg p-2 mb-2`;
            }}
            enableMultiContainer
            containerId="GLOBAL_OUTLINE"
            position="top-center"
            autoClose={3000}
            hideProgressBar
            newestOnTop
            theme="dark"
            progressClassName="toastLoading"
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Component {...pageProps} />
        </Layout>
        <UserDataUpdater />
        <LoginModal />
        <MobileTncModal />
      </WagmiConfig>

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        defaultChain={DEFAULT_CHAIN}
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

      <TransferTokenModal />
      <MetamaskModal />
      <MobileGetTokenModal />
    </>
  );
}
