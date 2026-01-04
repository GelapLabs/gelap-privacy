import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Optimasi image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },

  // Optimasi compiler
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // React strict mode untuk development
  reactStrictMode: true,

  // Optimasi experimental features
  experimental: {
    optimizePackageImports: ["three", "gsap", "cobe", "lucide-react"],
  },
};

export default nextConfig;
