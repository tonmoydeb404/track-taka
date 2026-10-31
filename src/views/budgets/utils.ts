import {
  CircleCheck,
  CircleX,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import { monthKey, type BudgetStatus } from "@/lib/domain"

export type { BudgetStatus }

/** Icon + text per budget state so state is never conveyed by color alone. */
export const STATE_META: Record<
  BudgetStatus["state"],
  { Icon: LucideIcon; className: string }
> = {
  normal: { Icon: CircleCheck, className: "text-muted-foreground" },
  warning: { Icon: TriangleAlert, className: "text-warning" },
  over: { Icon: CircleX, className: "text-expense" },
}

/** Days left in the month, today included. null unless `month` is the current one. */
export function daysLeftInMonth(month: string, now: Date): number | null {
  if (monthKey(now) !== month) return null
  const [y, m] = month.split("-").map(Number)
  return new Date(y, m, 0).getDate() - now.getDate() + 1
}

/** First word of a month label: "September". */
export function monthName(label: string): string {
  return label.split(" ")[0]
}
