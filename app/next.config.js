/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        fs: false,
        os: false,
        path: false,
      },
    },
  }),
};

module.exports = nextConfig;
