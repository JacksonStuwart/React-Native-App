import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "coin-images.coingecko.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns", "recharts"],
  },
};

export default nextConfig;
