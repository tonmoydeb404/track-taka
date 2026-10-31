import type { Metadata } from "next"

import { ScreenshotsPage } from "@/views/screenshots"

// A tool page for generating the install prompt screenshots. Reachable by
// URL, not linked from the site, and kept out of search results.
export const metadata: Metadata = {
  title: "App screenshots",
  description: "Export the Track Taka install prompt and store screenshots.",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <ScreenshotsPage />
}
