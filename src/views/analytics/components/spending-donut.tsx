"use client"

import { Cell, Pie, PieChart } from "recharts"

import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { formatMoney } from "@/lib/domain"

const CONFIG = { total: { label: "Spent" } } satisfies ChartConfig

export interface Slice {
  name: string
  value: number
  color: string
}

/** Share of spending by category, with the total in the middle. */
export function SpendingDonut({
  slices,
  total,
}: {
  slices: Slice[]
  total: number
}) {
  return (
    <div className="relative mx-auto size-56 sm:size-64">
      <ChartContainer config={CONFIG} className="aspect-square size-full">
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="name"
            innerRadius="68%"
            outerRadius="100%"
            paddingAngle={slices.length > 1 ? 2 : 0}
            strokeWidth={0}
            isAnimationActive={false}
          >
            {slices.map((s) => (
              <Cell key={s.name} fill={s.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-sm text-muted-foreground">Total spent</span>
        <span className="tnum text-2xl font-bold tracking-tight">
          {formatMoney(total)}
        </span>
      </div>
    </div>
  )
}
