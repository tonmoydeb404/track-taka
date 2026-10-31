"use client"

import { useCallback } from "react"

import { useRxQuery, type QueryResult, type TransactionDoc } from "@/lib/db"
import { monthRange, type MonthKey } from "@/lib/domain"

/**
 * Live transactions, newest first. Pass a month to load just that month, or
 * "all" for the whole history. Filtering by type, account or category is done
 * by the caller on the returned rows.
 */
export function useTransactions(
  period: MonthKey | "all"
): QueryResult<TransactionDoc> {
  return useRxQuery<TransactionDoc>(
    useCallback(
      (db) => {
        if (period === "all") {
          return db.transactions.find({ sort: [{ date: "desc" }] })
        }
        const { start, end } = monthRange(period)
        return db.transactions.find({
          selector: { date: { $gte: start, $lt: end } },
          sort: [{ date: "desc" }],
        })
      },
      [period]
    )
  )
}
