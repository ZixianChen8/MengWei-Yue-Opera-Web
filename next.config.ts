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
  // The 10th-anniversary pages moved under the generic /special/<slug> routes
  // when special events became CMS-managed. Printed material and QR codes still
  // point at the old paths.
  async redirects() {
    return [
      {
        source: '/anniversary',
        destination: '/special/10th-anniversary',
        permanent: false,
      },
      {
        source: '/anniversary/:path*',
        destination: '/special/10th-anniversary/:path*',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
