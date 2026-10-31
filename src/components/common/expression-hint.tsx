import { formatMoney, hasOperator, parseMoneyInput } from "@/lib/domain"
import { cn } from "@/lib/utils"

/**
 * Live result under an amount field that contains a calculation:
 * "120+80*2" shows "= ৳280". Plain numbers show nothing.
 */
export function ExpressionHint({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  if (!hasOperator(value)) return null
  const paisa = parseMoneyInput(value)
  const failed = paisa === null
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "tnum text-sm",
        failed ? "text-destructive" : "text-muted-foreground",
        className
      )}
    >
      {failed ? "Can't calculate that" : `= ${formatMoney(paisa)}`}
    </p>
  )
}
