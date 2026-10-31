import { formatMoney } from "@/lib/domain"
import { cn } from "@/lib/utils"

interface BudgetBarProps {
  spent: number
  limit: number
  className?: string
  label: string
}

/**
 * Spending against a limit.
 *
 * Within the limit the bar fills toward the end, like any progress bar. Once
 * spending passes the limit the bar rescales to what was actually spent: the
 * in-budget part keeps its color (brand blue, or amber once past 80%), a gap marks where the limit was, and the
 * overspend continues past it in red. So "over" always shows how far over.
 */
export function BudgetBar({ spent, limit, className, label }: BudgetBarProps) {
  const over = limit > 0 && spent > limit
  const ratio = limit > 0 ? spent / limit : 0
  const warn = !over && ratio >= 0.8
  const fill = warn ? "var(--warning)" : "var(--primary)"

  const text = over
    ? `${Math.round(ratio * 100)}% of the limit, over by ${formatMoney(spent - limit)}`
    : `${Math.round(ratio * 100)}% of the limit`

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.min(Math.round(ratio * 100), 100)}
      aria-valuetext={text}
      className={cn(
        "flex h-2 gap-0.5 overflow-hidden rounded-full bg-secondary",
        className
      )}
    >
      {over ? (
        <>
          <div
            className="h-full shrink-0 rounded-l-full"
            style={{
              width: `${(limit / spent) * 100}%`,
              backgroundColor: fill,
            }}
          />
          <div className="h-full min-w-1 flex-1 rounded-r-full bg-expense" />
        </>
      ) : (
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${Math.min(ratio, 1) * 100}%`,
            backgroundColor: fill,
          }}
        />
      )}
    </div>
  )
}
