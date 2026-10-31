import { BarChart3 } from "lucide-react"

import { EmptyState } from "@/components/common/empty-state"

export function NoActivity({ period }: { period: string }) {
  return (
    <EmptyState
      icon={BarChart3}
      title="Nothing to analyse yet"
      description={`No spending or income was recorded for ${period}. Try another period.`}
    />
  )
}

export function AnalyticsLoading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="h-48 animate-pulse rounded-xl border bg-muted/40"
    />
  )
}
