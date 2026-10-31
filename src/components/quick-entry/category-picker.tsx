"use client"

import * as React from "react"

import { CategoryIcon } from "@/components/common/category-icon"
import { categoriesFor } from "@/lib/domain"
import { cn } from "@/lib/utils"

interface CategoryPickerProps {
  /** Which category type to show. */
  type: "expense" | "income"
  value: string | null
  onChange: (categoryId: string) => void
  /** Slightly denser cells for dialogs. */
  compact?: boolean
  id?: string
  className?: string
}

/**
 * Tappable icon grid of categories. Selected cell gets a primary ring.
 * Cells are at least 44px tall for touch targets.
 */
export function CategoryPicker({
  type,
  value,
  onChange,
  compact = false,
  id,
  className,
}: CategoryPickerProps) {
  const visible = React.useMemo(() => categoriesFor(type), [type])

  if (visible.length === 0) {
    return <p className="text-sm text-muted-foreground">No categories yet.</p>
  }

  return (
    <div
      id={id}
      role="radiogroup"
      aria-label={type === "expense" ? "Expense category" : "Income category"}
      className={cn(
        "grid grid-cols-4 gap-1.5 sm:grid-cols-5 sm:gap-2",
        className
      )}
    >
      {visible.map((cat) => {
        const selected = value === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(cat.id)}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl border border-transparent p-1.5 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              selected && "bg-accent ring-2 ring-primary"
            )}
          >
            <CategoryIcon
              icon={cat.icon}
              color={cat.color}
              size={compact ? 16 : 18}
              className={compact ? "h-8 w-8" : "h-10 w-10"}
            />
            <span className="w-full truncate text-center text-[11px] leading-tight text-foreground">
              {cat.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
