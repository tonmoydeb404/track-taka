import { BudgetBar } from "@/components/common/budget-bar"
import { formatMoney } from "@/lib/domain"
import { cn } from "@/lib/utils"

interface BudgetSummaryProps {
  planned: number
  spent: number
  /** Days left in the month, today included; null when not the current month. */
  daysLeft: number | null
  overCount: number
  className?: string
}

/** The month's whole plan at a glance: what's left, how much is used, and the daily pace. */
export function BudgetSummary({
  planned,
  spent,
  daysLeft,
  overCount,
  className,
}: BudgetSummaryProps) {
  const left = planned - spent
  const over = left < 0

  let pace: string | null = null
  if (over) {
    pace = `${overCount} ${overCount === 1 ? "budget is" : "budgets are"} over the limit`
  } else if (daysLeft !== null && daysLeft > 0) {
    const perDay = formatMoney(Math.floor(left / daysLeft))
    pace =
      daysLeft === 1
        ? `${perDay} to spend today`
        : `About ${perDay} a day for the last ${daysLeft} days`
  }

  return (
    <section
      aria-label="Budget summary"
      className={cn(
        "rounded-xl border bg-card p-5 shadow-xs sm:p-6",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        {over ? "Over budget" : "Left to spend"}
      </p>
      <p
        className={cn(
          "tnum mt-1 text-3xl font-bold tracking-tight",
          over && "text-expense"
        )}
      >
        {formatMoney(Math.abs(left))}
      </p>

      <BudgetBar
        className="mt-4 h-2.5"
        spent={spent}
        limit={planned}
        label="Share of the plan spent"
      />
      <p className="tnum mt-2 text-sm text-muted-foreground">
        {formatMoney(spent)} of {formatMoney(planned)} planned
      </p>

      {pace ? (
        <p
          className={cn(
            "mt-4 rounded-lg bg-muted px-3 py-2.5 text-sm",
            over && "bg-expense/10 text-expense"
          )}
        >
          {pace}
        </p>
      ) : null}
    </section>
  )
}
