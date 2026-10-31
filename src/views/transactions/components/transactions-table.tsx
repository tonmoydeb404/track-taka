"use client"

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TransactionDoc } from "@/lib/db"
import { cn } from "@/lib/utils"

import { createTransactionColumns } from "./transactions-table-columns"
import type { AccountLookup, CategoryLookup } from "../utils"

interface TransactionsTableProps {
  rows: TransactionDoc[]
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  categoryById: CategoryLookup
  accountById: AccountLookup
  onOpenDetail: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

/** Desktop data table of transactions (hidden below md), TanStack-powered. */
export function TransactionsTable({
  rows,
  sorting,
  onSortingChange,
  categoryById,
  accountById,
  onOpenDetail,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  const columns = createTransactionColumns({
    categoryById,
    accountById,
    onEdit,
    onDelete,
  })

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      onSortingChange(next)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="hidden rounded-xl border bg-card shadow-xs md:block">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-left",
                      header.column.id === "amount" && "text-right"
                    )}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          "group inline-flex items-center gap-1 rounded px-1 font-medium hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                          header.column.id === "amount" ? "-mr-1" : "-ml-1"
                        )}
                        aria-label={`Sort by ${String(header.column.columnDef.header)}`}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {sorted === false ? (
                          <ChevronsUpDown
                            className="h-3.5 w-3.5 text-muted-foreground/60 group-hover:text-muted-foreground"
                            aria-hidden="true"
                          />
                        ) : sorted === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowDown
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
              tabIndex={0}
              onClick={() => onOpenDetail(row.original.id)}
              onKeyDown={(e) => {
                if (
                  e.target === e.currentTarget &&
                  (e.key === "Enter" || e.key === " ")
                ) {
                  e.preventDefault()
                  onOpenDetail(row.original.id)
                }
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(cell.column.id === "amount" && "text-right")}
                  onClick={
                    cell.column.id === "actions"
                      ? (e) => e.stopPropagation()
                      : undefined
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
