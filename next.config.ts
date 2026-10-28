import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { agentFeedback: true, cpus: 1 },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
