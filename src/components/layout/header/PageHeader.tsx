import React from 'react';
import Head from 'next/head';

interface PageHeaderProps {
  title: string;
  ogTitle: string;
  ogDesc: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, ogTitle, ogDesc }) => (
  <Head>
    <title>{title ? `${title} | Tribe3` : 'Tribe3'}</title>
    <link rel="icon" type="image/png" href="/icons/favicon.svg" />
    <meta property="og:title" content={ogTitle} />
    <meta property="og:description" content={ogDesc} />
    <meta property="og:type" content="website" />
    <meta name="twitter:title" content={ogTitle} />
    <meta name="twitter:description" content={ogDesc} />
    <meta name="twitter:site" content="@Tribe3Official" />

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  </Head>
);

export default PageHeader;
