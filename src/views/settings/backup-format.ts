import type {
  AccountDoc,
  BudgetDoc,
  SettingsDoc,
  TransactionDoc,
} from "@/lib/db"

export const BACKUP_APP = "track-taka"
export const BACKUP_VERSION = 1

export type BackupFile = {
  app: typeof BACKUP_APP
  version: typeof BACKUP_VERSION
  exportedAt: string
  accounts: AccountDoc[]
  transactions: TransactionDoc[]
  budgets: BudgetDoc[]
  settings: SettingsDoc[]
}

export type ParsedBackup = Pick<
  BackupFile,
  "accounts" | "transactions" | "budgets"
>

type Row = Record<string, unknown>

const isRow = (v: unknown): v is Row =>
  typeof v === "object" && v !== null && !Array.isArray(v)
const isStr = (v: unknown): v is string => typeof v === "string" && v !== ""
const isInt = (v: unknown): v is number => Number.isInteger(v)

function list(file: Row, key: string): Row[] {
  const value = file[key]
  if (!Array.isArray(value)) {
    throw new Error(`This backup is missing its "${key}" list.`)
  }
  value.forEach((row, i) => {
    if (!isRow(row)) throw new Error(`"${key}" entry ${i + 1} isn't valid.`)
  })
  return value as Row[]
}

function check(ok: boolean, key: string, i: number): void {
  if (!ok) throw new Error(`"${key}" entry ${i + 1} has missing or bad fields.`)
}

/** Validates a parsed JSON value; throws an Error with a user-safe message. */
export function parseBackup(raw: unknown): ParsedBackup {
  if (!isRow(raw) || raw.app !== BACKUP_APP) {
    throw new Error("This isn't a Track Taka backup file.")
  }
  if (raw.version !== BACKUP_VERSION) {
    throw new Error(
      "This backup was made by a different version of Track Taka."
    )
  }

  const accounts = list(raw, "accounts")
  accounts.forEach((a, i) =>
    check(
      isStr(a.id) &&
        isStr(a.name) &&
        ["cash", "mobile", "bank", "card"].includes(a.type as string) &&
        isStr(a.color) &&
        isInt(a.openingBalance) &&
        typeof a.archived === "boolean" &&
        isStr(a.createdAt) &&
        isStr(a.updatedAt),
      "accounts",
      i
    )
  )

  const transactions = list(raw, "transactions")
  transactions.forEach((t, i) =>
    check(
      isStr(t.id) &&
        ["expense", "income", "transfer"].includes(t.type as string) &&
        isInt(t.amount) &&
        (t.amount as number) > 0 &&
        (t.categoryId === null || isStr(t.categoryId)) &&
        isStr(t.accountId) &&
        (t.toAccountId === null || isStr(t.toAccountId)) &&
        typeof t.description === "string" &&
        isStr(t.date) &&
        isStr(t.createdAt) &&
        isStr(t.updatedAt),
      "transactions",
      i
    )
  )

  const budgets = list(raw, "budgets")
  budgets.forEach((b, i) =>
    check(
      isStr(b.categoryId) &&
        typeof b.month === "string" &&
        /^\d{4}-\d{2}$/.test(b.month) &&
        isInt(b.limit) &&
        (b.limit as number) >= 0 &&
        isStr(b.updatedAt),
      "budgets",
      i
    )
  )

  return {
    accounts: accounts as unknown as AccountDoc[],
    transactions: transactions as unknown as TransactionDoc[],
    budgets: budgets.map((b) => ({
      ...b,
      id: `${b.categoryId}|${b.month}`,
    })) as unknown as BudgetDoc[],
  }
}
