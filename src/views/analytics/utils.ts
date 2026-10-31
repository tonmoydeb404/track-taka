import { addMonths } from "@/lib/domain"

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

/** A period made of exactly the days someone picked, compared with the same number of days before. */
export function customPeriod(r: {
  from: string
  to: string
  label: string
  days: number
  prev: { label: string }
}): Period {
  return {
    months: monthsBetween(r.from.slice(0, 7), r.to.slice(0, 7)),
    prevMonths: null,
    label: r.label,
    prevLabel: r.prev.label,
    days: r.days,
  }
}

/** Percentage change from `prev` to `cur`, or null when there's nothing to compare with. */
export function pctChange(cur: number, prev: number): number | null {
  return prev > 0 ? ((cur - prev) / prev) * 100 : null
}
