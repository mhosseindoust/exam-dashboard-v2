/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: 'storage.mobedu.ir',
      },
    ],
  },
  output: 'standalone',
}

module.exports = nextConfig
