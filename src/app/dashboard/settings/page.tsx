import type { Metadata } from "next"

import { GeneralSection } from "@/views/settings"

export const metadata: Metadata = { title: "Settings" }

// On a phone the section cards (from the layout) are the page and this stays
// hidden; from lg up the nav sits beside General.
export default function Page() {
  return <GeneralSection />
}
