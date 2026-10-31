"use client"

import { PenLine, Trash2 } from "lucide-react"

import { SwipeActions } from "@/components/common/swipe-actions"
import { TransactionRow, useDeleteTransaction } from "@/components/transactions"
import { useQuickEntryParams } from "@/hooks"
import type { TransactionDoc } from "@/lib/db"
import { formatMoney } from "@/lib/domain"
import { cn } from "@/lib/utils"

import type { DayGroup } from "./../utils"

/** Day-grouped list for phones and tablets (hidden from md up). Swipe a row for Edit / Delete. */
export function TransactionsMobileList({ groups }: { groups: DayGroup[] }) {
  const quickEntry = useQuickEntryParams()
  const requestDelete = useDeleteTransaction()

  const actionsFor = (tx: TransactionDoc) => [
    {
      label: "Edit",
      icon: PenLine,
      onSelect: () => quickEntry.openEdit(tx.id),
      className: "bg-primary text-primary-foreground",
    },
    {
      label: "Delete",
      icon: Trash2,
      onSelect: () => void requestDelete(tx),
      className: "bg-destructive text-white",
    },
  ]

  return (
    <div className="flex flex-col gap-2 md:hidden">
      {groups.map((group) => {
        // Net movement for the day; transfers just move money between your own accounts
        let net = 0
        for (const tx of group.items) {
          if (tx.type === "expense") net -= tx.amount
          else if (tx.type === "income") net += tx.amount
        }
        return (
          <section key={group.key} aria-label={group.label}>
            {/* Stays under the status bar while its day scrolls past */}
            <div className="sticky top-0 z-10 -mx-5 flex items-baseline justify-between gap-3 bg-background/90 px-6 py-3 backdrop-blur-md sm:-mx-6 sm:px-7">
              <h2 className="text-sm font-semibold">{group.label}</h2>
              {net !== 0 ? (
                <span
                  className={cn(
                    "tnum text-sm font-medium text-muted-foreground",
                    net > 0 && "text-income"
                  )}
                >
                  {net > 0 ? "+" : "−"}
                  {formatMoney(Math.abs(net))}
                </span>
              ) : null}
            </div>
            <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-xs">
              {group.items.map((tx) => (
                <SwipeActions key={tx.id} actions={actionsFor(tx)}>
                  <TransactionRow
                    tx={tx}
                    timeOnly
                    className="rounded-none px-4"
                  />
                </SwipeActions>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
