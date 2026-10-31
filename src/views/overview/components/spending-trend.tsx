"use client"

import { BarChart3 } from "lucide-react"
import { Bar, CartesianGrid, ComposedChart, XAxis } from "recharts"

import { EmptyState } from "@/components/common/empty-state"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatMoney } from "@/lib/domain"

import { Section } from "./section"

// Expenses are coral everywhere in the app, never the brand blue.
const CONFIG = {
  expense: { label: "Expense", color: "var(--expense)" },
} satisfies ChartConfig

interface SpendingTrendProps {
  label: string
  series: { label: string; expense: number }[]
  className?: string
}

export function SpendingTrend({
  label,
  series,
  className,
}: SpendingTrendProps) {
  const hasData = series.some((d) => d.expense > 0)

  return (
    <Section title="Daily spending" description={label} className={className}>
      {hasData ? (
        <ChartContainer
          config={CONFIG}
          className="aspect-auto h-[200px] w-full sm:h-[260px]"
        >
          <ComposedChart
            data={series}
            margin={{ top: 8, right: 4, bottom: 0, left: 4 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) =>
                    payload?.[0] ? payload[0].payload.label : ""
                  }
                  formatter={(value) => (
                    <span className="tnum font-medium">
                      {formatMoney(Number(value))}
                    </span>
                  )}
                  hideIndicator
                />
              }
              cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            />
            <Bar
              dataKey="expense"
              fill="var(--color-expense)"
              radius={[4, 4, 0, 0]}
              maxBarSize={12}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ChartContainer>
      ) : (
        <EmptyState
          icon={BarChart3}
          title="No spending yet"
          description="Daily expenses show up here as you record them."
        />
      )}
    </Section>
  )
}
