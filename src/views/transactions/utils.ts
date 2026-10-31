import type { AccountDoc, TransactionDoc } from "@/lib/db"
import { dayKey, friendlyDay, monthKey, type Category } from "@/lib/domain"
import type { SortingState } from "@tanstack/react-table"

import {
  defaultFilters,
  type SortOption,
  type TransactionFilters,
} from "./types"

export type CategoryLookup = Map<string, Category | undefined>
export type AccountLookup = Map<string, AccountDoc | undefined>

/** Apply search, month, type, category, account filters. */
export function filterTransactions(
  transactions: TransactionDoc[],
  filters: TransactionFilters,
  categoryById: CategoryLookup,
  accountById: AccountLookup
): TransactionDoc[] {
  const q = filters.search.trim().toLowerCase()
  const monthTarget = filters.month === "all" ? null : filters.month

  return transactions.filter((tx) => {
    if (monthTarget && monthKey(tx.date) !== monthTarget) return false
    if (filters.type !== "all" && tx.type !== filters.type) return false
    if (filters.category !== "all" && tx.categoryId !== filters.category)
      return false
    if (
      filters.account !== "all" &&
      tx.accountId !== filters.account &&
      tx.toAccountId !== filters.account
    ) {
      return false
    }
    if (q) {
      const cat = tx.categoryId ? categoryById.get(tx.categoryId) : undefined
      const acc = accountById.get(tx.accountId)
      const toAcc = tx.toAccountId ? accountById.get(tx.toAccountId) : undefined
      const haystack = [tx.description, cat?.name, acc?.name, toAcc?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

/** Sort rows per the selected sort option (shared by the table and the mobile list). */
export function sortTransactions(
  rows: TransactionDoc[],
  sort: SortOption
): TransactionDoc[] {
  const byDate = (a: TransactionDoc, b: TransactionDoc) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()

  return [...rows].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return byDate(a, b)
      case "highest":
        return b.amount - a.amount
      case "lowest":
        return a.amount - b.amount
      default:
        return byDate(b, a)
    }
  })
}

/** Map the sort Select option to TanStack sorting state (single-column only). */
export function sortOptionToSorting(sort: SortOption): SortingState {
  switch (sort) {
    case "oldest":
      return [{ id: "date", desc: false }]
    case "highest":
      return [{ id: "amount", desc: true }]
    case "lowest":
      return [{ id: "amount", desc: false }]
    default:
      return [{ id: "date", desc: true }]
  }
}

/** Map TanStack sorting state back to the sort Select option. */
export function sortingToSortOption(sorting: SortingState): SortOption {
  const first = sorting[0]
  if (!first) return "newest"
  if (first.id === "amount") return first.desc ? "highest" : "lowest"
  return first.desc ? "newest" : "oldest"
}

export function isDefaultFilters(filters: TransactionFilters): boolean {
  const d = defaultFilters()
  return (
    filters.search === d.search &&
    filters.month === d.month &&
    filters.type === d.type &&
    filters.category === d.category &&
    filters.account === d.account &&
    filters.sort === d.sort
  )
}

/** Filters narrowing the list beyond the period and type shown in the page header. */
export function activeDetailFilters(filters: TransactionFilters): number {
  const d = defaultFilters()
  return (
    Number(filters.category !== d.category) +
    Number(filters.account !== d.account) +
    Number(filters.sort !== d.sort)
  )
}

/** Spend / receive / transfer totals for a set of transactions. */
export function totalsFor(txs: TransactionDoc[]): {
  spent: number
  received: number
  transferred: number
} {
  let spent = 0
  let received = 0
  let transferred = 0
  for (const tx of txs) {
    if (tx.type === "expense") spent += tx.amount
    else if (tx.type === "income") received += tx.amount
    else transferred += tx.amount
  }
  return { spent, received, transferred }
}

export interface DayGroup {
  key: string
  label: string
  items: TransactionDoc[]
}

/** Group transactions by calendar day, preserving the incoming order. */
export function groupByDay(txs: TransactionDoc[]): DayGroup[] {
  const groups: DayGroup[] = []
  const index = new Map<string, number>()
  for (const tx of txs) {
    const key = dayKey(tx.date)
    let i = index.get(key)
    if (i === undefined) {
      i = groups.length
      index.set(key, i)
      groups.push({ key, label: friendlyDay(tx.date), items: [] })
    }
    groups[i].items.push(tx)
  }
  return groups
}
