"use client"

import { cloneElement, useState, type ReactElement } from "react"
import { RotateCcw } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { rangeLabel, useIsMobile } from "@/hooks"
import { haptic } from "@/lib/haptics"
import { dayKey, monthKey } from "@/lib/domain"
import { cn } from "@/lib/utils"

export interface RangePreset {
  label: string
  range: () => { from: Date; to: Date }
}

interface DateRangePickerProps {
  /** The button that opens the picker. */
  trigger: ReactElement<{ onClick?: () => void }>
  value: DateRange | undefined
  onChange: (range: { from: Date; to: Date }) => void
  /** Offered as a "Reset" button when given. */
  onReset?: () => void
  resetLabel?: string
  presets?: RangePreset[]
  /** Latest selectable day (default: no limit). */
  max?: Date
}

/**
 * Pick a from–to range of days. A popover with two months on desktop; a
 * bottom drawer on phones. Nothing is applied until "Apply", except presets,
 * which apply straight away.
 */
export function DateRangePicker({
  trigger,
  value,
  onChange,
  onReset,
  resetLabel = "Reset",
  presets,
  max,
}: DateRangePickerProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>(value)

  const handleOpenChange = (next: boolean) => {
    // Every session starts from what's currently applied
    if (next) setDraft(value)
    setOpen(next)
  }
  const apply = () => {
    if (!draft?.from) return
    onChange({ from: draft.from, to: draft.to ?? draft.from })
    setOpen(false)
  }

  const draftFrom = draft?.from ? dayKey(draft.from) : null
  const draftTo = draft?.from ? dayKey(draft.to ?? draft.from) : null
  const summary =
    draftFrom && draftTo
      ? `${rangeLabel(draftFrom, draftTo)} · ${dayCount(draftFrom, draftTo)}`
      : "Tap a start day, then an end day."

  const presetRow = presets?.length ? (
    <div
      className={cn(
        "flex scrollbar-none gap-2 overflow-x-auto",
        isMobile ? "px-4 pb-1" : "w-44 flex-col gap-1 overflow-visible p-3"
      )}
    >
      {presets.map((p) => {
        const r = p.range()
        const active = dayKey(r.from) === draftFrom && dayKey(r.to) === draftTo
        return (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              haptic()
              onChange(r)
              setOpen(false)
            }}
            className={cn(
              "shrink-0 touch-manipulation text-sm font-medium transition-colors select-none",
              isMobile
                ? "h-10 rounded-full border px-4 active:scale-95"
                : "h-9 rounded-lg px-3 text-left",
              active
                ? isMobile
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
                : isMobile
                  ? "bg-card hover:bg-muted"
                  : "hover:bg-muted"
            )}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  ) : null

  // Two months side by side: when the range ends in the latest selectable
  // month, start one earlier so the right-hand month isn't all greyed out.
  const anchor = draft?.to ?? draft?.from
  const firstMonth =
    anchor && !isMobile && max && monthKey(anchor) >= monthKey(max)
      ? new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1)
      : anchor
        ? new Date(anchor.getFullYear(), anchor.getMonth(), 1)
        : undefined

  const calendar = (
    <Calendar
      mode="range"
      numberOfMonths={isMobile ? 1 : 2}
      selected={draft}
      onSelect={(r) => {
        haptic()
        setDraft(r)
      }}
      defaultMonth={firstMonth}
      disabled={max ? { after: max } : undefined}
      className={cn(
        "bg-transparent",
        // Fill the sheet on phones, with finger-sized days
        isMobile
          ? "w-full p-4 [--cell-size:--spacing(11)]"
          : "p-4 [--cell-size:--spacing(10)]"
      )}
      classNames={
        isMobile ? { root: "w-full" } : { months: "relative flex gap-8" }
      }
    />
  )

  const actions = (
    <>
      {onReset ? (
        <Button
          type="button"
          variant="outline"
          className={cn("flex-1 sm:flex-none", isMobile && "h-12 rounded-xl")}
          onClick={() => {
            onReset()
            setOpen(false)
          }}
        >
          <RotateCcw aria-hidden="true" />
          {resetLabel}
        </Button>
      ) : null}
      <Button
        type="button"
        className={cn("flex-1 sm:flex-none", isMobile && "h-12 rounded-xl")}
        onClick={() => {
          haptic()
          apply()
        }}
        disabled={!draft?.from}
      >
        Apply
      </Button>
    </>
  )

  if (isMobile) {
    return (
      <>
        {cloneElement(trigger, { onClick: () => handleOpenChange(true) })}
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerContent>
            <DrawerHeader className="pb-3">
              <DrawerTitle>Date range</DrawerTitle>
              <DrawerDescription className="tnum">{summary}</DrawerDescription>
            </DrawerHeader>
            {presetRow}
            {/* Swiping the calendar must not drag the sheet */}
            <div data-vaul-no-drag className="min-h-0 overflow-y-auto">
              {calendar}
            </div>
            <DrawerFooter className="flex-row border-t">{actions}</DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="end">
        <div className="flex">
          {presetRow ? (
            <div className="border-r bg-muted/30">
              <p className="px-6 pt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Quick picks
              </p>
              {presetRow}
            </div>
          ) : null}
          <div className="flex flex-col">
            <p className="tnum px-5 pt-4 text-sm font-semibold">{summary}</p>
            {calendar}
            <div className="mt-auto flex items-center justify-end gap-2 border-t p-3">
              {actions}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const dayCount = (from: string, to: string) => {
  const n =
    Math.round(
      (new Date(`${to}T12:00:00`).getTime() -
        new Date(`${from}T12:00:00`).getTime()) /
        86_400_000
    ) + 1
  return `${n} ${n === 1 ? "day" : "days"}`
}
