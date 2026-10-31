import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { AccountIcon } from "@/components/common/account-icon"
import type { AccountDoc } from "@/lib/db"
import { formatBalance } from "@/lib/domain"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

interface BalanceHeroProps {
  className?: string
  balance: number
  accounts: AccountDoc[]
  /** Current balance by account id, in paisa. */
  balances: Map<string, number>
}

/** The page's one bold element: total balance on a solid brand surface. */
export function BalanceHero({
  className,
  balance,
  accounts,
  balances,
}: BalanceHeroProps) {
  return (
    <section
      aria-label="Total balance"
      className={cn(
        "flex flex-col rounded-2xl bg-primary px-5 pt-6 pb-5 text-primary-foreground sm:px-6 sm:pt-6",
        className
      )}
    >
      <p className="text-sm font-medium opacity-80">Total balance</p>
      <p className="tnum mt-1 text-display">{formatBalance(balance)}</p>
      <Link
        href={ROUTES.accounts}
        className="mt-2 inline-flex min-h-8 items-center gap-0.5 rounded-md text-sm font-medium opacity-80 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
      >
        {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
        <ChevronRight className="size-4" aria-hidden="true" />
      </Link>

      {accounts.length > 0 && (
        <ul
          className="-mx-5 mt-auto flex scrollbar-none gap-2 overflow-x-auto px-5 pt-3 pb-1 sm:-mx-6 sm:px-6"
          aria-label="Balance per account"
        >
          {accounts.map((a) => (
            <li key={a.id} className="shrink-0">
              <Link
                href={ROUTES.accounts}
                className="flex items-center gap-2 rounded-full bg-primary-foreground/12 py-1.5 pr-3.5 pl-1.5 text-sm transition-colors hover:bg-primary-foreground/20 focus-visible:outline-2 focus-visible:outline-primary-foreground"
              >
                <span className="rounded-full bg-card">
                  <AccountIcon
                    type={a.type}
                    color={a.color}
                    size={13}
                    className="size-7 rounded-full"
                  />
                </span>
                <span className="max-w-[7rem] truncate opacity-80">
                  {a.name}
                </span>
                <span className="tnum font-semibold">
                  {formatBalance(balances.get(a.id) ?? 0)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
