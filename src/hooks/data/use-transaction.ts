"use client"

import { useCallback } from "react"

import { useRxQuery, type TransactionDoc } from "@/lib/db"

/** One transaction by id (null id → nothing). `isLoading` until first result. */
export function useTransaction(id: string | null): {
  transaction: TransactionDoc | null
  isLoading: boolean
} {
  const { data, isLoading } = useRxQuery<TransactionDoc>(
    useCallback((db) => (id ? db.transactions.findOne(id) : null), [id])
  )
  return {
    transaction: id ? (data[0] ?? null) : null,
    isLoading: !!id && isLoading,
  }
}
