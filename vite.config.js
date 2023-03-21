import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import manifest from "./public/manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "public",
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: false,
        type: "module",
      },
      includeAssets: [
        "/icons/apple-touch-icon.png",
        "/icons/favicon-32x32.png",
        "/icons/favicon-16x16.png",
      ],
      manifest,
    }),
  ],
});
