"use client"

import { usePathname } from "next/navigation"

import { addMonths, monthKey } from "@/lib/domain"
import { isMonthRoute, monthsAhead } from "@/lib/routes"
import { useUIStore } from "@/lib/ui-store"

/**
 * The app-wide month. One value for every month-based screen, so picking
 * September anywhere shows September everywhere. It's clamped per screen:
 * only Budgets can look one month ahead, so elsewhere it never passes today.
 */
export function useSelectedMonth() {
  const pathname = usePathname()
  const stored = useUIStore((s) => s.month)
  const setStored = useUIStore((s) => s.setMonth)

  const current = monthKey(new Date())
  const maxAhead = monthsAhead(pathname)
  const cap = addMonths(current, maxAhead)
  const month = stored === null ? current : stored > cap ? cap : stored

  return {
    month,
    isCurrent: month === current,
    maxAhead,
    /** False on screens the picker doesn't affect (Accounts, Settings, …). */
    applies: isMonthRoute(pathname),
    setMonth: (m: string) => setStored(m === current ? null : m),
  }
}
