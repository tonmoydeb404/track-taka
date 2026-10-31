"use client"

import { useMemo } from "react"

import { useDatabase, type AccountDoc } from "@/lib/db"

export type AccountDraft = Pick<
  AccountDoc,
  "name" | "type" | "color" | "openingBalance"
>

function checkDraft(draft: Partial<AccountDraft>) {
  if (draft.name !== undefined && draft.name.trim() === "") {
    throw new Error("Give the account a name")
  }
}

export function useAccountActions() {
  const db = useDatabase()

  return useMemo(() => {
    const requireDb = () => {
      if (!db) throw new Error("The database is still opening")
      return db
    }

    return {
      async create(draft: AccountDraft): Promise<AccountDoc> {
        checkDraft(draft)
        const now = new Date().toISOString()
        const doc = await requireDb().accounts.insert({
          ...draft,
          name: draft.name.trim(),
          id: crypto.randomUUID(),
          archived: false,
          createdAt: now,
          updatedAt: now,
        })
        return doc.toJSON() as AccountDoc
      },

      async update(id: string, patch: Partial<AccountDraft>): Promise<void> {
        checkDraft(patch)
        const doc = await requireDb().accounts.findOne(id).exec()
        if (!doc) throw new Error("This account no longer exists")
        await doc.patch({
          ...patch,
          ...(patch.name !== undefined && { name: patch.name.trim() }),
          updatedAt: new Date().toISOString(),
        })
      },

      async setArchived(id: string, archived: boolean): Promise<void> {
        const doc = await requireDb().accounts.findOne(id).exec()
        if (!doc) throw new Error("This account no longer exists")
        await doc.patch({ archived, updatedAt: new Date().toISOString() })
      },

      /** Only accounts with no history can be deleted; archive the rest. */
      async remove(id: string): Promise<void> {
        const database = requireDb()
        const used = await database.transactions
          .findOne({
            selector: { $or: [{ accountId: id }, { toAccountId: id }] },
          })
          .exec()
        if (used) {
          throw new Error(
            "This account has transactions. Archive it instead of deleting."
          )
        }
        await (await database.accounts.findOne(id).exec())?.remove()
      },
    }
  }, [db])
}
