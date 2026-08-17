import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.2.159'],
  // Keep Turbopack rooted on this package when a parent lockfile exists (e.g. git worktrees).
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  async redirects() {
    return [
      { source: '/anniversary', destination: '/special/10th-anniversary', permanent: true },
      { source: '/anniversary/:path*', destination: '/special/10th-anniversary/:path*', permanent: true },
    ]
  },
};

export default nextConfig;
