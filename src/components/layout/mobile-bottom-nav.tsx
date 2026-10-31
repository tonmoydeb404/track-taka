"use client"

import { Ellipsis, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { MoreSheet } from "@/components/layout/more-sheet"
import {
  MOBILE_TABS,
  MORE_ITEMS,
  type NavItem,
} from "@/components/layout/nav-config"
import { useKeyboardOpen, useModalParam, useQuickEntryParams } from "@/hooks"
import { haptic } from "@/lib/haptics"
import { isRouteActive, ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

// Native-feel touch: no selection, no long-press callout, no double-tap zoom delay.
const touch =
  "touch-manipulation select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]"
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"

/**
 * Fixed mobile tab bar: translucent like a native tab bar, three daily tabs,
 * a centred Add and More. Slides away while the keyboard is open.
 */
export function MobileBottomNav() {
  const pathname = usePathname()
  const quickEntry = useQuickEntryParams()
  // `?more=1` in the URL keeps the sheet open, so the back button closes it
  const more = useModalParam("more")
  const keyboardOpen = useKeyboardOpen()

  const moreActive = MORE_ITEMS.some((item) =>
    isRouteActive(pathname, item.view)
  )

  const tabClass = (active: boolean) =>
    cn(
      "group flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-0.5 pt-1 text-[11px] leading-none",
      touch,
      focusRing,
      active
        ? "font-semibold text-primary"
        : "font-medium text-muted-foreground"
    )

  // Active = tinted and heavier stroke (the native "filled" cue); press = shrink.
  const tabBody = (label: string, Icon: NavItem["icon"], active: boolean) => (
    <>
      <Icon
        className="size-6 transition-transform duration-150 group-active:scale-90"
        strokeWidth={active ? 2.4 : 1.75}
        aria-hidden="true"
      />
      <span className="max-w-full truncate px-0.5">{label}</span>
    </>
  )

  const linkTab = ({ view, label, icon }: NavItem) => {
    const active = isRouteActive(pathname, view)
    return (
      <Link
        key={view}
        href={ROUTES[view]}
        aria-current={active ? "page" : undefined}
        onClick={(e) => {
          // Tapping the current tab scrolls to top, as native tab bars do
          if (active) {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          haptic()
        }}
        className={tabClass(active)}
      >
        {tabBody(label, icon, active)}
      </Link>
    )
  }

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className={cn(
          "pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/80 backdrop-blur-xl backdrop-saturate-150 transition-transform duration-200 lg:hidden",
          keyboardOpen && "translate-y-full"
        )}
      >
        <div className="mx-auto flex h-bottomnav max-w-lg items-stretch px-1">
          {MOBILE_TABS.slice(0, 2).map(linkTab)}

          <div className="flex w-14 shrink-0 items-center justify-center">
            <button
              type="button"
              onClick={() => {
                haptic(12)
                quickEntry.openAdd("expense")
              }}
              aria-label="Add transaction"
              className={cn(
                "flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition-transform duration-150 active:scale-90",
                touch,
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              )}
            >
              <Plus className="size-6" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          {MOBILE_TABS.slice(2).map(linkTab)}

          <button
            type="button"
            onClick={() => {
              haptic()
              more.open()
            }}
            aria-expanded={more.isOpen}
            aria-haspopup="dialog"
            aria-current={moreActive ? "page" : undefined}
            className={tabClass(moreActive)}
          >
            {tabBody("More", Ellipsis, moreActive)}
          </button>
        </div>
      </nav>

      <MoreSheet />
    </>
  )
}
