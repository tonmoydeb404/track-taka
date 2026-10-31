import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import { BudgetBar } from "@/components/common/budget-bar"
import { formatMoney } from "@/lib/domain"
import { cn } from "@/lib/utils"

import { ComparisonLine } from "./comparison-line"

interface MonthSummaryProps {
  prevLabel: string
  income: number
  expense: number
  prevIncome: number
  prevExpense: number
  /** Total of this month's budget limits; 0 when none are set. */
  budgetLimit: number
  className?: string
}

/** Month at a glance. The month itself is chosen in the page header. */
export function MonthSummary({
  prevLabel,
  income,
  expense,
  prevIncome,
  prevExpense,
  budgetLimit,
  className,
}: MonthSummaryProps) {
  const hasBudget = budgetLimit > 0
  const left = hasBudget ? budgetLimit - expense : income - expense
  const over = left < 0

  return (
    <section
      aria-label="Month summary"
      className={cn(
        "flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-xs sm:p-6",
        className
      )}
    >
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="flex items-center gap-1 text-sm text-muted-foreground">
            <ArrowDownLeft className="size-4 text-income" aria-hidden="true" />
            Income
          </dt>
          <dd className="tnum mt-1 text-xl font-bold text-income">
            {formatMoney(income)}
          </dd>
          <ComparisonLine
            current={income}
            previous={prevIncome}
            prevLabel={prevLabel}
          />
        </div>
        <div>
          <dt className="flex items-center gap-1 text-sm text-muted-foreground">
            <ArrowUpRight className="size-4 text-expense" aria-hidden="true" />
            Expenses
          </dt>
          <dd className="tnum mt-1 text-xl font-bold text-expense">
            {formatMoney(expense)}
          </dd>
          <ComparisonLine
            current={expense}
            previous={prevExpense}
            prevLabel={prevLabel}
          />
        </div>
      </dl>

      <div className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {hasBudget
            ? over
              ? "Over budget"
              : "Left to spend"
            : over
              ? "Spent more than earned"
              : "Saved"}
        </p>
        <p
          className={cn(
            "tnum mt-0.5 text-2xl font-bold tracking-tight",
            over && "text-expense"
          )}
        >
          {formatMoney(Math.abs(left))}
        </p>
        {hasBudget ? (
          <>
            <BudgetBar
              className="mt-3"
              spent={expense}
              limit={budgetLimit}
              label="Budget used"
            />
            <p className="tnum mt-2 text-xs text-muted-foreground">
              {formatMoney(expense)} of {formatMoney(budgetLimit)} budget
            </p>
          </>
        ) : null}
      </div>
    </section>
  )
}
