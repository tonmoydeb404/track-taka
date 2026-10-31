import type { MetadataRoute } from "next"

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
  }
}
