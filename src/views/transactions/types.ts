import { monthKey } from "@/lib/domain"

/** "all", or a month key such as "2026-10". */
export type PeriodFilter = string
export type TypeFilter = "all" | "expense" | "income" | "transfer"
export type SortOption = "newest" | "oldest" | "highest" | "lowest"

export interface TransactionFilters {
  search: string
  month: PeriodFilter
  type: TypeFilter
  category: string
  account: string
  sort: SortOption
}

/** Fresh defaults: the current month, nothing else narrowed. Built per call so the month never goes stale. */
export function defaultFilters(): TransactionFilters {
  return {
    search: "",
    month: monthKey(new Date()),
    type: "all",
    category: "all",
    account: "all",
    sort: "newest",
  }
}
