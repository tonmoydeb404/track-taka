import Link from "next/link"
import { Target } from "lucide-react"

import { BudgetBar } from "@/components/common/budget-bar"
import { EmptyState } from "@/components/common/empty-state"
import { Button } from "@/components/ui/button"
import {
  formatMoney,
  getCategory,
  monthLabel,
  type BudgetStatus,
} from "@/lib/domain"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

import { Section } from "./section"

interface BudgetSnapshotProps {
  month: string
  rows: BudgetStatus[]
  className?: string
}

/** The three budgets closest to (or past) their limit. */
export function BudgetSnapshot({
  month,
  rows,
  className,
}: BudgetSnapshotProps) {
  return (
    <Section
      title="Budgets"
      description={monthLabel(month)}
      action={{ label: "Manage", href: ROUTES.budgets }}
      className={className}
    >
      {rows.length > 0 ? (
        <ul className="space-y-4">
          {rows.map(({ budget, spent, remaining, state }) => {
            const cat = getCategory(budget.categoryId)
            const name = cat?.name ?? "Uncategorized"
            return (
              <li key={budget.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-sm font-medium">
                    {name}
                  </span>
                  <span
                    className={cn(
                      "tnum shrink-0 text-sm font-semibold",
                      state === "over" && "text-expense",
                      state === "warning" && "text-warning"
                    )}
                  >
                    {state === "over"
                      ? `Over by ${formatMoney(Math.abs(remaining))}`
                      : `${formatMoney(remaining)} left`}
                  </span>
                </div>
                <BudgetBar
                  className="mt-2"
                  spent={spent}
                  limit={budget.limit}
                  label={`${name} budget`}
                />
                <p className="tnum mt-1.5 text-xs text-muted-foreground">
                  {formatMoney(spent)} of {formatMoney(budget.limit)}
                </p>
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyState
          icon={Target}
          title="No budgets this month"
          description="Set a limit per category to see how much you can still spend."
          action={
            <Button asChild>
              <Link href={ROUTES.budgets}>Create a budget</Link>
            </Button>
          }
        />
      )}
    </Section>
  )
}
