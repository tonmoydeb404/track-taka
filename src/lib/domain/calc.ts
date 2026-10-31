import type { AccountDoc, BudgetDoc, TransactionDoc } from "../db/types"
import { dayKey, daysInMonth, monthKey, type MonthKey } from "./dates"

// All financial calculations live here so every screen agrees.
// Transfers between a user's own accounts are NEVER income or expense.

type Tx = Pick<
  TransactionDoc,
  "type" | "amount" | "accountId" | "toAccountId" | "categoryId" | "date"
>

/** How a transaction moves money: { accountId: delta in paisa }. */
export function balanceEffects(tx: Tx): Record<string, number> {
  switch (tx.type) {
    case "income":
      return { [tx.accountId]: tx.amount }
    case "expense":
      return { [tx.accountId]: -tx.amount }
    case "transfer":
      return tx.toAccountId
        ? { [tx.accountId]: -tx.amount, [tx.toAccountId]: tx.amount }
        : {}
  }
}

/** Current balance per account id: opening balance plus every effect. */
export function accountBalances(
  accounts: Pick<AccountDoc, "id" | "openingBalance">[],
  txs: Tx[]
): Map<string, number> {
  const balances = new Map(accounts.map((a) => [a.id, a.openingBalance]))
  for (const tx of txs) {
    for (const [id, delta] of Object.entries(balanceEffects(tx))) {
      if (balances.has(id)) balances.set(id, balances.get(id)! + delta)
    }
  }
  return balances
}

export function totalBalance(balances: Map<string, number>): number {
  let sum = 0
  for (const value of balances.values()) sum += value
  return sum
}

export type PeriodTotals = {
  income: number
  expense: number
  /** income − expense */
  net: number
  transferCount: number
  transferVolume: number
}

/** Totals for whatever transactions are passed in (already range-filtered). */
export function periodTotals(txs: Tx[]): PeriodTotals {
  let income = 0
  let expense = 0
  let transferCount = 0
  let transferVolume = 0
  for (const tx of txs) {
    if (tx.type === "income") income += tx.amount
    else if (tx.type === "expense") expense += tx.amount
    else {
      transferCount += 1
      transferVolume += tx.amount
    }
  }
  return {
    income,
    expense,
    net: income - expense,
    transferCount,
    transferVolume,
  }
}

export type CategoryTotal = {
  categoryId: string
  total: number
  /** 0..1 of the grand total for this kind */
  share: number
}

export function categoryTotals(
  txs: Tx[],
  type: "expense" | "income" = "expense"
): CategoryTotal[] {
  const totals = new Map<string, number>()
  let grand = 0
  for (const tx of txs) {
    if (tx.type !== type || !tx.categoryId) continue
    totals.set(tx.categoryId, (totals.get(tx.categoryId) ?? 0) + tx.amount)
    grand += tx.amount
  }
  return [...totals]
    .map(([categoryId, total]) => ({
      categoryId,
      total,
      share: grand > 0 ? total / grand : 0,
    }))
    .sort((a, b) => b.total - a.total)
}

export type DailyPoint = {
  day: number
  /** "Oct 3" — what charts show on the axis and in tooltips. */
  label: string
  expense: number
  cumulative: number
}

const shortDay = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

/**
 * Expense per day of a month, with a running total. For the current month the
 * series stops at `today`; future days are not included.
 */
export function dailyExpenseSeries(
  txs: Tx[],
  month: MonthKey,
  today: Date = new Date()
): DailyPoint[] {
  const byDay = new Map<string, number>()
  for (const tx of txs) {
    if (tx.type !== "expense" || monthKey(tx.date) !== month) continue
    const key = dayKey(tx.date)
    byDay.set(key, (byDay.get(key) ?? 0) + tx.amount)
  }

  const todayKey = dayKey(today)
  const series: DailyPoint[] = []
  let cumulative = 0
  for (let day = 1; day <= daysInMonth(month); day++) {
    const key = `${month}-${String(day).padStart(2, "0")}`
    if (key > todayKey) break
    const expense = byDay.get(key) ?? 0
    cumulative += expense
    series.push({
      day,
      label: shortDay(new Date(`${key}T12:00:00`)),
      expense,
      cumulative,
    })
  }
  return series
}

/**
 * Expense per day between two day keys (inclusive), with a running total.
 * Like the monthly series it stops at `today`. `day` counts from 1.
 */
export function dailyExpenseRange(
  txs: Tx[],
  from: string,
  to: string,
  today: Date = new Date()
): DailyPoint[] {
  const byDay = new Map<string, number>()
  for (const tx of txs) {
    if (tx.type !== "expense") continue
    const key = dayKey(tx.date)
    byDay.set(key, (byDay.get(key) ?? 0) + tx.amount)
  }

  const todayKey = dayKey(today)
  const series: DailyPoint[] = []
  let cumulative = 0
  const cursor = new Date(`${from}T12:00:00`)
  for (let day = 1; ; day++) {
    const key = dayKey(cursor)
    if (key > to || key > todayKey) break
    const expense = byDay.get(key) ?? 0
    cumulative += expense
    series.push({ day, label: shortDay(cursor), expense, cumulative })
    cursor.setDate(cursor.getDate() + 1)
  }
  return series
}

export type BudgetStatus = {
  budget: BudgetDoc
  spent: number
  remaining: number
  /** 0..100+ */
  pct: number
  state: "normal" | "warning" | "over"
}

/** Progress of each budget for `month`, most-used first. */
export function budgetStatuses(
  budgets: BudgetDoc[],
  txs: Tx[],
  month: MonthKey
): BudgetStatus[] {
  const spentByCategory = new Map<string, number>()
  for (const tx of txs) {
    if (tx.type !== "expense" || !tx.categoryId) continue
    if (monthKey(tx.date) !== month) continue
    spentByCategory.set(
      tx.categoryId,
      (spentByCategory.get(tx.categoryId) ?? 0) + tx.amount
    )
  }
  return budgets
    .filter((b) => b.month === month)
    .map((budget) => {
      const spent = spentByCategory.get(budget.categoryId) ?? 0
      const pct = budget.limit > 0 ? (spent / budget.limit) * 100 : 0
      const state: BudgetStatus["state"] =
        pct >= 100 ? "over" : pct >= 80 ? "warning" : "normal"
      return { budget, spent, remaining: budget.limit - spent, pct, state }
    })
    .sort((a, b) => b.pct - a.pct)
}
