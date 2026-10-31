"use client"

import { TransactionIcon } from "@/components/transactions/transaction-icon"
import { useAccountLookup } from "@/hooks/data"
import type { TransactionDoc } from "@/lib/db"
import {
  formatMoney,
  formatTime,
  friendlyDay,
  getCategory,
  signedMoney,
} from "@/lib/domain"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

interface TransactionRowProps {
  tx: TransactionDoc
  /** Put the day and time in the subtitle (lists that span days, like an account's history). */
  showDay?: boolean
  /** Under a day heading already: show only the time beneath the amount. */
  timeOnly?: boolean
  className?: string
}

/** Tappable summary row for a single transaction; opens the detail sheet. */
export function TransactionRow({
  tx,
  showDay = false,
  timeOnly = false,
  className,
}: TransactionRowProps) {
  const accounts = useAccountLookup()
  const openDetail = useUIStore((s) => s.openDetail)

  const category = getCategory(tx.categoryId)
  const account = accounts.get(tx.accountId)
  const toAccount = tx.toAccountId ? accounts.get(tx.toAccountId) : undefined

  const isTransfer = tx.type === "transfer"
  const title =
    tx.description ||
    category?.name ||
    (isTransfer ? "Transfer" : "Transaction")
  const where = isTransfer
    ? `${account?.name ?? "?"} → ${toAccount?.name ?? "?"}`
    : `${category?.name ?? "Uncategorized"} · ${account?.name ?? "?"}`

  const kind =
    tx.type === "income"
      ? "Income"
      : tx.type === "expense"
        ? "Expense"
        : "Transfer"

  return (
    <button
      type="button"
      onClick={() => openDetail(tx.id)}
      className={cn(
        "flex min-h-16 w-full touch-manipulation items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors select-none hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring active:bg-muted",
        className
      )}
      aria-label={`${kind}: ${title}, ${formatMoney(tx.amount)}, ${friendlyDay(tx.date)} ${formatTime(tx.date)}`}
    >
      <TransactionIcon tx={tx} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-base leading-snug font-medium">{title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {where}
          {showDay && ` · ${friendlyDay(tx.date)} ${formatTime(tx.date)}`}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span
          className={cn(
            "tnum text-base leading-snug font-semibold",
            tx.type === "income" && "text-income",
            isTransfer && "text-muted-foreground"
          )}
        >
          {signedMoney(tx)}
        </span>
        {!showDay && (
          <span className="tnum text-xs text-muted-foreground">
            {timeOnly
              ? formatTime(tx.date)
              : `${friendlyDay(tx.date)} · ${formatTime(tx.date)}`}
          </span>
        )}
      </div>
    </button>
  )
}

interface TransactionListProps {
  transactions: TransactionDoc[]
  limit?: number
  emptyHint?: string
  /** Put day and time in each row's subtitle, keeping the title at full width. */
  showDay?: boolean
}

/** Divider-separated list of transaction rows with an optional cap. */
export function TransactionList({
  transactions,
  limit,
  emptyHint,
  showDay,
}: TransactionListProps) {
  const shown = limit ? transactions.slice(0, limit) : transactions

  if (shown.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        {emptyHint ?? "No transactions yet."}
      </p>
    )
  }

  return (
    <div className="divide-y divide-border/70">
      {shown.map((tx) => (
        <TransactionRow
          key={tx.id}
          tx={tx}
          showDay={showDay}
          className="rounded-none"
        />
      ))}
    </div>
  )
}
