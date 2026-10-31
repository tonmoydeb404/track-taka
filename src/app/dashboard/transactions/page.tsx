import type { Metadata } from "next"

import { TransactionsPage } from "@/views/transactions"

export const metadata: Metadata = { title: "Transactions" }

// No Suspense needed: `useSearchQueries` (hooks) reads params without
// triggering the prerender-time bailout that raw `useSearchParams` would.
export default function Page() {
  return <TransactionsPage />
}
