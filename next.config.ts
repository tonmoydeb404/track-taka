import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // The service worker must never be cached by the browser or an
        // intermediate layer, or updates would not be picked up.
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
        ],
      },
    ]
  },
}

export default nextConfig
