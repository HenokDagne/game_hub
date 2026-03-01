import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.freetogame.com",
      },
      {
        protocol: "https",
        hostname: "freetogame.com",
      },
    ],
  },
};

export default nextConfig;
