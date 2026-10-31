import { getCategory } from "./categories"
import type { TransactionType } from "../db/types"

export type TransactionInput = {
  type: TransactionType
  amount: number
  categoryId: string | null
  accountId: string
  toAccountId: string | null
  description: string
  date: string
}

/** Rules a JSON schema can't express. Returns an error message or null. */
export function validateTransaction(input: TransactionInput): string | null {
  if (!Number.isInteger(input.amount) || input.amount < 1) {
    return "Amount must be greater than zero"
  }
  if (!input.accountId) return "Choose an account"
  if (Number.isNaN(new Date(input.date).getTime())) return "Invalid date"

  if (input.type === "transfer") {
    if (input.categoryId !== null) return "Transfers have no category"
    if (!input.toAccountId) return "Choose a destination account"
    if (input.toAccountId === input.accountId) {
      return "Choose two different accounts"
    }
    return null
  }

  if (input.toAccountId !== null) {
    return "Only transfers have a destination account"
  }
  const category = getCategory(input.categoryId)
  if (!category) return "Choose a category"
  if (category.kind !== input.type) {
    return `${category.name} is not an ${input.type} category`
  }
  return null
}
