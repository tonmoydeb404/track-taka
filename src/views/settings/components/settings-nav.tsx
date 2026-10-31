"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronRight,
  Database,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react"
import type { ReactNode } from "react"

import { useSettings } from "@/hooks"
import { ROUTES, SETTINGS_ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

import { THEME_LABELS } from "../utils"

interface Item {
  href: string
  label: string
  icon: LucideIcon
  /** A glance at what's inside, shown on the phone cards. */
  peek: ReactNode
}

const chip =
  "inline-flex h-7 items-center rounded-full bg-muted px-2.5 text-sm font-medium text-muted-foreground tnum"

/**
 * Phone: two cards, each with a live peek at its contents.
 * lg+: a compact side nav next to the section.
 */
export function SettingsNav({ className }: { className?: string }) {
  const pathname = usePathname()
  const settings = useSettings()
  const weekStart = `${settings.weekStart[0].toUpperCase()}${settings.weekStart.slice(1)}`

  const items: Item[] = [
    {
      href: SETTINGS_ROUTES.general,
      label: "General",
      icon: SlidersHorizontal,
      peek: (
        <div className="flex flex-wrap gap-2">
          <span className={chip}>{THEME_LABELS[settings.theme]} theme</span>
          <span className={chip}>Week starts {weekStart}</span>
        </div>
      ),
    },
    {
      href: SETTINGS_ROUTES.data,
      label: "Data",
      icon: Database,
      peek: (
        <div className="flex flex-wrap gap-2">
          <span className={chip}>Saved on this device</span>
        </div>
      ),
    },
  ]

  return (
    <nav aria-label="Settings sections" className={className}>
      <ul className="flex flex-col gap-3 lg:gap-1">
        {items.map(({ href, label, icon: Icon, peek }) => {
          // On desktop the bare /dashboard/settings URL shows General
          const active =
            pathname === href ||
            (href === SETTINGS_ROUTES.general && pathname === ROUTES.settings)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex touch-manipulation flex-col gap-3 rounded-2xl border bg-card p-4 shadow-xs transition-colors select-none hover:bg-muted/40 active:bg-muted",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  "lg:min-h-11 lg:flex-row lg:items-center lg:gap-3 lg:rounded-lg lg:border-0 lg:bg-transparent lg:px-3 lg:py-2 lg:shadow-none",
                  active &&
                    "lg:bg-accent lg:text-accent-foreground lg:hover:bg-accent"
                )}
              >
                <span className="flex items-center gap-3 lg:flex-1">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground lg:size-auto lg:bg-transparent"
                    aria-hidden="true"
                  >
                    <Icon className="size-6 lg:size-5" />
                  </span>
                  <span className="flex-1 text-lg font-bold tracking-tight lg:text-base lg:font-medium lg:tracking-normal">
                    {label}
                  </span>
                  <ChevronRight
                    className="size-5 shrink-0 text-muted-foreground lg:hidden"
                    aria-hidden="true"
                  />
                </span>
                <span className="lg:hidden">{peek}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="px-1 pt-4 text-sm text-muted-foreground lg:px-3">
        Track Taka · version 0.1
      </p>
    </nav>
  )
}
