import bundleAnalyzer from '@next/bundle-analyzer'
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

/** @type {import('next').NextConfig} */
const BACKEND_URL = (process.env.BACKEND_URL || 'http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io').trim()
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverActions: {
      allowedOrigins: ["*"]
    }
  },
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  },
  transpilePackages: [],
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // Add these for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  },
  // Ensure proper routing for dynamic routes
  async rewrites() {
    return [
      // Proxy Socket.IO/WebSocket to backend (avoids mixed-origin ws errors)
      {
        source: '/socket.io/:path*',
        destination: `${BACKEND_URL}/socket.io/:path*`
      },
      {
        source: '/meeting/:id',
        destination: '/meeting/:id'
      }
    ]
  }
};

export default withBundleAnalyzer(nextConfig);