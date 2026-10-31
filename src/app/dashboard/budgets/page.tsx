import type { Metadata } from "next"

import { BudgetsPage } from "@/views/budgets"

export const metadata: Metadata = { title: "Budgets" }

export default function Page() {
  return <BudgetsPage />
}
