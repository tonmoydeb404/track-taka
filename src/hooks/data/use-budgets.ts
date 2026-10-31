"use client"

import { useCallback, useMemo } from "react"

import { useRxQuery, type BudgetDoc, type QueryResult } from "@/lib/db"
import { budgetStatuses, type MonthKey } from "@/lib/domain"

import { useTransactions } from "./use-transactions"

/** Budgets set for one month. */
export function useBudgets(month: MonthKey): QueryResult<BudgetDoc> {
  return useRxQuery<BudgetDoc>(
    useCallback((db) => db.budgets.find({ selector: { month } }), [month])
  )
}

/** Each budget of the month with how much has been spent against it. */
export function useBudgetProgress(month: MonthKey) {
  const budgets = useBudgets(month)
  const transactions = useTransactions(month)

  const statuses = useMemo(
    () => budgetStatuses(budgets.data, transactions.data, month),
    [budgets.data, transactions.data, month]
  )
  return {
    statuses,
    isLoading: budgets.isLoading || transactions.isLoading,
    error: budgets.error ?? transactions.error,
  }
}
