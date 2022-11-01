/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'akamai',
    path: '',
  },
  rewrites: async () => [
    {
      source: "/public/ghc_home/home.html",
      destination: "/pages/api/home.js",
    },
  ],
}
module.exports = nextConfig
