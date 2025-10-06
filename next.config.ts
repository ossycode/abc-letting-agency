import type { NextConfig } from "next";

// const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/app/overview",
        permanent: true,
      },
    ];
  },
  /* config options here */
  // async rewrites() {
  //   return [{ source: "/api/:path*", destination: `${API_URL}/:path*` }];
  // },
};

export default nextConfig;
