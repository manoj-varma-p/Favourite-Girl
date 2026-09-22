import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Allow any local path with or without query strings.
    // This is required in Next.js 16+ for images served from
    // API routes like /api/admin/upload?id=...
    localPatterns: [
      {
        pathname: "/api/admin/upload",
        search: "*",
      },
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
