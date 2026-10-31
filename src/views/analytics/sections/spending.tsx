"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { CategoryIcon } from "@/components/common/category-icon"
import { formatMoney } from "@/lib/domain"

import { AnalyticsLoading, NoActivity } from "../components/analytics-empty"
import { SpendingDonut, type Slice } from "../components/spending-donut"
import { useAnalytics } from "../use-analytics"

const SLICES = 6

export function SpendingTab() {
  const a = useAnalytics()
  const { period, totals, categoryRows } = a
  if (a.isLoading) return <AnalyticsLoading />

  if (!a.hasExpense) return <NoActivity period={period.label} />

  // Six biggest as slices, everything else folded into "Other"
  const head: Slice[] = categoryRows.slice(0, SLICES).map((r) => ({
    name: r.category!.name,
    value: r.total,
    color: r.category!.color,
  }))
  const restTotal = categoryRows.slice(SLICES).reduce((s, r) => s + r.total, 0)
  const slices =
    restTotal > 0
      ? [
          ...head,
          {
            name: "Smaller ones",
            value: restTotal,
            color: "#cbd5e1",
          },
        ]
      : head

  // One month goes to that month's transactions; longer periods to all time
  const monthParam = a.single ? period.months[0] : "all"

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <section
        aria-label="Share of spending"
        className="rounded-xl border bg-card p-5 shadow-xs sm:p-6 lg:col-span-2 lg:self-start"
      >
        <SpendingDonut slices={slices} total={totals.expense} />
        <ul
          className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2"
          aria-hidden="true"
        >
          {slices.map((s) => (
            <li
              key={s.name}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.name}
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-label="Spending by category"
        className="overflow-hidden rounded-xl border bg-card shadow-xs lg:col-span-3"
      >
        <ul className="divide-y">
          {categoryRows.map((r) => {
            const c = r.category!
            const diff = r.prev === null ? null : r.total - r.prev
            return (
              <li key={r.categoryId}>
                <Link
                  href={`/dashboard/transactions?category=${r.categoryId}&month=${monthParam}&type=expense`}
                  className="block touch-manipulation px-5 py-4 transition-colors select-none hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring active:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon
                      icon={c.icon}
                      color={c.color}
                      className="size-10"
                      size={18}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-base font-medium">
                        {c.name}
                      </span>
                      <span className="tnum block text-sm text-muted-foreground">
                        {Math.round(r.share * 100)}%
                        {diff !== null && diff !== 0
                          ? ` · ${diff > 0 ? "up" : "down"} ${formatMoney(Math.abs(diff))}`
                          : ""}
                      </span>
                    </span>
                    <span className="tnum shrink-0 text-base font-semibold">
                      {formatMoney(r.total)}
                    </span>
                    <ChevronRight
                      className="size-5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"
                    role="img"
                    aria-label={`${c.name}: ${Math.round(r.share * 100)}% of spending`}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(r.share * 100, 2)}%`,
                        backgroundColor: c.color,
                      }}
                    />
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
        <p className="border-t px-5 py-3 text-sm text-muted-foreground">
          Tap a category to see its transactions.
        </p>
      </section>
    </div>
  )
}
