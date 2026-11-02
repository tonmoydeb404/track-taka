"use client"

import { formatMoney } from "@/lib/domain"

interface RecordPanelProps {
  eligibleCount: number
  /** Rows that will stay on the sheet (unpriced notes). */
  stayingCount: number
  eligibleTotal: number
}

/**
 * Desktop summary beside the sheet: what recording will produce. Recording
 * itself is per row (✓ opens the quick-entry dialog pre-filled), so the
 * panel only informs — it never gates.
 */
export function RecordPanel({
  eligibleCount,
  stayingCount,
  eligibleTotal,
}: RecordPanelProps) {
  return (
    <aside className="hidden flex-col gap-4 lg:sticky lg:top-10 lg:flex">
      <div className="flex flex-col gap-1">
        <p className="caption-1 text-muted-foreground">To record</p>
        <p className="tnum heading-4" aria-live="polite">
          {formatMoney(eligibleTotal)}
        </p>
        <p className="caption-5 text-muted-foreground">
          {eligibleCount > 0
            ? `${eligibleCount} priced row${eligibleCount === 1 ? "" : "s"}` +
              (stayingCount > 0
                ? ` · ${stayingCount} note${stayingCount === 1 ? "" : "s"} stay`
                : "")
            : "Price a row, then ✓ to record it"}
        </p>
      </div>

      <div className="flex flex-col gap-2 border-t border-border/70 pt-4 text-xs leading-relaxed text-muted-foreground/80">
        <p>
          ✓ records a single row: it opens the quick-entry form filled in, and
          leaves the sheet once you save.
        </p>
        <p>
          Unpriced notes stay here — price them whenever you&apos;re ready.
        </p>
      </div>
    </aside>
  )
}
