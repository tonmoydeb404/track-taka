"use client"

import {
  Banknote,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

/** Registry of account-type icons. Keys match `AccountType` values. */
export const ACCOUNT_ICONS: Record<string, LucideIcon> = {
  cash: Banknote,
  mobile: Smartphone,
  bank: Landmark,
  card: CreditCard,
}

interface AccountIconProps {
  type: string
  color?: string
  className?: string
  size?: number
}

/** Rounded, tinted square holding an account type's icon. */
export function AccountIcon({
  type,
  color,
  className,
  size = 16,
}: AccountIconProps) {
  const Icon = ACCOUNT_ICONS[type] ?? Wallet

  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
        className
      )}
      style={{
        backgroundColor: color ? `${color}14` : undefined,
        borderColor: color ? `${color}30` : undefined,
      }}
      aria-hidden="true"
    >
      <Icon
        size={size}
        strokeWidth={2}
        style={{ color: color ?? "currentColor" }}
      />
    </span>
  )
}
