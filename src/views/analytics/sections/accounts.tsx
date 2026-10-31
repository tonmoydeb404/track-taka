"use client"

import { AccountIcon } from "@/components/common/account-icon"
import { formatMoney, formatBalance } from "@/lib/domain"
import { cn } from "@/lib/utils"

import { AnalyticsLoading, NoActivity } from "../components/analytics-empty"
import { useAnalytics } from "../use-analytics"

/** "42% of your money", "Less than 1%", or the plain fact that it's overdrawn. */
function share(balance: number, sum: number): string {
  if (balance < 0) return "Overdrawn"
  const pct = (balance / sum) * 100
  if (pct > 0 && pct < 1) return "Less than 1% of your money"
  return `${Math.round(pct)}% of your money`
}

export function AccountsTab() {
  const a = useAnalytics()
  if (a.isLoading) return <AnalyticsLoading />
  if (a.accountRows.length === 0) return <NoActivity period={a.period.label} />

  const positive = a.accountRows.map((r) => Math.max(r.balance, 0))
  const sum = positive.reduce((s, n) => s + n, 0) || 1
  const total = a.accountRows.reduce((s, r) => s + r.balance, 0)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Balances are what each account holds today. Spent and received follow
        the period above ({a.period.label}).
      </p>
      <section
        aria-label="Accounts"
        className="overflow-hidden rounded-xl border bg-card shadow-xs"
      >
        <ul className="divide-y">
          {a.accountRows.map(({ account, balance, spent, received }) => (
            <li key={account.id} className="px-5 py-4">
              <div className="flex items-center gap-3">
                <AccountIcon
                  type={account.type}
                  color={account.color}
                  className="size-10"
                  size={18}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-medium">
                    {account.name}
                  </span>
                  <span className="tnum block text-sm text-muted-foreground">
                    {share(balance, sum)}
                  </span>
                </span>
                <span
                  className={cn(
                    "tnum shrink-0 text-lg font-bold",
                    balance < 0 && "text-expense"
                  )}
                >
                  {formatBalance(balance)}
                </span>
              </div>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"
                role="presentation"
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max((Math.max(balance, 0) / sum) * 100, balance > 0 ? 2 : 0)}%`,
                    backgroundColor: account.color,
                  }}
                />
              </div>
              <p className="tnum mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>
                  Spent{" "}
                  <span className="font-semibold text-expense">
                    {formatMoney(spent)}
                  </span>
                </span>
                <span>
                  Received{" "}
                  <span className="font-semibold text-income">
                    {formatMoney(received)}
                  </span>
                </span>
              </p>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t bg-muted/40 px-5 py-4">
          <span className="text-base font-medium">Total across accounts</span>
          <span className="tnum text-lg font-bold">{formatBalance(total)}</span>
        </div>
      </section>
    </div>
  )
}
