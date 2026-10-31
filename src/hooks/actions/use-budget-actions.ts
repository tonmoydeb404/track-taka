"use client"

import { useMemo } from "react"

import { useDatabase, type BudgetDoc } from "@/lib/db"
import { getCategory, isMonthKey } from "@/lib/domain"

export function useBudgetActions() {
  const db = useDatabase()

  return useMemo(() => {
    const requireDb = () => {
      if (!db) throw new Error("The database is still opening")
      return db
    }

    return {
      /** Create the budget for a category and month, or change its limit. */
      async set(
        categoryId: string,
        month: string,
        limit: number
      ): Promise<void> {
        if (getCategory(categoryId)?.kind !== "expense") {
          throw new Error("Budgets are for expense categories")
        }
        if (!isMonthKey(month)) throw new Error("Invalid month")
        if (!Number.isInteger(limit) || limit < 1) {
          throw new Error("Limit must be greater than zero")
        }
        await requireDb().budgets.upsert({
          categoryId,
          month,
          limit,
          updatedAt: new Date().toISOString(),
        } as BudgetDoc)
      },

      async remove(categoryId: string, month: string): Promise<void> {
        const doc = await requireDb()
          .budgets.findOne(`${categoryId}|${month}`)
          .exec()
        await doc?.remove()
      },
    }
  }, [db])
}
