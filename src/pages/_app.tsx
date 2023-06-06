import React from 'react';
import type { AppProps } from 'next/app';
import Layout from '@/components/layout';

import '@/styles/globals.css';
import '@/styles/all.scss';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
  return (
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
      <Component {...pageProps} />
    </Layout>
  );
}
