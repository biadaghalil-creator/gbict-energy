import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Framer CDN voor afbeeldingen in templates
      { protocol: 'https', hostname: 'framerusercontent.com' },
      { protocol: 'https', hostname: '*.framer.website' },
      { protocol: 'https', hostname: '*.framer.com' },
    ],
  },
};

export default nextConfig;
