"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { addMonths, monthKey, monthLabel, monthLabelShort } from "@/lib/domain"
import { cn } from "@/lib/utils"

interface MonthSwitcherProps {
  /** Month key, e.g. "2026-10". */
  month: string
  onChange: (month: string) => void
  /** How many months past the current one you can go (default 0). */
  maxAhead?: number
  /** "sidebar" restyles it for the dark navigation rail. */
  tone?: "default" | "sidebar"
  /** Stretch to the container, label centred and always in full ("October 2026"). */
  fill?: boolean
}

/**
 * Previous / next month control. Forward stops at today unless `maxAhead`
 * allows planning further out.
 */
export function MonthSwitcher({
  month,
  onChange,
  maxAhead = 0,
  tone = "default",
  fill = false,
}: MonthSwitcherProps) {
  const atLimit = month >= addMonths(monthKey(new Date()), maxAhead)
  const sidebar = tone === "sidebar"

  const arrow = cn(
    sidebar &&
      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-35"
  )

  return (
    <div
      className={cn(
        "flex items-center rounded-xl border",
        sidebar
          ? "border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground"
          : "bg-card",
        fill && "w-full"
      )}
      role="group"
      aria-label="Month selection"
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-l-xl rounded-r-none", arrow)}
        aria-label="Previous month"
        onClick={() => onChange(addMonths(month, -1))}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </Button>
      <span
        className={cn(
          "min-w-[4.5rem] text-center text-sm font-semibold tabular-nums sm:min-w-[7.5rem]",
          fill && "flex-1"
        )}
        aria-live="polite"
        aria-label={monthLabel(month)}
      >
        <span className={fill ? "hidden" : "sm:hidden"} aria-hidden="true">
          {monthLabelShort(month)}
        </span>
        <span
          className={fill ? "inline" : "hidden sm:inline"}
          aria-hidden="true"
        >
          {monthLabel(month)}
        </span>
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-l-none rounded-r-xl", arrow)}
        aria-label={atLimit ? "No later months" : "Next month"}
        disabled={atLimit}
        onClick={() => onChange(addMonths(month, 1))}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
