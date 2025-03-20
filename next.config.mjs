import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // السماح بأي مصدر
      },
      {
        protocol: 'https',
        hostname: '**', // السماح بأي مصدر
      },
    ],
  },
};

export default withNextIntl(nextConfig);