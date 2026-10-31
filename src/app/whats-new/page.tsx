import type { Metadata } from "next"

import { WhatsNewPage } from "@/views/whats-new"

export const metadata: Metadata = {
  title: "What's new",
  description:
    "Every Track Taka release with dates and highlights: the local first rebuild, accounts, budgets, analytics and backups.",
}

export default function Page() {
  return <WhatsNewPage />
}
