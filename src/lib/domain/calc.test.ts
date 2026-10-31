import { describe, expect, it } from "vitest"

import {
  accountBalances,
  balanceEffects,
  budgetStatuses,
  categoryTotals,
  dailyExpenseRange,
  dailyExpenseSeries,
  periodTotals,
  totalBalance,
} from "./calc"

const tx = (
  over: Partial<Parameters<typeof balanceEffects>[0]> = {}
): Parameters<typeof balanceEffects>[0] => ({
  type: "expense",
  amount: 1000,
  accountId: "cash",
  toAccountId: null,
  categoryId: "food",
  date: "2026-10-05T10:00:00.000Z",
  ...over,
})

describe("balanceEffects", () => {
  it("subtracts expenses and adds income", () => {
    expect(balanceEffects(tx())).toEqual({ cash: -1000 })
    expect(balanceEffects(tx({ type: "income" }))).toEqual({ cash: 1000 })
  })

  it("moves money between both accounts on a transfer", () => {
    expect(
      balanceEffects(tx({ type: "transfer", toAccountId: "bank" }))
    ).toEqual({ cash: -1000, bank: 1000 })
  })
})

describe("accountBalances", () => {
  const accounts = [
    { id: "cash", openingBalance: 5000 },
    { id: "bank", openingBalance: 0 },
  ]

  it("applies opening balance, flows and transfers", () => {
    const balances = accountBalances(accounts, [
      tx({ type: "income", amount: 20000 }),
      tx({ amount: 3000 }),
      tx({ type: "transfer", amount: 4000, toAccountId: "bank" }),
    ])
    expect(balances.get("cash")).toBe(5000 + 20000 - 3000 - 4000)
    expect(balances.get("bank")).toBe(4000)
    // A transfer never changes the total.
    expect(totalBalance(balances)).toBe(5000 + 20000 - 3000)
  })

  it("ignores transactions for unknown accounts", () => {
    const balances = accountBalances(accounts, [tx({ accountId: "gone" })])
    expect(balances.get("cash")).toBe(5000)
    expect(balances.has("gone")).toBe(false)
  })
})

describe("periodTotals", () => {
  it("excludes transfers from income and expense", () => {
    const totals = periodTotals([
      tx({ type: "income", amount: 9000 }),
      tx({ amount: 2500 }),
      tx({ type: "transfer", amount: 7000, toAccountId: "bank" }),
    ])
    expect(totals).toEqual({
      income: 9000,
      expense: 2500,
      net: 6500,
      transferCount: 1,
      transferVolume: 7000,
    })
  })
})

describe("categoryTotals", () => {
  it("groups expenses, sorts by size and computes shares", () => {
    const result = categoryTotals([
      tx({ categoryId: "food", amount: 3000 }),
      tx({ categoryId: "bills", amount: 1000 }),
      tx({ categoryId: "food", amount: 1000 }),
      tx({ type: "income", categoryId: "salary", amount: 99999 }),
    ])
    expect(result).toEqual([
      { categoryId: "food", total: 4000, share: 0.8 },
      { categoryId: "bills", total: 1000, share: 0.2 },
    ])
  })
})

describe("dailyExpenseSeries", () => {
  it("accumulates and stops at today", () => {
    const series = dailyExpenseSeries(
      [
        tx({ date: new Date(2026, 9, 2, 12).toISOString(), amount: 100 }),
        tx({ date: new Date(2026, 9, 3, 12).toISOString(), amount: 50 }),
      ],
      "2026-10",
      new Date(2026, 9, 4, 9)
    )
    expect(series).toEqual([
      { day: 1, label: "Oct 1", expense: 0, cumulative: 0 },
      { day: 2, label: "Oct 2", expense: 100, cumulative: 100 },
      { day: 3, label: "Oct 3", expense: 50, cumulative: 150 },
      { day: 4, label: "Oct 4", expense: 0, cumulative: 150 },
    ])
  })
})

describe("dailyExpenseRange", () => {
  it("covers the days between two keys, across months, and stops at today", () => {
    const series = dailyExpenseRange(
      [tx({ date: new Date(2026, 9, 31, 12).toISOString(), amount: 70 })],
      "2026-10-30",
      "2026-11-05",
      new Date(2026, 10, 1, 9)
    )
    expect(series).toEqual([
      { day: 1, label: "Oct 30", expense: 0, cumulative: 0 },
      { day: 2, label: "Oct 31", expense: 70, cumulative: 70 },
      { day: 3, label: "Nov 1", expense: 0, cumulative: 70 },
    ])
  })
})

describe("budgetStatuses", () => {
  const budget = (categoryId: string, limit: number) => ({
    id: `${categoryId}|2026-10`,
    categoryId,
    month: "2026-10",
    limit,
    updatedAt: "",
  })
  const at = (d: number) => new Date(2026, 9, d, 12).toISOString()

  it("flags warning at 80% and over at 100%", () => {
    const result = budgetStatuses(
      [budget("food", 10000), budget("bills", 10000), budget("health", 10000)],
      [
        tx({ categoryId: "food", amount: 8000, date: at(2) }),
        tx({ categoryId: "bills", amount: 10000, date: at(3) }),
        tx({ categoryId: "health", amount: 100, date: at(4) }),
        // other month and transfers don't count
        tx({
          categoryId: "health",
          amount: 99999,
          date: "2026-09-30T10:00:00Z",
        }),
      ],
      "2026-10"
    )
    expect(result.map((s) => [s.budget.categoryId, s.state])).toEqual([
      ["bills", "over"],
      ["food", "warning"],
      ["health", "normal"],
    ])
    expect(result[1].remaining).toBe(2000)
  })
})
