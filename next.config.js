/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization for all pages to prevent prerendering issues
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
    // Disable static generation for dynamic routes
    serverActions: true,
  },
  // Configure for Vercel deployment
  images: {
    unoptimized: true,
  },
  // Disable static export and force dynamic rendering
  output: undefined,
  trailingSlash: false,
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Disable static generation for pages with dynamic content
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

module.exports = nextConfig;