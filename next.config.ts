import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Keep the development compiler cache separate from the desktop app's
  // production build. Running `next dev` against a production `.next`
  // directory can otherwise leave missing chunks and manifest mismatches.
  distDir: process.env.NODE_ENV === 'production' ? '.next-production' : '.next-development',
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['better-sqlite3'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
