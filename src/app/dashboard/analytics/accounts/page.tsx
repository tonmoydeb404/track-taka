import type { Metadata } from "next"

import { AccountsTab } from "@/views/analytics"

export const metadata: Metadata = { title: "Accounts · Analytics" }

export default function Page() {
  return <AccountsTab />
}
