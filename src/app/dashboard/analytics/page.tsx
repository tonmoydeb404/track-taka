import type { Metadata } from "next"

import { SummaryTab } from "@/views/analytics"

export const metadata: Metadata = { title: "Analytics" }

export default function Page() {
  return <SummaryTab />
}
