/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Turn off ESLint checking during builds
    ignoreDuringBuilds: true,
  },
  // Add image domain configuration
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google user profile images
    ],
  },
  // Add any other Next.js config options here
};

module.exports = nextConfig; 