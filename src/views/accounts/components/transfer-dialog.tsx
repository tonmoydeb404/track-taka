"use client"

import { useState } from "react"
import { toast } from "sonner"

import { ExpressionHint } from "@/components/common/expression-hint"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { useAccountBalances, useAccounts, useTransactionActions } from "@/hooks"
import {
  dayKey,
  formatBalance,
  formatMoney,
  parseMoneyInput,
  sanitizeMoneyExpression,
} from "@/lib/domain"

import { isoFromDate } from "../utils"

interface TransferDialogProps {
  open: boolean
  presetFromId: string | null
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

/** Move money between the user's own accounts. The parent remounts it per
 * open (via key), so state starts fresh with the optional preset source. */
export function TransferDialog({
  open,
  presetFromId,
  onOpenChange,
  onClose,
}: TransferDialogProps) {
  // Money can be moved OUT of an archived account (to empty it), but never
  // into one: archived accounts are closed to new activity.
  const { data: sources } = useAccounts({ includeArchived: true })
  const accounts = sources.filter((a) => !a.archived)
  const { balances } = useAccountBalances()
  const { create, remove } = useTransactionActions()
  const [saving, setSaving] = useState(false)

  // Defaults are derived, not stored: the account lists arrive after mount.
  const [pickedFrom, setPickedFrom] = useState<string | null>(null)
  const [pickedTo, setPickedTo] = useState<string | null>(null)
  const fromId = pickedFrom ?? presetFromId ?? accounts[0]?.id ?? ""
  const toId =
    pickedTo && pickedTo !== fromId
      ? pickedTo
      : (accounts.find((a) => a.id !== fromId)?.id ?? "")
  const [amountStr, setAmountStr] = useState("")
  const [dateStr, setDateStr] = useState(() => dayKey(new Date()))
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)

  const fromAccount = sources.find((a) => a.id === fromId)
  const toAccount = accounts.find((a) => a.id === toId)
  const fromBalance = balances.get(fromId) ?? 0
  const amount = parseMoneyInput(amountStr)
  const overBalance = amount !== null && amount > fromBalance
  const valid =
    amount !== null && amount > 0 && !!fromId && !!toId && fromId !== toId

  const save = async () => {
    if (!valid || amount === null) {
      setError("Enter an amount above 0 and pick two different accounts.")
      return
    }
    if (!fromAccount || !toAccount) return
    setSaving(true)
    try {
      const tx = await create({
        type: "transfer",
        amount,
        categoryId: null,
        accountId: fromId,
        toAccountId: toId,
        description: note.trim() || `Transfer to ${toAccount.name}`,
        date: isoFromDate(dateStr),
      })
      toast.success("Transfer saved", {
        description: `${formatMoney(amount)} · ${fromAccount.name} → ${toAccount.name}`,
        action: {
          label: "Undo",
          onClick: () => {
            remove(tx.id).catch((e: unknown) =>
              toast.error(
                e instanceof Error ? e.message : "Could not undo the transfer"
              )
            )
          },
        },
      })
      onClose()
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Could not save the transfer"
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent
        dialogClassName="sm:max-w-md"
        sheetClassName="sm:max-w-md"
      >
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>New transfer</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Move money between your own accounts.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transfer-from">From</Label>
            <Select value={fromId} onValueChange={setPickedFrom}>
              <SelectTrigger id="transfer-from" className="w-full">
                <SelectValue placeholder="Pick an account" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                    {a.archived ? " (archived)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fromAccount ? (
              <p className="tnum text-xs text-muted-foreground">
                Balance: {formatBalance(fromBalance)}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transfer-to">To</Label>
            <Select value={toId} onValueChange={setPickedTo}>
              <SelectTrigger id="transfer-to" className="w-full">
                <SelectValue placeholder="Pick an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  .filter((a) => a.id !== fromId)
                  .map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transfer-amount">Amount</Label>
            <div className="relative">
              <span
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                ৳
              </span>
              <Input
                id="transfer-amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0"
                value={amountStr}
                onChange={(e) => {
                  setAmountStr(sanitizeMoneyExpression(e.target.value))
                  setError(null)
                }}
                aria-invalid={!!error}
                className="pl-8"
              />
            </div>
            <ExpressionHint value={amountStr} />
            {overBalance ? (
              <p className="text-xs text-warning">More than current balance</p>
            ) : null}
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transfer-date">Date</Label>
            <Input
              id="transfer-date"
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transfer-note">Note (optional)</Label>
            <Input
              id="transfer-note"
              placeholder="e.g. Cash withdrawal"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <p className="rounded-lg border border-dashed px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            Transfers move money between your accounts — they never count as
            income or spending.
          </p>
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 sm:flex-none"
            onClick={save}
            disabled={!valid || saving}
          >
            Save transfer
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
