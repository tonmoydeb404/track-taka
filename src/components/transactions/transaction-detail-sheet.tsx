"use client"

import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  PenLine,
  Trash2,
} from "lucide-react"

import { AccountIcon } from "@/components/common/account-icon"
import { CategoryIcon } from "@/components/common/category-icon"
import { TransactionTypeBadge } from "@/components/transactions/transaction-type-badge"
import { useDeleteTransaction } from "@/components/transactions/use-delete-transaction"
import { Button } from "@/components/ui/button"
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
  useAccountLookup,
  useModalParam,
  useQuickEntryParams,
  useTransaction,
} from "@/hooks"
import { formatDateTime, getCategory, signedMoney } from "@/lib/domain"
import { cn } from "@/lib/utils"

function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium">{children}</dd>
    </div>
  )
}

/**
 * Global bottom sheet with full transaction details. Mounted once by the app
 * shell; the open transaction id lives in the URL as `?tx=<id>`, so the back
 * button closes it and any transaction can be deep-linked.
 */
export function TransactionDetailSheet() {
  const accounts = useAccountLookup()
  const detail = useModalParam("tx")
  const quickEntry = useQuickEntryParams()

  const requestDelete = useDeleteTransaction()

  const { transaction: tx } = useTransaction(detail.value)

  const category = tx ? getCategory(tx.categoryId) : undefined
  const account = tx ? accounts.get(tx.accountId) : undefined
  const toAccount = tx?.toAccountId ? accounts.get(tx.toAccountId) : undefined

  const handleDelete = async () => {
    if (!tx) return
    if (await requestDelete(tx)) detail.close()
  }

  if (!tx) {
    return (
      <ResponsiveDialog
        open={false}
        onOpenChange={(open) => !open && detail.close()}
      >
        <span className="sr-only">Transaction details</span>
      </ResponsiveDialog>
    )
  }

  const amountColor =
    tx.type === "income"
      ? "text-income"
      : tx.type === "expense"
        ? "text-expense"
        : "text-foreground"
  const AmountIcon =
    tx.type === "income"
      ? ArrowUpRight
      : tx.type === "expense"
        ? ArrowDownLeft
        : ArrowLeftRight

  return (
    // `isOpen` (not the lingering value) drives the sheet, so a URL close
    // really closes it — the lingering tx keeps the content during the exit
    // animation.
    <ResponsiveDialog
      open={detail.isOpen}
      onOpenChange={(open) => !open && detail.close()}
    >
      <ResponsiveDialogContent
        dialogClassName="sm:max-w-md"
        sheetClassName="sm:max-w-md"
      >
        <ResponsiveDialogHeader className="border-b">
          <ResponsiveDialogTitle className="text-base">
            Transaction
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="sr-only">
            Details for this transaction, with edit and delete actions.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody>
          {/* Amount */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "tnum flex items-center gap-1 text-2xl font-semibold",
                amountColor
              )}
            >
              <AmountIcon className="h-5 w-5" aria-hidden="true" />
              {signedMoney(tx)}
            </span>
            <TransactionTypeBadge type={tx.type} />
          </div>

          <p className="mt-1.5 text-sm text-foreground">
            {tx.description || (
              <span className="text-muted-foreground">No description</span>
            )}
          </p>

          {/* Details */}
          <dl className="mt-4 divide-y rounded-xl border bg-card px-4">
            <DetailRow label="Type">
              <TransactionTypeBadge type={tx.type} />
            </DetailRow>
            <DetailRow label="Date">
              <span className="tnum">{formatDateTime(tx.date)}</span>
            </DetailRow>
            <DetailRow label="Category">
              {tx.type === "transfer" || !category ? (
                <span className="text-muted-foreground">—</span>
              ) : (
                <span className="inline-flex items-center justify-end gap-2">
                  <span className="truncate">{category.name}</span>
                  <CategoryIcon
                    icon={category.icon}
                    color={category.color}
                    size={13}
                  />
                </span>
              )}
            </DetailRow>
            <DetailRow label="Account">
              {account ? (
                <span className="inline-flex items-center justify-end gap-2">
                  <span className="truncate">{account.name}</span>
                  <AccountIcon
                    type={account.type}
                    color={account.color}
                    size={13}
                  />
                </span>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </DetailRow>
            {tx.type === "transfer" ? (
              <DetailRow label="To account">
                {toAccount ? (
                  <span className="inline-flex items-center justify-end gap-2">
                    <span className="truncate">{toAccount.name}</span>
                    <AccountIcon
                      type={toAccount.type}
                      color={toAccount.color}
                      size={13}
                    />
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </DetailRow>
            ) : null}
            <DetailRow label="Storage">
              <span className="text-xs text-muted-foreground">
                Saved on this device
              </span>
            </DetailRow>
          </dl>

          <p className="tnum mt-3 text-xs text-muted-foreground">
            Created {formatDateTime(tx.createdAt)} · Updated{" "}
            {formatDateTime(tx.updatedAt)}
          </p>
        </ResponsiveDialogBody>

        {/* Actions */}
        <ResponsiveDialogFooter>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => quickEntry.openEdit(tx.id)}
          >
            <PenLine className="h-4 w-4" aria-hidden="true" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
