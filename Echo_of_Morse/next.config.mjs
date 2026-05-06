/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true, // active instrumentation.js au démarrage
  },
};

export default nextConfig;