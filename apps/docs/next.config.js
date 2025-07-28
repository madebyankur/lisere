/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lisere'],
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      lisere: require('path').resolve(__dirname, '../../src'),
    };
    return config;
  },
};

module.exports = nextConfig;
