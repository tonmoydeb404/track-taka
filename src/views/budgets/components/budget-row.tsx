"use client"

import { PenLine, Trash2 } from "lucide-react"

import { BudgetBar } from "@/components/common/budget-bar"
import { CategoryIcon } from "@/components/common/category-icon"
import { SwipeActions } from "@/components/common/swipe-actions"
import { useIsMobile } from "@/hooks"
import { formatMoney, type Category } from "@/lib/domain"
import { cn } from "@/lib/utils"

import { STATE_META, type BudgetStatus } from "../utils"

interface BudgetRowProps {
  status: BudgetStatus
  category: Category | undefined
  onEdit: () => void
  onRemove: () => void
}

/**
 * One budget: category, spent of limit, a bar and one status. Tap to edit.
 * On phones, swipe left for Edit / Remove.
 */
export function BudgetRow({
  status,
  category,
  onEdit,
  onRemove,
}: BudgetRowProps) {
  const isMobile = useIsMobile()
  const { budget, spent, remaining, pct, state } = status
  const name = category?.name ?? "Unknown category"
  const { Icon, className: tone } = STATE_META[state]

  const right =
    state === "over"
      ? `Over by ${formatMoney(-remaining)}`
      : `${formatMoney(remaining)} left`

  const row = (
    <button
      type="button"
      onClick={onEdit}
      className="block w-full touch-manipulation px-5 py-4 text-left transition-colors select-none hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring active:bg-muted"
      aria-label={`${name} budget. ${formatMoney(spent)} of ${formatMoney(budget.limit)} spent. ${right}. Edit`}
    >
      <div className="flex items-center gap-3">
        <CategoryIcon
          icon={category?.icon ?? "package"}
          color={category?.color}
          className="size-10"
          size={18}
        />
        <p className="min-w-0 flex-1 truncate text-base leading-snug font-medium">
          {name}
        </p>
        <p
          className={cn(
            "tnum flex shrink-0 items-center gap-1.5 text-base font-semibold",
            state !== "normal" && tone
          )}
        >
          {state !== "normal" ? (
            <Icon className="size-4" aria-hidden="true" />
          ) : null}
          {right}
        </p>
      </div>
      <BudgetBar
        className="mt-3"
        spent={spent}
        limit={budget.limit}
        label={`${name} budget`}
      />
      <p className="tnum mt-2 flex justify-between gap-3 text-sm text-muted-foreground">
        <span>
          {formatMoney(spent)} of {formatMoney(budget.limit)}
        </span>
        <span>{Math.round(pct)}%</span>
      </p>
    </button>
  )

  if (!isMobile) return row
  return (
    <SwipeActions
      actions={[
        {
          label: "Edit",
          icon: PenLine,
          onSelect: onEdit,
          className: "bg-primary text-primary-foreground",
        },
        {
          label: "Remove",
          icon: Trash2,
          onSelect: onRemove,
          className: "bg-destructive text-white",
        },
      ]}
    >
      {row}
    </SwipeActions>
  )
}
