import { dayKey } from "@/lib/domain"

// Account metadata now lives in lib/domain so the account dialog can be
// shared by the accounts view and the quick-entry dialog; re-exported here.
export {
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_LABELS,
  PRESET_COLORS,
} from "@/lib/domain"

/** ISO date for a YYYY-MM-DD input — keeps the current time when it's today. */
export function isoFromDate(dateStr: string): string {
  if (dateStr === dayKey(new Date())) return new Date().toISOString()
  const d = new Date(`${dateStr}T12:00:00`)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}
