"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Download } from "lucide-react"

import { MORE_ITEMS } from "@/components/layout/nav-config"
import { showInstallGuide, useInstallPrompt } from "@/components/pwa"
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { isRouteActive, ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

interface MoreSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Bottom sheet listing secondary destinations on mobile. */
export function MoreSheet({ open, onOpenChange }: MoreSheetProps) {
  const pathname = usePathname()
  const { installed } = useInstallPrompt()

  function handleInstall() {
    // The dialog draws over everything; close the sheet first.
    onOpenChange(false)
    void showInstallGuide()
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      sheetSide="bottom"
    >
      <ResponsiveDialogContent
        className="rounded-t-2xl"
        sheetClassName="rounded-t-2xl px-4 pt-2"
        drawerClassName="rounded-t-2xl px-4"
      >
        <ResponsiveDialogHeader className="sr-only">
          <ResponsiveDialogTitle>More destinations</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Navigate to secondary sections
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogBody className="pb-safe">
          <nav aria-label="Secondary navigation" className="grid gap-1 pb-3">
            {MORE_ITEMS.map(({ view: v, label, icon: Icon }) => {
              const active = isRouteActive(pathname, v)
              return (
                <Link
                  key={v}
                  href={ROUTES[v]}
                  onClick={() => onOpenChange(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-14 w-full items-center gap-3 rounded-xl px-2 text-base transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-ring",
                    active
                      ? "bg-accent font-semibold text-accent-foreground"
                      : "font-medium text-foreground active:bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-left">{label}</span>
                  <ChevronRight
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </nav>
          {/* Always offered; only an already-installed session hides it. */}
          {!installed && (
            <div className="mt-2 border-t pt-2 pb-3">
              <button
                type="button"
                onClick={handleInstall}
                className={cn(
                  "flex h-14 w-full items-center gap-3 rounded-xl px-2 text-base transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-ring",
                  "font-medium text-foreground active:bg-muted"
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Download className="size-5" aria-hidden="true" />
                </span>
                <span className="flex-1 text-left">Install app</span>
                <span className="text-sm text-muted-foreground">
                  Add to home screen
                </span>
              </button>
            </div>
          )}
        </ResponsiveDialogBody>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
