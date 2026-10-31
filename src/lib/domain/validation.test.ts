import { describe, expect, it } from "vitest"

import { validateTransaction, type TransactionInput } from "./validation"

const base: TransactionInput = {
  type: "expense",
  amount: 1000,
  categoryId: "food",
  accountId: "cash",
  toAccountId: null,
  description: "",
  date: "2026-10-05T10:00:00.000Z",
}

describe("validateTransaction", () => {
  it("accepts valid expense, income and transfer", () => {
    expect(validateTransaction(base)).toBeNull()
    expect(
      validateTransaction({ ...base, type: "income", categoryId: "salary" })
    ).toBeNull()
    expect(
      validateTransaction({
        ...base,
        type: "transfer",
        categoryId: null,
        toAccountId: "bank",
      })
    ).toBeNull()
  })

  it("rejects bad amounts", () => {
    expect(validateTransaction({ ...base, amount: 0 })).not.toBeNull()
    expect(validateTransaction({ ...base, amount: 10.5 })).not.toBeNull()
  })

  it("enforces transfer rules", () => {
    const transfer = { ...base, type: "transfer" as const, categoryId: null }
    expect(validateTransaction(transfer)).toMatch(/destination/)
    expect(validateTransaction({ ...transfer, toAccountId: "cash" })).toMatch(
      /different/
    )
    expect(
      validateTransaction({
        ...transfer,
        toAccountId: "bank",
        categoryId: "food",
      })
    ).toMatch(/no category/)
  })

  it("requires a category of the matching kind", () => {
    expect(validateTransaction({ ...base, categoryId: null })).toMatch(
      /category/
    )
    expect(validateTransaction({ ...base, categoryId: "salary" })).toMatch(
      /not an expense/
    )
    expect(validateTransaction({ ...base, toAccountId: "bank" })).toMatch(
      /Only transfers/
    )
  })
})
