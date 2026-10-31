"use client"

import { MoreVertical, PenLine, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"

import { TransactionIcon } from "@/components/transactions/transaction-icon"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { TransactionDoc } from "@/lib/db"
import { formatTime, friendlyDay, signedMoney } from "@/lib/domain"
import { cn } from "@/lib/utils"

import type { AccountLookup, CategoryLookup } from "../utils"

interface ColumnContext {
  categoryById: CategoryLookup
  accountById: AccountLookup
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

/** Build the transaction table column definitions with row-action context. */
export function createTransactionColumns({
  categoryById,
  accountById,
  onEdit,
  onDelete,
}: ColumnContext): ColumnDef<TransactionDoc>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          <div className="tnum text-sm font-medium">
            {friendlyDay(row.original.date)}
          </div>
          <div className="tnum text-xs text-muted-foreground">
            {formatTime(row.original.date)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="flex max-w-[240px] items-center gap-2">
          <TransactionIcon tx={row.original} />
          <span className="truncate">
            {row.original.description ||
              (row.original.type === "transfer" ? "Transfer" : "Untitled")}
          </span>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => {
        const tx = row.original
        const cat = tx.categoryId ? categoryById.get(tx.categoryId) : undefined
        return (
          <span className="text-sm text-muted-foreground">
            {tx.type === "transfer" ? "—" : (cat?.name ?? "—")}
          </span>
        )
      },
    },
    {
      id: "account",
      header: "Account",
      cell: ({ row }) => {
        const tx = row.original
        const acc = accountById.get(tx.accountId)
        const toAcc = tx.toAccountId
          ? accountById.get(tx.toAccountId)
          : undefined
        return (
          <span className="truncate text-sm text-muted-foreground">
            {acc?.name ?? "—"}
            {toAcc ? ` → ${toAcc.name}` : ""}
          </span>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span
          className={cn(
            "tnum text-right text-sm font-semibold",
            row.original.type === "income" && "text-income"
          )}
        >
          {signedMoney(row.original)}
        </span>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const tx = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label={`Actions for ${tx.description || "transaction"}`}
              >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEdit(tx.id)}>
                <PenLine className="h-4 w-4" aria-hidden="true" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onDelete(tx.id)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
