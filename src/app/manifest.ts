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
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3f7fb",
    theme_color: "#0069a8",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    screenshots: SCREENSHOTS,
  }
}
