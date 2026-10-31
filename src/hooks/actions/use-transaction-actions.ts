"use client"

import { useMemo } from "react"

import { useDatabase, type TransactionDoc } from "@/lib/db"
import { validateTransaction, type TransactionInput } from "@/lib/domain"

/** Fields a person provides; ids and timestamps are filled in here. */
export type TransactionDraft = Omit<
  TransactionInput,
  "date" | "description"
> & {
  date?: string
  description?: string
}

function toInput(draft: TransactionDraft): TransactionInput {
  return {
    ...draft,
    description: (draft.description ?? "").trim(),
    date: draft.date ?? new Date().toISOString(),
  }
}

/**
 * Create, edit, delete and restore transactions. Validation failures throw an
 * Error whose message is safe to show to the user.
 */
export function useTransactionActions() {
  const db = useDatabase()

  return useMemo(() => {
    const requireDb = () => {
      if (!db) throw new Error("The database is still opening")
      return db
    }

    return {
      async create(draft: TransactionDraft): Promise<TransactionDoc> {
        const input = toInput(draft)
        const error = validateTransaction(input)
        if (error) throw new Error(error)
        const now = new Date().toISOString()
        const doc = await requireDb().transactions.insert({
          ...input,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        })
        return doc.toJSON() as TransactionDoc
      },

      async update(id: string, draft: TransactionDraft): Promise<void> {
        const input = toInput(draft)
        const error = validateTransaction(input)
        if (error) throw new Error(error)
        const doc = await requireDb().transactions.findOne(id).exec()
        if (!doc) throw new Error("This transaction no longer exists")
        await doc.patch({ ...input, updatedAt: new Date().toISOString() })
      },

      /** Returns the removed document so the caller can offer Undo. */
      async remove(id: string): Promise<TransactionDoc | null> {
        const doc = await requireDb().transactions.findOne(id).exec()
        if (!doc) return null
        const snapshot = doc.toJSON() as TransactionDoc
        await doc.remove()
        return snapshot
      },

      /** Put back a document returned by `remove`, with its original id. */
      async restore(snapshot: TransactionDoc): Promise<void> {
        await requireDb().transactions.upsert({
          ...snapshot,
          updatedAt: new Date().toISOString(),
        })
      },
    }
  }, [db])
}
