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
  useSelectedMonth,
  useTransactions,
} from "@/hooks"
import {
  addMonths,
  categoryTotals,
  dailyExpenseSeries,
  monthKey,
  periodTotals,
} from "@/lib/domain"
import { ROUTES } from "@/lib/routes"

import { BalanceHero } from "./components/balance-hero"
import { BudgetSnapshot } from "./components/budget-snapshot"
import { CategoryBreakdown } from "./components/category-breakdown"
import { MonthSummary } from "./components/month-summary"
import { QuickActions } from "./components/quick-actions"
import { RecentActivity } from "./components/recent-activity"
import { SpendingTrend } from "./components/spending-trend"
import { greetingFor, shortMonth } from "./utils"

/**
 * Dashboard home. Phone: one column ordered by how often each part is used.
 * lg+: a named-area grid (see .overview-grid in globals.css).
 */
export function OverviewPage() {
  const accountsQuery = useAccounts()
  const { balances, total: balance } = useAccountBalances()
  const txQuery = useTransactions("all")
  const { month } = useSelectedMonth()
  const { statuses } = useBudgetProgress(month)
  const [now] = useState(() => new Date())

  const accounts = accountsQuery.data
  const transactions = txQuery.data
  const prevMonth = useMemo(() => addMonths(month, -1), [month])

  // Derived, never stored
  const monthTxs = useMemo(
    () => transactions.filter((t) => monthKey(t.date) === month),
    [transactions, month]
  )
  const totals = useMemo(() => periodTotals(monthTxs), [monthTxs])
  const prevTotals = useMemo(
    () =>
      periodTotals(transactions.filter((t) => monthKey(t.date) === prevMonth)),
    [transactions, prevMonth]
  )
  const budgetLimit = useMemo(
    () => statuses.reduce((s, b) => s + b.budget.limit, 0),
    [statuses]
  )
  const series = useMemo(
    () => dailyExpenseSeries(monthTxs, month),
    [monthTxs, month]
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
            prevLabel={shortMonth(prevMonth)}
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
            month={month}
            rows={topCategories}
          />

          <SpendingTrend className="ov-trend" month={month} series={series} />
        </div>
      )}
    </div>
  )
}
