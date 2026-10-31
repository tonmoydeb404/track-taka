import type { AccountType } from "@/lib/db"
import { dayKey } from "@/lib/domain"

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: "Cash",
  mobile: "Mobile money",
  bank: "Bank",
  card: "Card",
}

export const ACCOUNT_TYPES: AccountType[] = ["cash", "mobile", "bank", "card"]

export const PRESET_COLORS = [
  "#0d9488",
  "#e2136e",
  "#f6821f",
  "#57534e",
  "#65a30d",
  "#be123c",
]

/** ISO date for a YYYY-MM-DD input — keeps the current time when it's today. */
export function isoFromDate(dateStr: string): string {
  if (dateStr === dayKey(new Date())) return new Date().toISOString()
  const d = new Date(`${dateStr}T12:00:00`)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}
