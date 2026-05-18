import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./prisma/**/*", "./node_modules/.prisma/**/*"],
  },
};

export default nextConfig;
