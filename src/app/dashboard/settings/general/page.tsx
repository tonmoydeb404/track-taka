import type { Metadata } from "next"

import { GeneralSection } from "@/views/settings"

export const metadata: Metadata = { title: "General · Settings" }

export default function Page() {
  return <GeneralSection />
}
