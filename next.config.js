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
}

module.exports = nextConfig
