import type { Metadata } from "next"

import { PatternsTab } from "@/views/analytics"

export const metadata: Metadata = { title: "Patterns · Analytics" }

export default function Page() {
  return <PatternsTab />
}
