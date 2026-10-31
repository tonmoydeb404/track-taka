import Link from "next/link"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SectionProps {
  title: string
  description?: string
  /** Link shown top-right, e.g. "View all". */
  action?: { label: string; href: string }
  children: ReactNode
  className?: string
  /** Remove body padding so rows can run edge to edge (lists). */
  flush?: boolean
}

/** Overview card: title, optional description and link, then content. */
export function Section({
  title,
  description,
  action,
  children,
  className,
  flush = false,
}: SectionProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "rounded-xl border bg-card py-5 shadow-xs sm:py-6",
        className
      )}
    >
      <header className="flex items-start justify-between gap-3 px-5 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="tnum mt-0.5 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-mt-1 -mr-2 shrink-0 text-primary"
          >
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : null}
      </header>
      <div className={cn("mt-4", flush ? "px-3" : "px-5 sm:px-6")}>
        {children}
      </div>
    </section>
  )
}
