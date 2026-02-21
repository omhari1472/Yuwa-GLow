import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/testv9',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
