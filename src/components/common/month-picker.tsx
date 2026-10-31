"use client"

import { cloneElement, useState, type ReactElement } from "react"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useIsMobile } from "@/hooks"
import { addMonths, monthKey, monthLabel } from "@/lib/domain"
import { haptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"

interface MonthPickerProps {
  /** Month key, e.g. "2026-10". */
  month: string
  onChange: (month: string) => void
  /** How many months past the current one can be chosen (default 0). */
  maxAhead?: number
  className?: string
}

const MONTH_NAMES = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleDateString("en-US", { month: "short" })
)

/**
 * Pick one month: a year header with arrows over a 3×4 grid of months. A
 * popover on desktop, a bottom drawer on phones. Choosing a month applies it.
 */
export function MonthPicker({
  month,
  onChange,
  maxAhead = 0,
  className,
}: MonthPickerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(Number(month.slice(0, 4)))

  const current = monthKey(new Date())
  const latest = addMonths(current, maxAhead)
  const latestYear = Number(latest.slice(0, 4))

  const handleOpenChange = (next: boolean) => {
    // Every session opens on the year of the applied month
    if (next) setYear(Number(month.slice(0, 4)))
    setOpen(next)
  }

  const trigger: ReactElement<{ onClick?: () => void }> = (
    <Button
      type="button"
      variant="outline"
      className={cn("font-semibold tabular-nums", className)}
      aria-label={`Month: ${monthLabel(month)}. Change month`}
    >
      <CalendarDays aria-hidden="true" />
      {monthLabel(month)}
    </Button>
  )

  const grid = (
    <div className={cn("p-4", !isMobile && "w-72")}>
      <div className="mb-3 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Previous year"
          onClick={() => setYear((y) => y - 1)}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <span className="tnum text-base font-semibold">{year}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Next year"
          disabled={year >= latestYear}
          onClick={() => setYear((y) => y + 1)}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {MONTH_NAMES.map((name, i) => {
          const key = `${year}-${String(i + 1).padStart(2, "0")}`
          const selected = key === month
          return (
            <button
              key={key}
              type="button"
              disabled={key > latest}
              aria-pressed={selected}
              onClick={() => {
                haptic()
                onChange(key)
                setOpen(false)
              }}
              className={cn(
                "touch-manipulation rounded-xl text-sm font-medium transition-colors select-none disabled:pointer-events-none disabled:opacity-35",
                isMobile ? "h-14 active:scale-95" : "h-11",
                selected
                  ? "bg-primary text-primary-foreground"
                  : key === current
                    ? "bg-accent text-accent-foreground hover:bg-accent/70"
                    : "hover:bg-muted"
              )}
            >
              {name}
            </button>
          )
        })}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {cloneElement(trigger, { onClick: () => handleOpenChange(true) })}
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerContent>
            <DrawerHeader className="pb-0">
              <DrawerTitle>Choose month</DrawerTitle>
              <DrawerDescription className="sr-only">
                Pick the month to show.
              </DrawerDescription>
            </DrawerHeader>
            {grid}
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        {grid}
      </PopoverContent>
    </Popover>
  )
}
