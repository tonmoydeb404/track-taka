"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { ROUTES } from "@/lib/routes"

import { cn } from "@/lib/utils"

/**
 * Heading for a settings page: a "‹ Settings" back link on phones, then the
 * section's icon tile, title and one line of help.
 */
export function SettingsDetailHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <header className="flex flex-col gap-3">
      <Link
        href={ROUTES.settings}
        className="-ml-2 inline-flex h-11 w-fit items-center gap-0.5 rounded-lg px-2 text-base font-medium text-primary focus-visible:outline-2 focus-visible:outline-ring lg:hidden"
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
        Settings
      </Link>
      <div className="flex items-start gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground"
          aria-hidden="true"
        >
          <Icon className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight lg:hidden">
            {title}
          </h1>
          <h2 className="hidden text-2xl font-bold tracking-tight lg:block">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </header>
  )
}

/** A titled, divided group of rows (the iOS "grouped list"). */
export function SettingsGroup({
  title,
  note,
  children,
  className,
}: {
  title?: string
  /** Small explanation under the group. */
  note?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={className}>
      {title ? (
        <h3 className="px-1 pb-2 text-sm font-semibold">{title}</h3>
      ) : null}
      <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-xs">
        {children}
      </div>
      {note ? (
        <p className="px-1 pt-2 text-sm text-muted-foreground">{note}</p>
      ) : null}
    </section>
  )
}

/** Label on the left, value or control on the right. */
export function SettingsRow({
  label,
  description,
  children,
  className,
}: {
  label: string
  description?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-14 items-center justify-between gap-4 px-4 py-3",
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-base font-medium">{label}</p>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex shrink-0 items-center gap-2 text-right text-base text-muted-foreground">
          {children}
        </div>
      ) : null}
    </div>
  )
}

/** A whole-row button: icon, label, optional detail, chevron. */
export function SettingsActionRow({
  icon,
  label,
  description,
  onClick,
  tone = "default",
  chevron = true,
  disabled,
  className,
}: {
  icon?: ReactNode
  label: string
  description?: string
  onClick?: () => void
  tone?: "default" | "destructive"
  chevron?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex min-h-14 w-full touch-manipulation items-center gap-3 px-4 py-3 text-left transition-colors select-none hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring active:bg-muted disabled:pointer-events-none disabled:opacity-50",
        tone === "destructive" && "text-destructive",
        className
      )}
    >
      {icon ? (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-base font-medium">{label}</span>
        {description ? (
          <span
            className={cn(
              "block text-sm",
              tone === "destructive"
                ? "text-destructive/80"
                : "text-muted-foreground"
            )}
          >
            {description}
          </span>
        ) : null}
      </span>
      {chevron ? (
        <ChevronRight
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      ) : null}
    </button>
  )
}
