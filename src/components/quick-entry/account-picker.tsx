"use client"

import * as React from "react"

import { AccountIcon } from "@/components/common/account-icon"
import { useAccounts } from "@/hooks"
import { cn } from "@/lib/utils"

interface AccountPickerProps {
  value: string | null
  onChange: (accountId: string) => void
  /** Optional label shown above the chips (e.g. "From" / "To"). */
  label?: string
  /** Hide one account — used so a transfer can't have the same account on both sides. */
  excludeAccountId?: string | null
  id?: string
  className?: string
}

/**
 * Horizontal row (wrapping) of account chips with icon + name.
 * Selected chip gets a primary ring. Chips are min 44px tall.
 */
export function AccountPicker({
  value,
  onChange,
  label,
  excludeAccountId = null,
  id,
  className,
}: AccountPickerProps) {
  const { data: accounts } = useAccounts()
  const visible = React.useMemo(
    () => accounts.filter((a) => a.id !== excludeAccountId),
    [accounts, excludeAccountId]
  )

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <span
          id={id ? `${id}-label` : undefined}
          className="text-xs font-medium text-muted-foreground"
        >
          {label}
        </span>
      ) : null}
      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No accounts available.</p>
      ) : (
        <div
          id={id}
          role="radiogroup"
          aria-label={label ?? "Account"}
          aria-labelledby={id && label ? `${id}-label` : undefined}
          className="flex flex-wrap gap-2"
        >
          {visible.map((account) => {
            const selected = value === account.id
            return (
              <button
                key={account.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(account.id)}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-xl border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  selected && "bg-accent ring-2 ring-primary"
                )}
              >
                <AccountIcon
                  type={account.type}
                  color={account.color}
                  size={14}
                  className="h-7 w-7"
                />
                <span className="max-w-32 truncate">{account.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
