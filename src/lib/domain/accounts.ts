// Account metadata shared by the accounts view and the quick-entry dialog.

import type { AccountType } from "@/lib/db"

export const ACCOUNT_TYPES: AccountType[] = ["cash", "mobile", "bank", "card"]

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: "Cash",
  mobile: "Mobile money",
  bank: "Bank",
  card: "Card",
}

export const PRESET_COLORS = [
  "#0d9488",
  "#e2136e",
  "#f6821f",
  "#57534e",
  "#65a30d",
  "#be123c",
]
