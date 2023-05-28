/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')]
  },
  reactStrictMode: true,
  images: {
    domains: ['i.seadn.io']
  }
};

module.exports = nextConfig;
