import { TransactionList } from "@/components/transactions"
import type { TransactionDoc } from "@/lib/db"
import { ROUTES } from "@/lib/routes"

import { Section } from "./section"

export function RecentActivity({
  transactions,
  className,
}: {
  transactions: TransactionDoc[]
  className?: string
}) {
  return (
    <Section
      title="Recent activity"
      action={{ label: "View all", href: ROUTES.transactions }}
      className={className}
      flush
    >
      <TransactionList
        transactions={transactions}
        limit={5}
        showDay
        emptyHint="Nothing recorded yet. Tap + to add your first transaction."
      />
    </Section>
  )
}
