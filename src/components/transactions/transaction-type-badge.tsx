"use client"

import { Badge } from "@/components/ui/badge"
import type { TransactionType } from "@/lib/db"

interface TransactionTypeBadgeProps {
  type: TransactionType
}

/**
 * Type badge for transactions. Never relies on color alone — the label
 * distinguishes income, expense and transfer.
 */
export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
  if (type === "income") {
    return (
      <Badge className="border-transparent bg-income/10 text-income hover:bg-income/10">
        Income
      </Badge>
    )
  }

  if (type === "transfer") {
    return (
      <Badge className="border-transparent bg-muted text-muted-foreground hover:bg-muted">
        Transfer
      </Badge>
    )
  }

  return <Badge variant="outline">Expense</Badge>
}
