
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/auth', '@repo/config'],
};

module.exports = nextConfig;
