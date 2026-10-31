"use client"

import { Cloud, CloudOff } from "lucide-react"

import { useOnline } from "@/components/layout/use-online"
import { cn } from "@/lib/utils"

interface SyncStatusProps {
  className?: string
}

/**
 * Honest save indicator: the app is local-first, so every change is stored on
 * this device immediately. There is no cloud sync yet.
 */
export function SyncStatus({ className }: SyncStatusProps) {
  const online = useOnline()
  const Icon = online ? Cloud : CloudOff

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
      role="status"
    >
      <Icon
        className={cn("h-3.5 w-3.5", online ? "text-income" : "text-expense")}
        aria-hidden="true"
      />
      <span>
        {online ? "Saved on this device" : "Offline · saved on this device"}
      </span>
    </div>
  )
}
