import type { ReactNode } from "react"

import { DateRangeButton } from "@/components/layout/date-range-button"

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

/**
 * Standard view heading. No container: the title sits directly on the page so
 * it costs little height on mobile. Actions share the row when they fit and
 * wrap beneath the title when they don't.
 */
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0 flex-1 basis-36">
        <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <DateRangeButton />
      </div>
    </header>
  )
}
