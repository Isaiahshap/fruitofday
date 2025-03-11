import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // The following settings help with hydration issues
  experimental: {
    // This setting helps to maintain consistency between server and client rendering
    appDocumentPreloading: false,
  },
};

export default nextConfig;
