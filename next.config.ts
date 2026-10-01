import type { NextConfig } from "next";
import path from "node:path";

/** Optional subdirectory deploy: NEXT_BASE_PATH=/preview */
const basePath = process.env.NEXT_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
