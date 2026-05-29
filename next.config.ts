import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone server output — minimal runtime for Docker on Railway
  // (~150 MB final image vs ~1 GB for a full node_modules copy).
  output: "standalone",
  images: {
    // Unsplash & Cloudinary already optimize via URL params (w=, q=,
    // auto=format) — routing through next/image would just duplicate that
    // work on the Railway container (CPU $$). Local /public JPGs are
    // pre-compressed. Net: leaner container, no `sharp` runtime dep.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/player',
        permanent: true,
      },
      {
        source: '/home/:path*',
        destination: '/player/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
