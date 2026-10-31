"use client"

import {
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  Clapperboard,
  Gift,
  HeartPulse,
  Laptop,
  Package,
  Receipt,
  ShoppingBag,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

/** Registry of available category icons. Keys are stable identifiers stored on records. */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  bus: Bus,
  "shopping-bag": ShoppingBag,
  receipt: Receipt,
  "heart-pulse": HeartPulse,
  clapperboard: Clapperboard,
  "book-open": BookOpen,
  package: Package,
  briefcase: Briefcase,
  laptop: Laptop,
  "building-2": Building2,
  gift: Gift,
  wallet: Wallet,
}

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS)

interface CategoryIconProps {
  icon: string
  color?: string
  className?: string
  size?: number
}

/** Rounded, tinted square holding a category's icon. */
export function CategoryIcon({
  icon,
  color,
  className,
  size = 16,
}: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[icon] ?? Package

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
