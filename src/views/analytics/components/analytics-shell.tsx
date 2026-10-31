"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, type ReactNode } from "react"

import { PageHeader } from "@/components/common/page-header"
import { SegmentedControl } from "@/components/common/segmented-control"
import { useSelectedMonth } from "@/hooks"
import { cn } from "@/lib/utils"

import { usePeriod } from "../use-period"
import { RANGE_OPTIONS, resolvePeriod } from "../utils"

const TABS = [
  { href: "/dashboard/analytics", label: "Summary" },
  { href: "/dashboard/analytics/spending", label: "Spending" },
  { href: "/dashboard/analytics/patterns", label: "Patterns" },
  { href: "/dashboard/analytics/accounts", label: "Accounts" },
]

/** Frame for the four analytics tabs: one period control above all of them. */
export function AnalyticsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const range = usePeriod((s) => s.range)
  const setRange = usePeriod((s) => s.setRange)
  const { month: endMonth } = useSelectedMonth()
  const [now] = useState(() => new Date())

  const label = resolvePeriod(range, endMonth, null, now).label

  return (
    <div className="page-stack">
      <PageHeader title="Analytics" subtitle={label} />

      <SegmentedControl
        aria-label="Period length"
        value={range}
        onChange={setRange}
        options={RANGE_OPTIONS}
        className="max-w-md"
      />

      <nav
        aria-label="Analytics sections"
        className="sticky top-0 z-20 -mx-5 -mb-2 border-b bg-background/90 px-5 backdrop-blur-md sm:-mx-6 sm:px-6"
      >
        <ul className="flex gap-1">
          {TABS.map((t) => {
            const active = pathname === t.href
            return (
              <li key={t.href} className="min-w-0 flex-1 sm:flex-none">
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-12 touch-manipulation items-center justify-center px-3 text-sm font-semibold transition-colors select-none sm:px-5",
                    "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
                    active
                      ? "text-primary after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                      : "text-muted-foreground active:text-foreground"
                  )}
                >
                  {t.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {children}
    </div>
  )
}
