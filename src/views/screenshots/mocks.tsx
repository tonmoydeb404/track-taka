import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ChartColumn,
  House,
  PiggyBank,
  Plus,
  Settings2,
  Wallet,
} from "lucide-react"
import type { ReactNode } from "react"

import { AccountIcon } from "@/components/common/account-icon"
import { BrandMark } from "@/components/common/brand-mark"
import { BudgetBar } from "@/components/common/budget-bar"
import { CategoryIcon } from "@/components/common/category-icon"
import { formatMoney, getCategory } from "@/lib/domain"
import { cn } from "@/lib/utils"

/* Static reproductions of app screens for the store and install screenshots.
   Everything is built from the app's own primitives and theme tokens; the
   frame forces the light theme so exports look the same in any mode. */

export const ACCOUNTS = [
  { name: "Cash", type: "cash", color: "#0d9488", balance: 125000 },
  { name: "bKash", type: "mobile", color: "#e2136e", balance: 284050 },
  { name: "Nagad", type: "mobile", color: "#f6921e", balance: 41000 },
  { name: "DBBL", type: "bank", color: "#0069a8", balance: 3890000 },
] as const

type Tx = {
  title: string
  categoryId?: string
  account: string
  amount: number
  type: "expense" | "income" | "transfer"
  time: string
  day: string
}

export const TRANSACTIONS: Tx[] = [
  {
    title: "Groceries",
    categoryId: "food",
    account: "Cash",
    amount: 83500,
    type: "expense",
    time: "7:30 pm",
    day: "Today",
  },
  {
    title: "Mobile recharge",
    categoryId: "bills",
    account: "bKash",
    amount: 9900,
    type: "expense",
    time: "3:05 pm",
    day: "Today",
  },
  {
    title: "Lunch at the mess",
    categoryId: "food",
    account: "Cash",
    amount: 12500,
    type: "expense",
    time: "1:15 pm",
    day: "Today",
  },
  {
    title: "Cash to bKash",
    account: "Cash",
    amount: 50000,
    type: "transfer",
    time: "9:02 am",
    day: "Today",
  },
  {
    title: "Rickshaw, 2 trips",
    categoryId: "transport",
    account: "Cash",
    amount: 8000,
    type: "expense",
    time: "8:40 am",
    day: "Today",
  },
  {
    title: "Pathao ride",
    categoryId: "transport",
    account: "bKash",
    amount: 18700,
    type: "expense",
    time: "6:48 pm",
    day: "Yesterday",
  },
  {
    title: "Electricity bill",
    categoryId: "bills",
    account: "Nagad",
    amount: 134000,
    type: "expense",
    time: "11:20 am",
    day: "Yesterday",
  },
  {
    title: "Freelance payment",
    categoryId: "freelance",
    account: "DBBL",
    amount: 1200000,
    type: "income",
    time: "10:05 am",
    day: "Yesterday",
  },
  {
    title: "Medicine",
    categoryId: "health",
    account: "Cash",
    amount: 26000,
    type: "expense",
    time: "8:15 pm",
    day: "Wednesday",
  },
  {
    title: "Coffee with Rafi",
    categoryId: "food",
    account: "bKash",
    amount: 21000,
    type: "expense",
    time: "5:30 pm",
    day: "Wednesday",
  },
]

export const BUDGETS = [
  { id: "food", spent: 417500, limit: 600000 },
  { id: "transport", spent: 186000, limit: 200000 },
  { id: "shopping", spent: 542000, limit: 400000 },
  { id: "bills", spent: 241900, limit: 500000 },
  { id: "entertainment", spent: 65000, limit: 150000 },
] as const

export function MockCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 text-card-foreground shadow-xs",
        className
      )}
    >
      {children}
    </div>
  )
}

export function MockBalance({ className }: { className?: string }) {
  const total = ACCOUNTS.reduce((s, a) => s + a.balance, 0)
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl bg-primary px-5 pt-6 pb-5 text-primary-foreground",
        className
      )}
    >
      <p className="caption-1 opacity-80">Total balance</p>
      <p className="tnum mt-1 text-display">{formatMoney(total)}</p>
      <p className="mt-2 caption-1 opacity-80">4 accounts</p>
      <ul className="-mx-5 mt-4 flex gap-2 overflow-hidden px-5">
        {ACCOUNTS.map((a) => (
          <li
            key={a.name}
            className="flex shrink-0 items-center gap-2 rounded-full bg-primary-foreground/12 py-1.5 pr-3.5 pl-1.5 caption-2"
          >
            <span className="rounded-full bg-card">
              <AccountIcon
                type={a.type}
                color={a.color}
                size={13}
                className="h-7 w-7 rounded-full"
              />
            </span>
            <span className="opacity-80">{a.name}</span>
            <span className="tnum font-semibold">{formatMoney(a.balance)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MockMonthSummary({ className }: { className?: string }) {
  return (
    <MockCard className={cn("flex flex-col gap-5", className)}>
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="flex items-center gap-1 caption-2 text-muted-foreground">
            <ArrowDownLeft className="size-4 text-income" aria-hidden="true" />
            Income
          </dt>
          <dd className="tnum mt-1 heading-6 text-income">
            {formatMoney(5450000)}
          </dd>
          <p className="mt-1 caption-5 text-muted-foreground">
            Same as September
          </p>
        </div>
        <div>
          <dt className="flex items-center gap-1 caption-2 text-muted-foreground">
            <ArrowUpRight className="size-4 text-expense" aria-hidden="true" />
            Expenses
          </dt>
          <dd className="tnum mt-1 heading-6 text-expense">
            {formatMoney(2214700)}
          </dd>
          <p className="mt-1 caption-5 text-muted-foreground">
            8% less than September
          </p>
        </div>
      </dl>
      <div className="border-t pt-4">
        <p className="caption-2 text-muted-foreground">Left to spend</p>
        <p className="tnum mt-1 heading-6">{formatMoney(3235300)}</p>
        <BudgetBar
          spent={2214700}
          limit={5450000}
          label="Month"
          className="mt-3"
        />
      </div>
    </MockCard>
  )
}

export function MockTxRow({ tx }: { tx: Tx }) {
  const c = tx.categoryId ? getCategory(tx.categoryId) : undefined
  const sign = tx.type === "income" ? "+" : tx.type === "expense" ? "−" : ""
  return (
    <div className="flex min-h-16 items-center gap-3 px-2 py-3">
      {tx.type === "transfer" || !c ? (
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted">
          <ArrowLeftRight
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        </span>
      ) : (
        <CategoryIcon icon={c.icon} color={c.color} />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate body-2">{tx.title}</p>
        <p className="truncate caption-2 text-muted-foreground">
          {tx.type === "transfer"
            ? "Transfer · Cash"
            : `${c?.name ?? ""} · ${tx.account}`}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span
          className={cn(
            "tnum body-1",
            tx.type === "income" && "text-income",
            tx.type === "transfer" && "text-muted-foreground"
          )}
        >
          {sign}
          {formatMoney(tx.amount)}
        </span>
        <span className="tnum caption-5 text-muted-foreground">{tx.time}</span>
      </div>
    </div>
  )
}

export function MockRecent({
  limit = 5,
  className,
}: {
  limit?: number
  className?: string
}) {
  return (
    <MockCard className={cn("p-3", className)}>
      <div className="flex items-baseline justify-between px-2 pt-1 pb-2">
        <p className="title-3">Recent activity</p>
        <p className="caption-1 text-primary">See all</p>
      </div>
      <div className="divide-y divide-border/70">
        {TRANSACTIONS.slice(0, limit).map((tx) => (
          <MockTxRow key={tx.title + tx.time} tx={tx} />
        ))}
      </div>
    </MockCard>
  )
}

export function MockBudgets({
  count = 5,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <MockCard className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-baseline justify-between">
        <p className="title-3">Budgets</p>
        <p className="caption-2 text-muted-foreground">October 2026</p>
      </div>
      <ul className="flex flex-col gap-5">
        {BUDGETS.slice(0, count).map((b) => {
          const c = getCategory(b.id)
          if (!c) return null
          const over = b.spent > b.limit
          return (
            <li key={b.id} className="flex items-center gap-3">
              <CategoryIcon icon={c.icon} color={c.color} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate body-2">{c.name}</p>
                  <p className="tnum shrink-0 caption-2">
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
    </MockCard>
  )
}

const CATEGORY_IDS = [
  "food",
  "transport",
  "shopping",
  "bills",
  "health",
  "entertainment",
  "education",
  "other",
] as const

export function MockQuickEntry({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-t-3xl border bg-card px-5 pt-3 pb-6 text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-muted" />
      <div className="grid auto-cols-fr grid-flow-col gap-0.5 rounded-xl bg-muted p-1 caption-1">
        <span className="flex h-10 items-center justify-center rounded-lg bg-card shadow-sm">
          Expense
        </span>
        <span className="flex h-10 items-center justify-center rounded-lg text-muted-foreground">
          Income
        </span>
        <span className="flex h-10 items-center justify-center rounded-lg text-muted-foreground">
          Transfer
        </span>
      </div>
      <div className="flex flex-col items-center py-6">
        <div className="flex items-center gap-2">
          <span className="tnum heading-5 text-muted-foreground">৳</span>
          <span className="tnum heading-3">
            40+40
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block h-8 w-0.5 translate-y-1 bg-primary"
            />
          </span>
        </div>
        <p className="tnum mt-1 caption-2 text-muted-foreground">= ৳80</p>
      </div>
      <p className="mb-3 caption-1 text-muted-foreground">Category</p>
      <ul className="grid grid-cols-4 gap-2">
        {CATEGORY_IDS.map((id) => {
          const c = getCategory(id)
          if (!c) return null
          const on = id === "transport"
          return (
            <li
              key={id}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-xl border px-1 py-2",
                on && "border-primary bg-accent text-accent-foreground"
              )}
            >
              <CategoryIcon
                icon={c.icon}
                color={c.color}
                size={15}
                className="h-8 w-8 rounded-full"
              />
              <span className="w-full truncate text-center caption-5">
                {c.name}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 mb-3 caption-1 text-muted-foreground">Paid from</p>
      <ul className="flex gap-2 overflow-hidden">
        {ACCOUNTS.map((a, i) => (
          <li
            key={a.name}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border py-1 pr-3 pl-1 caption-1",
              i === 0 && "border-primary bg-accent text-accent-foreground"
            )}
          >
            <AccountIcon
              type={a.type}
              color={a.color}
              size={13}
              className="h-7 w-7 rounded-full"
            />
            {a.name}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex h-12 items-center justify-center rounded-xl bg-primary button-md text-primary-foreground">
        Save expense
      </div>
    </div>
  )
}

const NAV = [
  { label: "Overview", icon: House },
  { label: "Transactions", icon: ArrowLeftRight },
  { label: "Budgets", icon: PiggyBank },
  { label: "Analytics", icon: ChartColumn },
  { label: "Accounts", icon: Wallet },
] as const

export function MockSidebar({ active = "Overview" }: { active?: string }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 px-5">
        <BrandMark className="size-9 shrink-0" label="" />
        <span className="title-3 font-bold">Track Taka</span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3">
        <div className="mt-1 mb-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-sidebar-primary button-sm text-sidebar-primary-foreground">
          <Plus className="size-4" aria-hidden="true" />
          Add expense
        </div>
        <div className="mb-3 flex h-10 items-center justify-between rounded-lg bg-sidebar-accent/60 px-3 caption-1">
          <span>October 2026</span>
          <span className="opacity-60">Today</span>
        </div>
        <ul className="flex flex-col gap-1">
          {NAV.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className={cn(
                "flex h-10 items-center gap-3 rounded-lg px-3 caption-1",
                label === active
                  ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70"
              )}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex h-10 items-center gap-3 rounded-lg px-3 caption-1 text-sidebar-foreground/70">
          <Settings2 className="size-[18px]" aria-hidden="true" />
          Settings
        </div>
      </div>
    </aside>
  )
}

export function MockBottomNav({ active = "Home" }: { active?: string }) {
  return (
    <div className="grid h-16 grid-cols-4 border-t bg-card">
      {[
        { label: "Home", icon: House },
        { label: "Transactions", icon: ArrowLeftRight },
        { label: "Budgets", icon: PiggyBank },
        { label: "More", icon: Settings2 },
      ].map(({ label, icon: Icon }) => (
        <div
          key={label}
          className={cn(
            "caption-4 flex flex-col items-center justify-center gap-1",
            label === active ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
          {label}
        </div>
      ))}
    </div>
  )
}

const UNBUDGETED = [
  { id: "health", amount: 26000 },
  { id: "other", amount: 41000 },
] as const

export function MockUnbudgeted({ className }: { className?: string }) {
  return (
    <MockCard className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-baseline justify-between">
        <p className="title-3">Not budgeted</p>
        <p className="caption-2 text-muted-foreground">Spent this month</p>
      </div>
      <ul className="flex flex-col gap-3">
        {UNBUDGETED.map((u) => {
          const c = getCategory(u.id)
          if (!c) return null
          return (
            <li key={u.id} className="flex items-center gap-3">
              <CategoryIcon icon={c.icon} color={c.color} />
              <p className="flex-1 body-2">{c.name}</p>
              <p className="tnum body-4">{formatMoney(u.amount)}</p>
            </li>
          )
        })}
      </ul>
    </MockCard>
  )
}

export function MockTable() {
  return (
    <MockCard className="p-0">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left caption-1 text-muted-foreground">
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Description</th>
            <th className="px-5 py-3 font-medium">Account</th>
            <th className="px-5 py-3 font-medium">Type</th>
            <th className="px-5 py-3 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {TRANSACTIONS.map((tx) => {
            const c = tx.categoryId ? getCategory(tx.categoryId) : undefined
            return (
              <tr key={tx.title + tx.time} className="body-6">
                <td className="tnum px-5 py-3 whitespace-nowrap text-muted-foreground">
                  {tx.day}, {tx.time}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {c ? (
                      <CategoryIcon
                        icon={c.icon}
                        color={c.color}
                        size={14}
                        className="h-8 w-8"
                      />
                    ) : (
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-muted">
                        <ArrowLeftRight
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                    <div>
                      <p className="body-5">{tx.title}</p>
                      <p className="caption-5 text-muted-foreground">
                        {c?.name ?? "Transfer"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {tx.account}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "caption-4 rounded-full px-2 py-0.5",
                      tx.type === "income" && "bg-income/10 text-income",
                      tx.type === "expense" && "bg-expense/10 text-expense",
                      tx.type === "transfer" && "bg-muted text-muted-foreground"
                    )}
                  >
                    {tx.type === "income"
                      ? "Income"
                      : tx.type === "expense"
                        ? "Expense"
                        : "Transfer"}
                  </span>
                </td>
                <td
                  className={cn(
                    "tnum px-5 py-3 text-right body-4",
                    tx.type === "income" && "text-income",
                    tx.type === "transfer" && "text-muted-foreground"
                  )}
                >
                  {tx.type === "income"
                    ? "+"
                    : tx.type === "expense"
                      ? "−"
                      : ""}
                  {formatMoney(tx.amount)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </MockCard>
  )
}
