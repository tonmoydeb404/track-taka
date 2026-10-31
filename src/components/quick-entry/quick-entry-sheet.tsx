"use client"

import Link from "next/link"
import * as React from "react"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { toast } from "sonner"

import { AccountPicker } from "@/components/quick-entry/account-picker"
import { OperatorKeys } from "@/components/common/operator-keys"
import { AmountInput } from "@/components/quick-entry/amount-input"
import { CategoryPicker } from "@/components/quick-entry/category-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  useAccounts,
  useIsMobile,
  useTransaction,
  useTransactionActions,
} from "@/hooks"
import type { AccountDoc, TransactionDoc, TransactionType } from "@/lib/db"
import {
  categoriesFor,
  formatDate,
  formatMoney,
  formatTime,
  paisaToTaka,
  parseMoneyInput,
  sanitizeMoneyExpression,
} from "@/lib/domain"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** 48 half-hour slots: 12:00 AM … 11:30 PM */
const TIME_SLOTS: string[] = (() => {
  const slots: string[] = []
  const d = new Date(2000, 0, 1)
  for (let i = 0; i < 48; i++) {
    d.setHours(0, i * 30, 0, 0)
    slots.push(
      d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    )
  }
  return slots
})()

function slotIndexFromDate(d: Date): number {
  return d.getHours() * 2 + (d.getMinutes() >= 30 ? 1 : 0)
}

/** Keep the time-of-day when the calendar day changes. */
function mergeDay(day: Date, current: Date): Date {
  const next = new Date(day)
  next.setHours(current.getHours(), current.getMinutes(), 0, 0)
  return next
}

function savedToastLabel(
  type: TransactionType,
  amount: number,
  description: string
): string {
  const tail = description ? ` · ${description}` : ""
  if (type === "income") return `Income saved — ${formatMoney(amount)}${tail}`
  if (type === "transfer")
    return `Transfer saved — ${formatMoney(amount)}${tail}`
  return `Expense saved — ${formatMoney(amount)}${tail}`
}

/** Initial form values, resolved from the loaded accounts/transaction. */
function initialFormState(
  type: TransactionType,
  tx: TransactionDoc | null,
  accounts: AccountDoc[]
) {
  if (tx) {
    return {
      type: tx.type,
      amount: String(paisaToTaka(tx.amount)),
      categoryId: tx.categoryId,
      accountId: tx.accountId,
      toAccountId: tx.toAccountId,
      description: tx.description,
      date: new Date(tx.date),
    }
  }

  const catKind = type === "income" ? "income" : "expense"
  const first = accounts[0]
  const second = accounts.find((a) => a.id !== first?.id)
  return {
    type,
    amount: "",
    categoryId: categoriesFor(catKind)[0]?.id ?? null,
    accountId: first?.id ?? null,
    toAccountId: second?.id ?? first?.id ?? null,
    description: "",
    date: new Date(),
  }
}

// ---------------------------------------------------------------------------
// QuickEntrySheet
// ---------------------------------------------------------------------------

/**
 * The core add/edit transaction sheet. Opens from the UI store, so it can be
 * rendered once at the app root — it is fully closed (renders nothing) by default.
 * The form itself remounts on every open session (see `quickEntrySession`),
 * which resets its state without effects.
 */
export function QuickEntrySheet() {
  const open = useUIStore((s) => s.quickEntryOpen)
  const quickEntryType = useUIStore((s) => s.quickEntryType)
  const editingTxId = useUIStore((s) => s.editingTxId)
  const quickEntrySession = useUIStore((s) => s.quickEntrySession)
  const closeQuickEntry = useUIStore((s) => s.closeQuickEntry)

  return (
    <ResponsiveDialog open={open} onOpenChange={(o) => !o && closeQuickEntry()}>
      <ResponsiveDialogContent
        className="flex flex-col"
        drawerClassName="h-[92dvh] data-[vaul-drawer-direction=bottom]:max-h-[92dvh] data-[vaul-drawer-direction=bottom]:rounded-t-2xl"
        sheetClassName="sm:max-w-md sm:rounded-l-2xl"
      >
        <ResponsiveDialogHeader className="gap-1 pb-3 text-left">
          <ResponsiveDialogTitle>
            {editingTxId ? "Edit transaction" : "Quick entry"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription className="text-xs">
            Saved on this device instantly
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <QuickEntryForm
          key={quickEntrySession}
          editingTxId={editingTxId}
          initialType={quickEntryType}
        />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

interface QuickEntryFormProps {
  editingTxId: string | null
  initialType: TransactionType
}

/** Waits for accounts (and the transaction when editing) before the form. */
function QuickEntryForm({ editingTxId, initialType }: QuickEntryFormProps) {
  const closeQuickEntry = useUIStore((s) => s.closeQuickEntry)
  const accountsQuery = useAccounts()
  const { transaction, isLoading: txLoading } = useTransaction(editingTxId)

  if (accountsQuery.isLoading || txLoading) {
    return (
      <ResponsiveDialogBody>
        <p className="text-sm text-muted-foreground" role="status">
          Loading…
        </p>
      </ResponsiveDialogBody>
    )
  }

  if (editingTxId && !transaction) {
    return (
      <ResponsiveDialogBody>
        <p className="text-sm text-muted-foreground" role="alert">
          This transaction no longer exists.
        </p>
      </ResponsiveDialogBody>
    )
  }

  if (accountsQuery.data.length === 0) {
    return (
      <ResponsiveDialogBody className="flex flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">
          Create an account first, then you can record transactions.
        </p>
        <Button asChild onClick={closeQuickEntry}>
          <Link href="/dashboard/accounts">Create an account</Link>
        </Button>
      </ResponsiveDialogBody>
    )
  }

  return (
    <QuickEntryFields
      editingTx={transaction}
      initialType={initialType}
      accounts={accountsQuery.data}
    />
  )
}

interface QuickEntryFieldsProps {
  editingTx: TransactionDoc | null
  initialType: TransactionType
  accounts: AccountDoc[]
}

function QuickEntryFields({
  editingTx,
  initialType,
  accounts,
}: QuickEntryFieldsProps) {
  const closeQuickEntry = useUIStore((s) => s.closeQuickEntry)
  const { create, update, remove } = useTransactionActions()
  const isMobile = useIsMobile()
  const editing = Boolean(editingTx)

  const initial = React.useState(() =>
    initialFormState(initialType, editingTx, accounts)
  )[0]

  const [type, setType] = React.useState<TransactionType>(initial.type)
  const [amount, setAmount] = React.useState(initial.amount)
  const [categoryId, setCategoryId] = React.useState<string | null>(
    initial.categoryId
  )
  const [accountId, setAccountId] = React.useState<string | null>(
    initial.accountId
  )
  const [toAccountId, setToAccountId] = React.useState<string | null>(
    initial.toAccountId
  )
  const [description, setDescription] = React.useState(initial.description)
  const [date, setDate] = React.useState<Date>(initial.date)
  const [submitted, setSubmitted] = React.useState(false)

  const submitLockRef = React.useRef(false) // double-submit lock
  const amountInputRef = React.useRef<HTMLInputElement>(null)

  // Auto-focus the amount on desktop (pointer devices); skip on touch so the
  // keyboard doesn't cover the sheet on phones.
  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches
    ) {
      const timer = window.setTimeout(
        () => amountInputRef.current?.focus(),
        220
      )
      return () => window.clearTimeout(timer)
    }
  }, [])

  // Transfers must never have the same account on both sides. Instead of an
  // effect, derive the effective destination: if the current pick collides
  // with the source, fall back to the first other account.
  const effectiveToAccountId = React.useMemo(() => {
    if (type !== "transfer") return toAccountId
    if (toAccountId && toAccountId !== accountId) return toAccountId
    const other =
      accounts.find((a) => a.id !== accountId) ?? accounts[1] ?? accounts[0]
    return other?.id ?? null
  }, [type, toAccountId, accountId, accounts])

  const amountValue = parseMoneyInput(amount) ?? 0
  const amountValid = amountValue > 0
  const accountsValid =
    type !== "transfer" ||
    Boolean(
      accountId && effectiveToAccountId && accountId !== effectiveToAccountId
    )
  const canSave = amountValid && accountsValid

  const handleTypeChange = (next: string) => {
    if (!next || next === type) return
    const nextType = next as TransactionType
    setType(nextType)
    setSubmitted(false)
    if (nextType === "transfer") {
      if (!toAccountId || toAccountId === accountId) {
        const other =
          accounts.find((a) => a.id !== accountId) ?? accounts[1] ?? accounts[0]
        setToAccountId(other?.id ?? null)
      }
    } else {
      const kind = nextType === "income" ? "income" : "expense"
      const options = categoriesFor(kind)
      if (!options.some((c) => c.id === categoryId)) {
        setCategoryId(options[0]?.id ?? null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (submitLockRef.current) return
    if (!canSave || !accountId) return
    submitLockRef.current = true

    const draft = {
      type,
      amount: amountValue,
      categoryId: type === "transfer" ? null : categoryId,
      accountId,
      toAccountId: type === "transfer" ? effectiveToAccountId : null,
      description: description.trim(),
      date: date.toISOString(),
    }

    try {
      if (editingTx) {
        const before = editingTx
        await update(editingTx.id, draft)
        closeQuickEntry()
        toast("Transaction updated", {
          action: {
            label: "Undo",
            onClick: async () => {
              try {
                await update(before.id, {
                  type: before.type,
                  amount: before.amount,
                  categoryId: before.categoryId,
                  accountId: before.accountId,
                  toAccountId: before.toAccountId,
                  description: before.description,
                  date: before.date,
                })
                toast("Change reverted")
              } catch (err) {
                toast.error(
                  err instanceof Error ? err.message : "Could not undo"
                )
              }
            },
          },
        })
        return
      }

      const tx = await create(draft)
      closeQuickEntry()
      toast(savedToastLabel(type, amountValue, description.trim()), {
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              await remove(tx.id)
              toast("Transaction removed")
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Could not undo")
            }
          },
        },
      })
    } catch (err) {
      submitLockRef.current = false
      toast.error(err instanceof Error ? err.message : "Could not save")
    }
  }

  const saveLabel = editing
    ? "Save changes"
    : type === "expense"
      ? "Save expense"
      : type === "income"
        ? "Save income"
        : "Save transfer"

  return (
    <>
      <ResponsiveDialogBody className="flex flex-col gap-5">
        <form
          id="quick-entry-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          {/* 1. Type */}
          <div>
            <Label className="sr-only">Transaction type</Label>
            <ToggleGroup
              type="single"
              value={type}
              onValueChange={handleTypeChange}
              disabled={editing && type === "transfer"}
              variant="outline"
              className="w-full rounded-xl"
            >
              <ToggleGroupItem
                value="expense"
                className="flex-1 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Expense
              </ToggleGroupItem>
              <ToggleGroupItem
                value="income"
                className="flex-1 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Income
              </ToggleGroupItem>
              <ToggleGroupItem
                value="transfer"
                className="flex-1 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Transfer
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* 2. Amount */}
          <div className="space-y-1">
            <Label
              htmlFor="qe-amount"
              className="text-xs font-medium text-muted-foreground"
            >
              Amount
            </Label>
            <div
              className={cn(
                "rounded-xl border bg-background py-2",
                submitted && !amountValid ? "border-expense" : "border-input"
              )}
            >
              <AmountInput
                id="qe-amount"
                inputRef={amountInputRef}
                value={amount}
                onChange={(v) => {
                  setAmount(v)
                  if (v) setSubmitted(false)
                }}
                invalid={submitted && !amountValid}
              />
            </div>
            {isMobile ? (
              <OperatorKeys
                onInsert={(text) => {
                  setAmount(sanitizeMoneyExpression(amount + text))
                  setSubmitted(false)
                }}
              />
            ) : null}
            {submitted && !amountValid && (
              <p className="text-xs text-expense" role="alert">
                Enter an amount
              </p>
            )}
          </div>

          {/* 3. Category — hidden for transfers */}
          {type !== "transfer" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Category
              </Label>
              <CategoryPicker
                type={type === "income" ? "income" : "expense"}
                value={categoryId}
                onChange={setCategoryId}
              />
            </div>
          )}

          {/* 4. Account(s) */}
          {type === "transfer" ? (
            <div className="space-y-3">
              <AccountPicker
                label="From"
                value={accountId}
                onChange={setAccountId}
                excludeAccountId={effectiveToAccountId}
              />
              {submitted && !accountsValid && (
                <p className="text-xs text-expense" role="alert">
                  Choose two different accounts
                </p>
              )}
              <AccountPicker
                label="To"
                value={effectiveToAccountId}
                onChange={setToAccountId}
                excludeAccountId={accountId}
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Account
              </Label>
              <AccountPicker value={accountId} onChange={setAccountId} />
            </div>
          )}

          {/* 5. Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="qe-note"
              className="text-xs font-medium text-muted-foreground"
            >
              Note <span className="font-normal">(optional)</span>
            </Label>
            <Input
              id="qe-note"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Lunch at office"
              maxLength={120}
            />
          </div>

          {/* 6. Date & time */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 flex-1 justify-start font-normal"
                >
                  <CalendarIcon
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {formatDate(date.toISOString())}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(day) =>
                    day && setDate((prev) => mergeDay(day, prev))
                  }
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 flex-1 justify-start font-normal"
                >
                  <ClockIcon
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {formatTime(date.toISOString())}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="end">
                <div
                  role="listbox"
                  aria-label="Time"
                  className="grid max-h-64 grid-cols-3 gap-1 overflow-y-auto"
                >
                  {TIME_SLOTS.map((slot, i) => (
                    <button
                      key={slot}
                      type="button"
                      role="option"
                      aria-selected={slotIndexFromDate(date) === i}
                      onClick={() =>
                        setDate((prev) => {
                          const next = new Date(prev)
                          next.setHours(Math.floor(i / 2), (i % 2) * 30, 0, 0)
                          return next
                        })
                      }
                      className={cn(
                        "min-h-9 rounded-md px-1 text-xs tabular-nums transition-colors hover:bg-accent",
                        slotIndexFromDate(date) === i &&
                          "bg-primary text-primary-foreground hover:bg-primary"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </form>
      </ResponsiveDialogBody>

      {/* Sticky save — submits the form via its id */}
      <ResponsiveDialogFooter>
        <Button
          type="submit"
          form="quick-entry-form"
          disabled={!canSave}
          className="h-12 w-full rounded-xl text-base font-semibold"
        >
          {saveLabel}
          {!editing && amountValid ? ` · ${formatMoney(amountValue)}` : ""}
        </Button>
      </ResponsiveDialogFooter>
    </>
  )
}
