import type { Metadata } from "next"

import { OverviewPage } from "@/views/overview"

export const metadata: Metadata = { title: "Overview" }

export default function Page() {
  return <OverviewPage />
}
