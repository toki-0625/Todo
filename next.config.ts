import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  async redirects() {
    return [
      {
        source: "/",
        destination: "/todos",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
