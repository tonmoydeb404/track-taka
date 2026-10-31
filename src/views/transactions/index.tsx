"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { SortingState } from "@tanstack/react-table"
import { CalendarRange, Inbox, Plus, RotateCcw, SearchX, X } from "lucide-react"

import { EmptyState } from "@/components/common/empty-state"
import { PageHeader } from "@/components/common/page-header"
import { useDeleteTransaction } from "@/components/transactions"
import {
  useAccountLookup,
  useAccounts,
  useDateRange,
  useModalParam,
  useQuickEntryParams,
  useSearchQueries,
  useSelectedMonth,
  useTransactions,
} from "@/hooks"
import { Button } from "@/components/ui/button"
import { CATEGORIES, formatMoney, monthKey } from "@/lib/domain"
import { cn } from "@/lib/utils"

import { TransactionsFilterBar } from "./components/transactions-filter-bar"
import { TransactionsMobileList } from "./components/transactions-mobile-list"
import { TransactionsTable } from "./components/transactions-table"
import {
  defaultFilters,
  type TransactionFilters,
  type TypeFilter,
} from "./types"
import {
  filterTransactions,
  groupByDay,
  sortOptionToSorting,
  sortTransactions,
  sortingToSortOption,
  totalsFor,
} from "./utils"

/** Rows rendered at first, and added each time the end of the list is reached. */
const PAGE_SIZE = 40

const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]))

/**
 * Transaction history. The period (a month, or all time) is chosen in the
 * header like everywhere else in the app. Below it: totals for what's shown,
 * search and filters, then a swipeable day-grouped list on phones or a
 * sortable table on desktop.
 */
export function TransactionsPage() {
  const quickEntry = useQuickEntryParams()
  const detail = useModalParam("tx")
  const requestDelete = useDeleteTransaction()

  // Links from Analytics arrive as ?category=…&month=2026-10&type=expense
  const params = useSearchQueries()
  const [filters, setFilters] = useState<TransactionFilters>(() => {
    const f = defaultFilters()
    const month = params.get("month")
    const type = params.get("type")
    const category = params.get("category")
    const account = params.get("account")
    if (month === "all") f.month = "all"
    if (type === "expense" || type === "income" || type === "transfer")
      f.type = type as TypeFilter
    if (category) f.category = category
    if (account) f.account = account
    return f
  })
  const [limit, setLimit] = useState(PAGE_SIZE)

  // The month is app-wide (see the picker in the sidebar); this screen only
  // adds an "All time" switch on top. A link from Analytics can name a month.
  const { month: sharedMonth, setMonth: setSharedMonth } = useSelectedMonth()
  useEffect(() => {
    const m = params.get("month")
    if (m && /^\d{4}-\d{2}$/.test(m)) setSharedMonth(m)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Any filter change starts the list over from the top
  const setFilter = <K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K]
  ) => {
    // Anything but "all" means "follow the shared month"
    const next =
      key === "month" && value !== "all"
        ? (defaultFilters().month as TransactionFilters[K])
        : value
    setFilters((f) => ({ ...f, [key]: next }))
    setLimit(PAGE_SIZE)
  }
  const resetFilters = () => {
    setFilters(defaultFilters())
    setLimit(PAGE_SIZE)
  }

  const allTime = filters.month === "all"
  // Days picked in the header's range picker replace the month
  const dr = useDateRange()
  const ranged = dr.custom && !allTime
  const txQuery = useTransactions(allTime || ranged ? "all" : sharedMonth)
  const transactions = useMemo(
    () =>
      ranged ? txQuery.data.filter((t) => dr.inRange(t.date)) : txQuery.data,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [txQuery.data, ranged, dr.from, dr.to]
  )
  const accountsQuery = useAccounts({ includeArchived: true })
  const accounts = accountsQuery.data
  const accountById = useAccountLookup()
  const view: TransactionFilters = {
    ...filters,
    month: allTime || ranged ? "all" : sharedMonth,
  }
  const narrowed =
    filters.search.trim() !== "" ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.account !== "all"

  const categoryById = CATEGORY_BY_ID

  const filtered = useMemo(
    () => filterTransactions(transactions, view, categoryById, accountById),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, filters, sharedMonth, ranged, categoryById, accountById]
  )
  const sorted = useMemo(
    () => sortTransactions(filtered, filters.sort),
    [filtered, filters.sort]
  )
  const totals = useMemo(() => totalsFor(filtered), [filtered])

  // Slice after sorting so the list grows in the order you see
  const visible = useMemo(() => sorted.slice(0, limit), [sorted, limit])
  const mobileGroups = useMemo(() => groupByDay(visible), [visible])
  const remaining = sorted.length - visible.length

  // Load the next page as the end of the list scrolls into view
  const sentinel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = sentinel.current
    if (!el || remaining <= 0) return
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setLimit((l) => l + PAGE_SIZE),
      { rootMargin: "400px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [remaining, visible.length])

  // Sorting state mirrors the sort select so header clicks and the select stay in sync
  const sorting: SortingState = useMemo(
    () => sortOptionToSorting(filters.sort),
    [filters.sort]
  )
  const handleSortingChange = (next: SortingState) =>
    setFilter("sort", sortingToSortOption(next))

  const handleDeleteById = (id: string) => {
    const tx = transactions.find((t) => t.id === id)
    if (tx) void requestDelete(tx)
  }

  const subtitle = `${filtered.length} ${filtered.length === 1 ? "transaction" : "transactions"} · ${allTime ? "all time" : dr.label}`

  const header = (
    <PageHeader
      title="Transactions"
      subtitle={subtitle}
      actions={
        <>
          {allTime ? (
            <Button
              variant="outline"
              onClick={() => setFilter("month", monthKey(new Date()))}
              aria-label="All time. Switch back to a single month"
            >
              <CalendarRange aria-hidden="true" />
              All time
              <X className="text-muted-foreground" aria-hidden="true" />
            </Button>
          ) : null}
          <Button
            className="max-md:hidden"
            onClick={() => quickEntry.openAdd("expense")}
          >
            <Plus aria-hidden="true" />
            Add
          </Button>
        </>
      }
    />
  )

  const filterBar = (
    <TransactionsFilterBar
      filters={filters}
      onFilterChange={setFilter}
      onReset={resetFilters}
      categories={CATEGORIES}
      accounts={accounts}
      resultCount={filtered.length}
    />
  )

  if (txQuery.isLoading) {
    return (
      <div className="page-stack">
        {header}
        <p className="text-sm text-muted-foreground" role="status">
          Loading transactions…
        </p>
      </div>
    )
  }

  if (allTime && transactions.length === 0) {
    return (
      <div className="page-stack">
        {header}
        <EmptyState
          icon={Inbox}
          title="No transactions yet"
          description="Track your first expense or income to start building your history."
          action={
            <Button onClick={() => quickEntry.openAdd("expense")}>
              <Plus aria-hidden="true" />
              Add transaction
            </Button>
          }
        />
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="page-stack">
        {header}
        {filterBar}
        {narrowed ? (
          <EmptyState
            icon={SearchX}
            title="No matching transactions"
            description="Try a different search or loosen a filter."
            action={
              <Button variant="outline" onClick={resetFilters}>
                <RotateCcw aria-hidden="true" />
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={Inbox}
            title={`Nothing in ${dr.label}`}
            description="No transactions were recorded in this period."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={() => quickEntry.openAdd("expense")}>
                  <Plus aria-hidden="true" />
                  Add transaction
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFilter("month", "all")}
                >
                  Show all time
                </Button>
              </div>
            }
          />
        )}
      </div>
    )
  }

  const net = totals.received - totals.spent

  return (
    <div className="page-stack">
      {header}

      {/* Phone: one quiet line. md+: the full strip. */}
      <p className="tnum -mt-3 text-sm text-muted-foreground md:hidden">
        <span className="font-semibold text-expense">
          −{formatMoney(totals.spent)}
        </span>{" "}
        spent ·{" "}
        <span className="font-semibold text-income">
          +{formatMoney(totals.received)}
        </span>{" "}
        received
      </p>
      <dl
        className="hidden grid-cols-4 divide-x rounded-xl border bg-card shadow-xs md:grid"
        aria-label="Totals for the transactions shown"
      >
        <Stat label="Spent" value={formatMoney(totals.spent)} tone="expense" />
        <Stat
          label="Received"
          value={formatMoney(totals.received)}
          tone="income"
        />
        <Stat
          label="Net"
          value={`${net < 0 ? "−" : net > 0 ? "+" : ""}${formatMoney(Math.abs(net))}`}
        />
        <Stat label="Moved" value={formatMoney(totals.transferred)} />
      </dl>

      {filterBar}

      <TransactionsTable
        rows={visible}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        categoryById={categoryById}
        accountById={accountById}
        onOpenDetail={detail.open}
        onEdit={quickEntry.openEdit}
        onDelete={handleDeleteById}
      />
      <TransactionsMobileList groups={mobileGroups} />

      {remaining > 0 ? (
        <div ref={sentinel} className="flex flex-col items-center gap-2 py-2">
          <p className="tnum text-sm text-muted-foreground">
            Showing {visible.length} of {sorted.length}
          </p>
          <Button
            variant="outline"
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
          >
            Show {Math.min(PAGE_SIZE, remaining)} more
          </Button>
        </div>
      ) : sorted.length > PAGE_SIZE ? (
        <p className="tnum py-2 text-center text-sm text-muted-foreground">
          All {sorted.length} shown
        </p>
      ) : null}
    </div>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: "income" | "expense"
}) {
  return (
    <div className="min-w-0 px-4 py-3 lg:px-5 lg:py-4">
      <dt className="truncate text-sm text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "tnum mt-0.5 truncate text-lg font-bold lg:text-xl",
          tone === "income" && "text-income",
          tone === "expense" && "text-expense"
        )}
      >
        {value}
      </dd>
    </div>
  )
}
