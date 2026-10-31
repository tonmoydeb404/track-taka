"use client"

import * as React from "react"

import { ExpressionHint } from "@/components/common/expression-hint"
import { sanitizeMoneyExpression } from "@/lib/domain"
import { cn } from "@/lib/utils"

interface AmountInputProps {
  value: string
  onChange: (next: string) => void
  /** Marks the field invalid (red text + aria-invalid). */
  invalid?: boolean
  id?: string
  ariaLabel?: string
  autoFocus?: boolean
  /** 'lg' for the quick-entry hero field, 'md' for compact dialogs. */
  size?: "lg" | "md"
  inputRef?: React.Ref<HTMLInputElement>
  className?: string
}

/**
 * Large centered amount input with a ৳ prefix rendered beside it. Accepts
 * inline math ("120+80*2"), with the result shown underneath.
 * Numbers use tabular figures (tnum) so digits don't jitter while typing.
 */
export function AmountInput({
  value,
  onChange,
  invalid = false,
  id,
  ariaLabel = "Amount in taka",
  autoFocus = false,
  size = "lg",
  inputRef,
  className,
}: AmountInputProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl px-2 py-1",
        className
      )}
    >
      <div className="flex w-full items-center justify-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            "tnum font-medium text-muted-foreground select-none",
            size === "lg" ? "text-2xl" : "text-lg"
          )}
        >
          ৳
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder="0"
          autoFocus={autoFocus}
          value={value}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange(sanitizeMoneyExpression(e.target.value))}
          className={cn(
            "tnum w-full max-w-[16rem] min-w-0 border-none bg-transparent text-center font-semibold tabular-nums outline-none placeholder:text-muted-foreground/40 focus-visible:ring-0",
            size === "lg" ? "text-3xl" : "text-2xl",
            invalid && "text-expense placeholder:text-expense/50"
          )}
        />
      </div>
      <ExpressionHint value={value} />
    </div>
  )
}
