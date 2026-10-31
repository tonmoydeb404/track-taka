// Track Taka: RxDB document types.
// Plain JSON only (ISO strings, integer paisa) so documents replicate cleanly
// to any backend later. `_deleted` and revision fields are managed by RxDB.

export type TransactionType = "expense" | "income" | "transfer"

export type AccountType = "cash" | "mobile" | "bank" | "card"

export type AccountDoc = {
  id: string
  name: string
  type: AccountType
  color: string
  /** Integer paisa. */
  openingBalance: number
  archived: boolean
  createdAt: string
  updatedAt: string
}

export type TransactionDoc = {
  id: string
  type: TransactionType
  /** Integer paisa, always > 0. */
  amount: number
  /** Static category id; null for transfers. */
  categoryId: string | null
  accountId: string
  /** Destination account; set only for transfers. */
  toAccountId: string | null
  description: string
  /** ISO timestamp of when the transaction happened. */
  date: string
  createdAt: string
  updatedAt: string
}

export type BudgetDoc = {
  /** Derived by RxDB: `${categoryId}|${month}`. */
  id: string
  categoryId: string
  /** 'YYYY-MM' */
  month: string
  /** Integer paisa. */
  limit: number
  updatedAt: string
}

export type DateFormat = "dd MMM yyyy" | "dd/MM/yyyy" | "MMM dd, yyyy"
export type WeekStart = "saturday" | "sunday" | "monday"
export type ThemeMode = "light" | "dark" | "system"

export type SettingsDoc = {
  /** Always "main". */
  id: string
  dateFormat: DateFormat
  weekStart: WeekStart
  theme: ThemeMode
  lastBackupAt: string | null
  schemaVersion: number
  updatedAt: string
}

export const SETTINGS_ID = "main"

export const DEFAULT_SETTINGS: SettingsDoc = {
  id: SETTINGS_ID,
  dateFormat: "dd MMM yyyy",
  weekStart: "saturday",
  theme: "system",
  lastBackupAt: null,
  schemaVersion: 1,
  updatedAt: new Date(0).toISOString(),
}
