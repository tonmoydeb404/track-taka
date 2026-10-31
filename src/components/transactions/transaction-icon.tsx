"use client"

import { ArrowLeftRight, Inbox } from "lucide-react"

import { CategoryIcon } from "@/components/common/category-icon"
import type { TransactionDoc } from "@/lib/db"
import { getCategory } from "@/lib/domain"

/** Icon cell for a transaction row: category icon, or a neutral glyph for
 * transfers and uncategorised entries. */
export function TransactionIcon({
  tx,
}: {
  tx: Pick<TransactionDoc, "type" | "categoryId">
}) {
  const category = getCategory(tx.categoryId)

  if (tx.type === "transfer") {
    return (
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted"
        aria-hidden="true"
      >
        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
      </span>
    )
  }

  if (!category) {
    return (
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted"
        aria-hidden="true"
      >
        <Inbox className="h-4 w-4 text-muted-foreground" />
      </span>
    )
  }

  return <CategoryIcon icon={category.icon} color={category.color} />
}
