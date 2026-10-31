"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Wallet } from "lucide-react"

import { EmptyState } from "@/components/common/empty-state"
import { PageHeader } from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import {
  useAccountBalances,
  useAccounts,
  useBudgetProgress,
  useDateRange,
  useTransactions,
} from "@/hooks"
import { categoryTotals, dailyExpenseRange, periodTotals } from "@/lib/domain"
import { ROUTES } from "@/lib/routes"

import { BalanceHero } from "./components/balance-hero"
import { BudgetSnapshot } from "./components/budget-snapshot"
import { CategoryBreakdown } from "./components/category-breakdown"
import { MonthSummary } from "./components/month-summary"
import { QuickActions } from "./components/quick-actions"
import { RecentActivity } from "./components/recent-activity"
import { SpendingTrend } from "./components/spending-trend"
import { greetingFor } from "./utils"

/**
 * Dashboard home. Phone: one column ordered by how often each part is used.
 * lg+: a named-area grid (see .overview-grid in src/styles/utilities.css).
 */
export function OverviewPage() {
  const accountsQuery = useAccounts()
  const { balances, total: balance } = useAccountBalances()
  const txQuery = useTransactions("all")
  const range = useDateRange()
  const { month } = range
  const { statuses } = useBudgetProgress(month)
  const [now] = useState(() => new Date())

  const accounts = accountsQuery.data
  const transactions = txQuery.data

  // Derived, never stored
  const monthTxs = useMemo(
    () => transactions.filter((t) => range.inRange(t.date)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, range.from, range.to]
  )
  const totals = useMemo(() => periodTotals(monthTxs), [monthTxs])
  const prevTotals = useMemo(
    () => periodTotals(transactions.filter((t) => range.prev.inRange(t.date))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, range.prev.from, range.prev.to]
  )
  const budgetLimit = useMemo(
    () => statuses.reduce((s, b) => s + b.budget.limit, 0),
    [statuses]
  )
  const series = useMemo(
    () => dailyExpenseRange(monthTxs, range.from, range.to),
    [monthTxs, range.from, range.to]
  )
  const topCategories = useMemo(
    () => categoryTotals(monthTxs, "expense").slice(0, 5),
    [monthTxs]
  )
  const budgetRows = useMemo(() => statuses.slice(0, 3), [statuses])

  const isLoading = accountsQuery.isLoading || txQuery.isLoading
  const noAccounts = !isLoading && accounts.length === 0

  return (
    <div className="page-stack">
      <PageHeader
        title={greetingFor(now)}
        subtitle={now.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      />

      {noAccounts ? (
        <EmptyState
          icon={Wallet}
          title="Add your first account"
          description="Create an account, like cash or bKash, to start tracking your money."
          action={
            <Button asChild>
              <Link href={ROUTES.accounts}>Create an account</Link>
            </Button>
          }
        />
      ) : (
        <div className="overview-grid flex flex-col gap-5 sm:gap-6">
          <BalanceHero
            className="ov-hero"
            balance={balance}
            accounts={accounts}
            balances={balances}
          />

          <QuickActions className="ov-actions" />

          <MonthSummary
            className="ov-month"
            prevLabel={range.prev.label}
            income={totals.income}
            expense={totals.expense}
            prevIncome={prevTotals.income}
            prevExpense={prevTotals.expense}
            budgetLimit={budgetLimit}
          />

          <RecentActivity className="ov-recent" transactions={transactions} />

          <BudgetSnapshot
            className="ov-budgets"
            month={month}
            rows={budgetRows}
          />

          <CategoryBreakdown
            className="ov-cats"
            label={range.label}
            rows={topCategories}
          />

          <SpendingTrend
            className="ov-trend"
            label={range.label}
            series={series}
          />
        </div>
      )}
    </div>
  )
}
