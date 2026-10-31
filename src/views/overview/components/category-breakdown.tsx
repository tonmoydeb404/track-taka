import { PieChart } from "lucide-react"

import { CategoryIcon } from "@/components/common/category-icon"
import { EmptyState } from "@/components/common/empty-state"
import { formatMoney, getCategory, monthLabel } from "@/lib/domain"
import { ROUTES } from "@/lib/routes"

import { Section } from "./section"

interface CategoryBreakdownProps {
  month: string
  rows: { categoryId: string; total: number; share: number }[]
  className?: string
}

export function CategoryBreakdown({
  month,
  rows,
  className,
}: CategoryBreakdownProps) {
  return (
    <Section
      title="Where money went"
      description={monthLabel(month)}
      action={{ label: "Analytics", href: ROUTES.analytics }}
      className={className}
    >
      {rows.length > 0 ? (
        <ul className="space-y-4">
          {rows.map((c) => {
            const cat = getCategory(c.categoryId)
            const name = cat?.name ?? "Uncategorized"
            const pct = Math.round(c.share * 100)
            return (
              <li key={c.categoryId}>
                <div className="flex items-center gap-3">
                  <CategoryIcon
                    icon={cat?.icon ?? "package"}
                    color={cat?.color}
                    size={14}
                    className="size-8"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {name}
                  </span>
                  <span className="tnum text-sm font-semibold">
                    {formatMoney(c.total)}
                  </span>
                  <span className="tnum w-9 shrink-0 text-right text-xs text-muted-foreground">
                    {pct}%
                  </span>
                </div>
                <div
                  className="mt-2 ml-11 h-1.5 overflow-hidden rounded-full bg-secondary"
                  role="img"
                  aria-label={`${name}: ${pct}% of expenses`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(c.share * 100, 2)}%`,
                      backgroundColor: cat?.color ?? "var(--chart-1)",
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <EmptyState
          icon={PieChart}
          title="No expenses yet"
          description="Expenses are grouped by category here."
        />
      )}
    </Section>
  )
}
