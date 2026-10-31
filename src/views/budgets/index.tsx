"use client"

import { useMemo, useState } from "react"
import { Copy, PiggyBank, Plus } from "lucide-react"
import { toast } from "sonner"

import { useConfirm } from "@/components/common/confirm-dialog"
import { EmptyState } from "@/components/common/empty-state"
import { PageHeader } from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useBudgetActions,
  useBudgetProgress,
  useBudgets,
  useSelectedMonth,
  useTransactions,
} from "@/hooks"
import type { BudgetDoc } from "@/lib/db"
import {
  addMonths,
  categoryTotals,
  EXPENSE_CATEGORIES,
  getCategory,
  monthLabel,
} from "@/lib/domain"

import { BudgetRow } from "./components/budget-row"
import { BudgetSheet } from "./components/budget-sheet"
import { BudgetSummary } from "./components/budget-summary"
import { UnbudgetedSpending } from "./components/unbudgeted-spending"
import { daysLeftInMonth, monthName } from "./utils"

/**
 * Monthly category budgets. You can plan one month ahead and copy last
 * month's limits. Layout: phone is one column (summary, list, unbudgeted);
 * lg+ puts the list on the left and the summary beside it.
 */
export function BudgetsPage() {
  const budgetActions = useBudgetActions()
  const confirm = useConfirm()

  const { month } = useSelectedMonth()
  const [now] = useState(() => new Date())
  const prevMonth = addMonths(month, -1)

  const { statuses, isLoading, error } = useBudgetProgress(month)
  const prevBudgetsQuery = useBudgets(prevMonth)
  const monthTx = useTransactions(month)
  const prevTx = useTransactions(prevMonth)
  const prevBudgets = prevBudgetsQuery.data

  // One sheet for create and edit; `session` remounts it so the form starts fresh
  const [sheet, setSheet] = useState<{
    editing: BudgetDoc | null
    preset: string | null
    session: number
    open: boolean
  } | null>(null)
  const openSheet = (editing: BudgetDoc | null, preset: string | null = null) =>
    setSheet((s) => ({
      editing,
      preset,
      session: (s?.session ?? 0) + 1,
      open: true,
    }))
  // Stay mounted while closing so the exit animation can play
  const closeSheet = () => setSheet((s) => (s ? { ...s, open: false } : s))

  const taken = useMemo(
    () => new Set(statuses.map((s) => s.budget.categoryId)),
    [statuses]
  )
  const lastMonthSpent = useMemo(
    () =>
      new Map(
        categoryTotals(prevTx.data, "expense").map((t) => [
          t.categoryId,
          t.total,
        ])
      ),
    [prevTx.data]
  )
  const unbudgeted = useMemo(
    () =>
      categoryTotals(monthTx.data, "expense").filter(
        (t) => !taken.has(t.categoryId)
      ),
    [monthTx.data, taken]
  )

  const planned = statuses.reduce((sum, s) => sum + s.budget.limit, 0)
  const spent = statuses.reduce((sum, s) => sum + s.spent, 0)
  const overCount = statuses.filter((s) => s.state === "over").length
  const canAdd = EXPENSE_CATEGORIES.some((c) => !taken.has(c.id))

  async function save(input: { categoryId: string; limit: number }) {
    try {
      await budgetActions.set(
        sheet?.editing?.categoryId ?? input.categoryId,
        month,
        input.limit
      )
      toast.success(sheet?.editing ? "Budget updated" : "Budget created")
      closeSheet()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the budget")
    }
  }

  async function remove(b: BudgetDoc): Promise<boolean> {
    const name = getCategory(b.categoryId)?.name ?? "this"
    const ok = await confirm({
      title: "Remove this budget?",
      description: `The ${name} limit for ${monthLabel(b.month)} will be removed. Your spending stays in your history.`,
      confirmLabel: "Remove",
      destructive: true,
    })
    if (!ok) return false
    try {
      await budgetActions.remove(b.categoryId, b.month)
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not remove the budget"
      )
      return false
    }
    toast("Budget removed", {
      action: {
        label: "Undo",
        onClick: () =>
          void budgetActions
            .set(b.categoryId, b.month, b.limit)
            .catch((e: unknown) =>
              toast.error(e instanceof Error ? e.message : "Could not undo")
            ),
      },
    })
    return true
  }

  async function copyFromPrevious() {
    const todo = prevBudgets.filter((b) => !taken.has(b.categoryId))
    if (todo.length === 0) {
      toast("Nothing new to copy")
      return
    }
    const created: string[] = []
    try {
      for (const b of todo) {
        await budgetActions.set(b.categoryId, month, b.limit)
        created.push(b.categoryId)
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not copy budgets")
      return
    }
    toast.success(
      `Copied ${todo.length} ${todo.length === 1 ? "budget" : "budgets"} from ${monthName(monthLabel(prevMonth))}`,
      {
        action: {
          label: "Undo",
          onClick: () =>
            void Promise.all(
              created.map((id) => budgetActions.remove(id, month))
            ).catch((e: unknown) =>
              toast.error(e instanceof Error ? e.message : "Could not undo")
            ),
        },
      }
    )
  }

  const subtitle =
    statuses.length > 0
      ? `${statuses.length} ${statuses.length === 1 ? "budget" : "budgets"} · ${monthLabel(month)}`
      : monthLabel(month)

  return (
    <div className="page-stack">
      <PageHeader
        title="Budgets"
        subtitle={subtitle}
        actions={
          <>
            <Button
              className="max-md:hidden"
              onClick={() => openSheet(null)}
              disabled={!canAdd}
            >
              <Plus aria-hidden="true" />
              New budget
            </Button>
          </>
        }
      />

      {error ? (
        <EmptyState
          icon={PiggyBank}
          title="Could not load budgets"
          description={error.message}
        />
      ) : isLoading ? (
        <div className="grid gap-6 lg:grid-cols-5" aria-busy="true">
          <Skeleton className="h-64 rounded-xl lg:col-span-3" />
          <Skeleton className="h-48 rounded-xl lg:col-span-2" />
        </div>
      ) : statuses.length === 0 ? (
        prevBudgets.length > 0 ? (
          <EmptyState
            icon={Copy}
            title={`Nothing planned for ${monthName(monthLabel(month))}`}
            description={`Start from ${monthName(monthLabel(prevMonth))}'s ${prevBudgets.length} ${prevBudgets.length === 1 ? "limit" : "limits"}, then adjust what changed.`}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={() => void copyFromPrevious()}>
                  <Copy aria-hidden="true" />
                  Copy {monthName(monthLabel(prevMonth))}&rsquo;s budgets
                </Button>
                <Button variant="outline" onClick={() => openSheet(null)}>
                  Start fresh
                </Button>
              </div>
            }
          />
        ) : (
          <EmptyState
            icon={PiggyBank}
            title="No budgets yet"
            description={`Set a monthly limit for the categories you want to keep an eye on in ${monthLabel(month)}.`}
            action={
              <Button onClick={() => openSheet(null)}>
                <Plus aria-hidden="true" />
                Create your first budget
              </Button>
            }
          />
        )
      ) : (
        <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
          <BudgetSummary
            className="lg:col-span-2 lg:col-start-4 lg:row-start-1"
            planned={planned}
            spent={spent}
            daysLeft={daysLeftInMonth(month, now)}
            overCount={overCount}
          />

          <section
            aria-label="Budgets"
            className="overflow-hidden rounded-xl border bg-card shadow-xs lg:col-span-3 lg:col-start-1 lg:row-span-2 lg:row-start-1"
          >
            <ul className="divide-y">
              {statuses.map((status) => (
                <li key={status.budget.id}>
                  <BudgetRow
                    status={status}
                    category={getCategory(status.budget.categoryId)}
                    onEdit={() => openSheet(status.budget)}
                    onRemove={() => void remove(status.budget)}
                  />
                </li>
              ))}
            </ul>
            {canAdd ? (
              <button
                type="button"
                onClick={() => openSheet(null)}
                className="flex min-h-14 w-full touch-manipulation items-center justify-center gap-2 border-t text-base font-medium text-primary transition-colors select-none hover:bg-muted/50 active:bg-muted md:hidden"
              >
                <Plus className="size-5" aria-hidden="true" />
                New budget
              </button>
            ) : null}
          </section>

          <UnbudgetedSpending
            className="lg:col-span-2 lg:col-start-4 lg:row-start-2"
            rows={unbudgeted}
            onSetBudget={(categoryId) => {
              if (getCategory(categoryId)) openSheet(null, categoryId)
            }}
          />
        </div>
      )}

      {sheet ? (
        <BudgetSheet
          key={sheet.session}
          open={sheet.open}
          onOpenChange={(o) => !o && closeSheet()}
          month={month}
          editing={sheet.editing}
          presetCategoryId={sheet.preset}
          categories={[...EXPENSE_CATEGORIES]}
          takenCategoryIds={taken}
          lastMonthSpent={lastMonthSpent}
          onSave={save}
          onRemove={async () => {
            if (sheet.editing && (await remove(sheet.editing))) closeSheet()
          }}
        />
      ) : null}
    </div>
  )
}
