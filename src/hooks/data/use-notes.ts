"use client"

import { useCallback, useMemo } from "react"

import { useDatabase, useRxQuery, type NoteDoc } from "@/lib/db"
import { sanitizeMoneyExpression } from "@/lib/domain"

/** Fields a person provides; ids and timestamps are filled in here. */
export type NoteDraft = {
  note: string
  amount: string
}

/** Live khata rows in writing order (oldest first). */
export function useNotes() {
  return useRxQuery<NoteDoc>(
    useCallback((db) => db.notes.find({ sort: [{ createdAt: "asc" }] }), [])
  )
}

/**
 * Create, change, remove and wipe khata rows. Amounts are stored as the raw
 * text so half-written expressions survive; they are validated when a row is
 * converted into a transaction, not while it is being written.
 */
export function useNoteActions() {
  const db = useDatabase()

  return useMemo(() => {
    const requireDb = () => {
      if (!db) throw new Error("The database is still opening")
      return db
    }

    return {
      async add(draft: NoteDraft): Promise<NoteDoc> {
        const now = new Date().toISOString()
        const doc = await requireDb().notes.insert({
          id: crypto.randomUUID(),
          note: draft.note.trim().slice(0, 120),
          amount: sanitizeMoneyExpression(draft.amount).slice(0, 24),
          createdAt: now,
          updatedAt: now,
        })
        return doc.toJSON() as NoteDoc
      },

      async patch(id: string, changes: Partial<NoteDraft>): Promise<void> {
        const doc = await requireDb().notes.findOne(id).exec()
        if (!doc) return
        const next: Partial<NoteDoc> = {
          updatedAt: new Date().toISOString(),
        }
        if (changes.note !== undefined) next.note = changes.note
        if (changes.amount !== undefined) {
          next.amount = sanitizeMoneyExpression(changes.amount).slice(0, 24)
        }
        await doc.patch(next)
      },

      /** Returns the removed document so the caller can offer Undo. */
      async remove(id: string): Promise<NoteDoc | null> {
        const doc = await requireDb().notes.findOne(id).exec()
        if (!doc) return null
        const snapshot = doc.toJSON() as NoteDoc
        await doc.remove()
        return snapshot
      },

      /** Removes every row; returns snapshots so the caller can offer Undo. */
      async clearAll(): Promise<NoteDoc[]> {
        const docs = await requireDb().notes.find().exec()
        const snapshots = docs.map((d) => d.toJSON() as NoteDoc)
        await requireDb().notes.find().remove()
        return snapshots
      },

      /** Put snapshots returned by `remove` / `clearAll` back. */
      async restore(snapshots: NoteDoc[]): Promise<void> {
        if (snapshots.length === 0) return
        await requireDb().notes.bulkUpsert(snapshots)
      },
    }
  }, [db])
}
