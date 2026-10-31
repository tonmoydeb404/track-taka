"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Download, Plus } from "lucide-react"

import { BrandMark } from "@/components/common"

import {
  NAV_GROUPS,
  SETTINGS,
  type NavItem,
} from "@/components/layout/nav-config"
import { SyncStatus } from "@/components/layout/sync-status"
import { showInstallGuide, useInstallPrompt } from "@/components/pwa"
import { useUIStore } from "@/lib/ui-store"
import { isRouteActive, ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"

/** Fixed left rail (lg+): brand, primary action, navigation, account. */
export function DesktopSidebar() {
  const pathname = usePathname()
  const openQuickEntry = useUIStore((s) => s.openQuickEntry)
  const { installed } = useInstallPrompt()

  const renderItem = ({ view: v, label, icon: Icon }: NavItem) => {
    const active = isRouteActive(pathname, v)
    return (
      <li key={v}>
        <Link
          href={ROUTES[v]}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors",
            focusRing,
            active
              ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          )}
        >
          <Icon className="size-[18px] shrink-0" aria-hidden="true" />
          {label}
        </Link>
      </li>
    )
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-sidebar flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex"
      aria-label="Primary"
    >
      {/* Brand: the taka sign is the mark */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-5">
        <BrandMark className="size-9 shrink-0" label="" />
        <span className="text-base font-bold tracking-tight">Track Taka</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3">
        <button
          type="button"
          onClick={() => openQuickEntry("expense")}
          className={cn(
            "mt-1 mb-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sidebar-primary px-3 text-sm font-semibold text-sidebar-primary-foreground transition-opacity hover:opacity-90",
            focusRing
          )}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add expense
        </button>

        <nav
          aria-label="Main navigation"
          className="scrollbar-slim -mx-1 min-h-0 flex-1 overflow-y-auto px-1"
        >
          {NAV_GROUPS.map((group, i) => (
            <ul
              key={i}
              className={cn("flex flex-col gap-0.5", i > 0 && "mt-6")}
            >
              {group.map(renderItem)}
            </ul>
          ))}
        </nav>

        <div className="mt-3 border-t border-sidebar-border pt-3">
          <ul>
            {renderItem(SETTINGS)}
            {/* Always offered; only an already-installed session hides it. */}
            {!installed && (
              <li>
                <button
                  type="button"
                  onClick={() => void showInstallGuide()}
                  className={cn(
                    "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                    focusRing,
                    "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                  )}
                >
                  <Download
                    className="size-[18px] shrink-0"
                    aria-hidden="true"
                  />
                  Install app
                </button>
              </li>
            )}
          </ul>

          <div className="mt-3 px-3">
            <SyncStatus className="text-sidebar-foreground/70 [&_svg]:text-sidebar-foreground/70" />
          </div>
        </div>
      </div>
    </aside>
  )
}
