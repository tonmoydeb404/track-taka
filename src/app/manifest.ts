import type { MetadataRoute } from "next"

// Screenshots power the richer install prompt on Android and desktop. They
// are generated from /screenshots (see src/views/screenshots) and must keep
// one aspect ratio per form factor.
const SCREENSHOTS: NonNullable<MetadataRoute.Manifest["screenshots"]> = [
  {
    src: "/screenshots/overview-1080x1920.png",
    sizes: "1080x1920",
    type: "image/png",
    form_factor: "narrow",
    label: "Overview: balance, month summary and recent activity",
  },
  {
    src: "/screenshots/quick-entry-1080x1920.png",
    sizes: "1080x1920",
    type: "image/png",
    form_factor: "narrow",
    label: "Quick entry with arithmetic in the amount field",
  },
  {
    src: "/screenshots/budgets-1080x1920.png",
    sizes: "1080x1920",
    type: "image/png",
    form_factor: "narrow",
    label: "Budgets per category with overspend visible",
  },
  {
    src: "/screenshots/desktop-overview-2560x1440.png",
    sizes: "2560x1440",
    type: "image/png",
    form_factor: "wide",
    label: "Overview on desktop",
  },
  {
    src: "/screenshots/desktop-transactions-2560x1440.png",
    sizes: "2560x1440",
    type: "image/png",
    form_factor: "wide",
    label: "Transactions table on desktop",
  },
]

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Track Taka",
    short_name: "Track Taka",
    description: "Record expenses in seconds and see where your money goes.",
    // Pins the app identity so updates to start_url don't create a second
    // installed app on Android.
    id: "/dashboard",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3f7fb",
    theme_color: "#0069a8",
    lang: "en",
    dir: "ltr",
    categories: ["finance", "productivity"],
    // PNGs are generated from src/app/icon.svg (maskable from
    // public/icons/icon-maskable.svg) — see public/icons/README.md. The SVG
    // covers desktop installs; PNGs cover Android/iOS and the maskable safe
    // zone for adaptive launchers.
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: SCREENSHOTS,
  }
}
