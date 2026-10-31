// Dates are stored as ISO strings and shown in the user's local time.

/** 'YYYY-MM' */
export type MonthKey = string

const pad = (n: number) => String(n).padStart(2, "0")

export function monthKey(d: Date | string): MonthKey {
  const dt = typeof d === "string" ? new Date(d) : d
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}`
}

export function dayKey(d: Date | string): string {
  const dt = typeof d === "string" ? new Date(d) : d
  return `${monthKey(dt)}-${pad(dt.getDate())}`
}

export function isMonthKey(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value)
}

export function addMonths(month: MonthKey, delta: number): MonthKey {
  const [y, m] = month.split("-").map(Number)
  return monthKey(new Date(y, m - 1 + delta, 1))
}

/** 'October 2026' */
export function monthLabel(month: MonthKey): string {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

/** Half-open ISO range [start, end) covering a local calendar month. */
export function monthRange(month: MonthKey): { start: string; end: string } {
  const [y, m] = month.split("-").map(Number)
  return {
    start: new Date(y, m - 1, 1).toISOString(),
    end: new Date(y, m, 1).toISOString(),
  }
}

export function daysInMonth(month: MonthKey): number {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m, 0).getDate()
}

/** 'Oct 2026' */
export function monthLabelShort(month: MonthKey): string {
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

export function isSameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b)
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`
}

/** "Today", "Yesterday", or "12 Mar" */
export function friendlyDay(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (isSameDay(d, today)) return "Today"
  if (isSameDay(d, yesterday)) return "Yesterday"
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" })
}
