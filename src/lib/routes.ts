export type View =
  | "overview"
  | "transactions"
  | "budgets"
  | "analytics"
  | "accounts"
  | "settings"

/** Every screen lives under /dashboard. */
export const ROUTES: Record<View, string> = {
  overview: "/dashboard",
  transactions: "/dashboard/transactions",
  budgets: "/dashboard/budgets",
  analytics: "/dashboard/analytics",
  accounts: "/dashboard/accounts",
  settings: "/dashboard/settings",
}

/** Screens that follow the app-wide month picker. */
export function isMonthRoute(pathname: string): boolean {
  return (
    pathname === ROUTES.overview ||
    [ROUTES.transactions, ROUTES.budgets, ROUTES.analytics].some(
      (r) => pathname === r || pathname.startsWith(`${r}/`)
    )
  )
}

/** How many months past today the picker may go on this screen (budgets can plan one ahead). */
export function monthsAhead(pathname: string): number {
  return pathname === ROUTES.budgets ? 1 : 0
}

/** Overview owns the bare /dashboard path, so it must match exactly. */
export function isRouteActive(pathname: string, view: View): boolean {
  const href = ROUTES[view]
  return view === "overview"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)
}

/** Settings is split into pages; /dashboard/settings itself is the section list (General on desktop). */
export const SETTINGS_ROUTES = {
  general: "/dashboard/settings/general",
  data: "/dashboard/settings/data",
} as const
