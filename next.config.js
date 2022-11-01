/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: 'akamai',
    path: '',
  },
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/ghc_home/home.html',
      },
    ]
  },
}
module.exports = nextConfig
