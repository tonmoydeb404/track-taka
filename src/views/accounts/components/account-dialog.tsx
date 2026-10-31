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
import type { AccountDoc, AccountType } from "@/lib/db"
import {
  paisaToTaka,
  parseMoneyInput,
  sanitizeMoneyExpression,
} from "@/lib/domain"
import { useAccountActions } from "@/hooks"
import { cn } from "@/lib/utils"

import { ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS, PRESET_COLORS } from "../utils"

interface AccountFormState {
  name: string
  type: AccountType
  color: string
  openingBalance: string
}

const EMPTY_ACCOUNT_FORM: AccountFormState = {
  name: "",
  type: "cash",
  color: PRESET_COLORS[0],
  openingBalance: "0",
}

interface AccountDialogProps {
  open: boolean
  editing: AccountDoc | null
  onOpenChange: (open: boolean) => void
  onClose: () => void
}

/** Add/edit account dialog. The parent remounts it per open (via key), so the
 * form initialises fresh from `editing` without effects. */
export function AccountDialog({
  open,
  editing,
  onOpenChange,
  onClose,
}: AccountDialogProps) {
  const { create, update } = useAccountActions()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<AccountFormState>(() =>
    editing
      ? {
          name: editing.name,
          type: editing.type,
          color: editing.color,
          openingBalance: String(paisaToTaka(editing.openingBalance)),
        }
      : EMPTY_ACCOUNT_FORM
  )
  const [errors, setErrors] = useState<{
    name?: string
    openingBalance?: string
  }>({})

  const save = async () => {
    const nextErrors: typeof errors = {}
    const name = form.name.trim()
    if (!name) nextErrors.name = "Give this account a name."
    const openingBalance = parseMoneyInput(form.openingBalance)
    if (openingBalance === null) {
      nextErrors.openingBalance = "Enter a valid amount, 0 or more."
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || openingBalance === null) return

    setSaving(true)
    try {
      const values = {
        name,
        type: form.type,
        color: form.color,
        openingBalance,
      }
      if (editing) {
        await update(editing.id, values)
        toast.success(`“${name}” updated`)
      } else {
        await create(values)
        toast.success(`“${name}” added`)
      }
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the account")
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
          <ResponsiveDialogTitle>
            {editing ? "Edit account" : "Add account"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {editing
              ? "Update the name, type, colour or opening balance."
              : "Wallets, mobile money, bank accounts — they all live here."}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account-name">Name</Label>
            <Input
              id="account-name"
              placeholder="e.g. bKash, Cash wallet"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              aria-invalid={!!errors.name}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account-type">Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, type: v as AccountType }))
              }
            >
              <SelectTrigger id="account-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {ACCOUNT_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Colour</Label>
            <div
              className="flex items-center gap-2"
              role="radiogroup"
              aria-label="Account colour"
            >
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={form.color === c}
                  aria-label={`Colour ${c}`}
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-shadow pointer-coarse:size-11",
                    form.color === c
                      ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                      : "ring-1 ring-border hover:ring-muted-foreground/50"
                  )}
                >
                  <span
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account-balance">Opening balance</Label>
            <div className="relative">
              <span
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                ৳
              </span>
              <Input
                id="account-balance"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={form.openingBalance}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    openingBalance: sanitizeMoneyExpression(e.target.value),
                  }))
                }
                aria-invalid={!!errors.openingBalance}
                className="pl-8"
              />
            </div>
            <ExpressionHint value={form.openingBalance} />
            {errors.openingBalance ? (
              <p className="text-xs text-destructive">
                {errors.openingBalance}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                What the account holds right now, before any tracked activity.
              </p>
            )}
          </div>
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
            disabled={saving}
          >
            {editing ? "Save changes" : "Add account"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
