/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')]
  },
  reactStrictMode: true,
  images: {
    domains: ['i.seadn.io']
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/trade/BAYC'
      },
      {
        source: '/trade/:collection',
        destination: '/trade?collection=:collection'
      }
    ];
  }
};

module.exports = nextConfig;
