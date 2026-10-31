"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { compactMoney, formatMoney } from "@/lib/domain"

const MONTHLY = {
  income: { label: "Income", color: "var(--income)" },
  expense: { label: "Spent", color: "var(--expense)" },
} satisfies ChartConfig

const DAILY = {
  expense: { label: "Spent", color: "var(--expense)" },
} satisfies ChartConfig

const tick = { fontSize: 12 }

/** Single month: spending per day. Longer periods: income against spending per month. */
export function TrendChart({
  single,
  daily,
  monthly,
}: {
  single: boolean
  daily: { label: string; expense: number }[]
  monthly: { label: string; income: number; expense: number }[]
}) {
  if (single) {
    return (
      <ChartContainer
        config={DAILY}
        className="aspect-auto h-[200px] w-full lg:h-[260px]"
      >
        <BarChart
          data={daily}
          margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="label"
            tick={tick}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            content={
              <ChartTooltipContent
                hideIndicator
                labelFormatter={(_, p) => (p?.[0] ? p[0].payload.label : "")}
                formatter={(v) => (
                  <span className="tnum font-medium">
                    {formatMoney(Number(v))}
                  </span>
                )}
              />
            }
          />
          <Bar
            dataKey="expense"
            fill="var(--color-expense)"
            radius={[4, 4, 0, 0]}
            maxBarSize={14}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>
    )
  }
  return (
    <ChartContainer
      config={MONTHLY}
      className="aspect-auto h-[200px] w-full lg:h-[260px]"
    >
      <BarChart
        data={monthly}
        margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
      >
        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="label"
          tick={tick}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={16}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.5 }}
          content={
            <ChartTooltipContent
              formatter={(v) => (
                <span className="tnum font-medium">
                  {compactMoney(Number(v))}
                </span>
              )}
            />
          }
        />
        <Bar
          dataKey="income"
          fill="var(--color-income)"
          radius={[4, 4, 0, 0]}
          maxBarSize={22}
          isAnimationActive={false}
        />
        <Bar
          dataKey="expense"
          fill="var(--color-expense)"
          radius={[4, 4, 0, 0]}
          maxBarSize={22}
          isAnimationActive={false}
        />
      </BarChart>
    </ChartContainer>
  )
}
