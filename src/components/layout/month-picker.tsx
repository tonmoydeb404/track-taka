"use client"

import { MonthSwitcher } from "@/components/common/month-switcher"
import { useSelectedMonth } from "@/hooks"
import { cn } from "@/lib/utils"

/**
 * The app-wide month picker. In the sidebar it's always in the same spot and
 * simply dims on screens it doesn't affect, so the nav never shifts.
 */
export function SidebarMonthPicker() {
  const { month, setMonth, maxAhead, applies } = useSelectedMonth()
  return (
    <div
      className={cn(
        "mb-5 transition-opacity",
        !applies && "pointer-events-none opacity-40"
      )}
      aria-disabled={!applies}
      title={applies ? undefined : "The month doesn't change this screen"}
    >
      <MonthSwitcher
        tone="sidebar"
        fill
        month={month}
        onChange={setMonth}
        maxAhead={maxAhead}
      />
    </div>
  )
}

/** Phones have no sidebar, so the shell shows the same picker once above month-based screens. */
export function MobileMonthBar() {
  const { month, setMonth, maxAhead, applies } = useSelectedMonth()
  if (!applies) return null
  return (
    <div className="mb-4 lg:hidden">
      <MonthSwitcher
        fill
        month={month}
        onChange={setMonth}
        maxAhead={maxAhead}
      />
    </div>
  )
}
