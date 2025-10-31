/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['raw.githubusercontent.com', 'placeholder.svg'],
    unoptimized: true,
  },
  experimental: {
    disableOptimizedLoading: true,
    // optimizeCss: false, // ← REMOVED: This was causing blur, border, and color issues in production
  },
};

export default nextConfig;
