"use client"

import { useMemo } from "react"
import { Wallet } from "lucide-react"

import { AccountIcon } from "@/components/common/account-icon"
import { EmptyState } from "@/components/common/empty-state"
import { TransactionRow } from "@/components/transactions"
import { Separator } from "@/components/ui/separator"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { useAccountBalances, useTransactions } from "@/hooks"
import type { AccountDoc } from "@/lib/db"
import { formatBalance, formatMoney } from "@/lib/domain"

interface AccountSheetProps {
  account: AccountDoc | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Every transaction touching the given account: drawer on phones, side panel or modal on desktop. */
export function AccountSheet({
  account,
  open,
  onOpenChange,
}: AccountSheetProps) {
  const { data: transactions, isLoading } = useTransactions("all")
  const { balances } = useAccountBalances()

  const accountTxs = useMemo(() => {
    if (!account) return []
    return transactions.filter(
      (t) => t.accountId === account.id || t.toAccountId === account.id
    )
  }, [transactions, account])

  const { moneyIn, moneyOut } = useMemo(() => {
    let moneyIn = 0
    let moneyOut = 0
    if (account) {
      for (const t of accountTxs) {
        if (t.type === "income" || t.toAccountId === account.id) {
          moneyIn += t.amount
        } else {
          moneyOut += t.amount
        }
      }
    }
    return { moneyIn, moneyOut }
  }, [accountTxs, account])

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent
        dialogClassName="sm:max-w-lg"
        sheetClassName="sm:max-w-md"
        drawerClassName="min-h-[50dvh]"
      >
        <ResponsiveDialogHeader className="pb-2 text-left">
          <ResponsiveDialogTitle className="flex items-center gap-2.5">
            {account ? (
              <AccountIcon
                type={account.type}
                color={account.color}
                size={18}
              />
            ) : null}
            {account?.name ?? "Account"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="tnum">
            {account ? formatBalance(balances.get(account.id) ?? 0) : ""} ·{" "}
            {accountTxs.length} transaction
            {accountTxs.length === 1 ? "" : "s"}
            {account?.archived ? " · Archived" : ""}
            {accountTxs.length > 0
              ? ` · In ${formatMoney(moneyIn)} · Out ${formatMoney(moneyOut)}`
              : ""}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <Separator />
        <ResponsiveDialogBody>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading…
            </p>
          ) : accountTxs.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No transactions yet"
              description={`Nothing has been recorded on ${account?.name ?? "this account"} so far.`}
              className="border-0"
            />
          ) : (
            <div className="divide-y divide-border/70">
              {accountTxs.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} showDay />
              ))}
            </div>
          )}
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
