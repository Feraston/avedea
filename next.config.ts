import type { NextConfig } from "next";
import path from "node:path";

/** Set NEXT_BASE_PATH=/new for preview deploy at https://avedea.ru/new/ */
const basePath = process.env.NEXT_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
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
