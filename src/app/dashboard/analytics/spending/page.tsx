import type { Metadata } from "next"

import { SpendingTab } from "@/views/analytics"

export const metadata: Metadata = { title: "Spending · Analytics" }

export default function Page() {
  return <SpendingTab />
}
