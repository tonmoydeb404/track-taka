"use client"

import Link from "next/link"
import {
  ArrowDownLeft,
  ArrowLeftRight,
  Mic,
  Plus,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useModalParam, useQuickEntryParams } from "@/hooks"
import { cn } from "@/lib/utils"

interface Action {
  label: string
  /** Short enough to sit under a round icon on a 360px phone. */
  shortLabel: string
  icon: LucideIcon
  /** Tint of the round icon on mobile. */
  tone: string
  onClick?: () => void
  href?: string
}

/**
 * Phone: round icon tiles with a short label beneath, like a banking app.
 * sm and up: a row of labelled buttons, with Add expense as the primary.
 */
export function QuickActions({ className }: { className?: string }) {
  const quickEntry = useQuickEntryParams()
  const voice = useModalParam("voice")

  const actions: Action[] = [
    {
      label: "Add expense",
      shortLabel: "Expense",
      icon: Plus,
      tone: "bg-expense/12 text-expense",
      onClick: () => quickEntry.openAdd("expense"),
    },
    {
      label: "Add income",
      shortLabel: "Income",
      icon: ArrowDownLeft,
      tone: "bg-income/12 text-income",
      onClick: () => quickEntry.openAdd("income"),
    },
    {
      label: "Transfer",
      shortLabel: "Transfer",
      icon: ArrowLeftRight,
      tone: "bg-accent text-accent-foreground",
      onClick: () => quickEntry.openAdd("transfer"),
    },
    {
      label: "Voice",
      shortLabel: "Voice",
      icon: Mic,
      tone: "bg-accent text-accent-foreground",
      onClick: () => voice.open(),
    },
  ]

  return (
    <nav aria-label="Quick actions" className={className}>
      <ul className="grid grid-cols-4 sm:hidden">
        {actions.map(
          ({ shortLabel, label, icon: Icon, tone, onClick, href }) => {
            const body = (
              <>
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full transition-transform group-active:scale-90",
                    tone
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium">{shortLabel}</span>
              </>
            )
            const cls =
              "group flex w-full touch-manipulation flex-col items-center gap-1.5 py-1 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            return (
              <li key={label} className="min-w-0">
                {href ? (
                  <Link href={href} aria-label={label} className={cls}>
                    {body}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={onClick}
                    aria-label={label}
                    className={cls}
                  >
                    {body}
                  </button>
                )}
              </li>
            )
          }
        )}
      </ul>

      <ul className="hidden flex-wrap gap-2 sm:flex">
        {actions.map(({ label, icon: Icon, onClick, href }, i) => (
          <li key={label} className={i === 0 ? "lg:hidden" : undefined}>
            <Button
              asChild={!!href}
              variant={i === 0 ? "default" : "outline"}
              onClick={onClick}
            >
              {href ? (
                <Link href={href}>
                  <Icon aria-hidden="true" />
                  {label}
                </Link>
              ) : (
                <>
                  <Icon aria-hidden="true" />
                  {label}
                </>
              )}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
