import { ArrowLeftRight } from "lucide-react"
import type { ReactNode } from "react"

import { AccountIcon } from "@/components/common/account-icon"
import { BudgetBar } from "@/components/common/budget-bar"
import { CategoryIcon } from "@/components/common/category-icon"
import { formatMoney, getCategory } from "@/lib/domain"
import { cn } from "@/lib/utils"

/* Static reproductions of real screens, built from the app's own primitives.
   They are pictures: role="img" with a description of what they show. */

function Frame({
  children,
  className,
  label,
}: {
  children: ReactNode
  className?: string
  label: string
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "overflow-hidden rounded-lg border bg-background p-4 text-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}

const ACCOUNTS = [
  { name: "Cash", type: "cash", color: "#0d9488", balance: 125000 },
  { name: "bKash", type: "mobile", color: "#e2136e", balance: 284050 },
  { name: "Nagad", type: "mobile", color: "#f6921e", balance: 41000 },
  { name: "DBBL", type: "bank", color: "#0069a8", balance: 3890000 },
] as const

export function AccountsFragment() {
  const total = ACCOUNTS.reduce((s, a) => s + a.balance, 0)
  return (
    <Frame
      label="Total balance across four accounts, with a transfer from cash to bKash marked as not spending"
      className="p-0"
    >
      <div className="bg-primary px-4 pt-4 pb-3 text-primary-foreground">
        <p className="caption-2 opacity-80">Total balance</p>
        <p className="tnum mt-1 heading-4">{formatMoney(total)}</p>
        <ul className="-mx-4 mt-3 flex gap-2 overflow-hidden [mask-image:linear-gradient(to_right,black_82%,transparent)] px-4">
          {ACCOUNTS.map((a) => (
            <li
              key={a.name}
              className="flex shrink-0 items-center gap-2 rounded-full bg-primary-foreground/12 py-1 pr-3 pl-1 caption-2"
            >
              <span className="rounded-full bg-card">
                <AccountIcon
                  type={a.type}
                  color={a.color}
                  size={12}
                  className="h-6 w-6 rounded-full"
                />
              </span>
              <span className="opacity-80">{a.name}</span>
              <span className="tnum font-semibold">
                {formatMoney(a.balance)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
          <ArrowLeftRight className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate body-5">Cash to bKash</p>
          <p className="caption-5 text-muted-foreground">
            Transfer, not counted as spending
          </p>
        </div>
        <span className="tnum body-4 text-muted-foreground">
          {formatMoney(50000)}
        </span>
      </div>
    </Frame>
  )
}

const CHIP_IDS = ["transport", "food", "shopping", "bills"] as const

export function QuickEntryFragment() {
  return (
    <Frame label="The quick entry sheet with 40+40 typed, resolving to 80 taka, and Transport selected">
      <div className="grid auto-cols-fr grid-flow-col gap-0.5 rounded-lg bg-muted p-0.5 caption-1">
        <span className="flex h-8 items-center justify-center rounded-md bg-card shadow-sm">
          Expense
        </span>
        <span className="flex h-8 items-center justify-center rounded-md text-muted-foreground">
          Income
        </span>
        <span className="flex h-8 items-center justify-center rounded-md text-muted-foreground">
          Transfer
        </span>
      </div>
      <div className="flex flex-col items-center py-6">
        <div className="flex items-center gap-2">
          <span className="tnum title-1 text-muted-foreground">৳</span>
          <span className="tnum heading-4">
            40+40
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block h-7 w-0.5 translate-y-1 bg-primary"
            />
          </span>
        </div>
        <p className="tnum mt-1 caption-2 text-muted-foreground">= ৳80</p>
      </div>
      <ul className="flex gap-2 overflow-hidden [mask-image:linear-gradient(to_right,black_82%,transparent)]">
        {CHIP_IDS.map((id) => {
          const c = getCategory(id)
          if (!c) return null
          const on = id === "transport"
          return (
            <li
              key={id}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border py-0.5 pr-3 pl-0.5 caption-1",
                on && "border-primary bg-accent text-accent-foreground"
              )}
            >
              <CategoryIcon
                icon={c.icon}
                color={c.color}
                size={12}
                className="h-6 w-6 rounded-full"
              />
              {c.name}
            </li>
          )
        })}
      </ul>
    </Frame>
  )
}

const BUDGETS = [
  { id: "food", spent: 417500, limit: 600000 },
  { id: "transport", spent: 186000, limit: 200000 },
  { id: "shopping", spent: 542000, limit: 400000 },
] as const

export function BudgetsFragment() {
  return (
    <Frame label="October budgets: Food under its limit, Transport close to its limit, Shopping over by 1,420 taka">
      <div className="flex items-baseline justify-between">
        <p className="title-3">October 2026</p>
        <p className="caption-2 text-muted-foreground">Budgets</p>
      </div>
      <ul className="mt-4 flex flex-col gap-4">
        {BUDGETS.map((b) => {
          const c = getCategory(b.id)
          if (!c) return null
          const over = b.spent > b.limit
          return (
            <li key={b.id} className="flex items-center gap-3">
              <CategoryIcon
                icon={c.icon}
                color={c.color}
                size={14}
                className="h-8 w-8 rounded-md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate body-5">{c.name}</p>
                  <p className="tnum shrink-0 caption-5">
                    <span
                      className={cn("font-semibold", over && "text-expense")}
                    >
                      {formatMoney(b.spent)}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      of {formatMoney(b.limit)}
                    </span>
                  </p>
                </div>
                <BudgetBar
                  spent={b.spent}
                  limit={b.limit}
                  label={`${c.name} budget`}
                  className="mt-2"
                />
              </div>
            </li>
          )
        })}
      </ul>
    </Frame>
  )
}
