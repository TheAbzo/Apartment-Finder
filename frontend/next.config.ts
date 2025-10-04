import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // simplest for local images served by backend
  },
};

export default nextConfig;
