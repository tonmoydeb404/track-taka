"use client"

import { useMemo } from "react"

import {
  addMonths,
  dayKey,
  daysInMonth,
  monthKey,
  monthLabel,
} from "@/lib/domain"
import { useUIStore } from "@/lib/ui-store"

import { useSelectedMonth } from "./use-selected-month"

const parse = (key: string) => new Date(`${key}T12:00:00`)
const shift = (key: string, days: number) => {
  const d = parse(key)
  d.setDate(d.getDate() + days)
  return dayKey(d)
}

const short = (d: Date, year: boolean) =>
  d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    ...(year && { year: "numeric" }),
  })

/** "3 Oct – 28 Oct 2026", "3 Oct" for one day. */
export function rangeLabel(from: string, to: string): string {
  const a = parse(from)
  const b = parse(to)
  if (from === to) return short(a, true)
  return `${short(a, a.getFullYear() !== b.getFullYear())} – ${short(b, true)}`
}

export interface DateRangeInfo {
  /** Inclusive day keys, "2026-10-03". */
  from: string
  to: string
  /** True when the user picked days; false when it's just the selected month. */
  custom: boolean
  label: string
  /** Month the range ends in; what month-only data (budgets) lines up with. */
  month: string
  /** Whole days covered, from `from` up to today at most. */
  days: number
  inRange: (iso: string) => boolean
  /** The same-length stretch just before. For a month, the month before. */
  prev: {
    from: string
    to: string
    label: string
    inRange: (iso: string) => boolean
  }
  setRange: (range: { from: string; to: string } | null) => void
}

/**
 * The app-wide period. Normally the selected month; once someone picks days
 * in the header's range picker it's exactly those days, on every screen that
 * follows it.
 */
export function useDateRange(): DateRangeInfo {
  const stored = useUIStore((s) => s.range)
  const setRange = useUIStore((s) => s.setRange)
  const { month: selected } = useSelectedMonth()

  return useMemo(() => {
    const custom = stored !== null
    const from = stored?.from ?? `${selected}-01`
    const to =
      stored?.to ??
      `${selected}-${String(daysInMonth(selected)).padStart(2, "0")}`
    const inRange = (iso: string) => {
      const k = dayKey(iso)
      return k >= from && k <= to
    }

    const todayKey = dayKey(new Date())
    const last = to < todayKey ? to : todayKey
    const days = Math.max(
      1,
      Math.round((parse(last).getTime() - parse(from).getTime()) / 86_400_000) +
        1
    )

    let prevFrom: string
    let prevTo: string
    let prevLabel: string
    if (custom) {
      const length =
        Math.round((parse(to).getTime() - parse(from).getTime()) / 86_400_000) +
        1
      prevTo = shift(from, -1)
      prevFrom = shift(prevTo, -(length - 1))
      prevLabel = length === 1 ? "the day before" : `the ${length} days before`
    } else {
      const pm = addMonths(selected, -1)
      prevFrom = `${pm}-01`
      prevTo = `${pm}-${String(daysInMonth(pm)).padStart(2, "0")}`
      prevLabel = monthLabel(pm).split(" ")[0]
    }

    return {
      from,
      to,
      custom,
      label: custom ? rangeLabel(from, to) : monthLabel(selected),
      month: monthKey(parse(to)),
      days,
      inRange,
      prev: {
        from: prevFrom,
        to: prevTo,
        label: prevLabel,
        inRange: (iso: string) => {
          const k = dayKey(iso)
          return k >= prevFrom && k <= prevTo
        },
      },
      setRange,
    }
  }, [stored, selected, setRange])
}
