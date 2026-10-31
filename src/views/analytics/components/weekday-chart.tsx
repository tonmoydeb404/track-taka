"use client"

import { Bar, BarChart, Cell, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatMoney } from "@/lib/domain"

const CONFIG = {
  total: { label: "Spent", color: "var(--expense)" },
} satisfies ChartConfig

/** Spending per weekday; the biggest day is solid, the rest are lighter. */
export function WeekdayChart({
  data,
}: {
  data: { label: string; total: number }[]
}) {
  const max = Math.max(...data.map((d) => d.total))
  return (
    <ChartContainer config={CONFIG} className="aspect-auto h-[200px] w-full">
      <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.5 }}
          content={
            <ChartTooltipContent
              hideIndicator
              formatter={(v) => (
                <span className="tnum font-medium">
                  {formatMoney(Number(v))}
                </span>
              )}
            />
          }
        />
        <Bar
          dataKey="total"
          radius={[6, 6, 0, 0]}
          maxBarSize={36}
          isAnimationActive={false}
        >
          {data.map((d) => (
            <Cell
              key={d.label}
              fill="var(--color-total)"
              fillOpacity={d.total === max && max > 0 ? 1 : 0.4}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
