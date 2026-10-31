import { TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * "12% more than September". Factual and uncoloured: whether more spending
 * is bad depends on the person, so we state the change and leave it there.
 */
export function Delta({
  change,
  versus,
  className,
}: {
  /** Percentage change, or null when there's nothing to compare with. */
  change: number | null
  /** What it's compared with: "September", "the same months last year". */
  versus: string | null
  className?: string
}) {
  if (change === null || !versus) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Nothing earlier to compare with
      </p>
    )
  }
  const rounded = Math.round(Math.abs(change))
  if (rounded === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        About the same as {versus}
      </p>
    )
  }
  const Icon = change > 0 ? TrendingUp : TrendingDown
  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-sm text-muted-foreground",
        className
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="tnum">
        {rounded}% {change > 0 ? "more" : "less"} than {versus}
      </span>
    </p>
  )
}
