"use client"

import { useState } from "react"
import {
  CalendarRange,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react"

import { SegmentedControl } from "@/components/common/segmented-control"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { AccountDoc } from "@/lib/db"
import { monthKey, type Category } from "@/lib/domain"
import { cn } from "@/lib/utils"

import { defaultFilters, type TransactionFilters } from "../types"
import { activeDetailFilters } from "../utils"

interface TransactionsFilterBarProps {
  filters: TransactionFilters
  onFilterChange: <K extends keyof TransactionFilters>(
    key: K,
    value: TransactionFilters[K]
  ) => void
  onReset: () => void
  categories: readonly Category[]
  accounts: AccountDoc[]
  resultCount: number
}

const TYPE_OPTIONS: { value: TransactionFilters["type"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "expense", label: "Expenses" },
  { value: "income", label: "Income" },
  { value: "transfer", label: "Transfers" },
]

const SORT_LABELS: Record<TransactionFilters["sort"], string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  highest: "Highest amount",
  lowest: "Lowest amount",
}

/**
 * Search and filters. Period lives in the page header, so what's left is:
 * phone: search, a Filters sheet, a type switch and removable chips for
 * whatever is applied; lg and up: everything in one toolbar row.
 */
export function TransactionsFilterBar(props: TransactionsFilterBarProps) {
  const {
    filters,
    onFilterChange,
    onReset,
    resultCount,
    categories,
    accounts,
  } = props
  const [sheetOpen, setSheetOpen] = useState(false)
  const detailCount = activeDetailFilters(filters)
  const d = defaultFilters()

  const chips: { key: string; label: string; clear: () => void }[] = []
  if (filters.category !== d.category) {
    chips.push({
      key: "category",
      label:
        categories.find((c) => c.id === filters.category)?.name ?? "Category",
      clear: () => onFilterChange("category", d.category),
    })
  }
  if (filters.account !== d.account) {
    chips.push({
      key: "account",
      label: accounts.find((a) => a.id === filters.account)?.name ?? "Account",
      clear: () => onFilterChange("account", d.account),
    })
  }
  if (filters.sort !== d.sort) {
    chips.push({
      key: "sort",
      label: SORT_LABELS[filters.sort],
      clear: () => onFilterChange("sort", d.sort),
    })
  }

  const search = (
    <div className="relative min-w-0 flex-1">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
        placeholder="Search transactions"
        className="pl-9"
        aria-label="Search transactions"
        type="search"
        enterKeyHint="search"
      />
    </div>
  )

  return (
    <>
      {/* Phone / tablet */}
      <div className="flex flex-col gap-4 lg:hidden">
        <div className="flex items-center gap-2">
          {search}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSheetOpen(true)}
            aria-label={
              detailCount > 0 ? `Filters, ${detailCount} applied` : "Filters"
            }
            className="relative shrink-0"
          >
            <SlidersHorizontal aria-hidden="true" />
            {detailCount > 0 ? (
              <span
                className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground"
                aria-hidden="true"
              >
                {detailCount}
              </span>
            ) : null}
          </Button>
        </div>

        <SegmentedControl
          aria-label="Transaction type"
          value={filters.type}
          onChange={(v) => onFilterChange("type", v)}
          options={TYPE_OPTIONS}
        />

        {chips.length > 0 ? (
          <ul
            className="-mx-5 flex scrollbar-none gap-2 overflow-x-auto px-5 sm:-mx-6 sm:px-6"
            aria-label="Applied filters"
          >
            {chips.map((c) => (
              <li key={c.key} className="shrink-0">
                <button
                  type="button"
                  onClick={c.clear}
                  aria-label={`Remove filter: ${c.label}`}
                  className="flex h-8 touch-manipulation items-center gap-1 rounded-full bg-accent pr-2 pl-3 text-sm font-medium text-accent-foreground active:scale-95"
                >
                  {c.label}
                  <X className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <ResponsiveDialog open={sheetOpen} onOpenChange={setSheetOpen}>
          <ResponsiveDialogContent
            dialogClassName="sm:max-w-md"
            sheetClassName="sm:max-w-md"
          >
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Filters</ResponsiveDialogTitle>
              <ResponsiveDialogDescription className="sr-only">
                Narrow the list by category and account, change the sort order,
                or show every month.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
            <ResponsiveDialogBody className="flex flex-col gap-4">
              <Field label="Category">
                <CategorySelect {...props} stack />
              </Field>
              <Field label="Account">
                <AccountSelect {...props} stack />
              </Field>
              <Field label="Sort by">
                <SortSelect {...props} stack />
              </Field>
              <label className="flex items-center justify-between gap-4 rounded-xl border bg-card p-3">
                <span>
                  <span className="block text-sm font-medium">All time</span>
                  <span className="block text-sm text-muted-foreground">
                    Show every month, not just the one in the header.
                  </span>
                </span>
                <Switch
                  checked={filters.month === "all"}
                  onCheckedChange={(on) =>
                    onFilterChange("month", on ? "all" : monthKey(new Date()))
                  }
                />
              </label>
            </ResponsiveDialogBody>
            <ResponsiveDialogFooter>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={onReset}
              >
                <RotateCcw aria-hidden="true" />
                Reset all
              </Button>
              <Button
                className="flex-1 sm:flex-none"
                onClick={() => setSheetOpen(false)}
              >
                Show {resultCount} {resultCount === 1 ? "result" : "results"}
              </Button>
            </ResponsiveDialogFooter>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      </div>

      {/* Desktop */}
      <div
        className="hidden items-center gap-2 lg:flex"
        role="search"
        aria-label="Transaction filters"
      >
        <div className="max-w-sm min-w-56 flex-1">{search}</div>
        <TypeSelect {...props} />
        <CategorySelect {...props} />
        <AccountSelect {...props} />
        <SortSelect {...props} />
        <Button
          variant="outline"
          aria-pressed={filters.month === "all"}
          onClick={() =>
            onFilterChange(
              "month",
              filters.month === "all" ? monthKey(new Date()) : "all"
            )
          }
          className={cn(
            filters.month === "all" &&
              "border-primary bg-accent text-accent-foreground"
          )}
        >
          <CalendarRange aria-hidden="true" />
          All time
        </Button>
        {!isDefault(filters) ? (
          <Button variant="ghost" onClick={onReset}>
            <RotateCcw aria-hidden="true" />
            Reset
          </Button>
        ) : null}
      </div>
    </>
  )
}

function isDefault(f: TransactionFilters) {
  const d = defaultFilters()
  return (
    f.search === d.search &&
    f.month !== "all" &&
    f.type === d.type &&
    f.category === d.category &&
    f.account === d.account &&
    f.sort === d.sort
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  )
}

type SelectProps = TransactionsFilterBarProps & { stack?: boolean }

function TypeSelect({ filters, onFilterChange }: SelectProps) {
  return (
    <Select
      value={filters.type}
      onValueChange={(v) =>
        onFilterChange("type", v as TransactionFilters["type"])
      }
    >
      <SelectTrigger className="w-[130px]" aria-label="Filter by type">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All types</SelectItem>
        <SelectItem value="expense">Expenses</SelectItem>
        <SelectItem value="income">Income</SelectItem>
        <SelectItem value="transfer">Transfers</SelectItem>
      </SelectContent>
    </Select>
  )
}

function CategorySelect({
  filters,
  onFilterChange,
  categories,
  stack,
}: SelectProps) {
  return (
    <Select
      value={filters.category}
      onValueChange={(v) => onFilterChange("category", v)}
    >
      <SelectTrigger
        className={stack ? "w-full" : "w-[160px]"}
        aria-label="Filter by category"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-72 overflow-y-auto">
        <SelectItem value="all">All categories</SelectItem>
        {categories.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function AccountSelect({
  filters,
  onFilterChange,
  accounts,
  stack,
}: SelectProps) {
  return (
    <Select
      value={filters.account}
      onValueChange={(v) => onFilterChange("account", v)}
    >
      <SelectTrigger
        className={stack ? "w-full" : "w-[150px]"}
        aria-label="Filter by account"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All accounts</SelectItem>
        {accounts.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {a.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SortSelect({ filters, onFilterChange, stack }: SelectProps) {
  return (
    <Select
      value={filters.sort}
      onValueChange={(v) =>
        onFilterChange("sort", v as TransactionFilters["sort"])
      }
    >
      <SelectTrigger
        className={stack ? "w-full" : "w-[160px]"}
        aria-label="Sort transactions"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
