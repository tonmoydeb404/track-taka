"use client"

import Link from "next/link"
import { CalendarDays, ChevronRight, PiggyBank } from "lucide-react"

import { CategoryIcon } from "@/components/common/category-icon"
import { formatMoney, monthLabelShort } from "@/lib/domain"
import { cn } from "@/lib/utils"

import { AnalyticsLoading, NoActivity } from "../components/analytics-empty"
import { Delta } from "../components/delta"
import { TrendChart } from "../components/trend-chart"
import { useAnalytics } from "../use-analytics"

export function SummaryTab() {
  const a = useAnalytics()
  const { period, totals, changes, prevTotals } = a
  if (a.isLoading) return <AnalyticsLoading />

  if (!a.hasAny) return <NoActivity period={period.label} />

  const top = a.categoryRows[0]
  const savingsRate =
    totals.income > 0 ? Math.round((totals.net / totals.income) * 100) : null
  const monthShort = monthLabelShort(period.months[0]).split(" ")[0]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* The focal block: the number, how it compares, and its shape over time */}
      <section
        aria-label="Spending"
        className="rounded-xl border bg-card p-5 shadow-xs sm:p-6 lg:col-span-2"
      >
        <p className="text-sm text-muted-foreground">Spent · {period.label}</p>
        <p className="tnum mt-1 text-display">{formatMoney(totals.expense)}</p>
        <Delta
          className="mt-2"
          change={changes?.expense ?? null}
          versus={period.prevLabel}
        />
        {prevTotals &&
        changes?.expense !== null &&
        changes?.expense !== undefined ? (
          <p className="tnum mt-0.5 text-sm text-muted-foreground">
            {formatMoney(prevTotals.expense)}{" "}
            {period.prevLabel ? `in ${period.prevLabel}` : ""}
          </p>
        ) : null}
        <div className="mt-5">
          {a.hasExpense ? (
            <TrendChart
              single={a.single}
              daily={a.dailySeries}
              monthly={a.monthlySeries}
              monthShort={monthShort}
            />
          ) : (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No spending in this period.
            </p>
          )}
        </div>
      </section>

      <section
        aria-label="Income and savings"
        className="divide-y rounded-xl border bg-card shadow-xs lg:self-start"
      >
        <StatRow
          label="Income"
          value={formatMoney(totals.income)}
          tone="income"
          note={
            changes?.income !== null && changes?.income !== undefined
              ? `${Math.round(Math.abs(changes.income))}% ${changes.income >= 0 ? "more" : "less"} than ${period.prevLabel}`
              : undefined
          }
        />
        <StatRow
          label={totals.net >= 0 ? "Net saved" : "Net overspent"}
          value={formatMoney(Math.abs(totals.net))}
          tone={totals.net >= 0 ? "income" : "expense"}
          note={
            savingsRate !== null
              ? `${savingsRate >= 0 ? "Saved" : "Overspent"} ${Math.abs(savingsRate)}% of income`
              : undefined
          }
        />
        <StatRow
          label="Average per day"
          value={formatMoney(Math.round(a.avgPerDay))}
          note={`Over ${period.days} ${period.days === 1 ? "day" : "days"}`}
        />
      </section>

      {a.hasExpense ? (
        <section
          aria-label="Insights"
          className="divide-y overflow-hidden rounded-xl border bg-card shadow-xs lg:col-span-3 lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0"
        >
          {top?.category ? (
            <Link
              href="/dashboard/analytics/spending"
              className="flex min-h-20 touch-manipulation items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring active:bg-muted"
            >
              <CategoryIcon
                icon={top.category.icon}
                color={top.category.color}
                className="size-11"
                size={20}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-muted-foreground">
                  Biggest category
                </span>
                <span className="block truncate text-base font-semibold">
                  {top.category.name}
                </span>
                <span className="tnum block text-sm text-muted-foreground">
                  {formatMoney(top.total)} · {Math.round(top.share * 100)}% of
                  spending
                </span>
              </span>
              <ChevronRight
                className="size-5 shrink-0 text-muted-foreground lg:hidden"
                aria-hidden="true"
              />
            </Link>
          ) : null}
          {a.busiest ? (
            <Link
              href="/dashboard/analytics/patterns"
              className="flex min-h-20 touch-manipulation items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring active:bg-muted"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <CalendarDays className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-muted-foreground">
                  Busiest day
                </span>
                <span className="block text-base font-semibold">
                  {new Date(`${a.busiest.key}T12:00:00`).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    }
                  )}
                </span>
                <span className="tnum block text-sm text-muted-foreground">
                  {formatMoney(a.busiest.amount)} spent
                </span>
              </span>
              <ChevronRight
                className="size-5 shrink-0 text-muted-foreground lg:hidden"
                aria-hidden="true"
              />
            </Link>
          ) : null}
          <div className="flex min-h-20 items-center gap-3 px-5 py-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <PiggyBank className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-muted-foreground">
                Money moved
              </span>
              <span className="tnum block text-base font-semibold">
                {formatMoney(totals.transferVolume)}
              </span>
              <span className="block text-sm text-muted-foreground">
                Between your own accounts, not counted above
              </span>
            </span>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function StatRow({
  label,
  value,
  tone,
  note,
}: {
  label: string
  value: string
  tone?: "income" | "expense"
  note?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="text-base font-medium">{label}</p>
        {note ? <p className="text-sm text-muted-foreground">{note}</p> : null}
      </div>
      <p
        className={cn(
          "tnum shrink-0 text-xl font-bold",
          tone === "income" && "text-income",
          tone === "expense" && "text-expense"
        )}
      >
        {value}
      </p>
    </div>
  )
}
