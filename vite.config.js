import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";
import manifest from "./public/manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "public",
  server: {
    https: true,
  },
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      includeAssets: [
        "/icons/apple-touch-icon.png",
        "/icons/favicon-32x32.png",
        "/icons/favicon-16x16.png",
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css",
      ],
      devOptions: {
        enabled: false,
      },

      manifest,
      workbox: {
        globPatterns: ["**/*.{js,css,html,woff,woff2}"],
      },
    }),
  ],
});
