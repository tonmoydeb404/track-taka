"use client"

import { cn } from "@/lib/utils"

interface SegmentedControlProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
  "aria-label": string
  className?: string
}

/** Equal-width, single-choice switch (iOS style). Use for 2-4 short, mutually exclusive views. */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
  ...rest
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={rest["aria-label"]}
      className={cn(
        "grid auto-cols-fr grid-flow-col gap-0.5 rounded-xl bg-muted p-1",
        className
      )}
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-10 min-w-0 touch-manipulation truncate rounded-lg px-1 text-sm font-medium transition-[background-color,color,box-shadow] select-none pointer-coarse:h-11",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
              on
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground active:bg-card/50"
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
