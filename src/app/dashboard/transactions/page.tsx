import type { Metadata } from "next"

import { Suspense } from "react"

import { TransactionsPage } from "@/views/transactions"

export const metadata: Metadata = { title: "Transactions" }

export default function Page() {
  // useSearchParams needs a Suspense boundary when the page is prerendered
  return (
    <Suspense>
      <TransactionsPage />
    </Suspense>
  )
}
