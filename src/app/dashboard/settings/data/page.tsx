import type { Metadata } from "next"

import { DataSection } from "@/views/settings"

export const metadata: Metadata = { title: "Data & sync · Settings" }

export default function Page() {
  return <DataSection />
}
