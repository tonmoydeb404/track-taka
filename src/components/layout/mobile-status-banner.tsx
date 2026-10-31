"use client"

import { CloudOff } from "lucide-react"

import { useOnline } from "@/components/layout/use-online"

/**
 * Mobile has no top bar, so connection state only surfaces when it needs
 * attention: offline. Sticks under the status bar.
 */
export function MobileStatusBanner() {
  const online = useOnline()
  if (online) return null

  return (
    <div
      role="status"
      className="pt-safe sticky top-0 z-40 border-b bg-card lg:hidden"
    >
      <div className="flex h-9 items-center justify-center gap-2 px-4 text-xs font-medium">
        <CloudOff className="size-3.5 text-expense" aria-hidden="true" />
        You&rsquo;re offline · changes save on this device
      </div>
    </div>
  )
}
