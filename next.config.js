/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Turn off ESLint checking during builds
    ignoreDuringBuilds: true,
  },
  // Add any other Next.js config options here
};

module.exports = nextConfig; 