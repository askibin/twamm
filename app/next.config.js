/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    console.log("|>", config);

    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          fs: false,
          os: false,
          path: false,
        },
      },
    };
  },
};

module.exports = nextConfig;
