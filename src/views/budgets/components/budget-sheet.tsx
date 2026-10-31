"use client"

import { useState } from "react"
import Link from "next/link"
import { ListFilter, Trash2 } from "lucide-react"

import { CategoryIcon } from "@/components/common/category-icon"
import { ExpressionHint } from "@/components/common/expression-hint"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import type { BudgetDoc } from "@/lib/db"
import {
  formatMoney,
  monthLabel,
  paisaToTaka,
  parseMoneyInput,
  sanitizeMoneyExpression,
  takaToPaisa,
  type Category,
} from "@/lib/domain"
import { cn } from "@/lib/utils"

interface BudgetSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  month: string
  /** Set to edit that budget; null to create. */
  editing: BudgetDoc | null
  /** Create only: category to select up front. */
  presetCategoryId: string | null
  /** Every expense category. */
  categories: Category[]
  /** Categories that already have a budget this month (not offered when creating). */
  takenCategoryIds: Set<string>
  /** What was spent per category last month (paisa), for the suggestion. */
  lastMonthSpent: Map<string, number>
  /** `limit` is in paisa. */
  onSave: (input: { categoryId: string; limit: number }) => void
  onRemove: () => void
}

/**
 * Create or edit one budget. Remount it (change `key`) each time it opens so
 * the form starts fresh.
 */
export function BudgetSheet({
  open,
  onOpenChange,
  month,
  editing,
  presetCategoryId,
  categories,
  takenCategoryIds,
  lastMonthSpent,
  onSave,
  onRemove,
}: BudgetSheetProps) {
  const [categoryId, setCategoryId] = useState(
    editing?.categoryId ?? presetCategoryId ?? ""
  )
  const [amount, setAmount] = useState(
    editing ? String(paisaToTaka(editing.limit)) : ""
  )
  const [touched, setTouched] = useState(false)

  const choices = categories.filter((c) => !takenCategoryIds.has(c.id))
  const category = categories.find((c) => c.id === categoryId)
  const limit = parseMoneyInput(amount)
  const amountValid = limit !== null && limit > 0
  const valid = !!categoryId && amountValid
  const last = categoryId ? (lastMonthSpent.get(categoryId) ?? 0) : 0

  const setDigits = (v: string) => setAmount(sanitizeMoneyExpression(v))
  const add = (taka: number) =>
    setAmount(
      String(paisaToTaka((amountValid ? limit : 0) + takaToPaisa(taka)))
    )

  const submit = () => {
    setTouched(true)
    if (valid && limit !== null) onSave({ categoryId, limit })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent
        dialogClassName="sm:max-w-md"
        sheetClassName="sm:max-w-md"
      >
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {editing ? "Edit budget" : "New budget"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Monthly limit for {monthLabel(month)}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <ResponsiveDialogBody className="flex flex-col gap-6">
          {editing ? (
            <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <CategoryIcon
                icon={category?.icon ?? "package"}
                color={category?.color}
                className="size-10"
                size={18}
              />
              <span className="text-base font-medium">
                {category?.name ?? "Unknown category"}
              </span>
            </div>
          ) : (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium">Category</legend>
              {choices.length === 0 ? (
                <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  Every expense category already has a budget for{" "}
                  {monthLabel(month)}.
                </p>
              ) : (
                <div
                  role="radiogroup"
                  aria-label="Category"
                  className="grid grid-cols-3 gap-2"
                >
                  {choices.map((c) => {
                    const on = c.id === categoryId
                    return (
                      <button
                        key={c.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setCategoryId(c.id)}
                        className={cn(
                          "flex min-w-0 touch-manipulation flex-col items-center gap-1.5 rounded-xl border bg-card px-1 py-3 text-sm font-medium transition-colors select-none active:scale-[0.97]",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                          on && "border-primary bg-accent ring-1 ring-primary"
                        )}
                      >
                        <CategoryIcon
                          icon={c.icon}
                          color={c.color}
                          className="size-10"
                          size={18}
                        />
                        <span className="max-w-full truncate px-1">
                          {c.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
              {touched && !categoryId && choices.length > 0 ? (
                <p className="text-sm text-destructive" role="alert">
                  Pick a category.
                </p>
              ) : null}
            </fieldset>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="budget-limit">Monthly limit</Label>
            <div className="relative">
              <span
                className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-xl text-muted-foreground"
                aria-hidden="true"
              >
                ৳
              </span>
              <Input
                id="budget-limit"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={amount}
                onChange={(e) => setDigits(e.target.value)}
                placeholder="0"
                aria-invalid={touched && !amountValid}
                className="h-14 pl-10 text-2xl font-semibold tabular-nums pointer-coarse:h-14"
              />
            </div>
            <ExpressionHint value={amount} />
            {touched && !amountValid ? (
              <p className="text-sm text-destructive" role="alert">
                Enter an amount above 0.
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {last > 0 ? (
                <Chip onClick={() => setAmount(String(paisaToTaka(last)))}>
                  Last month {formatMoney(last)}
                </Chip>
              ) : null}
              <Chip onClick={() => add(500)}>
                +{formatMoney(takaToPaisa(500))}
              </Chip>
              <Chip onClick={() => add(1000)}>
                +{formatMoney(takaToPaisa(1000))}
              </Chip>
            </div>
          </div>

          {editing ? (
            <Link
              href={`/dashboard/transactions?category=${editing.categoryId}&month=${month}&type=expense`}
              className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ListFilter className="size-4" aria-hidden="true" />
              View {category?.name ?? "category"} transactions
            </Link>
          ) : null}

          {editing ? (
            <Button
              variant="ghost"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 aria-hidden="true" />
              Remove budget
            </Button>
          ) : null}
        </ResponsiveDialogBody>

        <ResponsiveDialogFooter>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 sm:flex-none"
            onClick={submit}
            disabled={!editing && choices.length === 0}
          >
            {editing ? "Save changes" : "Create budget"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

function Chip({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 touch-manipulation rounded-full border bg-card px-3.5 text-sm font-medium select-none active:scale-95 pointer-coarse:h-10"
    >
      {children}
    </button>
  )
}
