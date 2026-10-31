"use client"

import type { ReactNode } from "react"

import { DesktopSidebar } from "@/components/layout/desktop-sidebar"
import { ConfirmProvider } from "@/components/common/confirm-dialog"
import { PageTransition } from "@/components/layout/page-transition"
import { PageSkeleton } from "@/components/layout/page-skeleton"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { MobileStatusBanner } from "@/components/layout/mobile-status-banner"
import { ThemeSync } from "@/components/layout/theme-sync"
import { QuickEntrySheet } from "@/components/quick-entry"
import { useMounted } from "@/hooks"
import { useDatabaseState } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { TransactionDetailSheet } from "@/components/transactions"
import { VoiceCaptureDialog } from "@/components/quick-entry"

/** Application chrome: sidebar, mobile bars and the global overlays. */
export function AppShell({ children }: { children: ReactNode }) {
  // Wait for hydration so persisted local state renders without flicker
  const mounted = useMounted()
  const { error } = useDatabaseState()

  if (error) return <DatabaseErrorPanel error={error} />

  return (
    <ConfirmProvider>
      <div className="min-h-dvh bg-background text-foreground">
        <ThemeSync />
        <DesktopSidebar />

        <div className="flex min-h-dvh flex-col lg:pl-sidebar">
          <MobileStatusBanner />
          <main className="app-gutter flex-1 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(var(--spacing-bottomnav)+max(env(safe-area-inset-bottom),0.75rem)+1.5rem)] lg:pt-8 lg:pb-8">
            <div className="mx-auto w-full max-w-content">
              {mounted ? (
                <PageTransition>{children}</PageTransition>
              ) : (
                <PageSkeleton />
              )}
            </div>
          </main>
        </div>

        <MobileBottomNav />

        {/* Global overlays — mounted once, self-closed via ui-store state */}
        <QuickEntrySheet />
        <VoiceCaptureDialog />
        <TransactionDetailSheet />
      </div>
    </ConfirmProvider>
  )
}

function DatabaseErrorPanel({ error }: { error: Error }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-6 text-foreground">
      <div
        role="alert"
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border bg-card p-6 shadow-xs"
      >
        <h1 className="text-xl font-bold tracking-tight">
          Couldn&rsquo;t open your data on this device
        </h1>
        <p className="text-sm text-muted-foreground">
          Track Taka stores everything in this browser. Private browsing or
          blocked site storage can stop it from opening. Your data hasn&rsquo;t
          been changed.
        </p>
        <details className="rounded-lg bg-muted p-3 text-sm">
          <summary className="cursor-pointer font-medium">Details</summary>
          <pre className="mt-2 font-mono text-xs break-words whitespace-pre-wrap">
            {error.message}
          </pre>
        </details>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    </div>
  )
}
