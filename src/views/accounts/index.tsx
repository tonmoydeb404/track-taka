"use client"

import { useMemo, useState } from "react"
import {
  Archive,
  ArchiveRestore,
  ArrowLeftRight,
  ChevronRight,
  EllipsisVertical,
  PenLine,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"

import { AccountIcon } from "@/components/common/account-icon"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { PageHeader } from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  useAccountActions,
  useAccountBalances,
  useAccounts,
  useTransactions,
} from "@/hooks"
import type { AccountDoc } from "@/lib/db"
import { formatBalance } from "@/lib/domain"

import { AccountDialog } from "./components/account-dialog"
import { AccountSheet } from "./components/account-sheet"
import { TransferDialog } from "./components/transfer-dialog"
import { ACCOUNT_TYPE_LABELS } from "./utils"

/** Account management: cards, add/edit, transfers and per-account history. */
export function AccountsPage() {
  const { data: allAccounts, isLoading: accountsLoading } = useAccounts({
    includeArchived: true,
  })
  const { balances, total } = useAccountBalances()
  const { data: transactions } = useTransactions("all")
  const { remove, setArchived } = useAccountActions()

  const [showArchived, setShowArchived] = useState(false)
  const activeAccounts = useMemo(
    () => allAccounts.filter((a) => !a.archived),
    [allAccounts]
  )
  const archivedAccounts = useMemo(
    () => allAccounts.filter((a) => a.archived),
    [allAccounts]
  )
  const accounts = showArchived ? allAccounts : activeAccounts
  const usedIds = useMemo(() => {
    const ids = new Set<string>()
    for (const t of transactions) {
      ids.add(t.accountId)
      if (t.toAccountId) ids.add(t.toAccountId)
    }
    return ids
  }, [transactions])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AccountDoc | null>(null)
  const [transferOpen, setTransferOpen] = useState(false)
  const [transferPresetFrom, setTransferPresetFrom] = useState<string | null>(
    null
  )
  const [deleteTarget, setDeleteTarget] = useState<AccountDoc | null>(null)
  const [sheetAccountId, setSheetAccountId] = useState<string | null>(null)

  const sheetAccount = allAccounts.find((a) => a.id === sheetAccountId) ?? null

  const toggleArchived = async (account: AccountDoc, archived: boolean) => {
    try {
      await setArchived(account.id, archived)
      toast.success(`“${account.name}” ${archived ? "archived" : "restored"}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update account")
    }
  }

  const openAdd = () => {
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (account: AccountDoc) => {
    setEditing(account)
    setDialogOpen(true)
  }
  const openTransfer = (fromId?: string) => {
    setTransferPresetFrom(fromId ?? null)
    setTransferOpen(true)
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Accounts"
        subtitle={`${formatBalance(total)} across ${activeAccounts.length} account${activeAccounts.length === 1 ? "" : "s"}`}
        actions={
          <>
            <Button
              variant="outline"
              className="max-sm:hidden"
              onClick={() => openTransfer()}
              disabled={activeAccounts.length < 2}
            >
              <ArrowLeftRight aria-hidden="true" />
              New transfer
            </Button>
            <Button onClick={openAdd}>
              <Plus aria-hidden="true" />
              Add account
            </Button>
          </>
        }
      />

      {accountsLoading ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          <Skeleton className="h-[4.5rem] w-full rounded-xl" />
          <Skeleton className="h-[4.5rem] w-full rounded-xl" />
        </div>
      ) : allAccounts.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Create your first account"
          description="Add your cash wallet, mobile money or bank account to start tracking."
          action={
            <Button onClick={openAdd}>
              <Plus aria-hidden="true" />
              Create your first account
            </Button>
          }
        />
      ) : (
        <>
          <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-xs sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none xl:grid-cols-3">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="relative flex items-center sm:rounded-xl sm:border sm:bg-card sm:shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setSheetAccountId(account.id)}
                  className="flex min-h-[4.5rem] min-w-0 flex-1 touch-manipulation items-center gap-3 py-3.5 pr-1 pl-5 text-left transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring active:bg-muted sm:min-h-0 sm:flex-col sm:items-start sm:gap-5 sm:rounded-xl sm:p-5"
                  aria-label={`${account.name}, ${ACCOUNT_TYPE_LABELS[account.type]}, balance ${formatBalance(balances.get(account.id) ?? 0)}. View history`}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-3 sm:w-full sm:flex-none">
                    <AccountIcon
                      type={account.type}
                      color={account.color}
                      size={18}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-base font-medium">
                        {account.name}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {ACCOUNT_TYPE_LABELS[account.type]}
                        {account.archived ? " · Archived" : ""}
                      </span>
                    </span>
                  </span>
                  <span className="tnum shrink-0 text-base font-semibold sm:text-2xl sm:font-bold sm:tracking-tight">
                    {formatBalance(balances.get(account.id) ?? 0)}
                  </span>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-1 shrink-0 text-muted-foreground sm:absolute sm:top-2 sm:right-2 sm:mr-0"
                      aria-label={`More actions for ${account.name}`}
                    >
                      <EllipsisVertical aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(account)}>
                      <PenLine aria-hidden="true" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openTransfer(account.id)}
                      disabled={
                        activeAccounts.length < (account.archived ? 1 : 2)
                      }
                    >
                      <ArrowLeftRight aria-hidden="true" />
                      Transfer from here
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {account.archived ? (
                      <DropdownMenuItem
                        onClick={() => toggleArchived(account, false)}
                      >
                        <ArchiveRestore aria-hidden="true" />
                        Restore
                      </DropdownMenuItem>
                    ) : usedIds.has(account.id) ? (
                      <DropdownMenuItem
                        onClick={() => toggleArchived(account, true)}
                      >
                        <Archive aria-hidden="true" />
                        Archive
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteTarget(account)}
                      >
                        <Trash2 aria-hidden="true" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>

          {/* Phone: transfer lives here; from sm it is a header action */}
          <Button
            variant="outline"
            className="w-full justify-between sm:hidden"
            onClick={() => openTransfer()}
            disabled={activeAccounts.length < 2}
          >
            <span className="flex items-center gap-2">
              <ArrowLeftRight aria-hidden="true" />
              Transfer between accounts
            </span>
            <ChevronRight
              className="text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </>
      )}

      {!accountsLoading && archivedAccounts.length > 0 ? (
        <Button
          variant="ghost"
          className="self-start text-muted-foreground"
          onClick={() => setShowArchived((v) => !v)}
          aria-pressed={showArchived}
        >
          <Archive aria-hidden="true" />
          {showArchived
            ? "Hide archived accounts"
            : `Show archived accounts (${archivedAccounts.length})`}
        </Button>
      ) : null}

      <AccountDialog
        key={`account-dialog-${dialogOpen ? (editing?.id ?? "new") : "closed"}`}
        open={dialogOpen}
        editing={editing}
        onOpenChange={setDialogOpen}
        onClose={() => setDialogOpen(false)}
      />

      <TransferDialog
        key={`transfer-dialog-${transferOpen ? (transferPresetFrom ?? "any") : "closed"}`}
        open={transferOpen}
        presetFromId={transferPresetFrom}
        onOpenChange={setTransferOpen}
        onClose={() => setTransferOpen(false)}
      />

      <AccountSheet
        account={sheetAccount}
        onOpenChange={(open) => {
          if (!open) setSheetAccountId(null)
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title={`Delete “${deleteTarget?.name ?? ""}”?`}
        description="This account has no transactions, so it is removed completely. This cannot be undone."
        confirmLabel="Delete account"
        destructive
        onConfirm={async () => {
          if (!deleteTarget) return
          try {
            await remove(deleteTarget.id)
            toast.success(`“${deleteTarget.name}” deleted`)
          } catch (e) {
            toast.error(
              e instanceof Error ? e.message : "Could not delete the account"
            )
          }
        }}
      />
    </div>
  )
}
