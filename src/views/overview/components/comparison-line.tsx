"use client"

import { TrendingDown, TrendingUp } from "lucide-react"

import { formatMoney } from "@/lib/domain"

interface ComparisonLineProps {
  current: number
  previous: number
  prevLabel: string
}

/** Neutral, factual month-over-month line — states the delta, never colours it. */
export function ComparisonLine({
  current,
  previous,
  prevLabel,
}: ComparisonLineProps) {
  const delta = current - previous
  if (Math.abs(delta) < 0.5) {
    return (
      <p className="mt-1 text-xs text-muted-foreground">
        No change vs {prevLabel}
      </p>
    )
  }
  const Icon = delta > 0 ? TrendingUp : TrendingDown
  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="tnum">
        {formatMoney(Math.abs(delta))} vs {prevLabel}
      </span>
    </p>
  )
}
