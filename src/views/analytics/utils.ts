import { addMonths, monthKey, monthLabel, monthLabelShort } from "@/lib/domain"

export type RangeKey = "month" | "3m" | "year" | "all"

export const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: "month", label: "Month" },
  { value: "3m", label: "3 months" },
  { value: "year", label: "Year" },
  { value: "all", label: "All" },
]

/** All 'YYYY-MM' keys from start to end inclusive. */
export function monthsBetween(startMonth: string, endMonth: string): string[] {
  const arr: string[] = []
  let m = startMonth
  while (m <= endMonth) {
    arr.push(m)
    m = addMonths(m, 1)
  }
  return arr
}

export interface Period {
  range: RangeKey
  months: string[]
  /** The equally long stretch just before (or the same stretch a year earlier). null for "all". */
  prevMonths: string[] | null
  /** "October 2026", "Aug – Oct 2026", "All time". */
  label: string
  /** "September", "May – Jul 2026", "the same months last year". */
  prevLabel: string | null
  /** Days the period covers so far (today caps the current month). */
  days: number
}

/**
 * Turn a range and an end month into the months it covers, the period to
 * compare it with, and how many days it spans.
 */
export function resolvePeriod(
  range: RangeKey,
  endMonth: string,
  earliestMonth: string | null,
  now: Date
): Period {
  let months: string[]
  let prevMonths: string[] | null = null
  let label: string
  let prevLabel: string | null = null

  switch (range) {
    case "month":
      months = [endMonth]
      prevMonths = [addMonths(endMonth, -1)]
      label = monthLabel(endMonth)
      prevLabel = monthLabel(prevMonths[0]).split(" ")[0]
      break
    case "3m":
      months = monthsBetween(addMonths(endMonth, -2), endMonth)
      prevMonths = monthsBetween(
        addMonths(endMonth, -5),
        addMonths(endMonth, -3)
      )
      label = `${monthLabelShort(months[0]).split(" ")[0]} – ${monthLabelShort(endMonth)}`
      prevLabel = "the 3 months before"
      break
    case "year": {
      const year = endMonth.slice(0, 4)
      months = monthsBetween(`${year}-01`, endMonth)
      prevMonths = months.map((m) => addMonths(m, -12))
      label = `Jan – ${monthLabelShort(endMonth)}`
      prevLabel = "the same months last year"
      break
    }
    default: {
      const current = monthKey(now)
      months = monthsBetween(earliestMonth ?? current, current)
      label = "All time"
    }
  }

  // Days covered: from the 1st of the first month to the end of the last, but never past today
  const [fy, fm] = months[0].split("-").map(Number)
  const [ly, lm] = months[months.length - 1].split("-").map(Number)
  const start = new Date(fy, fm - 1, 1)
  const endOfLast = new Date(ly, lm, 0)
  const end =
    endOfLast > now
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
      : endOfLast
  const days = Math.max(
    1,
    Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1
  )

  return { range, months, prevMonths, label, prevLabel, days }
}

/** Percentage change from `prev` to `cur`, or null when there's nothing to compare with. */
export function pctChange(cur: number, prev: number): number | null {
  return prev > 0 ? ((cur - prev) / prev) * 100 : null
}
