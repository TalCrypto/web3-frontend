import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/all.scss';
import { CHAINS } from '@/const/supportedChains';
import UserDataUpdater from '@/components/updaters/UserDataUpdater';
import TransferTokenModal from '@/components/layout/header/desktop/TransferTokenModal';
import { publicProvider } from 'wagmi/providers/public';
import MetamaskModal from '@/components/layout/header/desktop/MetamaskModal';
import LoginModal from '@/components/layout/header/desktop/LoginModal';
import MobileGetTokenModal from '@/components/trade/mobile/trading/MobileGetTokenModal';

import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';

// Wagmi config

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? '';

const { chains, publicClient, webSocketPublicClient } = configureChains(CHAINS, [
  alchemyProvider({ apiKey: 'Tl96rbTfIVIaVixF9FDMBWk9Wjq0IxvQ' }),
  publicProvider()
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: false
      }
    })
  ],
  publicClient,
  webSocketPublicClient
});

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
      </WagmiConfig>

      <TransferTokenModal />
      <MetamaskModal />
      <MobileGetTokenModal />
    </>
  );
}
