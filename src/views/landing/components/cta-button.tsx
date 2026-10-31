import Link from "next/link"

import { cn } from "@/lib/utils"

interface CtaButtonProps {
  children: string
  /** Inverted colours for use on the brand surface. */
  onBrand?: boolean
  className?: string
}

/** The one primary action, identical wherever it appears. */
export function CtaButton({ children, onBrand, className }: CtaButtonProps) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-3 py-2 button-md shadow-sm transition-[background-color,transform] duration-300 ease-landing focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]",
        onBrand
          ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90 focus-visible:outline-primary-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-ring",
        className
      )}
    >
      {children}
    </Link>
  )
}
