"use client"

import { usePathname } from "next/navigation"
import { CalendarRange } from "lucide-react"

import {
  DateRangePicker,
  type RangePreset,
} from "@/components/common/date-range-picker"
import { Button } from "@/components/ui/button"
import { useDateRange } from "@/hooks"
import { addMonths, dayKey, monthKey } from "@/lib/domain"
import { isRangeRoute } from "@/lib/routes"

const parse = (key: string) => new Date(`${key}T12:00:00`)

const PRESETS: RangePreset[] = [
  {
    label: "This month",
    range: () => {
      const now = new Date()
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now }
    },
  },
  {
    label: "Last month",
    range: () => {
      const now = new Date()
      return {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        to: new Date(now.getFullYear(), now.getMonth(), 0),
      }
    },
  },
  {
    label: "Last 30 days",
    range: () => {
      const now = new Date()
      const from = new Date(now)
      from.setDate(from.getDate() - 29)
      return { from, to: now }
    },
  },
  {
    label: "Last 3 months",
    range: () => {
      const now = new Date()
      return {
        from: parse(`${addMonths(monthKey(now), -2)}-01`),
        to: now,
      }
    },
  },
  {
    label: "This year",
    range: () => {
      const now = new Date()
      return { from: new Date(now.getFullYear(), 0, 1), to: now }
    },
  },
]

/**
 * Icon button beside the page title that opens the app-wide date range.
 * Renders nothing on screens the range doesn't affect.
 */
export function DateRangeButton() {
  const pathname = usePathname()
  const { from, to, custom, label, setRange } = useDateRange()
  if (!isRangeRoute(pathname)) return null

  return (
    <DateRangePicker
      max={new Date()}
      value={{ from: parse(from), to: parse(to) }}
      onChange={(r) => setRange({ from: dayKey(r.from), to: dayKey(r.to) })}
      onReset={custom ? () => setRange(null) : undefined}
      resetLabel="Back to month"
      presets={PRESETS}
      trigger={
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative shrink-0"
          aria-label={`Date range: ${label}`}
          title={label}
        >
          <CalendarRange aria-hidden="true" />
          {custom ? (
            <span
              className="absolute -top-1 -right-1 size-2.5 rounded-full bg-primary ring-2 ring-background"
              aria-hidden="true"
            />
          ) : null}
        </Button>
      }
    />
  )
}
