import { CategoryIcon } from "@/components/common/category-icon"
import { Button } from "@/components/ui/button"
import { formatMoney, getCategory } from "@/lib/domain"
import { cn } from "@/lib/utils"

interface UnbudgetedSpendingProps {
  rows: { categoryId: string; total: number }[]
  onSetBudget: (categoryId: string) => void
  className?: string
}

/** Money spent this month in categories that have no limit yet. */
export function UnbudgetedSpending({
  rows,
  onSetBudget,
  className,
}: UnbudgetedSpendingProps) {
  if (rows.length === 0) return null
  return (
    <section
      aria-label="Spending without a budget"
      className={cn("rounded-xl border bg-card py-5 shadow-xs", className)}
    >
      <header className="px-5 sm:px-6">
        <h2 className="text-base font-semibold tracking-tight">Not budgeted</h2>
        <p className="text-sm text-muted-foreground">
          Spent this month with no limit set
        </p>
      </header>
      <ul className="mt-3 divide-y">
        {rows.map((r) => {
          const cat = getCategory(r.categoryId)
          return (
            <li
              key={r.categoryId}
              className="flex items-center gap-3 px-5 py-3 sm:px-6"
            >
              <CategoryIcon
                icon={cat?.icon ?? "package"}
                color={cat?.color}
                className="size-9"
                size={16}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-medium">
                  {cat?.name ?? "Uncategorized"}
                </p>
                <p className="tnum text-sm text-muted-foreground">
                  {formatMoney(r.total)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-primary"
                onClick={() => onSetBudget(r.categoryId)}
                aria-label={`Set a budget for ${cat?.name ?? "this category"}`}
              >
                Set limit
              </Button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
