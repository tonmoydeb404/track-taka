"use client"

import { TransactionRow } from "@/components/transactions"
import { useSettings } from "@/hooks"
import { formatMoney } from "@/lib/domain"

import { AnalyticsLoading, NoActivity } from "../components/analytics-empty"
import { WeekdayChart } from "../components/weekday-chart"
import { useAnalytics } from "../use-analytics"

const NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const LONG = [
  "Sundays",
  "Mondays",
  "Tuesdays",
  "Wednesdays",
  "Thursdays",
  "Fridays",
  "Saturdays",
]
const START = { sunday: 0, monday: 1, saturday: 6 } as const

export function PatternsTab() {
  const a = useAnalytics()
  const { weekStart } = useSettings()
  if (a.isLoading) return <AnalyticsLoading />

  if (!a.hasExpense) return <NoActivity period={a.period.label} />

  const first = START[weekStart]
  const order = Array.from({ length: 7 }, (_, i) => (first + i) % 7)
  const data = order.map((d) => ({ label: NAMES[d], total: a.weekday[d] }))
  const topDay = order.reduce(
    (best, d) => (a.weekday[d] > a.weekday[best] ? d : best),
    order[0]
  )
  const noSpend = Math.max(0, a.period.days - a.spendDays)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <section
        aria-label="Spending by weekday"
        className="rounded-xl border bg-card p-5 shadow-xs sm:p-6 lg:col-span-3 lg:self-start"
      >
        <h2 className="text-base font-semibold tracking-tight">
          You spend the most on {LONG[topDay]}
        </h2>
        <p className="tnum mt-0.5 text-sm text-muted-foreground">
          {formatMoney(a.weekday[topDay])} across {a.period.label}
        </p>
        <div className="mt-4">
          <WeekdayChart data={data} />
        </div>
      </section>

      <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
        <section
          aria-label="Spending days"
          className="grid grid-cols-2 divide-x rounded-xl border bg-card shadow-xs"
        >
          <div className="px-5 py-4">
            <p className="text-sm text-muted-foreground">Days you spent</p>
            <p className="tnum mt-0.5 text-2xl font-bold">
              {a.spendDays}
              <span className="text-base font-medium text-muted-foreground">
                {" "}
                of {a.period.days}
              </span>
            </p>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-muted-foreground">No-spend days</p>
            <p className="tnum mt-0.5 text-2xl font-bold text-income">
              {noSpend}
            </p>
          </div>
        </section>
      </div>

      <section
        aria-label="Biggest expenses"
        className="rounded-xl border bg-card py-5 shadow-xs lg:col-span-5"
      >
        <h2 className="px-5 text-base font-semibold tracking-tight sm:px-6">
          Biggest expenses
        </h2>
        <p className="px-5 text-sm text-muted-foreground sm:px-6">
          The largest single payments in {a.period.label}
        </p>
        <ul className="mt-3 divide-y px-3">
          {a.biggest.map((tx) => (
            <li key={tx.id}>
              <TransactionRow tx={tx} showDay className="rounded-none px-2" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
