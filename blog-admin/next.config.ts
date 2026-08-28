import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/admin',
  async rewrites() {
    return [
      {
        source: "/admin-blog",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
