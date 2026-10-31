"use client"

import { Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { cn } from "@/lib/utils"

import {
  setUnsupportedInstallDialogOpen,
  useUnsupportedInstallDialog,
} from "./use-install-prompt"

/**
 * The guide for browsers with no install support (the third path of
 * installWithFeedback(), see use-install-prompt.ts) — and the last resort
 * when the guide dialog itself fails to load. Deliberately step-free: it
 * points people at their browser's own menu instead of walking through
 * per-browser UI. Mounted once in the root layout next to
 * <PwaInstallDialog />; opened imperatively via setUnsupportedInstallDialogOpen().
 */
export function UnsupportedInstallDialog() {
  const open = useUnsupportedInstallDialog()

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setUnsupportedInstallDialogOpen}
      mode="dialog"
    >
      <ResponsiveDialogContent dialogClassName="sm:max-w-md">
        <ResponsiveDialogHeader className="flex flex-col items-center gap-4 pt-6 text-center sm:pt-8">
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
            aria-hidden="true"
          >
            <Globe className="size-6" />
          </span>
          <div className="flex min-w-0 flex-col gap-1.5 text-center">
            <ResponsiveDialogTitle className="text-lg font-semibold">
              Install from your browser menu
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription className="text-sm text-muted-foreground">
              This browser doesn&apos;t support one-tap install. You can still
              add Track Taka from your browser&apos;s menu — look for
              &ldquo;Install app&rdquo; or &ldquo;Add to Home screen&rdquo;.
            </ResponsiveDialogDescription>
          </div>
        </ResponsiveDialogHeader>

        <ResponsiveDialogFooter
          className={cn("border-t-0", "items-stretch px-4 pb-4")}
        >
          <Button
            variant="outline"
            onClick={() => setUnsupportedInstallDialogOpen(false)}
          >
            Got it
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
