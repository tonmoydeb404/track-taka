import {
  ArrowLeftRight,
  ChartColumn,
  House,
  PiggyBank,
  Settings2,
  Wallet,
} from "lucide-react"

import type { View } from "@/lib/routes"

export interface NavItem {
  view: View
  label: string
  icon: typeof House
}

const OVERVIEW: NavItem = { view: "overview", label: "Overview", icon: House }
const TRANSACTIONS: NavItem = {
  view: "transactions",
  label: "Transactions",
  icon: ArrowLeftRight,
}
const BUDGETS: NavItem = { view: "budgets", label: "Budgets", icon: PiggyBank }
const ANALYTICS: NavItem = {
  view: "analytics",
  label: "Analytics",
  icon: ChartColumn,
}
const ACCOUNTS: NavItem = { view: "accounts", label: "Accounts", icon: Wallet }
export const SETTINGS: NavItem = {
  view: "settings",
  label: "Settings",
  icon: Settings2,
}

/** Desktop rail: daily use first, then upkeep. Settings is pinned separately. */
export const NAV_GROUPS: NavItem[][] = [
  [OVERVIEW, TRANSACTIONS, BUDGETS, ANALYTICS],
  [ACCOUNTS],
]

/** Mobile bottom bar: the three screens used every day. */
export const MOBILE_TABS: NavItem[] = [
  { ...OVERVIEW, label: "Home" },
  TRANSACTIONS,
  BUDGETS,
]

/** Everything else lives behind "More" on mobile. */
export const MORE_ITEMS: NavItem[] = [ANALYTICS, ACCOUNTS, SETTINGS]
