"use client"

import { useCallback, useMemo } from "react"

import { useRxQuery, type AccountDoc, type QueryResult } from "@/lib/db"
import { accountBalances, totalBalance } from "@/lib/domain"

import { useTransactions } from "./use-transactions"

/** Live accounts, oldest first. Archived ones are left out unless asked for. */
export function useAccounts(opts?: {
  includeArchived?: boolean
}): QueryResult<AccountDoc> {
  const includeArchived = opts?.includeArchived ?? false
  return useRxQuery<AccountDoc>(
    useCallback(
      (db) =>
        db.accounts.find({
          selector: includeArchived ? {} : { archived: false },
          sort: [{ createdAt: "asc" }],
        }),
      [includeArchived]
    )
  )
}

/**
 * Current balance of every account (archived included), derived from the
 * opening balance and all transactions, so it can never drift.
 */
export function useAccountBalances() {
  const accounts = useAccounts({ includeArchived: true })
  const transactions = useTransactions("all")

  const balances = useMemo(
    () => accountBalances(accounts.data, transactions.data),
    [accounts.data, transactions.data]
  )
  const total = useMemo(() => {
    const active = new Map(
      accounts.data
        .filter((a) => !a.archived)
        .map((a) => [a.id, balances.get(a.id) ?? 0])
    )
    return totalBalance(active)
  }, [accounts.data, balances])

  return {
    /** Balance by account id. */
    balances,
    /** Sum over accounts that are not archived. */
    total,
    isLoading: accounts.isLoading || transactions.isLoading,
    error: accounts.error ?? transactions.error,
  }
}
