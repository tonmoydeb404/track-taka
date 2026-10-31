"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { showInstallGuide } from "./pwa-install-dialog"
import { useInstallPrompt } from "./use-install-prompt"

/**
 * "Install app" button for surfaces that offer the app directly (the landing
 * page). Opens the shared install dialog — native install on Chromium, a
 * screenshot guide on iOS. Always offered; only an already-installed session
 * hides it. Renders nothing on the server snapshot and corrects after
 * hydration.
 */
export function InstallButton({ className }: { className?: string }) {
  const { installed } = useInstallPrompt()

  if (installed) return null

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => void showInstallGuide()}
      className={cn(className)}
      size={"lg"}
    >
      <Download aria-hidden="true" />
      Install app
    </Button>
  )
}
