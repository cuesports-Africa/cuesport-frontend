import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
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
};

export default nextConfig;
